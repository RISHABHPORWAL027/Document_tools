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
  buildAppointmentLetterCasualVacancyHtml,
  type AppointmentLetterCasualVacancyData,
} from "@/lib/pvt-ltd/auditor-casual-vacancy/appointment-letter-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

function initialData(): AppointmentLetterCasualVacancyData {
  return {
    date: new Date().toISOString().split("T")[0],
    auditorFirmName: "",
    auditorFirmType: "Chartered Accountants",
    auditorAddress: "",
    companyName: "",
    financialYear: "",
    meetingDay: "",
    meetingDayOfMonth: "",
    meetingMonth: "",
    meetingYear: new Date().getFullYear().toString(),
    signatoryName: "",
    signatoryDin: "",
    signatureImage: "",
  };
}

export default function AppointmentLetterCasualVacancyPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    signatoryName: (p) => p.directors[0]?.directorName || "",
    signatoryDin: (p) => p.directors[0]?.din || "",
  });

  const update = (field: keyof AppointmentLetterCasualVacancyData, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const previewHtml = useMemo(() => buildAppointmentLetterCasualVacancyHtml(data), [data]);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fn = `Appointment_Letter_Casual_Vacancy_${(data.auditorFirmName || "Auditor").replace(/\s+/g, "_").slice(0, 30)}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fn);
      } else {
        const res = await fetch("/api/pvt-ltd/auditor-casual-vacancy/appointment-letter/docx", {
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
      title="Appointment Letter — Casual Vacancy Auditor"
      description="Letter informing the auditor firm of their appointment to fill a casual vacancy."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          signatoryName: p.directors[0]?.directorName || "",
          signatoryDin: p.directors[0]?.din || "",
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
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Auditor Firm (Appointee)</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Name</label>
              <input className={inputClass} placeholder="e.g. XYZ & Company" value={data.auditorFirmName} onChange={(e) => update("auditorFirmName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Type</label>
              <input className={inputClass} value={data.auditorFirmType} onChange={(e) => update("auditorFirmType", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Address</label>
              <textarea className={inputClass} rows={2} value={data.auditorAddress} onChange={(e) => update("auditorAddress", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">EGM Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Date</label>
              <LegalDatePicker
                className={inputClass}
                onChange={(parts) => {
                  update("meetingDay", parts.weekdayLower);
                  update("meetingMonth", parts.monthNameLower);
                  update("meetingYear", parts.year);
                  update("meetingDayOfMonth", parts.ordinalDayLower);
                }}
              />
              <div className="text-[10px] text-zinc-400 mt-1">
                Preview: {data.meetingDay ? `${data.meetingDay}, ${data.meetingDayOfMonth} ${data.meetingMonth} ${data.meetingYear}` : "Not selected"}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Signatory Director</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
                <input className={inputClass} value={data.signatoryName} onChange={(e) => update("signatoryName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">DIN</label>
                <input className={inputClass} value={data.signatoryDin} onChange={(e) => update("signatoryDin", e.target.value)} />
              </div>
            </div>
            <SignatureUpload label="Director Signature" onSignatureChange={(sig) => update("signatureImage", sig || "")} />
          </div>
        </>
      }
    />
  );
}
