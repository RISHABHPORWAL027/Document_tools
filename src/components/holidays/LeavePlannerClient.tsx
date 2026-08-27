"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INDIAN_STATES } from "@/lib/calendars/holidays/holidaysData";
import { planOptimalLeaves } from "@/lib/calendars/holidays/longWeekendEngine";
import { Calendar, ChevronRight, Home, Sparkles, TrendingUp } from "lucide-react";

export default function LeavePlannerClient() {
  const [leaveQuota, setLeaveQuota] = useState<number>(15);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const planResult = planOptimalLeaves(leaveQuota, selectedYear, selectedState);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/" className="flex items-center gap-1 hover:text-[#1A2E7E]">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/holiday-calendar" className="hover:text-[#1A2E7E]">
          Holiday Calendar
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-[#1A1C1E] font-semibold">Interactive Leave Planner</span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-2xl border border-[#CBDBF5] bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0A1238] p-6 sm:p-8 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Smart Leave Optimizer</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          Indian Leave Planner & Optimizer
        </h1>
        <p className="text-xs sm:text-sm text-blue-100/90 mt-2 max-w-3xl leading-relaxed">
          Input your total annual leave balance to calculate the smartest dates to apply for leave. Turn 15 leaves into 45+ total days off!
        </p>
      </div>

      {/* Input Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-[#1A1C1E]">Configure Your Leave Quota</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Available Leaves Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <label>Available Paid Leaves</label>
              <span className="text-sm font-extrabold text-[#1A2E7E] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                {leaveQuota} Days
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={leaveQuota}
              onChange={(e) => setLeaveQuota(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1A2E7E]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>1 Day</span>
              <span>15 Days</span>
              <span>30 Days</span>
            </div>
          </div>

          {/* State Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Select State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-white focus:border-[#1A2E7E] outline-hidden"
            >
              <option value="all">All India (National)</option>
              {INDIAN_STATES.map((st) => (
                <option key={st.slug} value={st.slug}>
                  {st.name} ({st.capital})
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Calendar Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-white focus:border-[#1A2E7E] outline-hidden"
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <span className="block text-xs font-bold text-slate-600">Leaves Used</span>
          <span className="text-3xl font-extrabold text-[#1A2E7E] mt-1 block">
            {planResult.leavesUsed} / {leaveQuota}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Planned leave requests</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
          <span className="block text-xs font-bold text-slate-600">Total Days Off Gained</span>
          <span className="text-3xl font-extrabold text-emerald-800 mt-1 block">
            {planResult.totalDaysOffGained} Days
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block font-semibold">Vacation & holiday days</span>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 flex flex-col justify-between">
          <div>
            <span className="block text-xs font-bold text-slate-600 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-amber-700" />
              Efficiency Multiplier
            </span>
            <span className="text-3xl font-extrabold text-amber-900 mt-1 block">
              {planResult.multiplier}
            </span>
          </div>
          <span className="text-[11px] text-amber-800 font-bold">Days off per 1 leave taken</span>
        </div>
      </div>

      {/* Recommended Leave Schedule */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#1A1C1E] flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#1A2E7E]" />
          Recommended Leave Schedule ({planResult.plans.length} Vacations)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planResult.plans.map((p, idx) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#1A2E7E] bg-blue-50 px-2.5 py-1 rounded-lg">
                  Vacation #{idx + 1}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {p.durationDays} Total Days Off 🎉
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#1A1C1E]">{p.summary}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{p.recommendationReason}</p>

              {p.leaveDates.length > 0 && (
                <div className="pt-2 border-t border-slate-100 text-xs font-bold text-amber-800 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  Apply Leave On: {p.leaveDates.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
