"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import SignatureUpload from "@/components/SignatureUpload";
import type { CompanyProfile } from "@/lib/profiles/types";
import { buildBankAccountHtml, BankAccountValues } from "@/lib/pvt-ltd/bank-account-html";

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
  const companyFromUrl = searchParams.get("company");

  const [data, setData] = useState<BankAccountValues>({
    companyName: "",
    cin: "",
    regAddress: "",
    meetingDate: new Date().toISOString().split("T")[0],
    meetingVenue: "",
    bankName: "",
    bankBranch: "",
    bankAddress: "",
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

  const update = (field: keyof BankAccountValues, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSelect = (profile: CompanyProfile) => {
    setData((prev) => ({
      ...prev,
      companyName: profile.companyName || prev.companyName,
      cin: profile.cin || prev.cin,
      regAddress: profile.registeredAddress || prev.regAddress,
      place: profile.place || prev.place,
      authorizedSignatories: profile.directors.map(d => ({
        name: d.directorName || "",
        din: d.din || "",
        pan: d.pan || "",
        designation: "Director"
      })),
      signatoryName: profile.directors[0]?.directorName || prev.signatoryName,
    }));
  };

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
      companyId={companyFromUrl}
      onProfileSelect={handleProfileSelect}
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
                <input type="date" className={inputClass} value={data.meetingDate} onChange={(e) => update("meetingDate", e.target.value)} />
              </Input>
              <Input label="Meeting Venue">
                <input className={inputClass} placeholder="Registered Office Address" value={data.meetingVenue} onChange={(e) => update("meetingVenue", e.target.value)} />
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
                <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
              </Input>
            </div>
          </div>
        </div>
      }
    />
  );
}
