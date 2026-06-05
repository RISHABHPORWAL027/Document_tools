"use client";

import { useMemo, useState } from "react";
import ProfileSelector from "@/components/ProfileSelector";
import type { CompanyProfile } from "@/lib/profiles/types";
import { allLiveTools } from "@/lib/site/registry";

type DirectorEntry = {
  name: string;
  designation: string;
  signatureImageUrl: string;
};

type SpecimenFormData = {
  establishmentName: string;
  directors: DirectorEntry[];
};

const designationOptions = [
  "Director",
  "Managing Director",
  "CEO",
  "Whole Time Director",
  "Company Secretary",
  "CFO",
  "Manager",
];

const initialDirector: DirectorEntry = {
  name: "",
  designation: "Director",
  signatureImageUrl: "",
};

function createInitialSpecimenData(): SpecimenFormData {
  return {
    establishmentName: "",
    directors: [{ ...initialDirector }, { ...initialDirector }],
  };
}

export default function SpecimenSignaturePage() {
  const [data, setData] = useState<SpecimenFormData>(() =>
    createInitialSpecimenData(),
  );
  const [busy, setBusy] = useState(false);
  const previewHtml = useMemo(() => buildSpecimenHtml(data), [data]);

  const relatedDocs = useMemo(() => {
    return allLiveTools()
      .filter((t) => t.id !== "specimen" && t.status === "live" && t.href !== "#")
      .slice(0, 4)
      .map((t) => ({
        id: t.id,
        title: t.title,
        href: t.href,
        icon: t.icon,
      }));
  }, []);

  function update<K extends keyof SpecimenFormData>(
    key: K,
    value: SpecimenFormData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateDirector<K extends keyof DirectorEntry>(
    idx: number,
    key: K,
    value: DirectorEntry[K],
  ) {
    const next = [...data.directors];
    next[idx] = { ...next[idx], [key]: value };
    update("directors", next);
  }

  function addDirector() {
    update("directors", [...data.directors, { ...initialDirector }]);
  }

  function removeDirector(idx: number) {
    const next = data.directors.filter((_, i) => i !== idx);
    update("directors", next.length ? next : [{ ...initialDirector }]);
  }

  function handleSignatureUpload(idx: number, file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateDirector(idx, "signatureImageUrl", e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleProfileSelect(profile: CompanyProfile) {
    setData((prev) => ({
      ...prev,
      establishmentName: profile.companyName || prev.establishmentName,
      directors:
        profile.directors.length > 0
          ? profile.directors.map((d) => ({
              name: d.directorName,
              designation: d.designation || "Director",
              signatureImageUrl: "",
            }))
          : prev.directors,
    }));
  }

  async function download(kind: "pdf" | "docx") {
    setBusy(true);
    try {
      const res = await fetch(`/api/specimen-signature/${kind}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: data }),
      });
      if (!res.ok) throw new Error(`Failed to generate ${kind.toUpperCase()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Specimen-Signature.${kind}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  function printPreview() {
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
    <div>
      <div className="mx-auto max-w-[1440px] px-0 py-0">
        {/* BREADCRUMB */}
        <nav className="mb-2.5 flex items-center gap-1.5 text-xs text-[#888888] font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-black transition-colors">Workspace</a>
          <span>/</span>
          <span className="text-[#444444] font-semibold">Specimen Signature Card</span>
        </nav>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          Specimen Signature Card
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          For upload with online application for registration of the company.
        </p>

        <div className="mt-4">
          <ProfileSelector onSelect={handleProfileSelect} />
        </div>

        <div className="mt-2 grid gap-5 lg:grid-cols-[3fr_7fr]">
          {/* INPUT PANEL */}
          <section className="max-h-[88vh] overflow-y-auto rounded-xl border bg-white p-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-600 mb-4">
              <span className="font-bold text-zinc-950 block mb-1.5 uppercase tracking-wider text-[10px]">What is this document?</span>
              The Specimen Signature Card contains the official signatures of the authorized directors or signatories of a company. Banks and the Ministry of Corporate Affairs (MCA) require this card to verify the authenticity of signatures on resolutions, deeds, and bank account instructions, preventing unauthorized or fraudulent transactions.
            </div>
            <div className="grid gap-4">
              <Input label="Name of Establishment (Company Name)" required>
                <input
                  className={inputClass}
                  value={data.establishmentName}
                  onChange={(e) => update("establishmentName", e.target.value)}
                  placeholder="Company Name as per MCA"
                />
              </Input>


              {/* DIRECTORS */}
              <div className="rounded-xl border bg-zinc-50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold">Director Details</div>
                  <button
                    type="button"
                    className={secondaryBtnClass}
                    onClick={addDirector}
                  >
                    + Add Director
                  </button>
                </div>

                <div className="grid gap-4">
                  {data.directors.map((dir, idx) => (
                    <div
                      key={`dir-${idx}`}
                      className="rounded-xl border bg-white p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-semibold text-zinc-700">
                          Director {idx + 1}
                        </div>
                        <button
                          type="button"
                          className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          onClick={() => removeDirector(idx)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-3">
                        <Input label="Name" required>
                          <input
                            className={inputClass}
                            value={dir.name}
                            onChange={(e) =>
                              updateDirector(idx, "name", e.target.value)
                            }
                            placeholder="Full name of director"
                          />
                        </Input>
                        <Input label="Designation" required>
                          <select
                            className={inputClass}
                            value={dir.designation}
                            onChange={(e) =>
                              updateDirector(idx, "designation", e.target.value)
                            }
                          >
                            {designationOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </Input>
                        <Input label="Specimen Signature (upload image)">
                          <input
                            type="file"
                            accept="image/*"
                            className={inputClass}
                            onChange={(e) =>
                              handleSignatureUpload(
                                idx,
                                e.target.files?.[0],
                              )
                            }
                          />
                          {dir.signatureImageUrl && (
                            <div className="mt-2 rounded-lg border bg-zinc-50 p-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={dir.signatureImageUrl}
                                alt={`Signature ${idx + 1}`}
                                className="max-h-16 object-contain"
                              />
                            </div>
                          )}
                        </Input>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>


          </section>

          {/* PREVIEW PANEL */}
          <section className="flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Live Preview
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-auto bg-zinc-100 p-4">
              <div
                style={{
                  transform: "scale(0.9)",
                  transformOrigin: "top center",
                }}
              >
                <iframe
                  title="Specimen Signature Preview"
                  className="mx-auto w-[210mm] min-h-[1100px] bg-white shadow-sm border-none"
                  srcDoc={previewHtml}
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Action buttons — centered below both panels ── */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => download("pdf")}
            disabled={busy}
            className="min-w-[160px] rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {busy ? "Generating…" : "⬇ Download PDF"}
          </button>
          <button
            type="button"
            onClick={() => download("docx")}
            disabled={busy}
            className="min-w-[160px] rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          >
            ⬇ Download DOCX
          </button>
          <button
            type="button"
            onClick={printPreview}
            className="min-w-[160px] rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            🖨 Print
          </button>
        </div>

        {relatedDocs && relatedDocs.length > 0 && (
          <div className="mt-8 border-t border-[#eeeeee] pt-6 pb-2 max-w-4xl mx-auto w-full">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#888888] mb-3 text-center sm:text-left">
              Related Compliance Documents
            </h3>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {relatedDocs.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d9d9d9] bg-white px-3 py-2 text-xs font-bold text-[#444444] hover:border-black hover:text-black transition-colors"
                >
                  <span>{doc.icon}</span>
                  <span>{doc.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        <article className="mt-12 border-t pt-8 text-zinc-800 max-w-4xl mx-auto w-full">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-zinc-950">What is a Specimen Signature Card?</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                A Specimen Signature Card is an official record containing the signatures of the authorized directors or officers of a company or LLP. It serves as a verification benchmark for banks, registry officials (like the ROC), and counterparties to cross-reference and authenticate legal signatures on physical and digital files.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950">Frequently Asked Questions (FAQs)</h2>
              <div className="mt-4 space-y-3">
                <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
                    <span>What is a specimen signature card used for?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
                    A specimen signature card is a reference document that displays the authorized signatures of a company's directors or officers. It is used by banks, government departments (like MCA), and financial institutions to verify that signatures on checks, applications, and resolutions are authentic and authorized.
                  </div>
                </details>

                <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
                    <span>Do we need a specimen signature for new company incorporation?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
                    Yes, under the Ministry of Corporate Affairs (MCA) SPICe+ filing, a specimen signature card of the first directors is often required to be uploaded in the prescribed format as part of the incorporation documents.
                  </div>
                </details>

                <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
                    <span>Can a director upload a digital signature image?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
                    Yes, directors can upload a clean, scanned image of their physical signature to auto-fill and generate the specimen signature card. However, make sure the image is clear and matches their official government-issued identity documents (like PAN card or Passport).
                  </div>
                </details>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}

function Input({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-zinc-900">
        {label}{" "}
        {required ? <span className="text-red-600">*</span> : null}
      </div>
      {children}
    </label>
  );
}

function buildSpecimenHtml(data: SpecimenFormData): string {
  const val = (s: string) =>
    s.trim()
      ? escapeHtml(s)
      : '<span style="color:#aaa">_______________</span>';

  const directorCards = data.directors
    .map(
      (dir, idx) => `
      <div class="dir-card">
        <div class="dir-row">
          <span class="dir-label">Name of the Director ${idx + 1}</span>
          <span class="dir-sep"> &ndash; </span>
          <span class="dir-val">${val(dir.name)}</span>
        </div>
        <div class="dir-row">
          <span class="dir-label">Designation</span>
          <span class="dir-sep"> &ndash; </span>
          <span class="dir-val">${val(dir.designation)}</span>
        </div>
        <div class="dir-row" style="margin-top: 15px;">
          <span class="dir-label">Specimen Signature</span>
          <span class="dir-sep">:</span>
          <span class="dir-sig">
            ${
              dir.signatureImageUrl
                ? `<img src="${dir.signatureImageUrl}" alt="Signature" style="max-height:80px;max-width:250px;object-fit:contain;" />`
                : '<div style="width:250px;height:70px;border:1px solid #ccc; background: #fafafa;"></div>'
            }
          </span>
        </div>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      color: #000;
      padding: 24px;
      background: #fff;
      line-height: 1.5;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .page { max-width: 800px; margin: 0 auto; overflow-wrap: break-word; }

    .header {
      text-align: center;
      font-weight: bold;
      text-decoration: underline;
      font-size: 13pt;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    .establishment-row {
      margin-bottom: 25px;
      font-size: 13pt;
      font-weight: bold;
    }
    .establishment-row .label {
      font-weight: normal;
      font-size: 11pt;
    }

    .dir-card {
      border: 1px solid #000;
      padding: 16px;
      margin-bottom: 16px;
      border-radius: 2px;
      overflow-wrap: break-word;
    }
    .dir-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      gap: 4px;
      flex-wrap: wrap;
    }
    .dir-row:last-child { margin-bottom: 0; }
    .dir-label {
      min-width: 200px;
      font-size: 11pt;
      flex-shrink: 0;
    }
    .dir-sep {
      margin: 0 4px;
    }
    .dir-val {
      font-weight: bold;
      word-break: break-word;
    }
    .dir-sig {
      margin-top: 4px;
    }

    @media print {
      @page { size: auto; margin: 0; }
      body { padding: 0; margin: 0; }
      .page { max-width: none; padding: 15mm; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      Specimen Signature Card for Upload with the Online Application<br/>
      for Registration of the Company
    </div>

    <div class="establishment-row">
      <span class="label">NAME OF ESTABLISHMENT</span>
      <span class="sep"> &ndash; </span>
      <span class="value">${val(data.establishmentName)}</span>
    </div>

    ${directorCards}

  </div>
</body>
</html>`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";
const primaryBtnClass =
  "rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60";
const secondaryBtnClass =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60";
