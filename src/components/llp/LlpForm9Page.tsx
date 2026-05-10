"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import LegalDatePicker from "@/components/LegalDatePicker";
import SignatureUpload from "@/components/SignatureUpload";
import type { CompanyProfile } from "@/lib/profiles/types";
import { buildLlpForm9Html, type LlpForm9Values } from "@/lib/llp/form9-html";

const REF_FORM9 =
  "/company%20document/Company%20%3A%20LLP%20Incoorpation/LLP/Form%209%20Consent%20to%20Act%20as%20Designated%20Partner.docx";

function isoToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function initialForm(): LlpForm9Values {
  return {
    llpName: "",
    partnerName: "",
    fatherName: "",
    residentialAddress: "",
    nationality: "Indian",
    occupation: "",
    dateOfBirth: "",
    email: "",
    mobile: "",
    pan: "",
    dpin: "",
    place: "",
    date: isoToday(),
    signaturePrintedName: "",
    witnessName: "",
    witnessAddress: "",
    signatureImage: "",
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

export default function LlpForm9Page() {
  const searchParams = useSearchParams();
  const companyFromUrl = searchParams.get("company");
  const { profile } = useCompanyProfile(companyFromUrl || undefined);

  const [data, setData] = useState<LlpForm9Values>(() => initialForm());
  const [busy, setBusy] = useState(false);
  const previewHtml = useMemo(() => buildLlpForm9Html(data), [data]);

  function update<K extends keyof LlpForm9Values>(key: K, value: LlpForm9Values[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  useDocumentPrefill(profile, setData, {
    llpName: (p) => p.companyName || "",
    partnerName: (p) => p.directors[0]?.directorName || "",
    fatherName: (p) => p.directors[0]?.fatherName || "",
    residentialAddress: (p) => {
      const d = p.directors[0];
      return d ? [d.address, d.city, d.state, d.pincode].filter(Boolean).join(", ") : "";
    },
    nationality: (p) => p.directors[0]?.nationality || "Indian",
    occupation: (p) => p.directors[0]?.occupation || "",
    dateOfBirth: (p) => p.directors[0]?.dateOfBirth || "",
    email: (p) => p.directors[0]?.email || "",
    mobile: (p) => p.directors[0]?.mobileNumber || "",
    pan: (p) => p.directors[0]?.pan || "",
    dpin: (p) => (p.directors[0]?.din || "").replace(/\D/g, "").slice(0, 8),
    place: (p) => p.directors[0]?.city || p.place || "",
  });

  function validate(): string | null {
    if (!data.partnerName?.trim()) return "Designated partner name is required.";
    if (!data.llpName?.trim()) return "LLP name is required.";
    const d = (data.dpin ?? "").replace(/\D/g, "");
    if (d.length > 0 && d.length !== 8) return "DPIN must be 8 digits or blank.";
    const p = (data.pan ?? "").trim().toUpperCase();
    if (p.length > 0 && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(p))
      return "PAN must be ABCDE1234F format.";
    return null;
  }

  async function download(kind: "pdf" | "docx") {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/llp/form9/${kind}`, {
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
      a.download = `LLP-Form9_${safe}.${kind}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(String(e));
    } finally {
      setBusy(false);
    }
  }

  function printPreview() {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(buildLlpForm9Html(data));
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <DocumentEditorLayout
      title="Form 9 — Consent as Designated Partner"
      description="Draft consent aligned with LLP incorporation practice. Match final wording with your CS."
      onProfileSelect={(p) => {}}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Form 9 Preview"
      inputSection={
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">LLP & Partner Details</h2>
            <Input label="Name of LLP (proposed)" required>
              <input className={inputClass} placeholder="e.g. Dray Consulting LLP" value={data.llpName} onChange={(e) => update("llpName", e.target.value)} />
            </Input>
            <Input label="Address of LLP (under incorporation)" required>
              <textarea className={inputClass} rows={2} placeholder="Proposed registered office address" value={data.llpAddress} onChange={(e) => update("llpAddress", e.target.value)} />
            </Input>
            <Input label="Designated Partner — Full Name" required>
              <input className={inputClass} value={data.partnerName} onChange={(e) => update("partnerName", e.target.value)} />
            </Input>
            <Input label="Father / Mother's Name" required>
              <input className={inputClass} value={data.fatherName} onChange={(e) => update("fatherName", e.target.value)} />
            </Input>
            <Input label="Residential Address" required>
              <textarea className={inputClass} rows={3} value={data.residentialAddress} onChange={(e) => update("residentialAddress", e.target.value)} />
            </Input>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Nationality">
                <input className={inputClass} value={data.nationality} onChange={(e) => update("nationality", e.target.value)} />
              </Input>
              <Input label="Occupation">
                <input className={inputClass} value={data.occupation} onChange={(e) => update("occupation", e.target.value)} />
              </Input>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Date of Birth">
              <LegalDatePicker 
                className={inputClass} 
                value={data.dateOfBirth} 
                onChange={(parts) => update("dateOfBirth", parts.dateIso)} 
              />
              </Input>
              <Input label="PAN">
                <input className={inputClass} placeholder="ABCDE1234F" maxLength={10} value={data.pan} onChange={(e) => update("pan", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))} />
              </Input>
            </div>
            <Input label="DPIN (8 digits)">
              <input className={inputClass} inputMode="numeric" maxLength={8} placeholder="From MCA" value={data.dpin} onChange={(e) => update("dpin", e.target.value.replace(/\D/g, "").slice(0, 8))} />
            </Input>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Email">
                <input type="email" className={inputClass} value={data.email} onChange={(e) => update("email", e.target.value)} />
              </Input>
              <Input label="Mobile">
                <input className={inputClass} inputMode="tel" value={data.mobile} onChange={(e) => update("mobile", e.target.value)} />
              </Input>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Signature & Witness</h2>
            <Input label="Place">
              <input className={inputClass} value={data.place} onChange={(e) => update("place", e.target.value)} />
            </Input>
            <Input label="Date of Signing">
              <LegalDatePicker 
                className={inputClass} 
                value={data.date} 
                onChange={(parts) => update("date", parts.dateIso)} 
              />
            </Input>
            <SignatureUpload label="Partner Signature" onSignatureChange={(sig) => update("signatureImage", sig || "")} />
            <Input label="Printed Name Under Signature">
              <input className={inputClass} placeholder="Leave blank to use partner name" value={data.signaturePrintedName ?? ""} onChange={(e) => update("signaturePrintedName", e.target.value)} />
            </Input>
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="text-sm font-bold text-zinc-700 uppercase tracking-tight">Witness Details</h3>
              <Input label="Witness Name">
                <input className={inputClass} placeholder="Witness name as per ID" value={data.witnessName ?? ""} onChange={(e) => update("witnessName", e.target.value)} />
              </Input>
              <Input label="Witness Address">
                <textarea className={inputClass} rows={3} placeholder="Witness residential address" value={data.witnessAddress ?? ""} onChange={(e) => update("witnessAddress", e.target.value)} />
              </Input>
            </div>
          </div>
        </div>
      }
    />
  );
}
