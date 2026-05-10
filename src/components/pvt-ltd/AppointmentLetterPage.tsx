"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import ProfileSelector from "@/components/ProfileSelector";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import SignatureUpload from "@/components/SignatureUpload";
import { buildAppointmentLetterHtml, AppointmentLetterData } from "@/lib/pvt-ltd/appointment-letter-html";
import { downloadDocx } from "@/lib/render/docx-client";
import { downloadPdf } from "@/lib/render/pdf-client";

export default function AppointmentLetterPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);

  const [data, setData] = useState<AppointmentLetterData>({
    companyName: "",
    cin: "",
    regAddress: "",
    date: new Date().toISOString().split("T")[0],
    appointeeName: "",
    appointeeAddress: "",
    designation: "Director",
    effectiveDate: new Date().toISOString().split("T")[0],
    termYears: "5",
    signatoryName: "",
    signatoryDesignation: "Director",
    signatureImage: "",
  });

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        companyName: profile.companyName || prev.companyName,
        cin: profile.cin || prev.cin,
        regAddress: profile.registeredAddress || prev.regAddress,
      }));
    }
  }, [profile]);

  const update = (field: keyof AppointmentLetterData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const previewHtml = buildAppointmentLetterHtml(data);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fileName = `Appointment_Letter_${data.appointeeName.replace(/\s+/g, "_")}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fileName);
      } else {
        await downloadDocx(previewHtml, fileName);
      }
    } finally {
      setBusy(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

  return (
    <DocumentEditorLayout
      title="Letter of Appointment"
      description="Generate formal appointment letters for directors or auditors."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          cin: p.cin || "",
          regAddress: p.registeredAddress || "",
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Appointment Letter Preview"
      inputSection={
        <>
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Company Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
              <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">CIN</label>
                <input className={inputClass} value={data.cin} onChange={(e) => update("cin", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Letter Date</label>
                <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Appointee Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Appointee Name</label>
              <input className={inputClass} value={data.appointeeName} onChange={(e) => update("appointeeName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Appointee Address</label>
              <textarea className={inputClass} rows={2} value={data.appointeeAddress} onChange={(e) => update("appointeeAddress", e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Designation</label>
                <input className={inputClass} value={data.designation} onChange={(e) => update("designation", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Effective Date</label>
                <input type="date" className={inputClass} value={data.effectiveDate} onChange={(e) => update("effectiveDate", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Signatory Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Signatory Name</label>
                <input className={inputClass} value={data.signatoryName} onChange={(e) => update("signatoryName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Designation</label>
                <input className={inputClass} value={data.signatoryDesignation} onChange={(e) => update("signatoryDesignation", e.target.value)} />
              </div>
            </div>
            <SignatureUpload
              onSignatureChange={(sig) => update("signatureImage", sig || "")}
            />
          </div>
        </>
      }
    />
  );
}
