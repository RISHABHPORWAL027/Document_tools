"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import SignatureUpload from "@/components/SignatureUpload";
import type { CompanyProfile } from "@/lib/profiles/types";
import {
  buildLlpNocRoHtml,
  type LlpNocRoSignatory,
  type LlpNocRoValues,
} from "@/lib/llp/noc-ro-html";

const REF_BASE =
  "/company%20document/Company%20%3A%20LLP%20Incoorpation/LLP";

const REF_FILES = {
  noc: `${REF_BASE}/NOC%20to%20utilize%20the%20Registered%20Office.doc`,
} as const;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptySignatory(): LlpNocRoSignatory {
  return { name: "", position: "Designated Partner", dpin: "", pan: "" };
}

function initialData(): LlpNocRoValues {
  return {
    ownerName: "",
    ownerAddress: "",
    date: todayIso(),
    llpName: "",
    registeredOfficeAddress: "",
    signatories: [emptySignatory(), emptySignatory()],
  };
}

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

function signatoryValidationError(
  sig: LlpNocRoSignatory,
  indexOneBased: number,
): string | null {
  const d = (sig.dpin ?? "").replace(/\D/g, "").trim();
  const p = (sig.pan ?? "").trim().toUpperCase();
  if (d.length > 0 && d.length !== 8) {
    return `Signatory ${indexOneBased}: DPIN must be exactly 8 digits (or leave blank to use PAN only).`;
  }
  if (p.length > 0 && !PAN_RE.test(p)) {
    return `Signatory ${indexOneBased}: PAN must be in format ABCDE1234F.`;
  }
  return null;
}

function validateSignatories(sigs: LlpNocRoSignatory[]): string | null {
  for (let i = 0; i < sigs.length; i++) {
    const err = signatoryValidationError(sigs[i], i + 1);
    if (err) return err;
  }
  return null;
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100";

const labelClass = "mb-1 block text-xs font-semibold text-zinc-700";

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
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function LlpNocRoPage() {
  const searchParams = useSearchParams();
  const companyFromUrl = searchParams.get("company");

  const [data, setData] = useState<LlpNocRoValues>(() => initialData());
  const [busy, setBusy] = useState(false);
  const previewHtml = useMemo(() => buildLlpNocRoHtml(data), [data]);

  function update<K extends keyof LlpNocRoValues>(key: K, value: LlpNocRoValues[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateSignatory(
    idx: number,
    key: keyof LlpNocRoSignatory,
    value: string,
  ) {
    setData((prev) => {
      const sigs = prev.signatories!.map((s, i) =>
        i === idx ? { ...s, [key]: value } : s,
      );
      return { ...prev, signatories: sigs };
    });
  }

  function addSignatory() {
    setData((prev) => ({
      ...prev,
      signatories: [...(prev.signatories ?? []), emptySignatory()],
    }));
  }

  function removeSignatory(idx: number) {
    setData((prev) => {
      const sigs = prev.signatories ?? [];
      if (sigs.length <= 1) return prev;
      return { ...prev, signatories: sigs.filter((_, i) => i !== idx) };
    });
  }

  function handleProfileSelect(profile: CompanyProfile) {
    setData((prev) => ({
      ...prev,
      llpName: profile.companyName || prev.llpName,
      registeredOfficeAddress:
        profile.registeredAddress || prev.registeredOfficeAddress,
      signatories:
        profile.directors.length > 0
          ? profile.directors.map((d) => {
              const dpinRaw = (d.din ?? "").replace(/\D/g, "").slice(0, 8);
              const panRaw = (d.pan ?? "").trim().toUpperCase().slice(0, 10);
              return {
                name: d.directorName ?? "",
                position: "Designated Partner",
                dpin: dpinRaw,
                pan: panRaw,
              };
            })
          : prev.signatories,
    }));
  }

  async function download(kind: "pdf" | "docx") {
    const idErr = validateSignatories(data.signatories ?? []);
    if (idErr) {
      alert(idErr);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/llp/noc-ro/${kind}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: data }),
      });
      if (!res.ok) throw new Error(`Failed to generate ${kind.toUpperCase()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = (data.llpName ?? "LLP").replace(/[^\w\s-]/g, "").slice(0, 40);
      a.download = `LLP-NOC-RO_${safe}.${kind}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  function printPreview() {
    const idErr = validateSignatories(data.signatories ?? []);
    if (idErr) {
      alert(idErr);
      return;
    }
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(buildLlpNocRoHtml(data));
    w.document.close();
    w.focus();
    w.print();
  }

  const sigs = data.signatories ?? [];

  return (
    <DocumentEditorLayout
      title="NOC — Registered Office (LLP)"
      description="No Objection Certificate from the property owner for utilizing the address as the LLP's registered office."
      onProfileSelect={handleProfileSelect}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="LLP NOC Preview"
      inputSection={
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Property Owner Details</h2>
            <Input label="Owner Name" required>
              <input className={inputClass} value={data.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
            </Input>
            <Input label="Owner Address" required>
              <textarea className={inputClass} rows={3} value={data.ownerAddress} onChange={(e) => update("ownerAddress", e.target.value)} />
            </Input>
            <SignatureUpload label="Owner Signature" onSignatureChange={(sig) => update("ownerSignatureImage", sig || "")} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">LLP Details</h2>
            <Input label="LLP Name" required>
              <input className={inputClass} value={data.llpName} onChange={(e) => update("llpName", e.target.value)} />
            </Input>
            <Input label="Proposed Registered Office Address" required>
              <textarea className={inputClass} rows={3} value={data.registeredOfficeAddress} onChange={(e) => update("registeredOfficeAddress", e.target.value)} />
            </Input>
            <Input label="Date of Execution">
              <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
            </Input>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Designated Partners</h2>
              <button type="button" onClick={addSignatory} className="text-xs font-bold text-teal-700 hover:text-teal-800 uppercase tracking-tight">+ Add Partner</button>
            </div>
            <div className="space-y-4">
              {data.signatories?.map((sig, i) => (
                <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 space-y-3 relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Partner #{i + 1}</span>
                    {data.signatories!.length > 1 && (
                      <button onClick={() => removeSignatory(i)} className="text-xs font-medium text-red-600 hover:text-red-700">Remove</button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Input label="Full Name">
                      <input className={inputClass} value={sig.name} onChange={(e) => updateSignatory(i, "name", e.target.value)} />
                    </Input>
                    <Input label="Designation">
                      <input className={inputClass} value={sig.position} onChange={(e) => updateSignatory(i, "position", e.target.value)} />
                    </Input>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input label="DPIN">
                        <input className={inputClass} maxLength={8} value={sig.dpin} onChange={(e) => updateSignatory(i, "dpin", e.target.value.replace(/\D/g, "").slice(0, 8))} />
                      </Input>
                      <Input label="PAN">
                        <input className={inputClass} maxLength={10} value={sig.pan} onChange={(e) => updateSignatory(i, "pan", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))} />
                      </Input>
                    </div>
                    <SignatureUpload label="Partner Signature" onSignatureChange={(sigImg) => updateSignatory(i, "signatureImage", sigImg || "")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
