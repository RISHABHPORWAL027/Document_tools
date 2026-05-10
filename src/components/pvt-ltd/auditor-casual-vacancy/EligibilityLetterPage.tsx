"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import { downloadPdf } from "@/lib/render/pdf-client";
import { downloadDocx } from "@/lib/render/docx-client";
import {
  buildEligibilityCasualVacancyHtml,
  type EligibilityCasualVacancyData,
} from "@/lib/pvt-ltd/auditor-casual-vacancy/eligibility-letter-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

function initialData(): EligibilityCasualVacancyData {
  return {
    date: new Date().toISOString().split("T")[0],
    companyName: "",
    companyAddress: "",
    firmName: "",
    egmDate: "",
    financialYear: "",
    auditorPan: "",
    frn: "",
    firmAddress: "",
    firmCity: "",
    firmState: "",
    firmPincode: "",
    auditorEmail: "",
    proprietorName: "",
    membershipNo: "",
    signatureImage: "",
  };
}

export default function EligibilityLetterCasualVacancyPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    companyAddress: (p) => p.registeredAddress || "",
  });

  const update = (field: keyof EligibilityCasualVacancyData, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const previewHtml = useMemo(() => buildEligibilityCasualVacancyHtml(data), [data]);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fn = `Eligibility_Certificate_Casual_Vacancy_${(data.firmName || "Auditor").replace(/\s+/g, "_").slice(0, 30)}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fn);
      } else {
        const res = await fetch("/api/pvt-ltd/auditor-casual-vacancy/eligibility-letter/docx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: data }),
        });
        if (!res.ok) throw new Error("Failed to generate DOCX");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fn;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DocumentEditorLayout
      title="Eligibility Certificate — Casual Vacancy Auditor"
      description="Certificate of eligibility cum consent to act as auditor for filling casual vacancy."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          companyAddress: p.registeredAddress || "",
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Eligibility Certificate Preview"
      inputSection={
        <>
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Company Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
              <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Address</label>
              <textarea className={inputClass} rows={2} value={data.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Letter Date</label>
                <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Financial Year</label>
                <input className={inputClass} placeholder="e.g. 2024-25" value={data.financialYear} onChange={(e) => update("financialYear", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">EGM Date</label>
              <LegalDatePicker
                className={inputClass}
                onChange={(parts) => update("egmDate", `${parts.ordinalDayLower} ${parts.monthNameLower}, ${parts.year}`)}
              />
              <div className="text-[10px] text-zinc-400 mt-1">Preview output: {data.egmDate || "Not selected"}</div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Auditor Firm Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Name</label>
              <input className={inputClass} placeholder="e.g. ABC & Company" value={data.firmName} onChange={(e) => update("firmName", e.target.value)} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">FRN</label>
                <input className={inputClass} placeholder="e.g. 123456W" value={data.frn} onChange={(e) => update("frn", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">PAN</label>
                <input className={inputClass} value={data.auditorPan} onChange={(e) => update("auditorPan", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Address</label>
              <textarea className={inputClass} rows={2} value={data.firmAddress} onChange={(e) => update("firmAddress", e.target.value)} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">City</label>
                <input className={inputClass} value={data.firmCity} onChange={(e) => update("firmCity", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">State</label>
                <input className={inputClass} value={data.firmState} onChange={(e) => update("firmState", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Pincode</label>
                <input className={inputClass} value={data.firmPincode} onChange={(e) => update("firmPincode", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Email</label>
              <input type="email" className={inputClass} value={data.auditorEmail} onChange={(e) => update("auditorEmail", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Signatory (Proprietor / Partner)</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
                <input className={inputClass} value={data.proprietorName} onChange={(e) => update("proprietorName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Membership No.</label>
                <input className={inputClass} value={data.membershipNo} onChange={(e) => update("membershipNo", e.target.value)} />
              </div>
            </div>
            <SignatureUpload label="Proprietor Signature" onSignatureChange={(sig) => update("signatureImage", sig || "")} />
          </div>
        </>
      }
    />
  );
}
