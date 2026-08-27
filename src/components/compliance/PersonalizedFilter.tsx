"use client";

import React from "react";
import { BusinessEntityType } from "@/lib/calendars/compliance/types";
import { Building2, CheckSquare, ShieldCheck } from "lucide-react";

interface Props {
  selectedEntity: string;
  onEntityChange: (entity: string) => void;
}

const ENTITY_OPTIONS: { id: string; label: string; desc: string }[] = [
  { id: "all", label: "All Businesses", desc: "Show complete statutory compliance schedule" },
  { id: "pvt_ltd", label: "Private Limited Company", desc: "GST + Income Tax + ROC (AOC-4, MGT-7) + DIR-3 KYC" },
  { id: "llp", label: "Limited Liability Partnership (LLP)", desc: "GST + Income Tax + Form 11 + Form 8 LLP" },
  { id: "proprietorship", label: "Proprietorship / Sole Trader", desc: "GST + Income Tax ITR-3/4 + TDS" },
  { id: "gst_registered", label: "GST Registered Business", desc: "GSTR-1, GSTR-3B, CMP-08, GSTR-9" },
  { id: "employer", label: "Employer / Company with Staff", desc: "TDS 24Q, PF/ESI, Form 16, Salary Compliance" },
];

export default function PersonalizedFilter({ selectedEntity, onEntityChange }: Props) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/70 via-white to-blue-50/30 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#1A1C1E] flex items-center gap-2">
          <Building2 className="h-4 w-4 text-[#1A2E7E]" />
          Personalized Compliance Filter: What type of business do you have?
        </h3>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Filter Applied
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ENTITY_OPTIONS.map((opt) => {
          const active = selectedEntity === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onEntityChange(opt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                active
                  ? "border-[#1A2E7E] bg-white shadow-xs ring-2 ring-[#1A2E7E]/20"
                  : "border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className={`mt-0.5 shrink-0 ${active ? "text-[#1A2E7E]" : "text-slate-400"}`}>
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`block text-xs font-bold ${active ? "text-[#1A2E7E]" : "text-[#1A1C1E]"}`}>
                  {opt.label}
                </span>
                <span className="block text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {opt.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
