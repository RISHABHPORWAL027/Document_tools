"use client";

import React from "react";
import { BreakdownItem } from "@/lib/calculators/types";

interface Props {
  breakdown: BreakdownItem[];
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export default function ResultBreakdown({ breakdown, tableData }: Props) {
  return (
    <div className="space-y-4">
      {/* Detailed Line Items */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Calculation Breakdown
        </h4>
        <div className="divide-y divide-slate-100">
          {breakdown.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-2.5 text-xs sm:text-sm ${
                item.isTotal ? "font-bold text-[#1A2E7E] bg-indigo-50/50 -mx-2 px-2 rounded-md my-1" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={item.isDeduction ? "text-rose-600 font-medium" : item.isTotal ? "font-bold" : "text-slate-700"}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`font-semibold ${
                  item.isDeduction
                    ? "text-rose-600"
                    : item.isTotal
                    ? "text-[#1A2E7E] text-base"
                    : "text-slate-900"
                }`}
              >
                {item.isDeduction && "-"}
                {item.formattedValue}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Amortization / Year Table (if applicable) */}
      {tableData && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs overflow-hidden">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Schedule & Breakdown Table
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  {tableData.headers.map((header, idx) => (
                    <th key={idx} className="px-3 py-2.5 font-bold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2.5 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
