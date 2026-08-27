"use client";

import React, { useState } from "react";
import { CalculatorResultData, CalculatorConfig } from "@/lib/calculators/types";
import ResultBreakdown from "./ResultBreakdown";
import { Copy, Share2, Printer, Check, Info } from "lucide-react";

interface Props {
  result: CalculatorResultData;
  config: CalculatorConfig;
  inputs: Record<string, any>;
}

export default function CalculatorResult({ result, config }: Props) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    const summaryText = `${config.title}\n${result.primaryTitle}: ${result.formattedPrimaryValue}\n\nKey Breakdown:\n` +
      result.breakdown.map((b) => `- ${b.label}: ${b.formattedValue}`).join("\n") +
      `\n\nCalculated on ComplianceDraft: ${window.location.href}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: config.title,
        text: `Check out my ${config.title} results on ComplianceDraft: ${result.formattedPrimaryValue}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Main Result Card */}
      <div className="rounded-2xl border border-[#CBDBF5] bg-linear-to-br from-[#1A2E7E] to-[#12205B] p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
            {result.primaryTitle}
          </span>
          <div className="flex items-center gap-1.5 no-print">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-white/20 active:scale-95"
              title="Copy Summary to Clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-white/20 active:scale-95"
              title="Share Calculator"
            >
              {shared ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{shared ? "Copied!" : "Share"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-white/20 active:scale-95"
              title="Print / PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Big Number */}
        <div className="my-2">
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {result.formattedPrimaryValue}
          </div>
        </div>

        {/* Secondary Metrics Pills */}
        {result.secondaryMetrics && result.secondaryMetrics.length > 0 && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 border-t border-white/10 pt-4">
            {result.secondaryMetrics.map((sec, idx) => (
              <div key={idx} className="rounded-xl bg-white/10 p-2.5 backdrop-blur-xs">
                <div className="text-[11px] text-blue-200 font-medium">{sec.label}</div>
                <div className="text-sm font-bold text-white mt-0.5">{sec.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explanation Banner */}
      {result.explanation && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-relaxed text-[#1A2E7E] flex gap-2.5 items-start">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#1A2E7E]" />
          <div>{result.explanation}</div>
        </div>
      )}

      {/* Breakdown Details */}
      <ResultBreakdown breakdown={result.breakdown} tableData={result.tableData} />
    </div>
  );
}
