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
  buildLlpMrlHtml,
  type LlpMrlValues,
} from "@/lib/llp/mrl-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

function initialData(): LlpMrlValues {
  return {
    date: new Date().toISOString().split("T")[0],
    firmName: "",
    auditorName: "",
    firmType: "Practicing Chartered Accountant",
    firmAddress: "",
    llpName: "",
    partners: [
      { name: "", dpin: "", pan: "", address: "", signatureImage: "" },
      { name: "", dpin: "", pan: "", address: "", signatureImage: "" },
    ],
  };
}

export default function LlpMrlPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    llpName: (p) => p.companyName || "",
    partners: (p) => p.directors.length > 0
      ? p.directors.map((d) => ({
          name: d.directorName || "",
          dpin: d.din || "",
          pan: d.pan || "",
          address: [d.address, d.city, d.state, d.pincode].filter(Boolean).join(", "),
          signatureImage: "",
        }))
      : undefined,
  });

  const update = (field: keyof LlpMrlValues, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const previewHtml = useMemo(() => buildLlpMrlHtml(data), [data]);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fn = `MRL_LLP_${(data.llpName || "Company").replace(/\s+/g, "_").slice(0, 30)}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fn);
      } else {
        // use specific mrl docx generator route to preserve layout
        const res = await fetch("/api/llp/mrl/docx", {
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
      title="Management Representation Letter (MRL) — LLP"
      description="MRL for LLP incorporation to be submitted to the practicing professional."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          llpName: p.companyName || "",
          partners:
            p.directors.length > 0
              ? p.directors.map((d) => ({
                  name: d.directorName || "",
                  dpin: d.din || "",
                  pan: d.pan || "",
                  address: [d.address, d.city, d.state, d.pincode].filter(Boolean).join(", "),
                  signatureImage: "",
                }))
              : prev.partners,
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="LLP MRL Preview"
      inputSection={
        <>
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">LLP Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">LLP Name</label>
              <input className={inputClass} placeholder="e.g. ABC LLP" value={data.llpName} onChange={(e) => update("llpName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Letter Date</label>
                <LegalDatePicker 
                  className={inputClass} 
                  value={data.date} 
                  onChange={(parts) => update("date", parts.dateIso)} 
                />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Auditor / Professional Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Name</label>
              <input className={inputClass} placeholder="e.g. XYZ & Co." value={data.firmName} onChange={(e) => update("firmName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Professional Name</label>
              <input className={inputClass} placeholder="e.g. John Doe" value={data.auditorName} onChange={(e) => update("auditorName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Type / Designation</label>
              <input className={inputClass} placeholder="Practicing Chartered Accountant" value={data.firmType} onChange={(e) => update("firmType", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Address</label>
              <textarea className={inputClass} rows={2} placeholder="e.g. 123 Main St, City" value={data.firmAddress} onChange={(e) => update("firmAddress", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Designated Partners</h2>
              <button
                type="button"
                onClick={() => update("partners", [...data.partners, { name: "", dpin: "", pan: "", address: "", signatureImage: "" }])}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                + Add Partner
              </button>
            </div>
            {data.partners.map((p, i) => (
              <div key={i} className="rounded-lg border bg-zinc-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Partner #{i + 1}</span>
                  {data.partners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => update("partners", data.partners.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
                  <input className={inputClass} value={p.name} onChange={(e) => {
                    const parts = [...data.partners]; parts[i] = { ...parts[i], name: e.target.value }; update("partners", parts);
                  }} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">DPIN / DIN</label>
                    <input className={inputClass} value={p.dpin} onChange={(e) => {
                      const parts = [...data.partners]; parts[i] = { ...parts[i], dpin: e.target.value }; update("partners", parts);
                    }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase">PAN</label>
                    <input className={inputClass} value={p.pan} onChange={(e) => {
                      const parts = [...data.partners]; parts[i] = { ...parts[i], pan: e.target.value }; update("partners", parts);
                    }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 uppercase">Address</label>
                  <textarea className={inputClass} rows={2} value={p.address} onChange={(e) => {
                    const parts = [...data.partners]; parts[i] = { ...parts[i], address: e.target.value }; update("partners", parts);
                  }} />
                </div>
                <SignatureUpload label="Partner Signature" onSignatureChange={(sig) => {
                  const parts = [...data.partners]; parts[i] = { ...parts[i], signatureImage: sig || "" }; update("partners", parts);
                }} />
              </div>
            ))}
          </div>
        </>
      }
    />
  );
}
