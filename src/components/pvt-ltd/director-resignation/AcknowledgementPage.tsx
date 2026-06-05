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
  buildAcknowledgementResignationHtml,
  type AcknowledgementResignationData,
} from "@/lib/pvt-ltd/director-resignation/acknowledgement-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

function initialData(): AcknowledgementResignationData {
  return {
    date: new Date().toISOString().split("T")[0],
    resigningDirectorName: "",
    resigningDirectorAddress: "",
    resignationLetterDate: new Date().toISOString().split("T")[0],
    effectiveDate: new Date().toISOString().split("T")[0],
    companyName: "",
    companyCin: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    signatory1Name: "",
    signatory1Din: "",
    signatory1Signature: "",
    signatory2Name: "",
    signatory2Din: "",
    signatory2Signature: "",
    ackDate: new Date().toISOString().split("T")[0],
    ackPlace: "",
  };
}

export default function AcknowledgementPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);

  const relatedDocs = useMemo(() => {
    return getRelatedDocs("director-resignation-acknowledgement", "inc-auditor-resignation");
  }, []);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    companyCin: (p) => p.cin || "",
    companyAddress: (p) => p.registeredAddress || "",
    companyPhone: (p) => p.mobileNumber || "",
    companyEmail: (p) => p.email || "",
    resigningDirectorName: (p) => p.directors[0]?.directorName || "",
    resigningDirectorAddress: (p) => p.registeredAddress || "",
    signatory1Name: (p) => p.directors[0]?.directorName || "",
    signatory1Din: (p) => p.directors[0]?.din || "",
    signatory2Name: (p) => p.directors[1]?.directorName || "",
    signatory2Din: (p) => p.directors[1]?.din || "",
    ackPlace: (p) => p.place || "",
  });

  const update = (field: keyof AcknowledgementResignationData, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const previewHtml = useMemo(() => buildAcknowledgementResignationHtml(data), [data]);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fn = `Acknowledgement_Resignation_Letter_${(data.resigningDirectorName || "Director").replace(/\s+/g, "_").slice(0, 30)}.${format}`;
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
      title="Acknowledgement Letter"
      description="Generate company acknowledgement of receipt of resignation letter."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          companyCin: p.cin || "",
          companyAddress: p.registeredAddress || "",
          companyPhone: p.mobileNumber || "",
          companyEmail: p.email || "",
          resigningDirectorName: p.directors[0]?.directorName || "",
          resigningDirectorAddress: p.registeredAddress || "",
          signatory1Name: p.directors[0]?.directorName || "",
          signatory1Din: p.directors[0]?.din || "",
          signatory2Name: p.directors[1]?.directorName || "",
          signatory2Din: p.directors[1]?.din || "",
          ackPlace: p.place || "",
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Acknowledgement Preview"
      relatedDocs={relatedDocs}
      inputSection={
        <>
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Company Details</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
                <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">CIN</label>
                <input className={inputClass} value={data.companyCin} onChange={(e) => update("companyCin", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Registered Address</label>
              <textarea className={inputClass} rows={2} value={data.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Contact No</label>
                <input className={inputClass} value={data.companyPhone} onChange={(e) => update("companyPhone", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Email ID</label>
                <input className={inputClass} value={data.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} />
              </div>
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
                      update("resigningDirectorAddress", dir.address || profile.registeredAddress || "");
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
              <label className="text-xs font-medium text-zinc-500 uppercase">Director Name</label>
              <input className={inputClass} value={data.resigningDirectorName} onChange={(e) => update("resigningDirectorName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Director Address</label>
              <textarea className={inputClass} rows={2} value={data.resigningDirectorAddress} onChange={(e) => update("resigningDirectorAddress", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Resignation Dates</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Resignation Letter Date</label>
                <LegalDatePicker
                  className={inputClass}
                  value={data.resignationLetterDate}
                  onChange={(parts) => update("resignationLetterDate", parts.dateIso)}
                />
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
            <h2 className="text-lg font-semibold text-zinc-900">Acknowledgement Place and Date</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Place</label>
                <input className={inputClass} value={data.ackPlace} onChange={(e) => update("ackPlace", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Date</label>
                <LegalDatePicker
                  className={inputClass}
                  value={data.ackDate}
                  onChange={(parts) => update("ackDate", parts.dateIso)}
                />
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
