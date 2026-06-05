"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Control,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildZodSchema, type ToolField } from "@/lib/tools/types";

type ToolRunnerProps = {
  toolId: string;
};

type ToolMetaResponse = {
  tool: {
    id: string;
    title: string;
    summary: string;
    fields: ToolField[];
  };
};

export default function ToolRunner({ toolId }: ToolRunnerProps) {
  const [tool, setTool] = useState<ToolMetaResponse["tool"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      setTool(null);
      const res = await fetch(`/api/tools/${encodeURIComponent(toolId)}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        setError("Failed to load tool.");
        return;
      }
      const json = (await res.json()) as ToolMetaResponse;
      if (cancelled) return;
      setTool(json.tool);
    })().catch(() => setError("Failed to load tool."));
    return () => {
      cancelled = true;
    };
  }, [toolId]);

  if (!tool) {
    return (
      <div className="border border-[#eeeeee] bg-white p-6 text-sm text-[#666666]">
        {error ? error : "Loading tool…"}
      </div>
    );
  }

  return <ToolRunnerInner key={tool.id} tool={tool} />;
}

function ToolRunnerInner({ tool }: { tool: ToolMetaResponse["tool"] }) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(() => buildZodSchema(tool.fields), [tool.fields]);

  const defaultValues = useMemo(() => {
    const v: Record<string, unknown> = {};
    for (const f of tool.fields) {
      if (f.type === "repeatable") {
        v[f.name] = Array.from({ length: Math.max(1, f.minItems ?? 1) }).map(
          () => {
            const item: Record<string, unknown> = {};
            for (const sf of f.fields) item[sf.name] = "";
            return item;
          },
        );
        continue;
      }
      v[f.name] = "";
    }
    return v;
  }, [tool.fields]);

  const form = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  async function generate(values: FieldValues) {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/tools/${encodeURIComponent(tool.id)}/render`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ values }),
        },
      );
      if (!res.ok) {
        const msg = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(msg?.error ?? "Failed to generate preview.");
      }
      const json = (await res.json()) as { html: string };
      setPreviewHtml(json.html);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate preview.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function download(kind: "pdf" | "docx") {
    const values = form.getValues();
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/tools/${encodeURIComponent(tool.id)}/${kind}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values }),
      });
      if (!res.ok) {
        const msg = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          msg?.error ?? `Failed to generate ${kind.toUpperCase()}.`,
        );
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tool.id}.${kind}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to generate ${kind}.`);
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyText() {
    if (!previewHtml) {
      setError("Generate a preview first.");
      return;
    }
    const text = stripHtml(previewHtml);
    await navigator.clipboard.writeText(text);
  }

  function print() {
    if (!previewHtml) {
      setError("Generate a preview first.");
      return;
    }
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(previewHtml);
    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
    };
    // Fallback
    setTimeout(() => {
      if (w) {
        w.focus();
        w.print();
      }
    }, 500);
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[420px_1fr]">
      <section className="border border-[#eeeeee] bg-white">
        <div className="border-b border-[#eeeeee] bg-[#f6f6f6] px-5 py-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">Inputs</h2>
        </div>
        <form
          className="p-5 space-y-4"
          onSubmit={form.handleSubmit(generate)}
        >
          {tool.fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              control={form.control}
              register={form.register}
              errors={form.formState.errors}
            />
          ))}

          {error ? (
            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center justify-center bg-black px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a1a1a] disabled:opacity-40 transition-colors w-full sm:w-auto"
            >
              {isGenerating ? "Generating…" : "Generate"}
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => download("pdf")}
              className="inline-flex items-center justify-center border border-[#d9d9d9] bg-white px-4 py-2.5 text-sm font-bold text-[#444444] hover:border-black hover:text-black disabled:opacity-40 transition-colors w-full sm:w-auto"
            >
              Download PDF
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => download("docx")}
              className="inline-flex items-center justify-center border border-[#d9d9d9] bg-white px-4 py-2.5 text-sm font-bold text-[#444444] hover:border-black hover:text-black disabled:opacity-40 transition-colors w-full sm:w-auto"
            >
              Download DOCX
            </button>
            <button
              type="button"
              onClick={copyText}
              className="inline-flex items-center justify-center border border-[#d9d9d9] bg-white px-4 py-2.5 text-sm font-bold text-[#444444] hover:border-black hover:text-black transition-colors w-full sm:w-auto"
            >
              Copy Text
            </button>
            <button
              type="button"
              onClick={print}
              className="inline-flex items-center justify-center border border-[#d9d9d9] bg-white px-4 py-2.5 text-sm font-bold text-[#444444] hover:border-black hover:text-black transition-colors w-full sm:w-auto"
            >
              Print
            </button>
          </div>
        </form>
      </section>

      <section className="border border-[#eeeeee] bg-white">
        <div className="border-b border-[#eeeeee] bg-[#f6f6f6] px-5 py-3 flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">Preview</h2>
          <span className="text-[10px] text-[#b0b0b0]">
            Tip: click Generate after edits
          </span>
        </div>
        <div className="overflow-auto bg-[#eeeeee] p-2 sm:p-4 flex sm:justify-center mobile-scroll-hide">
          {previewHtml ? (
            <iframe
              title="Preview"
              className="bg-white shadow-sm border-none shrink-0"
              style={{ width: "210mm", minWidth: "210mm", height: "72vh" }}
              srcDoc={previewHtml}
            />
          ) : (
            <div className="flex h-40 w-full items-center justify-center text-sm text-[#888888]">
              Preview will appear here after you click Generate.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FieldRenderer({
  field,
  control,
  register,
  errors,
}: {
  field: ToolField;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
}) {
  if (field.type === "repeatable") {
    return (
      <RepeatableFieldRenderer
        field={field}
        control={control}
        register={register}
        errors={errors}
      />
    );
  }

  const error = errors?.[field.name]?.message as string | undefined;
  const inputClass =
    "mt-1 w-full border border-[#d9d9d9] bg-[#f6f6f6] px-3 py-2 text-sm text-black outline-none focus:border-black focus:bg-white transition-colors";

  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#666666]">{field.label}</label>
      {field.description ? (
        <div className="mt-1 text-xs text-[#888888]">{field.description}</div>
      ) : null}
      {field.type === "textarea" ? (
        <textarea
          className={inputClass}
          rows={3}
          placeholder={field.placeholder}
          {...register(field.name)}
        />
      ) : (
        <input
          className={inputClass}
          type={field.type === "date" ? "date" : field.type}
          placeholder={field.placeholder}
          {...register(field.name)}
        />
      )}
      {error ? (
        <div className="mt-1 text-xs text-red-600">{error}</div>
      ) : null}
    </div>
  );
}

function RepeatableFieldRenderer({
  field,
  control,
  register,
  errors,
}: {
  field: Extract<ToolField, { type: "repeatable" }>;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
  });

  const arrayError = errors?.[field.name]?.message as string | undefined;

  return (
    <div className="border border-[#eeeeee] bg-[#f6f6f6] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#666666]">{field.label}</div>
          {field.description ? (
            <div className="mt-1 text-xs text-[#888888]">{field.description}</div>
          ) : null}
        </div>
        <button
          type="button"
          className="border border-[#d9d9d9] bg-white px-3 py-1.5 text-xs font-bold text-[#444444] hover:border-black hover:text-black transition-colors"
          onClick={() => {
            const item: Record<string, unknown> = {};
            for (const sf of field.fields) item[sf.name] = "";
            append(item);
          }}
        >
          Add
        </button>
      </div>

      {arrayError ? (
        <div className="mt-2 text-xs text-red-600">{arrayError}</div>
      ) : null}

      <div className="mt-4 space-y-4">
        {fields.map((row, idx: number) => (
          <div key={row.id} className="border border-[#eeeeee] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#888888]">
                {(field.itemLabel ?? "Item") + " " + (idx + 1)}
              </div>
              <button
                type="button"
                className="text-xs font-medium text-[#888888] hover:text-black transition-colors"
                onClick={() => remove(idx)}
              >
                Remove
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {field.fields.map((sf) => {
                const name = `${field.name}.${idx}.${sf.name}`;
                const error = getErrorMessage(errors, [
                  field.name,
                  String(idx),
                  sf.name,
                ]);

                const inputClass =
                  "mt-1 w-full border border-[#d9d9d9] bg-[#f6f6f6] px-3 py-2 text-sm text-black outline-none focus:border-black focus:bg-white transition-colors";

                return (
                  <div key={name}>
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#666666]">
                      {sf.label}
                    </label>
                    {sf.type === "textarea" ? (
                      <textarea
                        className={inputClass}
                        rows={2}
                        placeholder={sf.placeholder}
                        {...register(name)}
                      />
                    ) : (
                      <input
                        className={inputClass}
                        type={sf.type === "date" ? "date" : sf.type}
                        placeholder={sf.placeholder}
                        {...register(name)}
                      />
                    )}
                    {error ? (
                      <div className="mt-1 text-xs text-red-600">{error}</div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body?.textContent ?? "").trim();
}

function getErrorMessage(
  errors: FieldErrors<FieldValues>,
  path: string[],
): string | undefined {
  let cur: unknown = errors as unknown;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  if (!cur || typeof cur !== "object") return undefined;
  const msg = (cur as Record<string, unknown>)["message"];
  return typeof msg === "string" ? msg : undefined;
}

