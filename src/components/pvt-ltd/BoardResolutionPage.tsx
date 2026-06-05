"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import { buildBrHtml, BrFormData } from "@/lib/pvt-ltd/board-resolution-html";
import { downloadDocx } from "@/lib/render/docx-client";
import { downloadPdf } from "@/lib/render/pdf-client";
import { allLiveTools } from "@/lib/site/registry";

const brSeoContent = (
  <article className="text-zinc-800">
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <h2 className="text-xl font-bold text-zinc-950">Corporate Board Resolution</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          A Board Resolution is a formal corporate document representing decision-making by the Board of Directors of a company. Under the Companies Act, 2013, key corporate approvals—including appointing statutory auditors, opening bank accounts, shifting registered offices, and executing transactions—must be passed as official resolutions during a board meeting and recorded in the company's minutes book.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-950">Frequently Asked Questions (FAQs)</h2>
        <div className="mt-4 space-y-3">
          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>What is a board resolution?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              A board resolution is a formal document that records the decisions and actions taken by a company's Board of Directors during a board meeting. It acts as legal proof of the board's collective agreement and authorization of transactions, appointments, or policies.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>Is a certified true copy of a board resolution legally valid?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              Yes, a certified true copy of a board resolution, signed by a director or the company secretary, is a legally accepted format for submission to bank managers, tax authorities, and registry officials (like the ROC) to prove corporate decisions.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>How many directors must sign a board resolution?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              Typically, a board resolution is signed by the chairperson of the meeting or authorized directors as decided by the board. To verify the resolution for bank or MCA filings, a certified true copy signed by at least one authorized director is standard.
            </div>
          </details>
        </div>
      </section>
    </div>
  </article>
);

const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

export default function BoardResolutionPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);

  const [data, setData] = useState<BrFormData>({
    companyName: "",
    cin: "",
    regAddress: "",
    meetingDate: new Date().toISOString().split("T")[0],
    meetingTime: "10:30 AM",
    meetingVenue: "",
    auditorFirmName: "",
    auditorFrn: "",
    chairmanName: "",
    directors: [
      { name: "", din: "", designation: "Director", pan: "" },
      { name: "", din: "", designation: "Director", pan: "" },
    ],
    signatoryName: "",
    signatoryDesignation: "Director",
    signatureImage: "",
    place: "",
    date: new Date().toISOString().split("T")[0],
    resolutions: [],
    contactNo: "",
    email: "",
  });

  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    cin: (p) => p.cin || "",
    regAddress: (p) => p.registeredAddress || "",
    place: (p) => p.place || "",
    directors: (p) => p.directors.length > 0
      ? p.directors.map(d => ({
          name: d.directorName || "",
          din: d.din || "",
          designation: "Director",
          pan: "",
        }))
      : undefined,
    signatoryName: (p) => p.directors[0]?.directorName || "",
    contactNo: (p) => p.mobileNumber || "",
    email: (p) => p.email || "",
  });

  const update = (field: keyof BrFormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const previewHtml = buildBrHtml(data);

  const relatedDocs = useMemo(() => {
    return allLiveTools()
      .filter((t) => t.id !== "board-resolution" && t.status === "live" && t.href !== "#")
      .slice(0, 4)
      .map((t) => ({
        id: t.id,
        title: t.title,
        href: t.href,
        icon: t.icon,
      }));
  }, []);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      if (format === "pdf") {
        await downloadPdf(previewHtml, `Board_Resolution_${data.companyName.replace(/\s+/g, "_")}.pdf`);
      } else {
        await downloadDocx(previewHtml, `Board_Resolution_${data.companyName.replace(/\s+/g, "_")}.docx`);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <DocumentEditorLayout
      title="Board Resolution"
      description="Generate certified true copies of board resolutions for statutory auditor appointment."
      companyId={companyId}
      aboutDescription="A Board Resolution is a formal record of decisions passed by the Board of Directors of a company. Under the Companies Act, 2013, key actions like appointing auditors or authorizing bank operations must be passed at a board meeting, with certified true copies submitted to verify the board's collective approval."
      relatedDocs={relatedDocs}
      seoContent={brSeoContent}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          cin: p.cin || "",
          regAddress: p.registeredAddress || "",
          place: p.place || "",
          directors: p.directors.length > 0
            ? p.directors.map(d => ({
                name: d.directorName || "",
                din: d.din || "",
                designation: "Director",
                pan: "",
              }))
            : prev.directors,
          signatoryName: p.directors[0]?.directorName || "",
          contactNo: p.mobileNumber || "",
          email: p.email || "",
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Board Resolution Preview"
      inputSection={
        <>
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Company Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
                <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">CIN (Optional)</label>
                <input className={inputClass} value={data.cin} onChange={(e) => update("cin", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Registered Office Address</label>
              <textarea className={inputClass} rows={2} value={data.regAddress} onChange={(e) => update("regAddress", e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Contact No</label>
                <input className={inputClass} value={data.contactNo} onChange={(e) => update("contactNo", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Email</label>
                <input className={inputClass} value={data.email} onChange={(e) => update("email", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Meeting Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Date</label>
                <LegalDatePicker 
                  className={inputClass} 
                  value={data.meetingDate} 
                  onChange={(parts) => update("meetingDate", parts.dateIso)} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Time</label>
                <input className={inputClass} placeholder="10:30 AM" value={data.meetingTime} onChange={(e) => update("meetingTime", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Venue</label>
              <input className={inputClass} placeholder="Registered Office Address" value={data.meetingVenue} onChange={(e) => update("meetingVenue", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Auditor Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Auditor Firm Name</label>
              <input className={inputClass} placeholder="e.g. OMN AND ASSOCIATES" value={data.auditorFirmName} onChange={(e) => update("auditorFirmName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Registration No (FRN)</label>
              <input className={inputClass} placeholder="e.g. 000383S" value={data.auditorFrn} onChange={(e) => update("auditorFrn", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Resolutions (Optional Override)</h2>
            <p className="text-xs text-zinc-500">Leave blank to use the default auditor appointment resolution. Add custom resolutions below if needed.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">{data.resolutions.length} custom resolution(s)</span>
              <button 
                type="button" 
                onClick={() => update("resolutions", [...data.resolutions, ""])}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Resolution
              </button>
            </div>
            {data.resolutions.map((res, i) => (
              <div key={i} className="flex gap-2">
                <textarea 
                  className={inputClass} 
                  rows={2} 
                  value={res} 
                  onChange={(e) => {
                    const newRes = [...data.resolutions];
                    newRes[i] = e.target.value;
                    update("resolutions", newRes);
                  }} 
                />
                <button 
                  type="button"
                  onClick={() => update("resolutions", data.resolutions.filter((_, idx) => idx !== i))}
                  className="text-zinc-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Directors</h2>
              <button 
                type="button"
                onClick={() => update("directors", [...data.directors, { name: "", din: "", designation: "Director", pan: "" }])}
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
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Designation</label>
                  <select
                    className={inputClass}
                    value={dir.designation}
                    onChange={(e) => {
                      const newDirs = [...data.directors];
                      newDirs[i] = { ...newDirs[i], designation: e.target.value };
                      update("directors", newDirs);
                    }}
                  >
                    <option value="Director">Director</option>
                    <option value="Managing Director">Managing Director</option>
                    <option value="Additional Director">Additional Director</option>
                    <option value="CEO">CEO</option>
                  </select>
                </div>
                {dir.designation === "CEO" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">PAN Card No.</label>
                    <input
                      className={inputClass}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={dir.pan ?? ""}
                      onChange={(e) => {
                        const newDirs = [...data.directors];
                        newDirs[i] = { ...newDirs[i], pan: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) };
                        update("directors", newDirs);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Signatory Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Place</label>
                <input className={inputClass} value={data.place} onChange={(e) => update("place", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Date of Signing</label>
                <LegalDatePicker 
                  className={inputClass} 
                  value={data.date} 
                  onChange={(parts) => update("date", parts.dateIso)} 
                />
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
