"use client";

import React from "react";
import Link from "next/link";
import { SeoCalendarDoc } from "@/data/seoCalendars";
import UnifiedCalendarHubClient from "../calendar/UnifiedCalendarHubClient";
import { Calendar, ChevronRight, HelpCircle, Home, ShieldCheck } from "lucide-react";

interface Props {
  doc: SeoCalendarDoc;
}

export default function CalendarSeoTemplate({ doc }: Props) {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="flex items-center gap-1 hover:text-[#1A2E7E]">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link href="/calendar" className="hover:text-[#1A2E7E]">
            India Calendar
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-[#1A1C1E] font-semibold">{doc.title}</span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0A1238] p-6 sm:p-8 text-white shadow-md space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{doc.trustBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{doc.title}</h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-3xl">{doc.intro}</p>
        </div>

        {/* Embedded Interactive Calendar Tool */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <h2 className="text-lg font-extrabold text-[#1A1C1E] mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#1A2E7E]" /> Live Interactive Calendar Tool
          </h2>
          <UnifiedCalendarHubClient initialYear={doc.year} pageTitle={doc.title} />
        </div>

        {/* Key Highlights Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1A1C1E]">Key Dates Overview ({doc.year})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Event Name</th>
                  <th className="px-4 py-2.5 text-right">Date & Day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {doc.highlights.map((h, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-800 font-bold">{h.label}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-[#1A2E7E]">{h.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Long Form Sections */}
        {doc.sections.map((sec, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#1A1C1E]">{sec.heading}</h2>
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {p}
              </p>
            ))}
          </div>
        ))}

        {/* FAQs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1A1C1E] flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#1A2E7E]" /> Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {doc.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <h3 className="text-xs font-bold text-[#1A1C1E]">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
