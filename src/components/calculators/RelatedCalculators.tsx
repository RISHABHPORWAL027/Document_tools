"use client";

import React from "react";
import Link from "next/link";
import { getRelatedCalculators } from "@/lib/calculators/registry";
import { Calculator, ArrowRight } from "lucide-react";

interface Props {
  slugs: string[];
}

export default function RelatedCalculators({ slugs }: Props) {
  const relatedList = getRelatedCalculators(slugs);

  if (relatedList.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-[#1A2E7E]">
          <Calculator className="h-4 w-4" />
        </div>
        <h3 className="text-base font-bold text-[#1A1C1E]">
          Related Calculators
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relatedList.map((calc) => (
          <Link
            key={calc.id}
            href={`/calculators/${calc.slug}`}
            className="group flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 transition-all hover:border-[#1A2E7E] hover:bg-slate-50/50 hover:shadow-xs"
          >
            <span className="text-2xl shrink-0 mt-0.5">{calc.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-[#1A1C1E] group-hover:text-[#1A2E7E] truncate">
                  {calc.title}
                </h4>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-[#1A2E7E] transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                {calc.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
