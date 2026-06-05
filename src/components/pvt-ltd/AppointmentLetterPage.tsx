"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import { getRelatedDocs } from "@/lib/site/registry";

const alSeoContent = (
  <article className="text-zinc-800">
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <h2 className="text-xl font-bold text-zinc-950">Statutory Auditor Appointment Letter</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          The Auditor Appointment Letter is an official corporate communication issued by a company to its newly appointed statutory auditor following approvals at the Annual General Meeting (AGM) or Board Meeting. It outlines the formal tenure, audit conditions, scope, and remuneration structure. Under Section 139 of the Companies Act, 2013, filing the appointment letter with Form ADT-1 is mandatory.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-950">Frequently Asked Questions (FAQs)</h2>
        <div className="mt-4 space-y-3">
          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>What is a statutory auditor appointment letter?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              An auditor appointment letter is a formal document issued by a company to its newly appointed statutory auditor. It outlines the terms of their appointment, the tenure (usually 5 years), the financial year(s) covered, and the compensation or ratification details decided by the shareholders.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>When is the appointment letter issued?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              It is issued immediately after the company passes a resolution in the Annual General Meeting (AGM) or Board Meeting appointing the statutory auditor. A copy is sent to the auditor along with their official consent request.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>Do private limited companies need to file the appointment letter with the ROC?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              Yes, under Section 139 of the Companies Act, 2013, the appointment letter along with the auditor's eligibility consent certificate must be filed as attachments to Form ADT-1 with the ROC.
            </div>
          </details>
        </div>
      </section>
    </div>
  </article>
);
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

  const relatedDocs = useMemo(() => {
    return getRelatedDocs("appointment-letter", "inc-auditor-first");
  }, []);

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
      aboutDescription="The Letter of Appointment is a formal notice issued to statutory auditors outlining the scope of audit work, agreed term (usually 5 consecutive years), and legal remuneration terms. It serves as mandatory attachment proof for filing Form ADT-1 with the ROC."
      relatedDocs={relatedDocs}
      seoContent={alSeoContent}
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
