"use client";

import React from "react";
import Link from "next/link";
import { HolidayItem, StateInfo } from "@/lib/calendars/holidays/types";
import HolidayTable from "./HolidayTable";
import { ChevronRight, Home, MapPin, Sparkles, Umbrella } from "lucide-react";

interface Props {
  stateInfo: StateInfo;
  holidays: HolidayItem[];
  year: number;
}

export default function StateHolidayClient({ stateInfo, holidays, year }: Props) {
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
        <span className="text-[#1A1C1E] font-semibold">{stateInfo.name} ({year})</span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-2xl border border-[#CBDBF5] bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0A1238] p-6 sm:p-8 text-white shadow-md">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
            <MapPin className="h-3.5 w-3.5 text-amber-300" />
            <span>{stateInfo.capital} Capital Region</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {stateInfo.name} Holiday Calendar {year}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Official government, bank, and festival holiday dates for {stateInfo.name} in {year}.
          </p>
        </div>

        {/* Action Links */}
        <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap gap-3">
          <Link
            href={`/long-weekends/${year}`}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 shadow-xs hover:bg-amber-300 transition-colors"
          >
            <Umbrella className="h-4 w-4" />
            <span>View Long Weekends</span>
          </Link>
          <Link
            href="/leave-planner"
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white border border-white/20 hover:bg-white/25 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Optimize {stateInfo.name} Leaves</span>
          </Link>
        </div>
      </div>

      {/* Table */}
      <HolidayTable holidays={holidays} title={`Official Holidays in ${stateInfo.name} (${year})`} />
    </div>
  );
}
