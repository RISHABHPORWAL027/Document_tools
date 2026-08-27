"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators/registry";
import { CalculatorCategory } from "@/lib/calculators/types";
import { Search, Calculator, ArrowRight, Sparkles, Building2, Banknote, Briefcase } from "lucide-react";

export default function CalculatorsHubClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCalculators = CALCULATORS.filter((calc) => {
    const matchesCategory = activeCategory === "all" || calc.category === activeCategory;
    const matchesSearch =
      calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: string; label: string; icon: any }[] = [
    { id: "all", label: "All Calculators (15)", icon: Calculator },
    { id: "finance", label: "Finance Calculators", icon: Banknote },
    { id: "salary", label: "Salary Calculators", icon: Briefcase },
    { id: "business", label: "Business Calculators", icon: Building2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Header */}
      <div className="rounded-3xl border border-[#CBDBF5] bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0D163F] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>ComplianceDraft Tools Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Financial, Salary & Business Calculators
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            Accurate, free, and instant web calculators built for professionals, businesses, and employees. Calculate take-home salary, GST, EPF, HRA tax exemptions, loan EMIs, and profit margins.
          </p>

          {/* Search Input Bar */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators (e.g., In-Hand Salary, GST, EMI, HRA)..."
                className="w-full rounded-xl border border-white/20 bg-white/90 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-md backdrop-blur-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                active
                  ? "bg-[#1A2E7E] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Calculators */}
      {filteredCalculators.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <p className="text-base font-bold text-slate-700">No calculators found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="text-xs font-semibold text-[#1A2E7E] hover:underline"
          >
            Clear filters and search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCalculators.map((calc) => (
            <Link
              key={calc.id}
              href={`/calculators/${calc.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#1A2E7E] hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-3xl">{calc.icon}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A2E7E] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {calc.categoryName}
                    </span>
                    {calc.badge && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                        {calc.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#1A1C1E] group-hover:text-[#1A2E7E] transition-colors">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {calc.shortDescription}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1A2E7E]">
                <span>Calculate Now</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
