"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import type { CompanyProfile } from "@/lib/profiles/types";
import {
  buildLlpNocRoHtml,
  type LlpNocRoValues,
} from "@/lib/llp/noc-ro-html";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function initialData(): LlpNocRoValues {
  return {
    ownerName: "",
    ownerAddress: "",
    date: todayIso(),
    llpName: "",
    registeredOfficeAddress: "",
    designatedPartnerName: "",
  };
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
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState<LlpNocRoValues>(() => initialData());
  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    llpName: (p) => p.companyName || "",
    registeredOfficeAddress: (p) => p.registeredAddress || "",
    designatedPartnerName: (p) => p.directors[0]?.directorName || "",
  });

  const previewHtml = useMemo(() => buildLlpNocRoHtml(data), [data]);

  function update<K extends keyof LlpNocRoValues>(key: K, value: LlpNocRoValues[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function download(kind: "pdf" | "docx") {
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

  return (
    <DocumentEditorLayout
      title="NOC — Registered Office (LLP)"
      description="No Objection Certificate from the property owner specifically for LLP incorporation."
      onProfileSelect={() => {}}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="LLP NOC Preview"
      inputSection={
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs font-bold">Property Owner Details</h2>
            <Input label="Owner Name" required>
              <input className={inputClass} value={data.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
            </Input>
            <Input label="Owner Address" required>
              <textarea className={inputClass} rows={3} value={data.ownerAddress} onChange={(e) => update("ownerAddress", e.target.value)} />
            </Input>
            <SignatureUpload label="Owner Signature" onSignatureChange={(sig) => update("ownerSignatureImage", sig || "")} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs font-bold">LLP & Authorization</h2>
            <Input label="LLP Name" required>
              <input className={inputClass} value={data.llpName} onChange={(e) => update("llpName", e.target.value)} />
            </Input>
            <Input label="Property Address (Office)" required>
              <textarea className={inputClass} rows={3} value={data.registeredOfficeAddress} onChange={(e) => update("registeredOfficeAddress", e.target.value)} />
            </Input>
            <Input label="Designated Partner to Authorize" required>
              <input className={inputClass} placeholder="Full Name" value={data.designatedPartnerName} onChange={(e) => update("designatedPartnerName", e.target.value)} />
            </Input>
            <Input label="Date of Execution">
              <LegalDatePicker 
                className={inputClass} 
                value={data.date} 
                onChange={(parts) => update("date", parts.dateIso)} 
              />
            </Input>
          </div>
        </div>
      }
    />
  );
}
