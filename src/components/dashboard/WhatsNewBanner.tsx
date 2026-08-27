"use client";

import Link from "next/link";
import { Sparkles, Calendar, Calculator, ArrowRight, ShieldCheck } from "lucide-react";

export default function WhatsNewBanner() {
  return (
    <div className="mx-auto max-w-5xl my-4 rounded-2xl border border-blue-200 bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0A1238] p-5 sm:p-6 text-white shadow-lg space-y-4">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>What&apos;s New in ComplianceDraft 2026</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" /> 100% Free & Statutory Compliant
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Explore Financial Calculators & Statutory Compliance Calendars
        </h2>
        <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mt-1">
          Calculate take-home salary, EPF interest, and GST tax split — plus track Indian public holidays and GST/Income Tax due dates.
        </p>
      </div>

      {/* Feature Quick Action Cards (Mobile Friendly Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <Link
          href="/calculators"
          className="group p-3 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <Calculator className="h-4 w-4 text-amber-300" />
              <ArrowRight className="h-3 w-3 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs font-bold text-white">Calculators</div>
            <div className="text-[10px] text-blue-200">15+ Salary & Tax tools</div>
          </div>
        </Link>

        <Link
          href="/calendar"
          className="group p-3 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <Calendar className="h-4 w-4 text-emerald-300" />
              <ArrowRight className="h-3 w-3 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs font-bold text-white">India Calendar</div>
            <div className="text-[10px] text-blue-200">Holidays & Due dates</div>
          </div>
        </Link>

        <Link
          href="/leave-planner"
          className="group p-3 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">🌴</span>
              <ArrowRight className="h-3 w-3 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs font-bold text-white">Leave Planner</div>
            <div className="text-[10px] text-blue-200">Take 1 leave get 4 days off</div>
          </div>
        </Link>

        <Link
          href="/payslips"
          className="group p-3 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">📄</span>
              <ArrowRight className="h-3 w-3 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xs font-bold text-white">Payslips & Invoices</div>
            <div className="text-[10px] text-blue-200">Instant PDF document generator</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
