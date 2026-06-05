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
  buildBoardResolutionResignationHtml,
  type BoardResolutionResignationData,
} from "@/lib/pvt-ltd/director-resignation/board-resolution-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

function initialData(): BoardResolutionResignationData {
  return {
    companyName: "",
    meetingDay: "",
    meetingDate: new Date().toISOString().split("T")[0],
    meetingTime: "11:00 AM",
    registeredOffice: "",
    resigningDirectorName: "",
    resigningDirectorDin: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    signatory1Name: "",
    signatory1Din: "",
    signatory1Signature: "",
    signatory2Name: "",
    signatory2Din: "",
    signatory2Signature: "",
    resolutionDate: new Date().toISOString().split("T")[0],
    resolutionPlace: "",
  };
}

export default function BoardResolutionResignationPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);

  const relatedDocs = useMemo(() => {
    return getRelatedDocs("director-resignation-board-resolution", "inc-auditor-resignation");
  }, []);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    registeredOffice: (p) => p.registeredAddress || "",
    resigningDirectorName: (p) => p.directors[0]?.directorName || "",
    resigningDirectorDin: (p) => p.directors[0]?.din || "",
    signatory1Name: (p) => p.directors[0]?.directorName || "",
    signatory1Din: (p) => p.directors[0]?.din || "",
    signatory2Name: (p) => p.directors[1]?.directorName || "",
    signatory2Din: (p) => p.directors[1]?.din || "",
    resolutionPlace: (p) => p.place || "",
  });

  const update = (field: keyof BoardResolutionResignationData, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const previewHtml = useMemo(() => buildBoardResolutionResignationHtml(data), [data]);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fn = `Board_Resolution_Resignation_Director_${(data.companyName || "Company").replace(/\s+/g, "_").slice(0, 30)}.${format}`;
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
      title="Board Resolution"
      description="Generate certified true copy of board resolution for resignation of director."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          registeredOffice: p.registeredAddress || "",
          resigningDirectorName: p.directors[0]?.directorName || "",
          resigningDirectorDin: p.directors[0]?.din || "",
          signatory1Name: p.directors[0]?.directorName || "",
          signatory1Din: p.directors[0]?.din || "",
          signatory2Name: p.directors[1]?.directorName || "",
          signatory2Din: p.directors[1]?.din || "",
          resolutionPlace: p.place || "",
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Board Resolution Preview"
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
                      update("resigningDirectorName", dir.directorName || "");
                      update("resigningDirectorDin", dir.din || "");
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
              <input className={inputClass} value={data.resigningDirectorName} onChange={(e) => update("resigningDirectorName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">DIN</label>
              <input className={inputClass} value={data.resigningDirectorDin} onChange={(e) => update("resigningDirectorDin", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Effective Date (w.e.f)</label>
              <LegalDatePicker
                className={inputClass}
                value={data.effectiveDate}
                onChange={(parts) => update("effectiveDate", parts.dateIso)}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Signatory Director #1</h2>
            {profile && profile.directors.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Select Signatory 1</label>
                <select
                  className={inputClass}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (idx >= 0 && profile.directors[idx]) {
                      const dir = profile.directors[idx];
                      update("signatory1Name", dir.directorName || "");
                      update("signatory1Din", dir.din || "");
                    }
                  }}
                  defaultValue="0"
                >
                  {profile.directors.map((d, idx) => (
                    <option key={idx} value={idx}>{d.directorName} ({d.din})</option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
              <input className={inputClass} value={data.signatory1Name} onChange={(e) => update("signatory1Name", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">DIN</label>
              <input className={inputClass} value={data.signatory1Din} onChange={(e) => update("signatory1Din", e.target.value)} />
            </div>
            <SignatureUpload label="Signatory 1 Signature" onSignatureChange={(sig) => update("signatory1Signature", sig || "")} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Signatory Director #2</h2>
            {profile && profile.directors.length > 1 && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Select Signatory 2</label>
                <select
                  className={inputClass}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (idx >= 0 && profile.directors[idx]) {
                      const dir = profile.directors[idx];
                      update("signatory2Name", dir.directorName || "");
                      update("signatory2Din", dir.din || "");
                    }
                  }}
                  defaultValue="1"
                >
                  {profile.directors.map((d, idx) => (
                    <option key={idx} value={idx}>{d.directorName} ({d.din})</option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
              <input className={inputClass} value={data.signatory2Name} onChange={(e) => update("signatory2Name", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">DIN</label>
              <input className={inputClass} value={data.signatory2Din} onChange={(e) => update("signatory2Din", e.target.value)} />
            </div>
            <SignatureUpload label="Signatory 2 Signature" onSignatureChange={(sig) => update("signatory2Signature", sig || "")} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Resolution Place and Date</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Place</label>
                <input className={inputClass} value={data.resolutionPlace} onChange={(e) => update("resolutionPlace", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Date</label>
                <LegalDatePicker
                  className={inputClass}
                  value={data.resolutionDate}
                  onChange={(parts) => update("resolutionDate", parts.dateIso)}
                />
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
