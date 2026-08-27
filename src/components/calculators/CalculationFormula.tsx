"use client";

import React from "react";
import { CalculatorConfig } from "@/lib/calculators/types";
import { Binary } from "lucide-react";

interface Props {
  config: CalculatorConfig;
}

export default function CalculationFormula({ config }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-[#1A2E7E]">
          <Binary className="h-4 w-4" />
        </div>
        <h3 className="text-base font-bold text-[#1A1C1E]">
          Calculation Formula & Methodology
        </h3>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 font-mono text-xs sm:text-sm font-semibold text-[#1A2E7E] overflow-x-auto my-3">
        {config.formulaText}
      </div>

      <p className="text-xs leading-relaxed text-slate-600">
        {config.formulaDescription}
      </p>
    </section>
  );
}
