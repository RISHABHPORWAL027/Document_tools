"use client";

import React from "react";
import { ComplianceItem } from "@/lib/calendars/compliance/types";
import { downloadIcsFile, generateGoogleCalendarUrl } from "@/lib/calendars/compliance/icsGenerator";
import { Bell, Calendar, Download, ExternalLink, X } from "lucide-react";

interface Props {
  item: ComplianceItem | null;
  onClose: () => void;
}

export default function AddToCalendarModal({ item, onClose }: Props) {
  if (!item) return null;

  const gcalUrl = generateGoogleCalendarUrl(item);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1A2E7E]">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#1A1C1E]">Set Compliance Reminder</h3>
              <p className="text-[11px] text-slate-500 font-medium">Add to your calendar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2.5 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A2E7E] bg-blue-100/80 px-2 py-0.5 rounded-md">
            {item.categoryName}
          </span>
          <h4 className="text-sm font-bold text-[#1A1C1E]">{item.title}</h4>
          <div className="text-xs text-slate-600 space-y-1 font-medium">
            <div><strong className="text-slate-800">Due Date:</strong> {item.dueDate}</div>
            <div><strong className="text-slate-800">Applies To:</strong> {item.whoShouldFile}</div>
          </div>
        </div>

        <div className="space-y-2.5">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1A2E7E] py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#12205B] transition-colors"
          >
            <Calendar className="h-4 w-4 text-amber-300" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70 ml-auto" />
          </a>

          <button
            onClick={() => downloadIcsFile(item)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-600" />
            <span>Download .ICS iCal File (Outlook / Apple)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
