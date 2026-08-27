"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ActiveFilters,
  DEFAULT_FILTERS,
  TodaySummary,
  UnifiedCalendarEvent,
  getTodayDashboardSummary,
  getUnifiedEvents,
} from "@/lib/calendars/unifiedEngine";
import TodayDashboardWidget from "./TodayDashboardWidget";
import UnifiedFiltersBar from "./UnifiedFiltersBar";
import MonthlyGridCalendar from "./MonthlyGridCalendar";
import EventDetailDrawer from "./EventDetailDrawer";
import HolidayTable from "../holidays/HolidayTable";
import { findLongWeekends, planOptimalLeaves } from "@/lib/calendars/holidays/longWeekendEngine";
import { Calendar, ChevronRight, Home, Sparkles, Umbrella, Users, Zap } from "lucide-react";

interface Props {
  initialYear?: number;
  initialMonth?: number;
  initialState?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export default function UnifiedCalendarHubClient({
  initialYear = 2026,
  initialMonth = 8,
  initialState = "all",
  pageTitle = "India Calendar 2026",
  pageDescription = "Holidays, long weekends, leave opportunities and statutory compliance due dates — all in one place.",
}: Props) {
  const [year, setYear] = useState<number>(initialYear);
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [filters, setFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<"overview" | "holidays" | "weekends" | "compliance" | "leaves">("overview");

  // Date drawer state
  const [drawerDate, setDrawerDate] = useState<string | null>(null);
  const [drawerEvents, setDrawerEvents] = useState<UnifiedCalendarEvent[]>([]);

  const todaySummary = getTodayDashboardSummary(undefined, selectedState);
  const unifiedEvents = getUnifiedEvents(year, 0, selectedState, filters);

  const holidaysOnly = unifiedEvents.filter((e) => e.isHoliday && e.rawHoliday).map((e) => e.rawHoliday!);
  const complianceOnly = unifiedEvents.filter((e) => e.isCompliance && e.rawCompliance).map((e) => e.rawCompliance!);
  const longWeekends = findLongWeekends(year, selectedState);
  const leavePlanResult = planOptimalLeaves(15, year, selectedState);

  const handleDateClick = (dateStr: string, events: UnifiedCalendarEvent[]) => {
    setDrawerDate(dateStr);
    setDrawerEvents(events);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-8">
      {/* Date Drawer */}
      <EventDetailDrawer dateStr={drawerDate} events={drawerEvents} onClose={() => setDrawerDate(null)} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/" className="flex items-center gap-1 hover:text-[#1A2E7E]">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-[#1A1C1E] font-semibold">{pageTitle}</span>
      </nav>

      {/* Master Hero Banner */}
      <div className="rounded-2xl border border-[#CBDBF5] bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0A1238] p-6 sm:p-8 text-white shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Unified India Calendar Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{pageTitle}</h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">{pageDescription}</p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <Link
              href="/leave-planner"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-900 shadow-xs hover:bg-amber-300 transition-colors"
            >
              <Zap className="h-4 w-4" />
              <span>Plan My Leaves</span>
            </Link>
            <Link
              href="/compliance-calendar/today"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white border border-white/20 hover:bg-white/25 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              <span>Due Today Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Today Dashboard Widget */}
      <TodayDashboardWidget summary={todaySummary} />

      {/* Unified Filters Bar */}
      <UnifiedFiltersBar
        year={year}
        onYearChange={setYear}
        selectedState={selectedState}
        onStateChange={setSelectedState}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Tab Switcher */}
      <div className="border-b border-slate-200 flex flex-wrap gap-2 text-xs font-bold">
        {[
          { id: "overview", label: "Overview", icon: "🗓️" },
          { id: "holidays", label: "Holidays List", icon: "🇮🇳" },
          { id: "weekends", label: "Long Weekends", icon: "🌴" },
          { id: "compliance", label: "Compliance Dates", icon: "🔴" },
          { id: "leaves", label: "Leave Opportunities", icon: "⚡" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-[#1A2E7E] text-[#1A2E7E]"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview (Monthly Grid) */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <MonthlyGridCalendar
            year={year}
            initialMonth={initialMonth}
            selectedState={selectedState}
            filters={filters}
            onDateClick={handleDateClick}
          />
        </div>
      )}

      {/* TAB CONTENT: Holidays List */}
      {activeTab === "holidays" && (
        <HolidayTable holidays={holidaysOnly} title={`Indian Holidays (${year})`} />
      )}

      {/* TAB CONTENT: Long Weekends */}
      {activeTab === "weekends" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {longWeekends.map((lw) => (
            <div key={lw.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {lw.durationDays} Days Off 🎉
                </span>
                <span className="text-slate-500">{lw.leaveDaysRequired === 0 ? "No Leave Needed" : `${lw.leaveDaysRequired} Leave Required`}</span>
              </div>
              <h3 className="text-base font-bold text-[#1A1C1E]">{lw.summary}</h3>
              <p className="text-xs text-slate-600 font-medium">{lw.recommendationReason}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Compliance Dates */}
      {activeTab === "compliance" && (
        <div className="space-y-3">
          {complianceOnly.map((comp) => (
            <div key={comp.id} className="p-4 border border-slate-200 rounded-xl bg-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-[#1A2E7E] uppercase tracking-wider">{comp.categoryName}</span>
                <h4 className="text-sm font-bold text-[#1A1C1E]">{comp.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{comp.whoShouldFile}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 block">
                  Due: {comp.dueDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Leave Opportunities */}
      {activeTab === "leaves" && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1A1C1E]">Take 1 Leave, Get 4 Days Off Opportunities</h3>
              <p className="text-xs text-slate-600 mt-0.5">Calculated for 15 annual leaves quota</p>
            </div>
            <span className="text-sm font-extrabold text-[#1A2E7E] bg-white px-3 py-1 rounded-lg border border-blue-200">
              {leavePlanResult.multiplier} Efficiency
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {leavePlanResult.plans.map((p, idx) => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="text-xs font-bold text-[#1A2E7E]">Opportunity #{idx + 1}</div>
                <div className="text-sm font-bold text-[#1A1C1E]">{p.summary}</div>
                <div className="text-xs text-slate-600 font-medium">{p.recommendationReason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
