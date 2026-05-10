"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import ProfileSelector from "@/components/ProfileSelector";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import SignatureUpload from "@/components/SignatureUpload";
import { buildBrHtml, BrFormData } from "@/lib/pvt-ltd/board-resolution-html";
import { downloadDocx } from "@/lib/render/docx-client";
import { downloadPdf } from "@/lib/render/pdf-client";

export default function BoardResolutionPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile, loading } = useCompanyProfile(companyId || undefined);

  const [data, setData] = useState<BrFormData>({
    companyName: "",
    cin: "",
    regAddress: "",
    meetingDate: new Date().toISOString().split("T")[0],
    meetingVenue: "",
    chairmanName: "",
    signatoryName: "",
    signatoryDesignation: "Director",
    signatureImage: "",
    place: "",
    date: new Date().toISOString().split("T")[0],
    resolutions: [
      "the company be incorporated under the Companies Act, 2013.",
      "the draft Memorandum and Articles of Association as placed before the Board be and are hereby approved.",
    ],
  });

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        companyName: profile.companyName || prev.companyName,
        cin: profile.cin || prev.cin,
        regAddress: profile.registeredAddress || prev.regAddress,
        place: profile.place || prev.place,
      }));
    }
  }, [profile]);

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

  const printPreview = () => {
    const frame = document.querySelector("iframe");
    if (frame?.contentWindow) {
      frame.contentWindow.print();
    }
  };

  const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

  return (
    <DocumentEditorLayout
      title="Board Resolution"
      description="Generate certified true copies of board resolutions."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          cin: p.cin || "",
          regAddress: p.registeredAddress || "",
          place: p.place || "",
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
                <input type="date" className={inputClass} value={data.meetingDate} onChange={(e) => update("meetingDate", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Meeting Venue</label>
                <input className={inputClass} value={data.meetingVenue} onChange={(e) => update("meetingVenue", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Resolutions</h2>
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
                  onClick={() => {
                    const newRes = data.resolutions.filter((_, idx) => idx !== i);
                    update("resolutions", newRes);
                  }}
                  className="text-zinc-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Signatory Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Signatory Name</label>
                <input className={inputClass} value={data.signatoryName} onChange={(e) => update("signatoryName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Designation</label>
                <input className={inputClass} value={data.signatoryDesignation} onChange={(e) => update("signatoryDesignation", e.target.value)} />
              </div>
            </div>
            <SignatureUpload 
              onSignatureChange={(sig) => update("signatureImage", sig || "")} 
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Place</label>
                <input className={inputClass} value={data.place} onChange={(e) => update("place", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Date of Signing</label>
                <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
