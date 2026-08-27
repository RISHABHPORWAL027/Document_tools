"use client";

import React from "react";
import Link from "next/link";
import { RelatedToolItem } from "@/lib/calculators/types";
import { FileText, ExternalLink } from "lucide-react";

interface Props {
  tools: RelatedToolItem[];
}

export default function RelatedTools({ tools }: Props) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50/60 to-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A2E7E] text-white">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#1A1C1E]">
            Related ComplianceDraft Tools & Generators
          </h3>
          <p className="text-xs text-slate-500">
            Convert your calculations into ready-to-use compliance drafts & official legal documents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group flex items-start gap-3 rounded-xl border border-indigo-100 bg-white p-4 transition-all hover:border-[#1A2E7E] hover:shadow-md"
          >
            <span className="text-2xl shrink-0">{tool.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-[#1A2E7E] group-hover:underline truncate">
                  {tool.title}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {tool.badge}
                  <ExternalLink className="h-2.5 w-2.5" />
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug mt-1">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
