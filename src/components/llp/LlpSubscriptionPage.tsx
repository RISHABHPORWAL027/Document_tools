"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import SignatureUpload from "@/components/SignatureUpload";
import type { CompanyProfile } from "@/lib/profiles/types";
import {
  buildLlpSubscriptionHtml,
  type LlpSubscriptionRow,
  type LlpSubscriptionValues,
} from "@/lib/llp/subscription-html";

const REF_SUB =
  "/company%20document/Company%20%3A%20LLP%20Incoorpation/LLP/Subscription%20Sheet_Dray%20Consulting%20LLP.doc";

function isoToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyRow(): LlpSubscriptionRow {
  return { partnerName: "", contributionRs: "" };
}

function initialData(): LlpSubscriptionValues {
  return {
    llpName: "",
    place: "",
    date: isoToday(),
    rows: [emptyRow(), emptyRow()],
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
  const companyFromUrl = searchParams.get("company");

  const [data, setData] = useState<LlpSubscriptionValues>(() => initialData());
  const [busy, setBusy] = useState(false);

  const previewHtml = useMemo(() => buildLlpSubscriptionHtml(data), [data]);

  function update<K extends keyof LlpSubscriptionValues>(
    key: K,
    value: LlpSubscriptionValues[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateRow(idx: number, key: keyof LlpSubscriptionRow, value: string) {
    setData((prev) => {
      const rows = [...(prev.rows ?? [])];
      rows[idx] = { ...rows[idx], [key]: value };
      return { ...prev, rows };
    });
  }

  function addRow() {
    setData((prev) => ({
      ...prev,
      rows: [...(prev.rows ?? []), emptyRow()],
    }));
  }

  function removeRow(idx: number) {
    setData((prev) => {
      const rows = prev.rows ?? [];
      if (rows.length <= 1) return prev;
      return { ...prev, rows: rows.filter((_, i) => i !== idx) };
    });
  }

  function handleProfileSelect(profile: CompanyProfile) {
    setData((prev) => ({
      ...prev,
      llpName: profile.companyName || prev.llpName,
      place: profile.directors[0]?.city || prev.place,
      rows: profile.directors.length > 0
        ? profile.directors.map(d => ({
            partnerName: d.directorName,
            contributionRs: "10,000"
          }))
        : prev.rows
    }));
  }

  async function download(kind: "pdf" | "docx") {
    if (!data.llpName?.trim()) {
      alert("LLP name is required.");
      return;
    }
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

  const rows = data.rows ?? [];

  return (
    <DocumentEditorLayout
      title="Subscription Sheet (LLP)"
      description="Partner-wise contribution table for LLP formation drafts. Totals update from numeric amounts; align with FiLLiP and professional advice."
      onProfileSelect={handleProfileSelect}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle="Subscription Preview"
      inputSection={
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">LLP Details</h2>
            <Input label="Name of LLP (proposed)" required>
              <input className={inputClass} placeholder="e.g. ABC Consulting LLP" value={data.llpName} onChange={(e) => update("llpName", e.target.value)} />
            </Input>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Place">
                <input className={inputClass} value={data.place} onChange={(e) => update("place", e.target.value)} />
              </Input>
              <Input label="Date">
                <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
              </Input>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 uppercase tracking-wider text-xs">Partners & Contributions</h2>
              <button type="button" onClick={addRow} className="text-xs font-bold text-teal-700 hover:text-teal-800 uppercase tracking-tight">+ Add Row</button>
            </div>
            <div className="space-y-4">
              {rows.map((row, i) => (
                <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 space-y-3 relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Partner Row #{i + 1}</span>
                    {rows.length > 1 && (
                      <button onClick={() => removeRow(i)} className="text-xs font-medium text-red-600 hover:text-red-700">Remove</button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Input label="Partner Name">
                      <input className={inputClass} placeholder="As per ID" value={row.partnerName} onChange={(e) => updateRow(i, "partnerName", e.target.value)} />
                    </Input>
                    <Input label="Contribution (₹)">
                      <input className={inputClass} inputMode="decimal" placeholder="e.g. 10000" value={row.contributionRs} onChange={(e) => updateRow(i, "contributionRs", e.target.value)} />
                    </Input>
                    <SignatureUpload label="Partner Signature" onSignatureChange={(sig) => updateRow(i, "signatureImage", sig || "")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
