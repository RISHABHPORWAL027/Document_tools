"use client";

import React from "react";
import { TodaySummary } from "@/lib/calendars/unifiedEngine";
import { AlertCircle, Calendar, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface Props {
  summary: TodaySummary;
}

export default function TodayDashboardWidget({ summary }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-[#1A2E7E] uppercase tracking-wider">Today Dashboard</span>
          <h2 className="text-lg font-extrabold text-[#1A1C1E]">{summary.todayDate}</h2>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold">
          <span>Is today a holiday?</span>
          {summary.isTodayHoliday ? (
            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Yes ({summary.todayHolidayName})
            </span>
          ) : (
            <span className="text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">
              ❌ No Working Day
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Next Holiday Card */}
        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1">
          <div className="flex items-center justify-between text-xs text-blue-900 font-bold">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Next Holiday
            </span>
            <span className="text-[11px] bg-blue-100 px-2 py-0.5 rounded-md">
              In {summary.daysToNextHoliday} Days
            </span>
          </div>
          <div className="text-sm font-extrabold text-[#1A1C1E] line-clamp-1">
            {summary.nextHoliday ? summary.nextHoliday.title : "No upcoming holiday"}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {summary.nextHoliday ? summary.nextHoliday.date : "N/A"}
          </div>
        </div>

        {/* Next Compliance Card */}
        <div className="p-4 rounded-xl border border-red-100 bg-red-50/40 space-y-1">
          <div className="flex items-center justify-between text-xs text-red-900 font-bold">
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 text-red-600" /> Next Compliance
            </span>
            <span className="text-[11px] bg-red-100 px-2 py-0.5 rounded-md">
              In {summary.daysToNextCompliance} Days
            </span>
          </div>
          <div className="text-sm font-extrabold text-[#1A1C1E] line-clamp-1">
            {summary.nextCompliance ? summary.nextCompliance.title : "No pending filing"}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {summary.nextCompliance ? summary.nextCompliance.date : "N/A"}
          </div>
        </div>

        {/* This Week Summary Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1 flex flex-col justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-700 font-bold">
            <Clock className="h-3.5 w-3.5 text-[#1A2E7E]" /> This Week Overview
          </div>
          <div className="text-xs text-slate-700 font-medium space-y-0.5">
            <div>🎉 <strong className="text-[#1A1C1E]">{summary.thisWeekHolidaysCount}</strong> Holidays</div>
            <div>🔴 <strong className="text-[#1A1C1E]">{summary.thisWeekComplianceCount}</strong> Compliance Deadlines</div>
          </div>
        </div>
      </div>
    </div>
  );
}
