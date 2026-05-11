"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import { buildBrHtml, BrFormData } from "@/lib/pvt-ltd/board-resolution-html";
import { downloadDocx } from "@/lib/render/docx-client";
import { downloadPdf } from "@/lib/render/pdf-client";

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
  });

  const update = (field: keyof BrFormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const previewHtml = buildBrHtml(data);

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
