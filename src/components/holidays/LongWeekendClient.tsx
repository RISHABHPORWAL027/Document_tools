"use client";

import React from "react";
import Link from "next/link";
import { LongWeekendPlan } from "@/lib/calendars/holidays/types";
import { Calendar, ChevronRight, Home, Sparkles, Umbrella } from "lucide-react";

interface Props {
  plans: LongWeekendPlan[];
  year: number;
}

export default function LongWeekendClient({ plans, year }: Props) {
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
        <span className="text-[#1A1C1E] font-semibold">Long Weekends {year}</span>
      </nav>

      {/* Header */}
      <div className="rounded-2xl border border-amber-300 bg-linear-to-br from-amber-500 via-amber-600 to-amber-700 p-6 sm:p-8 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-amber-100 mb-3">
          <Umbrella className="h-4 w-4 text-amber-200" />
          <span>Upcoming Mini-Vacation Guide</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          Long Weekends in India {year}
        </h1>
        <p className="text-xs sm:text-sm text-amber-100/95 mt-2 max-w-3xl leading-relaxed">
          Discover natural 3-day long weekends and &quot;Take 1 Leave, Get 4 Days Off&quot; bridge opportunities across India.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/leave-planner"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Open Leave Planner</span>
          </Link>
        </div>
      </div>

      {/* List of Long Weekend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {plans.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-[#1A2E7E] transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  {p.durationDays} Days Off
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {p.leaveDaysRequired === 0 ? "0 Leaves Needed" : `${p.leaveDaysRequired} Leave Required`}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-[#1A1C1E]">{p.summary}</h3>
              <p className="text-xs text-slate-600 font-medium">{p.recommendationReason}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Dates: {p.startDate} to {p.endDate}</span>
              <span className="text-[#1A2E7E] font-bold">Holiday: {p.holidays[0]?.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
