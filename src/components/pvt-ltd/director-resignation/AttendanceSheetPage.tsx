"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import { downloadPdf } from "@/lib/render/pdf-client";
import { downloadDocx } from "@/lib/render/docx-client";
import { getRelatedDocs } from "@/lib/site/registry";
import {
  buildAttendanceSheetHtml,
  type AttendanceSheetData,
} from "@/lib/pvt-ltd/director-resignation/attendance-sheet-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

function initialData(): AttendanceSheetData {
  return {
    companyName: "",
    meetingDay: "",
    meetingDate: new Date().toISOString().split("T")[0],
    meetingTime: "11:00 AM",
    registeredOffice: "",
    directors: [
      { name: "", designation: "Director", signatureImage: "" },
      { name: "", designation: "Director", signatureImage: "" },
    ],
    chairmanName: "",
    chairmanDin: "",
    chairmanSignature: "",
  };
}

export default function AttendanceSheetPage({ subflowTitle = "Resignation of Director" }: { subflowTitle?: string }) {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);

  const relatedDocs = useMemo(() => {
    const isFirstAuditor = subflowTitle === "First Auditor Appointment";
    const currentToolId = isFirstAuditor ? "first-auditor-attendance-sheet" : "director-resignation-attendance-sheet";
    const currentSubflowId = isFirstAuditor ? "inc-auditor-first" : "inc-auditor-resignation";
    return getRelatedDocs(currentToolId, currentSubflowId);
  }, [subflowTitle]);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    registeredOffice: (p) => p.registeredAddress || "",
    directors: (p) =>
      p.directors.length > 0
        ? p.directors.map((d) => ({
            name: d.directorName || "",
            designation: d.designation || "Director",
            signatureImage: "",
          }))
        : undefined,
    chairmanName: (p) => p.directors[0]?.directorName || "",
    chairmanDin: (p) => p.directors[0]?.din || "",
  });

  const update = (field: keyof AttendanceSheetData, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const updateDirector = (index: number, key: "name" | "designation" | "signatureImage", value: string) => {
    const newDirs = [...data.directors];
    newDirs[index] = { ...newDirs[index], [key]: value };
    update("directors", newDirs);
  };

  const previewHtml = useMemo(() => buildAttendanceSheetHtml(data), [data]);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fn = `BM_Attendance_Sheet_${(data.companyName || "Company").replace(/\s+/g, "_").slice(0, 30)}.${format}`;
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
      title="BM Attendance Sheet"
      description={`Generate the attendance sheet of the board meeting for ${subflowTitle.toLowerCase()}.`}
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          registeredOffice: p.registeredAddress || "",
          directors:
            p.directors.length > 0
              ? p.directors.map((d) => ({
                  name: d.directorName || "",
                  designation: d.designation || "Director",
                  signatureImage: "",
                }))
              : prev.directors,
          chairmanName: p.directors[0]?.directorName || "",
          chairmanDin: p.directors[0]?.din || "",
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Attendance Sheet Preview"
      relatedDocs={relatedDocs}
      inputSection={
        <>
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Company Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
              <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Registered Office Address</label>
              <textarea className={inputClass} rows={2} value={data.registeredOffice} onChange={(e) => update("registeredOffice", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Meeting Details</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Date</label>
                <LegalDatePicker
                  className={inputClass}
                  value={data.meetingDate}
                  onChange={(parts) => {
                    update("meetingDate", parts.dateIso);
                    update("meetingDay", parts.weekdayLower);
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Time</label>
                <input className={inputClass} placeholder="e.g. 11:00 AM" value={data.meetingTime} onChange={(e) => update("meetingTime", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Day</label>
              <input className={inputClass} placeholder="e.g. Thursday" value={data.meetingDay} onChange={(e) => update("meetingDay", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Directors Attendance</h2>
              <button
                type="button"
                onClick={() =>
                  update("directors", [...data.directors, { name: "", designation: "Director", signatureImage: "" }])
                }
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Director
              </button>
            </div>
            <div className="space-y-3">
              {data.directors.map((dir, i) => (
                <div key={i} className="rounded-lg border bg-zinc-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Director #{i + 1}
                    </span>
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
                      <input
                        className={inputClass}
                        value={dir.name}
                        onChange={(e) => updateDirector(i, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-500 uppercase">Designation</label>
                      <input
                        className={inputClass}
                        value={dir.designation}
                        onChange={(e) => updateDirector(i, "designation", e.target.value)}
                      />
                    </div>
                  </div>
                  <SignatureUpload
                    label={`Director #${i + 1} Signature (Optional)`}
                    onSignatureChange={(sig) => updateDirector(i, "signatureImage", sig || "")}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Verification Signatory (Chairman / Director)</h2>
            {profile && profile.directors.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Select Signatory</label>
                <select
                  className={inputClass}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (idx >= 0 && profile.directors[idx]) {
                      const dir = profile.directors[idx];
                      update("chairmanName", dir.directorName || "");
                      update("chairmanDin", dir.din || "");
                    }
                  }}
                  defaultValue="0"
                >
                  {profile.directors.map((d, idx) => (
                    <option key={idx} value={idx}>
                      {d.directorName} ({d.din})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
              <input className={inputClass} value={data.chairmanName} onChange={(e) => update("chairmanName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">DIN</label>
              <input className={inputClass} value={data.chairmanDin} onChange={(e) => update("chairmanDin", e.target.value)} />
            </div>
            <SignatureUpload label="Signatory Signature" onSignatureChange={(sig) => update("chairmanSignature", sig || "")} />
          </div>
        </>
      }
    />
  );
}
