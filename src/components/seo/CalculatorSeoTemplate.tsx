"use client";

import React from "react";
import Link from "next/link";
import { SeoCalculatorDoc } from "@/data/seoCalculators";
import { CALCULATORS } from "@/lib/calculators/registry";
import CalculatorLayout from "../calculators/CalculatorLayout";
import { CheckCircle2, ChevronRight, HelpCircle, Home, ShieldCheck, Sparkles } from "lucide-react";

interface Props {
  doc: SeoCalculatorDoc;
}

export default function CalculatorSeoTemplate({ doc }: Props) {
  const calcConfig = CALCULATORS.find((c) => c.slug === doc.calculatorSlug) || CALCULATORS[0];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="flex items-center gap-1 hover:text-[#1A2E7E]">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link href="/calculators" className="hover:text-[#1A2E7E]">
            Calculators
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-[#1A1C1E] font-semibold">{doc.title}</span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0A1238] p-6 sm:p-8 text-white shadow-md space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{doc.trustBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{doc.title}</h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-3xl">{doc.intro}</p>
        </div>

        {/* Embedded Interactive Calculator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <h2 className="text-lg font-extrabold text-[#1A1C1E] mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" /> Live Interactive {calcConfig.title}
          </h2>
          <CalculatorLayout config={calcConfig} />
        </div>

        {/* Concept Section: What is it? */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-[#1A1C1E]">What is {doc.title}?</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{doc.whatIsIt}</p>
        </div>

        {/* Formula Section */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 space-y-3">
          <h2 className="text-base font-bold text-[#1A2E7E]">{doc.formulaTitle}</h2>
          <div className="p-4 rounded-xl bg-white border border-blue-200 font-mono text-xs text-[#1A2E7E] font-bold">
            {doc.formulaText}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{doc.formulaExplanation}</p>
        </div>

        {/* Step-by-Step Practical Example Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1A1C1E]">{doc.exampleTitle}</h2>
          <p className="text-xs text-slate-600">{doc.exampleScenario}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Calculation Component</th>
                  <th className="px-4 py-2.5 text-right">Amount Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {doc.exampleSteps.map((step, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-800 font-semibold">{step.label}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#1A2E7E]">{step.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            {doc.exampleConclusion}
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-[#1A1C1E]">{doc.checklistTitle}</h2>
          <ul className="space-y-2 text-xs text-slate-700 font-medium">
            {doc.checklistItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Long-Form Sections */}
        {doc.sections.map((sec, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#1A1C1E]">{sec.heading}</h2>
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ))}

        {/* FAQs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1A1C1E] flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#1A2E7E]" /> Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {doc.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <h3 className="text-xs font-bold text-[#1A1C1E]">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
