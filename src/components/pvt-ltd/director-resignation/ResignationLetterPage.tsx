"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import { downloadPdf } from "@/lib/render/pdf-client";
import { downloadDocx } from "@/lib/render/docx-client";
import type { CompanyProfile } from "@/lib/profiles/types";
import {
  buildResignationLetterDirectorHtml,
  type ResignationLetterDirectorData,
} from "@/lib/pvt-ltd/director-resignation/resignation-letter-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

function initialData(): ResignationLetterDirectorData {
  return {
    date: new Date().toISOString().split("T")[0],
    companyName: "",
    companyCin: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    directorName: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    din: "",
    signatureImage: "",
  };
}

export default function ResignationLetterPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile: urlProfile } = useCompanyProfile(companyId || undefined);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (urlProfile) {
      setProfile(urlProfile);
    }
  }, [urlProfile]);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    companyCin: (p) => p.cin || "",
    companyAddress: (p) => p.registeredAddress || "",
    companyPhone: (p) => p.mobileNumber || "",
    companyEmail: (p) => p.email || "",
    directorName: (p) => p.directors[0]?.directorName || "",
    din: (p) => p.directors[0]?.din || "",
  });

  const update = (field: keyof ResignationLetterDirectorData, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const previewHtml = useMemo(() => buildResignationLetterDirectorHtml(data), [data]);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fn = `Resignation_Letter_Director_${(data.directorName || "Director").replace(/\s+/g, "_").slice(0, 30)}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fn);
      } else {
        await downloadDocx(previewHtml, fn);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DocumentEditorLayout
      title="Resignation Letter"
      description="Generate formal resignation letter of a director."
      companyId={companyId}
      onProfileSelect={(p) => {
        setProfile(p);
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          companyCin: p.cin || "",
          companyAddress: p.registeredAddress || "",
          companyPhone: p.mobileNumber || "",
          companyEmail: p.email || "",
          directorName: p.directors[0]?.directorName || "",
          din: p.directors[0]?.din || "",
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Resignation Letter Preview"
      inputSection={
        <>
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Company Details</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
                <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">CIN</label>
                <input className={inputClass} value={data.companyCin} onChange={(e) => update("companyCin", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Address</label>
              <textarea className={inputClass} rows={2} value={data.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Contact No</label>
                <input className={inputClass} value={data.companyPhone} onChange={(e) => update("companyPhone", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Email ID</label>
                <input className={inputClass} value={data.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Resigning Director Details</h2>
            
            {profile && profile.directors.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Select Resigning Director</label>
                <select
                  className={inputClass}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (idx >= 0 && profile.directors[idx]) {
                      const dir = profile.directors[idx];
                      update("directorName", dir.directorName || "");
                      update("din", dir.din || "");
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>-- Select a Director --</option>
                  {profile.directors.map((d, idx) => (
                    <option key={idx} value={idx}>{d.directorName} ({d.din})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Resigning Director Name</label>
              <input className={inputClass} value={data.directorName} onChange={(e) => update("directorName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">DIN</label>
              <input className={inputClass} value={data.din} onChange={(e) => update("din", e.target.value)} />
            </div>
            <SignatureUpload label="Resigning Director Signature" onSignatureChange={(sig) => update("signatureImage", sig || "")} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Letter Dates</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Letter Date</label>
                <LegalDatePicker
                  className={inputClass}
                  value={data.date}
                  onChange={(parts) => update("date", parts.dateIso)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Effective Resignation Date</label>
                <LegalDatePicker
                  className={inputClass}
                  value={data.effectiveDate}
                  onChange={(parts) => update("effectiveDate", parts.dateIso)}
                />
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
