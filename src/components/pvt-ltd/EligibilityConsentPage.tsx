"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import ProfileSelector from "@/components/ProfileSelector";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import SignatureUpload from "@/components/SignatureUpload";
import { buildEligibilityConsentHtml, EligibilityConsentData } from "@/lib/pvt-ltd/eligibility-consent-html";
import { downloadDocx } from "@/lib/render/docx-client";
import { downloadPdf } from "@/lib/render/pdf-client";

export default function EligibilityConsentPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);

  const [data, setData] = useState<EligibilityConsentData>({
    firmName: "",
    firmAddress: "",
    frn: "",
    date: new Date().toISOString().split("T")[0],
    companyName: "",
    companyAddress: "",
    financialYear: "2024-25",
    signatoryName: "",
    designation: "Partner",
    membershipNumber: "",
    signatureImage: "",
    place: "",
  });

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        companyName: profile.companyName || prev.companyName,
        companyAddress: profile.registeredAddress || prev.companyAddress,
        place: profile.place || prev.place,
      }));
    }
  }, [profile]);

  const update = (field: keyof EligibilityConsentData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const previewHtml = buildEligibilityConsentHtml(data);

  const download = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fileName = `Eligibility_Consent_${data.companyName.replace(/\s+/g, "_")}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fileName);
      } else {
        await downloadDocx(previewHtml, fileName);
      }
    } finally {
      setBusy(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

  return (
    <DocumentEditorLayout
      title="Eligibility & Consent Letter"
      description="Generate auditor consent and eligibility certificate."
      companyId={companyId}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          companyAddress: p.registeredAddress || "",
          place: p.place || "",
        }));
      }}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Consent Letter Preview"
      inputSection={
        <>
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Auditor Firm Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Name</label>
              <input className={inputClass} value={data.firmName} onChange={(e) => update("firmName", e.target.value)} placeholder="e.g. ABC & Associates" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Address</label>
              <textarea className={inputClass} rows={2} value={data.firmAddress} onChange={(e) => update("firmAddress", e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Firm Registration No. (FRN)</label>
                <input className={inputClass} value={data.frn} onChange={(e) => update("frn", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Letter Date</label>
                <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Company & FY Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
              <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Financial Year</label>
              <input className={inputClass} value={data.financialYear} onChange={(e) => update("financialYear", e.target.value)} placeholder="e.g. 2024-25" />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Signatory Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Partner Name</label>
                <input className={inputClass} value={data.signatoryName} onChange={(e) => update("signatoryName", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Membership Number</label>
                <input className={inputClass} value={data.membershipNumber} onChange={(e) => update("membershipNumber", e.target.value)} />
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
            </div>
          </div>
        </>
      }
    />
  );
}
