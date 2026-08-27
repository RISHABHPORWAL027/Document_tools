"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HolidayItem, StateInfo } from "@/lib/calendars/holidays/types";
import HolidayTable from "./HolidayTable";
import { Calendar, ChevronRight, Filter, Home, MapPin, Sparkles, Umbrella } from "lucide-react";

interface Props {
  initialHolidays: HolidayItem[];
  year: number;
  states: StateInfo[];
}

export default function HolidayHubClient({ initialHolidays, year, states }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");

  const filteredHolidays = initialHolidays.filter((h) => {
    const matchesCat = selectedCategory === "all" || h.category === selectedCategory;
    const matchesSt = selectedState === "all" || h.states.includes("all") || h.states.includes(selectedState);
    return matchesCat && matchesSt;
  });

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/" className="flex items-center gap-1 hover:text-[#1A2E7E]">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-[#1A1C1E] font-semibold">Holiday Calendar {year}</span>
      </nav>

      {/* Hero Banner */}
      <div className="rounded-2xl border border-[#CBDBF5] bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0A1238] p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>India Leave & Holiday Guide</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Indian Holiday Calendar {year}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Check national, bank, public, festival and state-wise holidays across India. Plan your leave requests and long weekend trips in advance.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <Link
              href={`/long-weekends/${year}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-900 shadow-xs hover:bg-amber-300 transition-colors"
            >
              <Umbrella className="h-4 w-4" />
              <span>Long Weekend Finder 🎉</span>
            </Link>
            <Link
              href="/leave-planner"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white border border-white/20 hover:bg-white/25 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              <span>Interactive Leave Planner</span>
            </Link>
          </div>
        </div>

        {/* Year Selector Tabs */}
        <div className="mt-6 pt-6 border-t border-white/15 flex items-center gap-2">
          <span className="text-xs text-blue-200 font-semibold">Select Year:</span>
          {[2026, 2027, 2028].map((y) => (
            <Link
              key={y}
              href={y === 2026 ? "/holiday-calendar" : `/holiday-calendar/${y}`}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                y === year
                  ? "bg-white text-[#1A2E7E] shadow-xs"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      {/* State-Wise Quick Links Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#1A1C1E] flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#1A2E7E]" />
          State-Wise Holiday Calendars
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {states.map((st) => (
            <Link
              key={st.code}
              href={`/holiday-calendar/state/${st.slug}/${year}`}
              className="p-3 border border-slate-200 rounded-xl bg-white text-center hover:border-[#1A2E7E] hover:shadow-xs transition-all group"
            >
              <span className="block text-xs font-bold text-[#1A1C1E] group-hover:text-[#1A2E7E]">
                {st.name}
              </span>
              <span className="text-[10px] text-slate-500">{st.capital}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-[#1A2E7E]" /> Filter:
        </span>
        {[
          { id: "all", label: "All Holidays" },
          { id: "national", label: "🇮🇳 National" },
          { id: "bank", label: "🏦 Bank Holidays" },
          { id: "festival", label: "🎉 Festivals" },
          { id: "state", label: "🗺 State Holidays" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? "bg-[#1A2E7E] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Holiday Table */}
      <HolidayTable holidays={filteredHolidays} title={`Holidays in ${year}`} />
    </div>
  );
}
