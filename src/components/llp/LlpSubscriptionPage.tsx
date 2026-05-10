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
  buildLlpSubscriptionHtml,
  type LlpSubscriptionPartner,
  type LlpSubscriptionValues,
} from "@/lib/llp/subscription-html";

function isoToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyPartner(): LlpSubscriptionPartner {
  return {
    name: "",
    fatherName: "",
    address: "",
    pan: "",
    dob: "",
    mobile: "",
    email: "",
    occupation: "",
    designation: "Designated Partner",
    signatureImage: "",
  };
}

function initialData(): LlpSubscriptionValues {
  return {
    llpName: "",
    place: "",
    date: isoToday(),
    witnessName: "",
    witnessAddress: "",
    witnessProfession: "",
    witnessMembership: "",
    witnessSignatureImage: "",
    partners: [emptyPartner(), emptyPartner()],
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

export default function LlpSubscriptionPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState<LlpSubscriptionValues>(() => initialData());
  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    llpName: (p) => p.companyName || "",
    place: (p) => p.directors[0]?.city || p.place || "",
    partners: (p) => p.directors.length > 0
      ? p.directors.map(d => ({
          name: d.directorName || "",
          fatherName: d.fatherName || "",
          address: [d.address, d.city, d.state, d.pincode].filter(Boolean).join(", "),
          pan: d.pan || "",
          dob: d.dateOfBirth || "",
          mobile: d.mobileNumber || "",
          email: d.email || "",
          occupation: d.occupation || "",
          designation: "Designated Partner",
          signatureImage: "",
        }))
      : undefined
  });

  const previewHtml = useMemo(() => buildLlpSubscriptionHtml(data), [data]);

  function update<K extends keyof LlpSubscriptionValues>(
    key: K,
    value: LlpSubscriptionValues[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updatePartner(idx: number, key: keyof LlpSubscriptionPartner, value: string) {
    setData((prev) => {
      const partners = [...(prev.partners ?? [])];
      partners[idx] = { ...partners[idx], [key]: value };
      return { ...prev, partners };
    });
  }

  function addPartner() {
    setData((prev) => ({
      ...prev,
      partners: [...(prev.partners ?? []), emptyPartner()],
    }));
  }

  function removePartner(idx: number) {
    setData((prev) => {
      const partners = prev.partners ?? [];
      if (partners.length <= 1) return prev;
      return { ...prev, partners: partners.filter((_, i) => i !== idx) };
    });
  }

  async function download(kind: "pdf" | "docx") {
    setBusy(true);
    try {
      const res = await fetch(`/api/llp/subscription/${kind}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: data }),
      });
      if (!res.ok) throw new Error(`Failed to generate ${kind.toUpperCase()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = (data.llpName ?? "LLP").replace(/[^\w\s-]/g, "").slice(0, 36);
      a.download = `LLP-Subscription_${safe}.${kind}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <DocumentEditorLayout
      title="Subscription Sheet (LLP)"
      description="Subscriber details sheet as per original document format. Verbatim content for LLP formation."
      onProfileSelect={() => {}}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Subscription Preview"
      inputSection={
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs font-bold">LLP Details</h2>
            <Input label="Name of LLP (proposed)" required>
              <input className={inputClass} placeholder="e.g. Dray Consulting LLP" value={data.llpName} onChange={(e) => update("llpName", e.target.value)} />
            </Input>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Place">
                <input className={inputClass} value={data.place} onChange={(e) => update("place", e.target.value)} />
              </Input>
              <Input label="Date">
                <LegalDatePicker 
                  className={inputClass} 
                  value={data.date} 
                  onChange={(parts) => update("date", parts.dateIso)} 
                />
              </Input>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs font-bold">Subscribers / Partners</h2>
              <button type="button" onClick={addPartner} className="text-xs font-bold text-teal-700 hover:text-teal-800 uppercase tracking-tight">+ Add Partner</button>
            </div>
            <div className="space-y-4">
              {data.partners?.map((p, i) => (
                <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 space-y-3 relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Partner #{i + 1}</span>
                    {data.partners!.length > 1 && (
                      <button onClick={() => removePartner(i)} className="text-xs font-medium text-red-600 hover:text-red-700">Remove</button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Input label="Partner Name">
                      <input className={inputClass} value={p.name} onChange={(e) => updatePartner(i, "name", e.target.value)} />
                    </Input>
                    <Input label="Father Name">
                      <input className={inputClass} value={p.fatherName} onChange={(e) => updatePartner(i, "fatherName", e.target.value)} />
                    </Input>
                    <Input label="Residential Address (R/O)">
                      <textarea className={inputClass} rows={2} value={p.address} onChange={(e) => updatePartner(i, "address", e.target.value)} />
                    </Input>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input label="PAN">
                        <input className={inputClass} value={p.pan} onChange={(e) => updatePartner(i, "pan", e.target.value.toUpperCase())} />
                      </Input>
                      <Input label="DOB">
                        <input className={inputClass} value={p.dob} onChange={(e) => updatePartner(i, "dob", e.target.value)} />
                      </Input>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input label="Mobile">
                        <input className={inputClass} value={p.mobile} onChange={(e) => updatePartner(i, "mobile", e.target.value)} />
                      </Input>
                      <Input label="Email">
                        <input className={inputClass} value={p.email} onChange={(e) => updatePartner(i, "email", e.target.value)} />
                      </Input>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input label="Occupation">
                        <input className={inputClass} value={p.occupation} onChange={(e) => updatePartner(i, "occupation", e.target.value)} />
                      </Input>
                      <Input label="Designation">
                        <input className={inputClass} value={p.designation} onChange={(e) => updatePartner(i, "designation", e.target.value)} />
                      </Input>
                    </div>
                    <SignatureUpload label="Signature" onSignatureChange={(sig) => updatePartner(i, "signatureImage", sig || "")} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs font-bold">Witness Details</h2>
            <Input label="Witness Name">
              <input className={inputClass} value={data.witnessName} onChange={(e) => update("witnessName", e.target.value)} />
            </Input>
            <Input label="Witness Address">
              <textarea className={inputClass} rows={2} value={data.witnessAddress} onChange={(e) => update("witnessAddress", e.target.value)} />
            </Input>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Profession">
                <input className={inputClass} placeholder="e.g. Chartered Accountant" value={data.witnessProfession} onChange={(e) => update("witnessProfession", e.target.value)} />
              </Input>
              <Input label="Membership No.">
                <input className={inputClass} value={data.witnessMembership} onChange={(e) => update("witnessMembership", e.target.value)} />
              </Input>
            </div>
            <SignatureUpload label="Witness Signature" onSignatureChange={(sig) => update("witnessSignatureImage", sig || "")} />
          </div>
        </div>
      }
    />
  );
}
