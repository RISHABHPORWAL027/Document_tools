"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import { downloadPdf } from "@/lib/render/pdf-client";
import { downloadDocx } from "@/lib/render/docx-client";
import {
  buildEgmResolutionCasualVacancyHtml,
  type EgmResolutionCasualVacancyData,
} from "@/lib/pvt-ltd/auditor-casual-vacancy/egm-resolution-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

function initialData(): EgmResolutionCasualVacancyData {
  return {
    companyName: "",
    meetingDay: "",
    meetingDayOfMonth: "",
    meetingMonth: "",
    meetingYear: new Date().getFullYear().toString(),
    registeredOfficeAddress: "",
    meetingTime: "",
    newAuditorName: "",
    newAuditorType: "Chartered Accountants",
    newAuditorFrn: "",
    oldAuditorName: "",
    oldAuditorType: "Chartered Accountants",
    oldAuditorFrn: "",
    resignationDate: "",
    financialYear: "",
    directors: [
      { name: "", din: "", designation: "DIRECTOR" },
      { name: "", din: "", designation: "DIRECTOR" },
    ],
  };
}

export default function EgmResolutionCasualVacancyPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    registeredOfficeAddress: (p) => p.registeredAddress || "",
    directors: (p) => p.directors.length > 0
      ? p.directors.map((d) => ({
          name: d.directorName || "",
          din: d.din || "",
          designation: "DIRECTOR",
        }))
      : undefined
  });

  const update = (field: keyof EgmResolutionCasualVacancyData, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const previewHtml = useMemo(() => buildEgmResolutionCasualVacancyHtml(data), [data]);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fn = `EGM_Resolution_Casual_Vacancy_${(data.companyName || "Company").replace(/\s+/g, "_").slice(0, 30)}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fn);
      } else {
        const res = await fetch("/api/pvt-ltd/auditor-casual-vacancy/egm-resolution/docx", {
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
      title="EGM Resolution — Casual Vacancy of Auditor"
      description="Ordinary Resolution at EGM for appointing statutory auditor to fill casual vacancy."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          registeredOfficeAddress: p.registeredAddress || "",
          directors:
            p.directors.length > 0
              ? p.directors.map((d) => ({
                  name: d.directorName || "",
                  din: d.din || "",
                  designation: "DIRECTOR",
                }))
              : prev.directors,
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="EGM Resolution Preview"
      inputSection={
        <>
          {/* Company & Meeting Details */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Company & Meeting Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
              <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Registered Office Address</label>
              <textarea className={inputClass} rows={2} value={data.registeredOfficeAddress} onChange={(e) => update("registeredOfficeAddress", e.target.value)} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Date</label>
                <LegalDatePicker
                  className={inputClass}
                  onChange={(parts) => {
                    update("meetingDay", parts.weekdayUpper);
                    update("meetingMonth", parts.monthNameUpper);
                    update("meetingYear", parts.year);
                    update("meetingDayOfMonth", parts.ordinalDayUpper);
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Time</label>
                <input 
                  type="time" 
                  className={inputClass} 
                  onChange={(e) => {
                    const time = e.target.value;
                    if (!time) return;
                    const [hoursStr, minutes] = time.split(":");
                    let hours = parseInt(hoursStr, 10);
                    const ampm = hours >= 12 ? "P.M." : "A.M.";
                    hours = hours % 12 || 12;
                    const formatted = `${hours.toString().padStart(2, "0")}.${minutes} ${ampm}`;
                    update("meetingTime", formatted);
                  }}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Financial Year</label>
                <input className={inputClass} placeholder="e.g. 2024-25" value={data.financialYear} onChange={(e) => update("financialYear", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Outgoing Auditor */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Outgoing Auditor (Resigned)</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Auditor Name</label>
              <input className={inputClass} placeholder="e.g. ABC & Co." value={data.oldAuditorName} onChange={(e) => update("oldAuditorName", e.target.value)} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Type</label>
                <input className={inputClass} value={data.oldAuditorType} onChange={(e) => update("oldAuditorType", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">FRN</label>
                <input className={inputClass} placeholder="e.g. 123456W" value={data.oldAuditorFrn} onChange={(e) => update("oldAuditorFrn", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Resignation Date</label>
              <LegalDatePicker
                className={inputClass}
                onChange={(parts) => update("resignationDate", parts.fullFormatted)}
              />
              <div className="text-[10px] text-zinc-400 mt-1">Preview output: {data.resignationDate || "Not selected"}</div>
            </div>
          </div>

          {/* New Auditor */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">New Auditor (Appointed)</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Auditor Name</label>
              <input className={inputClass} placeholder="e.g. XYZ & Company" value={data.newAuditorName} onChange={(e) => update("newAuditorName", e.target.value)} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Type</label>
                <input className={inputClass} value={data.newAuditorType} onChange={(e) => update("newAuditorType", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">FRN</label>
                <input className={inputClass} placeholder="e.g. 987654E" value={data.newAuditorFrn} onChange={(e) => update("newAuditorFrn", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Directors */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Directors (Signatories)</h2>
              <button
                type="button"
                onClick={() => update("directors", [...data.directors, { name: "", din: "", designation: "DIRECTOR" }])}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Director
              </button>
            </div>
            {data.directors.map((dir, i) => (
              <div key={i} className="rounded-lg border bg-zinc-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b pb-2 mb-2 border-zinc-200">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Director #{i + 1}</span>
                  {data.directors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => update("directors", data.directors.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
                    <input className={inputClass} value={dir.name} onChange={(e) => {
                      const d = [...data.directors]; d[i] = { ...d[i], name: e.target.value }; update("directors", d);
                    }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">DIN</label>
                    <input className={inputClass} value={dir.din} onChange={(e) => {
                      const d = [...data.directors]; d[i] = { ...d[i], din: e.target.value }; update("directors", d);
                    }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">Designation</label>
                    <input className={inputClass} value={dir.designation} onChange={(e) => {
                      const d = [...data.directors]; d[i] = { ...d[i], designation: e.target.value }; update("directors", d);
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
