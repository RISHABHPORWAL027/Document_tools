"use client";

import React from "react";
import { CalculatorConfig } from "@/lib/calculators/types";
import { BookOpen, CheckCircle2, Sliders } from "lucide-react";

interface Props {
  config: CalculatorConfig;
}

export default function SEOContent({ config }: Props) {
  return (
    <div className="space-y-6 text-[#1A1C1E]">
      {/* What is Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#1A2E7E]">
            <BookOpen className="h-4 w-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#1A1C1E]">
            {config.whatIs.title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
          {config.whatIs.content}
        </p>
      </section>

      {/* How it Works Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#1A1C1E]">
            {config.howItWorks.title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
          {config.howItWorks.content}
        </p>
      </section>

      {/* Practical Example Calculation */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#1A1C1E]">
          {config.exampleCalculation.title}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-700">
          {config.exampleCalculation.scenario}
        </p>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs sm:text-sm">
          {config.exampleCalculation.steps.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
              <span className="text-slate-600 font-medium">{step.label}</span>
              <span className="font-bold text-[#1A1C1E]">{step.value}</span>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-slate-600 italic">
          {config.exampleCalculation.conclusion}
        </p>
      </section>

      {/* Factors Affecting */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <Sliders className="h-4 w-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#1A1C1E]">
            {config.factorsAffecting.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.factorsAffecting.factors.map((factor, idx) => (
            <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
              <h4 className="text-xs font-bold text-[#1A2E7E]">{factor.name}</h4>
              <p className="text-xs text-slate-600 leading-normal">
                {factor.impact || factor.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
