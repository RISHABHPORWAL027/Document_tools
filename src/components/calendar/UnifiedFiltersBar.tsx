"use client";

import React from "react";
import { ActiveFilters } from "@/lib/calendars/unifiedEngine";
import { INDIAN_STATES } from "@/lib/calendars/holidays/holidaysData";
import { Filter, MapPin } from "lucide-react";

interface Props {
  year: number;
  onYearChange: (yr: number) => void;
  selectedState: string;
  onStateChange: (st: string) => void;
  filters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
}

export default function UnifiedFiltersBar({
  year,
  onYearChange,
  selectedState,
  onStateChange,
  filters,
  onFilterChange,
}: Props) {
  const toggle = (key: keyof ActiveFilters) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Year and State Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span>Year:</span>
            <select
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#1A2E7E] focus:border-[#1A2E7E] outline-hidden"
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-[#1A2E7E]" />
            <span>State:</span>
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-[#1A2E7E] outline-hidden max-w-[180px] sm:max-w-xs"
            >
              <option value="all">All India (National)</option>
              {INDIAN_STATES.map((st) => (
                <option key={st.slug} value={st.slug}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-[#1A2E7E]" /> Customize Categories
        </div>
      </div>

      {/* Checkboxes Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-700">
        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showNational}
            onChange={() => toggle("showNational")}
            className="rounded-md border-slate-300 text-[#1A2E7E] focus:ring-[#1A2E7E]"
          />
          <span>🇮🇳 National Holidays</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showState}
            onChange={() => toggle("showState")}
            className="rounded-md border-slate-300 text-[#1A2E7E] focus:ring-[#1A2E7E]"
          />
          <span>🗺️ State Holidays</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showBank}
            onChange={() => toggle("showBank")}
            className="rounded-md border-slate-300 text-[#1A2E7E] focus:ring-[#1A2E7E]"
          />
          <span>🏦 Bank Holidays</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showFestival}
            onChange={() => toggle("showFestival")}
            className="rounded-md border-slate-300 text-[#1A2E7E] focus:ring-[#1A2E7E]"
          />
          <span>🎉 Festivals</span>
        </label>

        <span className="text-slate-300 hidden sm:inline">|</span>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showGst}
            onChange={() => toggle("showGst")}
            className="rounded-md border-slate-300 text-red-600 focus:ring-red-600"
          />
          <span>🔴 GST Deadlines</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showIncomeTax}
            onChange={() => toggle("showIncomeTax")}
            className="rounded-md border-slate-300 text-red-600 focus:ring-red-600"
          />
          <span>🔴 Income Tax</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showTds}
            onChange={() => toggle("showTds")}
            className="rounded-md border-slate-300 text-amber-600 focus:ring-amber-600"
          />
          <span>🟠 TDS / TCS</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showRoc}
            onChange={() => toggle("showRoc")}
            className="rounded-md border-slate-300 text-red-600 focus:ring-red-600"
          />
          <span>🏢 ROC / MCA</span>
        </label>
      </div>
    </div>
  );
}
