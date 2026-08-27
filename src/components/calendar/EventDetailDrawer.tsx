"use client";

import React from "react";
import { UnifiedCalendarEvent } from "@/lib/calendars/unifiedEngine";
import { downloadIcsFile, generateGoogleCalendarUrl } from "@/lib/calendars/compliance/icsGenerator";
import { AlertTriangle, Bell, Calendar, ExternalLink, X } from "lucide-react";

interface Props {
  dateStr: string | null;
  events: UnifiedCalendarEvent[];
  onClose: () => void;
}

export default function EventDetailDrawer({ dateStr, events, onClose }: Props) {
  if (!dateStr) return null;

  const formattedDate = new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-[#1A2E7E]">Date Overview</span>
            <h3 className="text-lg font-extrabold text-[#1A1C1E]">{formattedDate}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No public holidays or compliance deadlines on this date.
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((e) => (
              <div
                key={e.id}
                className={`rounded-2xl border p-5 space-y-3 shadow-xs ${
                  e.isHoliday
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-red-200 bg-red-50/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      e.isHoliday
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {e.categoryName}
                  </span>
                  {e.isBankClosed && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      🏦 Bank Closed
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-[#1A1C1E]">{e.title}</h4>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{e.subtitle}</p>
                </div>

                {e.isCompliance && e.rawCompliance && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="text-slate-600 font-medium">
                      <strong className="text-slate-800">Who must file:</strong> {e.rawCompliance.whoShouldFile}
                    </div>
                    {e.rawCompliance.penaltyInfo && (
                      <div className="text-amber-800 bg-amber-50 p-2 rounded-lg text-[11px] font-semibold border border-amber-200">
                        ⚠️ {e.rawCompliance.penaltyInfo}
                      </div>
                    )}
                    <div className="pt-2 flex gap-2">
                      <a
                        href={generateGoogleCalendarUrl(e.rawCompliance)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-[#1A2E7E] text-white text-xs font-bold hover:bg-[#12205B]"
                      >
                        <Calendar className="h-3.5 w-3.5 text-amber-300" />
                        <span>Google Calendar</span>
                      </a>
                      <button
                        onClick={() => downloadIcsFile(e.rawCompliance!)}
                        className="flex items-center justify-center px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold hover:bg-slate-50"
                      >
                        .ICS
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
