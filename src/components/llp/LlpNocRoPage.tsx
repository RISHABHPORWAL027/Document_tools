"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import type { CompanyProfile } from "@/lib/profiles/types";
import {
  buildLlpNocRoHtml,
  type LlpNocRoValues,
} from "@/lib/llp/noc-ro-html";
import { allLiveTools } from "@/lib/site/registry";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function initialData(): LlpNocRoValues {
  return {
    ownerName: "",
    ownerAddress: "",
    date: todayIso(),
    llpName: "",
    registeredOfficeAddress: "",
    designatedPartnerName: "",
    electricityBillNote: "",
  };
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100";

const labelClass = "mb-1 block text-xs font-semibold text-zinc-700";

function Input({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const llpNocSeoContent = (
  <article className="text-zinc-800">
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <h2 className="text-xl font-bold text-zinc-950">LLP No Objection Certificate (NOC)</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          The No Objection Certificate (NOC) for an LLP registered office is a declaration issued by the owner of the property. It certifies that the owner has no objection to the proposed Limited Liability Partnership registering its principal place of business at the premises. This is a mandatory filing requirement with the Registrar of Companies (ROC) to establish proof of address.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-950">Frequently Asked Questions (FAQs)</h2>
        <div className="mt-4 space-y-3">
          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>Is an NOC mandatory for registering an LLP office address?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              Yes, the MCA requires a No Objection Certificate (NOC) from the property owner to verify that the owner has legally permitted the proposed LLP to use their premises as its registered office address.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>What utility bills are accepted alongside the LLP NOC?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              You must submit a recent utility bill of the property (Electricity bill, Gas bill, Water bill, or Telephone bill) that is not older than 2 months from the filing date, with the owner's name matching the NOC.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>Can a rented property be registered as an LLP office address?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              Yes, if the property is rented, you must attach the signed rent/lease agreement along with the NOC and the utility bill.
            </div>
          </details>
        </div>
      </section>
    </div>
  </article>
);

export default function LlpNocRoPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState<LlpNocRoValues>(() => initialData());
  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    llpName: (p) => p.companyName || "",
    registeredOfficeAddress: (p) => p.registeredAddress || "",
    designatedPartnerName: (p) => p.directors[0]?.directorName || "",
  });

  const previewHtml = useMemo(() => buildLlpNocRoHtml(data), [data]);

  const relatedDocs = useMemo(() => {
    return allLiveTools()
      .filter((t) => t.id !== "llp-noc-ro" && t.status === "live" && t.href !== "#")
      .slice(0, 4)
      .map((t) => ({
        id: t.id,
        title: t.title,
        href: t.href,
        icon: t.icon,
      }));
  }, []);

  function update<K extends keyof LlpNocRoValues>(key: K, value: LlpNocRoValues[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function download(kind: "pdf" | "docx") {
    setBusy(true);
    try {
      const res = await fetch(`/api/llp/noc-ro/${kind}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: data }),
      });
      if (!res.ok) throw new Error(`Failed to generate ${kind.toUpperCase()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = (data.llpName ?? "LLP").replace(/[^\w\s-]/g, "").slice(0, 40);
      a.download = `LLP-NOC-RO_${safe}.${kind}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <DocumentEditorLayout
      title="NOC — Registered Office (LLP)"
      description="No Objection Certificate from the property owner specifically for LLP incorporation."
      onProfileSelect={() => {}}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="LLP NOC Preview"
      aboutDescription="The LLP NOC is the property owner's written consent allowing a new Limited Liability Partnership to establish its registered office at their property. The ROC requires this certificate along with proof of property ownership (like a utility bill) to verify that the LLP is operating from a legally authorized location."
      relatedDocs={relatedDocs}
      seoContent={llpNocSeoContent}
      inputSection={
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs font-bold">Property Owner Details</h2>
            <Input label="Owner Name" required>
              <input className={inputClass} value={data.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
            </Input>
            <Input label="Owner Address" required>
              <textarea className={inputClass} rows={3} value={data.ownerAddress} onChange={(e) => update("ownerAddress", e.target.value)} />
            </Input>
            <SignatureUpload label="Owner Signature" onSignatureChange={(sig) => update("ownerSignatureImage", sig || "")} />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs font-bold">LLP & Authorization</h2>
            <Input label="LLP Name" required>
              <input className={inputClass} value={data.llpName} onChange={(e) => update("llpName", e.target.value)} />
            </Input>
            <Input label="Property Address (Office)" required>
              <textarea className={inputClass} rows={3} value={data.registeredOfficeAddress} onChange={(e) => update("registeredOfficeAddress", e.target.value)} />
            </Input>
            <Input label="Designated Partner to Authorize" required>
              <input className={inputClass} placeholder="Full Name" value={data.designatedPartnerName} onChange={(e) => update("designatedPartnerName", e.target.value)} />
            </Input>
            <Input label="Date of Execution">
              <LegalDatePicker 
                className={inputClass} 
                value={data.date} 
                onChange={(parts) => update("date", parts.dateIso)} 
              />
            </Input>
            <Input label="Enclosure Note">
              <input
                className={inputClass}
                placeholder="Copy of the Electricity Bill"
                value={data.electricityBillNote ?? ""}
                onChange={(e) => update("electricityBillNote", e.target.value)}
              />
            </Input>
          </div>
        </div>
      }
    />
  );
}
