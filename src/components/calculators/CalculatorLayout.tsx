"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalculatorConfig } from "@/lib/calculators/types";
import CalculatorForm from "./CalculatorForm";
import CalculatorResult from "./CalculatorResult";
import CalculationFormula from "./CalculationFormula";
import SEOContent from "./SEOContent";
import FAQSection from "./FAQSection";
import RelatedCalculators from "./RelatedCalculators";
import RelatedTools from "./RelatedTools";
import CalculatorSchema from "./CalculatorSchema";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";

interface Props {
  config: CalculatorConfig;
}

export default function CalculatorLayout({ config }: Props) {
  // Initialize default input state from config
  const initialInputs: Record<string, any> = {};
  config.inputs.forEach((field) => {
    initialInputs[field.id] = field.defaultValue;
  });

  const [inputs, setInputs] = useState<Record<string, any>>(initialInputs);
  const [mode, setMode] = useState<string>(
    config.modeToggleOptions ? config.modeToggleOptions[0].value : "quick"
  );

  const handleInputChange = (id: string, val: any) => {
    setInputs((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    setInputs(initialInputs);
    if (config.modeToggleOptions) {
      setMode(config.modeToggleOptions[0].value);
    }
  };

  // Perform real-time calculation
  const result = config.calculate(inputs, mode);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6 space-y-8">
      {/* Schema Markup */}
      <CalculatorSchema config={config} />

      {/* ── Breadcrumbs ── */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-[#1A2E7E] transition-colors">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/calculators" className="hover:text-[#1A2E7E] transition-colors">
          Calculators
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-[#1A1C1E] font-semibold truncate max-w-[200px] sm:max-w-none">
          {config.title}
        </span>
      </nav>

      {/* ── Section 1: Hero ── */}
      <header className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{config.icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1A2E7E] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            {config.categoryName}
          </span>
          {config.badge && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              {config.badge}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C1E] tracking-tight">
          {config.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          {config.shortDescription}
        </p>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 pt-1">
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            100% Free & Secure
          </span>
          <span>•</span>
          <span>Instant Calculation</span>
          <span>•</span>
          <span>No Registration Required</span>
        </div>
      </header>

      {/* ── Main Dual-Column Grid (Inputs & Results) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <CalculatorForm
            config={config}
            inputs={inputs}
            mode={mode}
            onInputChange={handleInputChange}
            onModeChange={setMode}
            onReset={handleReset}
          />
        </div>

        {/* Right Column: Live Results */}
        <div className="lg:col-span-6 space-y-6 sticky top-4">
          <CalculatorResult result={result} config={config} inputs={inputs} />
        </div>
      </div>

      {/* ── Formula Section ── */}
      <CalculationFormula config={config} />

      {/* ── SEO Narrative Content ── */}
      <SEOContent config={config} />

      {/* ── FAQs Section ── */}
      <FAQSection faqs={config.faqs} />

      {/* ── Related Calculators ── */}
      <RelatedCalculators slugs={config.relatedCalculatorSlugs} />

      {/* ── Related ComplianceDraft Tools & Internal Links ── */}
      <RelatedTools tools={config.relatedComplianceTools} />
    </div>
  );
}
