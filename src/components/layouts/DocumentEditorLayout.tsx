"use client";

import React, { ReactNode } from "react";
import ProfileSelector from "@/components/ProfileSelector";
import type { CompanyProfile } from "@/lib/profiles/types";

interface DocumentEditorLayoutProps {
  title: string;
  description: string;
  companyId?: string | null;
  onProfileSelect: (profile: CompanyProfile) => void;
  inputSection: ReactNode;
  previewHtml: string;
  onDownload: (format: "pdf" | "docx") => Promise<void>;
  busy?: boolean;
  iframeTitle?: string;
  extraActions?: ReactNode;
}

export default function DocumentEditorLayout({
  title,
  description,
  companyId,
  onProfileSelect,
  inputSection,
  previewHtml,
  onDownload,
  busy = false,
  iframeTitle = "Document Preview",
  extraActions,
}: DocumentEditorLayoutProps) {
  
  const printPreview = () => {
    const frame = document.querySelector("iframe");
    if (frame?.contentWindow) {
      // Small delay to ensure frame is focused/ready if needed, 
      // though print() is usually synchronous in blocking.
      frame.contentWindow.focus();
      frame.contentWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 p-4 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
            <p className="text-sm text-zinc-500">{description}</p>
          </div>
          <ProfileSelector
            initialCompanyId={companyId}
            onSelect={onProfileSelect}
          />
        </div>

        {/* MAIN GRID: 30% Input, 70% Preview */}
        <div className="grid gap-6 lg:grid-cols-[3fr_7fr]">
          {/* LEFT: INPUTS */}
          <div className="space-y-6">
            {inputSection}
          </div>

          {/* RIGHT: PREVIEW */}
          <section className="flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden h-fit sticky top-4">
            <div className="border-b bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 flex justify-between items-center">
              <span>Live Preview</span>
              <span className="text-[10px] text-zinc-400 normal-case font-normal">Standard A4 Scale (0.9x)</span>
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-auto bg-zinc-100 p-4 scrollbar-thin scrollbar-thumb-zinc-300">
              <div
                style={{
                  transform: "scale(0.9)",
                  transformOrigin: "top center",
                }}
              >
                <iframe
                  title={iframeTitle}
                  className="mx-auto w-[210mm] min-h-[1100px] bg-white shadow-xl border-none ring-1 ring-zinc-200"
                  srcDoc={previewHtml}
                  sandbox="allow-same-origin allow-scripts allow-modals"
                />
              </div>
            </div>
          </section>
        </div>

        {/* GLOBAL ACTION BUTTONS */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-zinc-200 pt-8">
          <button
            onClick={() => onDownload("pdf")}
            disabled={busy}
            className="min-w-[180px] rounded-lg bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 shadow-lg shadow-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {busy ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "⬇"
            )}
            {busy ? "Generating..." : "Download PDF"}
          </button>
          
          <button
            onClick={() => onDownload("docx")}
            disabled={busy}
            className="min-w-[180px] rounded-lg border border-zinc-300 bg-white px-8 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>⬇</span> Download DOCX
          </button>
          
          <button
            onClick={printPreview}
            className="min-w-[140px] rounded-lg border border-zinc-300 bg-white px-8 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🖨</span> Print
          </button>

          {extraActions}
        </div>
      </div>
    </div>
  );
}
