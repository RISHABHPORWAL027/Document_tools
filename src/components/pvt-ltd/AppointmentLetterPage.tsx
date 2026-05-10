"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import { buildAppointmentLetterHtml, AppointmentLetterData } from "@/lib/pvt-ltd/appointment-letter-html";
import { downloadDocx } from "@/lib/render/docx-client";
import { downloadPdf } from "@/lib/render/pdf-client";

const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

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
    appointeeFrn: "",
    appointeeAddress: "",
    meetingDate: new Date().toISOString().split("T")[0],
    designation: "Statutory Auditor",
    effectiveDate: new Date().toISOString().split("T")[0],
    termYears: "5",
    directors: [
      { name: "", din: "", designation: "Director" },
      { name: "", din: "", designation: "Director" },
    ],
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
        directors: profile.directors.length > 0
          ? profile.directors.map(d => ({
              name: d.directorName || "",
              din: d.din || "",
              designation: "Director",
            }))
          : prev.directors,
        signatoryName: profile.directors[0]?.directorName || prev.signatoryName,
      }));
    }
  }, [profile]);

  const update = (field: keyof AppointmentLetterData, value: any) => {
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

  return (
    <DocumentEditorLayout
      title="Letter of Appointment"
      description="Formal appointment letter for statutory auditor of the company."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          cin: p.cin || "",
          regAddress: p.registeredAddress || "",
          directors: p.directors.length > 0
            ? p.directors.map(d => ({
                name: d.directorName || "",
                din: d.din || "",
                designation: "Director",
              }))
            : prev.directors,
          signatoryName: p.directors[0]?.directorName || "",
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
                <label className="text-xs font-medium text-zinc-500 uppercase">Letter Date</label>
                <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Board Meeting Date</label>
                <input type="date" className={inputClass} value={data.meetingDate} onChange={(e) => update("meetingDate", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Appointee (Auditor Firm)</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Name</label>
              <input className={inputClass} value={data.appointeeName} onChange={(e) => update("appointeeName", e.target.value)} placeholder="e.g. OMN & ASSOCIATES" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">FRN (Firm Reg. No.)</label>
              <input className={inputClass} value={data.appointeeFrn} onChange={(e) => update("appointeeFrn", e.target.value)} placeholder="000383S" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Address</label>
              <textarea className={inputClass} rows={2} value={data.appointeeAddress} onChange={(e) => update("appointeeAddress", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Directors</h2>
              <button 
                type="button"
                onClick={() => update("directors", [...data.directors, { name: "", din: "", designation: "Director" }])}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Director
              </button>
            </div>
            {data.directors.map((dir, i) => (
              <div key={i} className="rounded-lg border bg-zinc-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Director #{i + 1}</span>
                  {data.directors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => update("directors", data.directors.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
                    <input className={inputClass} value={dir.name} onChange={(e) => {
                      const newDirs = [...data.directors];
                      newDirs[i] = { ...newDirs[i], name: e.target.value };
                      update("directors", newDirs);
                    }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">DIN</label>
                    <input className={inputClass} value={dir.din} onChange={(e) => {
                      const newDirs = [...data.directors];
                      newDirs[i] = { ...newDirs[i], din: e.target.value };
                      update("directors", newDirs);
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    />
  );
}
