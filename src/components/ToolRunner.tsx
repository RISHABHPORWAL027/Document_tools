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
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
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
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.open();
    w.document.write(previewHtml);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-sm font-semibold text-zinc-900">Inputs</h2>
        <form
          className="mt-4 space-y-4"
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
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {isGenerating ? "Generating…" : "Generate"}
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => download("pdf")}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
            >
              Download PDF
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => download("docx")}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
            >
              Download DOCX
            </button>
            <button
              type="button"
              onClick={copyText}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              Copy Text
            </button>
            <button
              type="button"
              onClick={print}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              Print
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-900">Preview</h2>
          <div className="text-xs text-zinc-500">
            Tip: click Generate after edits
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border bg-zinc-50">
          {previewHtml ? (
            <iframe
              title="Preview"
              className="h-[72vh] w-full"
              srcDoc={previewHtml}
            />
          ) : (
            <div className="p-4 text-sm text-zinc-600">
              Preview will appear here.
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
    "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400";

  return (
    <div>
      <label className="text-sm font-medium text-zinc-900">{field.label}</label>
      {field.description ? (
        <div className="mt-1 text-xs text-zinc-500">{field.description}</div>
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
    <div className="rounded-xl border bg-zinc-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-zinc-900">{field.label}</div>
          {field.description ? (
            <div className="mt-1 text-xs text-zinc-500">{field.description}</div>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-lg border bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50"
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
          <div key={row.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-medium text-zinc-700">
                {(field.itemLabel ?? "Item") + " " + (idx + 1)}
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
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
                  "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400";

                return (
                  <div key={name}>
                    <label className="text-sm font-medium text-zinc-900">
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

