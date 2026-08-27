"use client";

import React from "react";
import { HolidayItem } from "@/lib/calendars/holidays/types";
import { Calendar, Tag } from "lucide-react";

interface Props {
  holidays: HolidayItem[];
  title?: string;
}

export default function HolidayTable({ holidays, title = "Holidays List" }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#1A1C1E] flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#1A2E7E]" />
          {title} ({holidays.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Holiday Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Applicable States</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-[#1A1C1E]">
            {holidays.map((h) => {
              const formattedDate = new Date(h.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-[#1A2E7E] whitespace-nowrap">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{h.dayName}</td>
                  <td className="px-4 py-3.5 font-bold">
                    <div className="flex items-center gap-2">
                      <span>{h.title}</span>
                      {h.longWeekendEligible && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Long Weekend 🎉
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      <Tag className="h-3 w-3 text-slate-500" />
                      {h.categoryName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">
                    {h.states.includes("all") ? (
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        All India (National)
                      </span>
                    ) : (
                      <span className="capitalize font-medium">{h.states.join(", ").replace(/-/g, " ")}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
