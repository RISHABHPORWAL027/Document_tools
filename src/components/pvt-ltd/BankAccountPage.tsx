"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import type { CompanyProfile } from "@/lib/profiles/types";
import { buildBankAccountHtml, BankAccountValues } from "@/lib/pvt-ltd/bank-account-html";
import { allLiveTools } from "@/lib/site/registry";

const bankAccountSeoContent = (
  <article className="text-zinc-800">
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <h2 className="text-xl font-bold text-zinc-950">Corporate Bank Account Board Resolution</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          A Bank Account Board Resolution is a formal record authorizing the opening and operation of a current account in the name of a company. Under corporate law, banks require this certified resolution to confirm that the board has officially chosen the banking partner, designated authorized signatories, and specified the operational mandates (single or joint signatures).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-950">Frequently Asked Questions (FAQs)</h2>
        <div className="mt-4 space-y-3">
          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>Why is a board resolution required to open a company bank account?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              A company is a separate legal entity, and its bank accounts cannot be opened or operated on individual whims. Banks require a formal Board Resolution to prove that the Board of Directors has collectively authorized opening the account, chosen the bank, and designated specific individuals as authorized signatories.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>Can a director operate a company bank account singly?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              Yes, depending on the operational mandate chosen by the board in the resolution. The mandate can authorize directors to operate the account "severally" (singly), "jointly" (all signatures required), or "any two jointly" as per corporate convenience.
            </div>
          </details>

          <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
              <span>What documents are required along with the bank resolution?</span>
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
              To open a company current account, banks typically require the certified true copy of the board resolution, Certificate of Incorporation (COI), MOA and AOA, company PAN card, PAN and Aadhaar cards of all directors, and utility bills as proof of address.
            </div>
          </details>
        </div>
      </section>
    </div>
  </article>
);

const inputClass = "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100";
const labelClass = "mb-1 block text-xs font-semibold text-zinc-700";

function Input({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function BankAccountPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);

  const [data, setData] = useState<BankAccountValues>({
    companyName: "",
    cin: "",
    regAddress: "",
    meetingDate: new Date().toISOString().split("T")[0],
    meetingTime: "11:00 AM",
    meetingVenue: "",
    bankName: "",
    bankBranch: "",
    contactNumber: "",
    companyEmail: "",
    authorizedSignatories: [
      { name: "", din: "", pan: "", designation: "Director" }
    ],
    signingMethod: "Single",
    place: "",
    date: new Date().toISOString().split("T")[0],
    signatoryName: "",
    signatoryDesignation: "Director",
  });

  const [busy, setBusy] = useState(false);
  const previewHtml = useMemo(() => buildBankAccountHtml(data), [data]);

  const relatedDocs = useMemo(() => {
    return allLiveTools()
      .filter((t) => t.id !== "board-resolution-bank" && t.status === "live" && t.href !== "#")
      .slice(0, 4)
      .map((t) => ({
        id: t.id,
        title: t.title,
        href: t.href,
        icon: t.icon,
      }));
  }, []);

  const update = (field: keyof BankAccountValues, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    cin: (p) => p.cin || "",
    regAddress: (p) => p.registeredAddress || "",
    place: (p) => p.place || "",
    authorizedSignatories: (p) => p.directors.map(d => ({
      name: d.directorName || "",
      din: d.din || "",
      pan: d.pan || "",
      designation: "Director"
    })),
    signatoryName: (p) => p.directors[0]?.directorName || "",
  });

  const addSignatory = () => {
    setData(prev => ({
      ...prev,
      authorizedSignatories: [...prev.authorizedSignatories, { name: "", din: "", pan: "", designation: "Director" }]
    }));
  };

  const updateSignatory = (index: number, field: string, value: string) => {
    const newSigs = [...data.authorizedSignatories];
    newSigs[index] = { ...newSigs[index], [field]: value };
    setData(prev => ({ ...prev, authorizedSignatories: newSigs }));
  };

  const removeSignatory = (index: number) => {
    if (data.authorizedSignatories.length <= 1) return;
    const newSigs = data.authorizedSignatories.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, authorizedSignatories: newSigs }));
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const res = await fetch(`/api/pvt-ltd/bank-account/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: data }),
      });
      if (!res.ok) throw new Error("Failed to generate document");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bank_Account_Resolution_${data.companyName || "document"}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <DocumentEditorLayout
      title="Board Resolution — Bank Account"
      description="Resolution for opening and operating a current bank account for the company."
      companyId={companyId}
      aboutDescription="A Bank Account Board Resolution is a formal record of board approval for opening a current account. It certifies authorized signatories and operation mandates, and is a mandatory document requested by bank compliance departments."
      relatedDocs={relatedDocs}
      seoContent={bankAccountSeoContent}
      onProfileSelect={() => {}}
      busy={busy}
      onDownload={handleDownload}
      previewHtml={previewHtml}
      iframeTitle="Bank Account Resolution Preview"
      inputSection={
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Meeting Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Meeting Date" required>
                <LegalDatePicker 
                  className={inputClass} 
                  value={data.meetingDate} 
                  onChange={(parts) => update("meetingDate", parts.dateIso)} 
                />
              </Input>
              <Input label="Meeting Time" required>
                <input type="text" className={inputClass} placeholder="11:00 AM" value={data.meetingTime} onChange={(e) => update("meetingTime", e.target.value)} />
              </Input>
            </div>
            <Input label="Meeting Venue">
              <input className={inputClass} placeholder="Registered Office Address" value={data.meetingVenue} onChange={(e) => update("meetingVenue", e.target.value)} />
            </Input>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Company Contact</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Contact Number">
                <input className={inputClass} placeholder="+91 98765 43210" value={data.contactNumber} onChange={(e) => update("contactNumber", e.target.value)} />
              </Input>
              <Input label="Company Email">
                <input className={inputClass} placeholder="info@company.com" value={data.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} />
              </Input>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Bank Details</h2>
            <Input label="Bank Name" required>
              <input className={inputClass} placeholder="HDFC Bank / ICICI Bank" value={data.bankName} onChange={(e) => update("bankName", e.target.value)} />
            </Input>
            <Input label="Branch & Address">
              <input className={inputClass} placeholder="Main Branch, Mumbai" value={data.bankBranch} onChange={(e) => update("bankBranch", e.target.value)} />
            </Input>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Authorized Signatories</h2>
              <button onClick={addSignatory} className="text-xs font-bold text-teal-700 hover:text-teal-800 uppercase tracking-tight">+ Add Signatory</button>
            </div>
            <div className="space-y-4">
              {data.authorizedSignatories.map((sig, i) => (
                <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 space-y-3 relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signatory #{i + 1}</span>
                    {data.authorizedSignatories.length > 1 && (
                      <button onClick={() => removeSignatory(i)} className="text-xs font-medium text-red-600 hover:text-red-700">Remove</button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Input label="Name">
                      <input className={inputClass} value={sig.name} onChange={(e) => updateSignatory(i, "name", e.target.value)} />
                    </Input>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input label="DIN/DPIN">
                        <input className={inputClass} value={sig.din} onChange={(e) => updateSignatory(i, "din", e.target.value)} />
                      </Input>
                      <Input label="Designation">
                        <input className={inputClass} value={sig.designation} onChange={(e) => updateSignatory(i, "designation", e.target.value)} />
                      </Input>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Input label="Operation Mandate">
              <select className={inputClass} value={data.signingMethod} onChange={(e) => update("signingMethod", e.target.value)}>
                <option value="Single">Severally (Any One)</option>
                <option value="Joint">Jointly (All)</option>
                <option value="Any Two">Any Two Jointly</option>
              </select>
            </Input>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Certification Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Certified By (Name)" required>
                <input className={inputClass} value={data.signatoryName} onChange={(e) => update("signatoryName", e.target.value)} />
              </Input>
              <Input label="Designation">
                <input className={inputClass} value={data.signatoryDesignation} onChange={(e) => update("signatoryDesignation", e.target.value)} />
              </Input>
            </div>
            <SignatureUpload onSignatureChange={(sig) => update("signatureImage", sig || "")} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Place">
                <input className={inputClass} value={data.place} onChange={(e) => update("place", e.target.value)} />
              </Input>
              <Input label="Date of Certification">
                <LegalDatePicker 
                  className={inputClass} 
                  value={data.date} 
                  onChange={(parts) => update("date", parts.dateIso)} 
                />
              </Input>
            </div>
          </div>
        </div>
      }
    />
  );
}
