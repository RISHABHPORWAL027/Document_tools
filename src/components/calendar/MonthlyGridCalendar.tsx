"use client";

import React, { useState } from "react";
import { ActiveFilters, UnifiedCalendarEvent, getMonthlyCalendarGrid } from "@/lib/calendars/unifiedEngine";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  year: number;
  initialMonth?: number; // 1-12
  selectedState: string;
  filters: ActiveFilters;
  onDateClick: (dateStr: string, events: UnifiedCalendarEvent[]) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function MonthlyGridCalendar({
  year,
  initialMonth = 8, // Default to August or current month
  selectedState,
  filters,
  onDateClick,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth);

  const gridData = getMonthlyCalendarGrid(year, currentMonth, selectedState, filters);

  const handlePrev = () => {
    if (currentMonth === 1) setCurrentMonth(12);
    else setCurrentMonth(currentMonth - 1);
  };

  const handleNext = () => {
    if (currentMonth === 12) setCurrentMonth(1);
    else setCurrentMonth(currentMonth + 1);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      {/* Month Navigation Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-[#1A1C1E] flex items-center gap-2">
          <span>{MONTH_NAMES[currentMonth - 1]} {year}</span>
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-[#1A2E7E] min-w-[100px] text-center">
            {MONTH_NAMES[currentMonth - 1]}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-[11px] font-extrabold text-slate-600 py-2.5 rounded-t-xl">
            {WEEKDAYS.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 border-l border-b border-slate-200 text-xs">
            {/* Empty padding cells */}
            {Array.from({ length: gridData.firstDayPadding }).map((_, idx) => (
              <div
                key={`pad-${idx}`}
                className="min-h-[90px] border-r border-t border-slate-100 bg-slate-50/40 p-2"
              />
            ))}

            {/* Days cells */}
            {gridData.days.map((d) => {
              const hasHoliday = d.events.some((e) => e.isHoliday);
              const hasCompliance = d.events.some((e) => e.isCompliance);

              return (
                <div
                  key={d.dateStr}
                  onClick={() => onDateClick(d.dateStr, d.events)}
                  className={`min-h-[90px] border-r border-t border-slate-200 p-2 transition-all cursor-pointer hover:bg-blue-50/40 group relative ${
                    hasHoliday ? "bg-emerald-50/20" : hasCompliance ? "bg-red-50/15" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-700 text-xs group-hover:text-[#1A2E7E]">
                      {d.dayNumber}
                    </span>
                    {d.events.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {d.events.length} event{d.events.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Event Badges List */}
                  <div className="mt-1.5 space-y-1">
                    {d.events.slice(0, 2).map((evt) => {
                      const isHol = evt.isHoliday;
                      return (
                        <div
                          key={evt.id}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate leading-tight ${
                            isHol
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              : "bg-red-100 text-red-900 border border-red-200"
                          }`}
                        >
                          {isHol ? "🇮🇳 " : "🔴 "}{evt.title}
                        </div>
                      );
                    })}
                    {d.events.length > 2 && (
                      <div className="text-[9px] font-bold text-slate-500 pl-0.5">
                        +{d.events.length - 2} more...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> National Holiday (🇮🇳)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> State Holiday (🗺️)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Bank Holiday (🏦)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Compliance Deadline (🔴)</span>
      </div>
    </div>
  );
}
