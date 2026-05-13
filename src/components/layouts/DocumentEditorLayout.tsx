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
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(previewHtml);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-4 lg:p-8">
      <div className="mx-auto w-full max-w-[2400px]">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="border-l-4 border-black pl-4">
            <h1
              className="text-2xl font-black tracking-tight text-black"
              style={{ letterSpacing: "-0.025em" }}
            >
              {title}
            </h1>
            <p className="mt-1 text-sm text-[#666666]">{description}</p>
          </div>
          <ProfileSelector
            initialCompanyId={companyId}
            onSelect={onProfileSelect}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

          {/* LEFT: INPUTS */}
          <div className="space-y-5 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 pb-10">
            {inputSection}
          </div>

          {/* RIGHT: PREVIEW */}
          <section className="flex flex-col bg-white border border-[#eeeeee] overflow-hidden h-fit sticky top-4 shadow-sm">
            <div className="border-b border-[#eeeeee] bg-[#f6f6f6] px-5 py-3 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                Live Preview
              </span>
              <span className="text-[10px] text-[#b0b0b0]">
                Scroll to view full document
              </span>
            </div>
            <div
              className="overflow-auto bg-[#eeeeee] p-4 flex sm:justify-center"
              style={{ maxHeight: "calc(100vh - 12rem)" }}
            >
              <iframe
                title={iframeTitle}
                className="bg-white shadow-lg border-none shrink-0"
                style={{ width: "210mm", minWidth: "210mm", minHeight: "1350px" }}
                srcDoc={previewHtml}
                sandbox="allow-same-origin allow-scripts allow-modals"
              />
            </div>
          </section>
        </div>

        {/* ACTION BUTTONS — Uber style */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-[#eeeeee] pt-8">
          <button
            onClick={() => onDownload("pdf")}
            disabled={busy}
            className="min-w-[180px] bg-black px-8 py-3.5 text-sm font-bold text-white hover:bg-[#1a1a1a] disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {busy ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <span>⬇</span>
            )}
            {busy ? "Generating…" : "Download PDF"}
          </button>

          <button
            onClick={() => onDownload("docx")}
            disabled={busy}
            className="min-w-[180px] border-2 border-black bg-white px-8 py-3.5 text-sm font-bold text-black hover:bg-[#f6f6f6] disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>⬇</span>
            Download DOCX
          </button>

          <button
            onClick={printPreview}
            className="min-w-[140px] border border-[#d9d9d9] bg-white px-8 py-3.5 text-sm font-bold text-[#444444] hover:border-black hover:text-black transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🖨</span>
            Print
          </button>

          {extraActions}
        </div>
      </div>
    </div>
  );
}
