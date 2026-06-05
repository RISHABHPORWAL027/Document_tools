"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import { buildEligibilityConsentHtml, EligibilityConsentData } from "@/lib/pvt-ltd/eligibility-consent-html";
import { downloadDocx } from "@/lib/render/docx-client";
import { downloadPdf } from "@/lib/render/pdf-client";
import { allLiveTools } from "@/lib/site/registry";

const ecSeoContent = (
  <article className="text-zinc-800">
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <h2 className="text-xl font-bold text-zinc-950">Auditor Eligibility &amp; Consent Certificate</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          The Eligibility and Consent Letter is a statutory document issued by a proposed auditor or audit firm under Sections 139 and 141 of the Companies Act, 2013. It confirms that the auditor is eligible for appointment, not disqualified under any laws, and formally consents to serve as the statutory auditor of the company. It is a mandatory attachment for Form ADT-1 filing with the ROC.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-950">Frequently Asked Questions (FAQs)</h2>
        <div className="mt-4 space-y-3">
          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>What is the Auditor Eligibility &amp; Consent Letter?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              It is a formal certificate issued by a practicing Chartered Accountant or audit firm confirming their eligibility to be appointed as the statutory auditor under Section 139 and 141 of the Companies Act, 2013, along with their formal consent to act as such.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>Why is the consent letter required for MCA filings?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              The Registrar of Companies (ROC) requires the company to file Form ADT-1 within 15 days of appointing an auditor. The Eligibility and Consent Letter is a mandatory attachment to Form ADT-1 to prove the auditor has consented to the appointment and is qualified.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>What is the statutory limit for auditor appointments in a company?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              Individual auditors can be appointed for one term of 5 consecutive years, whereas an audit firm can be appointed for two terms of 5 consecutive years (total 10 years), subject to ratification/reappointment norms under section 139.
            </div>
          </details>
        </div>
      </section>
    </div>
  </article>
);

const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

export default function EligibilityConsentPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);

  const [data, setData] = useState<EligibilityConsentData>({
    companyName: "",
    companyAddress: "",
    firmName: "",
    firmAddress: "",
    frn: "",
    date: new Date().toISOString().split("T")[0],
    auditorPan: "",
    auditorMembershipNo: "",
    auditorEmail: "",
    financialYear: "2024-25",
    signatoryName: "",
    designation: "PARTNER",
    membershipNumber: "",
    signatureImage: "",
    place: "",
  });

  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    companyAddress: (p) => p.registeredAddress || "",
    place: (p) => p.place || "",
  });

  const update = (field: keyof EligibilityConsentData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const previewHtml = buildEligibilityConsentHtml(data);

  const relatedDocs = useMemo(() => {
    return allLiveTools()
      .filter((t) => t.id !== "eligibility-consent" && t.status === "live" && t.href !== "#")
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

  return (
    <DocumentEditorLayout
      title="Eligibility & Consent Letter"
      description="Certificate of eligibility cum consent to act as statutory auditor."
      companyId={companyId}
      aboutDescription="The Auditor Eligibility and Consent Letter is an official declaration issued by a proposed statutory auditor or audit firm under Sections 139 and 141. It certifies that the auditor is qualified, not disqualified under corporate laws, and formally consents to serve, which must be attached to Form ADT-1."
      relatedDocs={relatedDocs}
      seoContent={ecSeoContent}
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
            <h2 className="text-lg font-semibold text-zinc-900">Company Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Name</label>
              <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Company Address</label>
              <textarea className={inputClass} rows={2} value={data.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Auditor Firm Details</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Name</label>
              <input className={inputClass} value={data.firmName} onChange={(e) => update("firmName", e.target.value)} placeholder="e.g. OMN AND ASSOCIATES" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Firm Address</label>
              <textarea className={inputClass} rows={2} value={data.firmAddress} onChange={(e) => update("firmAddress", e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">FRN (Firm Reg. No.)</label>
                <input className={inputClass} value={data.frn} onChange={(e) => update("frn", e.target.value)} placeholder="000383S" />
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
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">ADT-1 Information</h2>
            <p className="text-xs text-zinc-500">Details required for Form ADT-1 filing with MCA.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Auditor PAN</label>
                <input className={inputClass} value={data.auditorPan} onChange={(e) => update("auditorPan", e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 uppercase">Membership No.</label>
                <input className={inputClass} value={data.auditorMembershipNo} onChange={(e) => update("auditorMembershipNo", e.target.value)} placeholder="278085" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Auditor Email</label>
              <input type="email" className={inputClass} value={data.auditorEmail} onChange={(e) => update("auditorEmail", e.target.value)} placeholder="audit@firm.in" />
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
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 uppercase">Place</label>
              <input className={inputClass} value={data.place} onChange={(e) => update("place", e.target.value)} />
            </div>
          </div>
        </>
      }
    />
  );
}
