"use client";

import { useMemo, useState } from "react";
import ProfileSelector from "@/components/ProfileSelector";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import SignatureUpload from "@/components/SignatureUpload";
import type { CompanyProfile } from "@/lib/profiles/types";
import { buildNocHtml } from "@/lib/noc/build-html";

// ── types ────────────────────────────────────────────────────────────────────
type Signatory = {
  name: string;
  position: string;
  /** 8-digit Director Identification Number — shown on NOC in preference to PAN */
  din: string;
  pan: string;
  signatureImage?: string;
};

type NocFormData = {
  ownerName: string;
  ownerAddress: string;
  ownerSignatureImage?: string;
  date: string;
  companyName: string;
  registeredOfficeAddress: string;
  signatories: Signatory[];
};

// ── helpers ──────────────────────────────────────────────────────────────────
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptySignatory(): Signatory {
  return { name: "", position: "Director", din: "", pan: "", signatureImage: "" };
}

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/** When non-empty, DIN must be 8 digits; PAN must match ABCDE1234F. */
function signatoryIdValidationError(sig: Signatory, indexOneBased: number): string | null {
  const d = sig.din.replace(/\D/g, "").trim();
  const p = sig.pan.trim().toUpperCase();
  if (d.length > 0 && d.length !== 8) {
    return `Signatory ${indexOneBased}: DIN must be exactly 8 digits (or leave blank to use PAN only).`;
  }
  if (p.length > 0 && !PAN_RE.test(p)) {
    return `Signatory ${indexOneBased}: PAN must be in format ABCDE1234F (5 letters, 4 numbers, 1 letter).`;
  }
  return null;
}

function validateSignatories(sigs: Signatory[]): string | null {
  for (let i = 0; i < sigs.length; i++) {
    const err = signatoryIdValidationError(sigs[i], i + 1);
    if (err) return err;
  }
  return null;
}

function initialData(): NocFormData {
  return {
    ownerName: "",
    ownerAddress: "",
    ownerSignatureImage: "",
    date: todayIso(),
    companyName: "",
    registeredOfficeAddress: "",
    signatories: [emptySignatory(), emptySignatory()],
  };
}

// ── styles ───────────────────────────────────────────────────────────────────
const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100";

const labelClass = "mb-1 block text-xs font-semibold text-zinc-700";

// ── sub-components ────────────────────────────────────────────────────────────
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

// ── main component ────────────────────────────────────────────────────────────
export default function NocPage() {
  const [data, setData] = useState<NocFormData>(initialData);
  const [busy, setBusy] = useState(false);
  const previewHtml = useMemo(() => buildNocHtml(data), [data]);

  function update<K extends keyof NocFormData>(key: K, value: NocFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateSignatory<K extends keyof Signatory>(idx: number, key: K, value: Signatory[K]) {
    setData((prev) => {
      const sigs = prev.signatories.map((s, i) =>
        i === idx ? { ...s, [key]: value } : s,
      );
      return { ...prev, signatories: sigs };
    });
  }

  function addSignatory() {
    setData((prev) => ({
      ...prev,
      signatories: [...prev.signatories, emptySignatory()],
    }));
  }

  function removeSignatory(idx: number) {
    setData((prev) => {
      if (prev.signatories.length <= 1) return prev;
      return {
        ...prev,
        signatories: prev.signatories.filter((_, i) => i !== idx),
      };
    });
  }

  function handleProfileSelect(profile: CompanyProfile) {
    setData((prev) => ({
      ...prev,
      companyName: profile.companyName || prev.companyName,
      registeredOfficeAddress:
        profile.registeredAddress || prev.registeredOfficeAddress,
      signatories:
        profile.directors.length > 0
          ? profile.directors.map((d) => {
              const dinRaw = (d.din ?? "").replace(/\D/g, "").slice(0, 8);
              const panRaw = (d.pan ?? "").trim().toUpperCase().slice(0, 10);
              return {
                name: d.directorName ?? "",
                position: d.designation || "Director",
                din: dinRaw,
                pan: panRaw,
                signatureImage: "",
              };
            })
          : prev.signatories,
    }));
  }

  async function download(kind: "pdf" | "docx") {
    const idErr = validateSignatories(data.signatories);
    if (idErr) {
      alert(idErr);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/noc/${kind}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: data }),
      });
      if (!res.ok) throw new Error(`Failed to generate ${kind.toUpperCase()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NOC_${data.companyName || "document"}.${kind}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <DocumentEditorLayout
      title="NOC — No Objection Certificate"
      description="For use of owner's property as Registered Office — addressed to MCA / IICA."
      onProfileSelect={handleProfileSelect}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="NOC Preview"
      inputSection={
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Property Owner Details</h2>
            <Input label="Owner Name" required>
              <input className={inputClass} placeholder="Full name of property owner" value={data.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
            </Input>
            <Input label="Owner Address" required>
              <textarea className={inputClass} rows={3} placeholder="Owner's full address" value={data.ownerAddress} onChange={(e) => update("ownerAddress", e.target.value)} />
            </Input>
            <SignatureUpload label="Owner Signature" onSignatureChange={(sig) => update("ownerSignatureImage", sig || "")} />
            <Input label="Date">
              <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
            </Input>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Company Details</h2>
            <Input label="Company Name" required>
              <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </Input>
            <Input label="Property Address" required>
              <textarea className={inputClass} rows={3} placeholder="Address of property being used" value={data.registeredOfficeAddress} onChange={(e) => update("registeredOfficeAddress", e.target.value)} />
            </Input>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Signatories (Accepted By)</h2>
              <button type="button" onClick={addSignatory} className="text-xs font-bold text-blue-600 hover:text-blue-700">+ Add</button>
            </div>
            <div className="space-y-6">
              {data.signatories.map((sig, idx) => (
                <div key={idx} className="relative rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 space-y-3">
                  <button type="button" onClick={() => removeSignatory(idx)} className="absolute right-2 top-2 text-zinc-400 hover:text-red-500">✕</button>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input label="Name">
                      <input className={inputClass} value={sig.name} onChange={(e) => updateSignatory(idx, "name", e.target.value)} />
                    </Input>
                    <Input label="Position">
                      <input className={inputClass} value={sig.position} onChange={(e) => updateSignatory(idx, "position", e.target.value)} />
                    </Input>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input label="DIN (8 digits)">
                      <input className={inputClass} value={sig.din} onChange={(e) => updateSignatory(idx, "din", e.target.value)} />
                    </Input>
                    <Input label="PAN">
                      <input className={inputClass} value={sig.pan} onChange={(e) => updateSignatory(idx, "pan", e.target.value)} />
                    </Input>
                  </div>
                  <SignatureUpload label="Signatory Signature" onSignatureChange={(sigImg) => updateSignatory(idx, "signatureImage", sigImg || "")} />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
