"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ComplianceItem } from "@/lib/calendars/compliance/types";
import { COMPLIANCE_CATEGORIES } from "@/lib/calendars/compliance/complianceData";
import PersonalizedFilter from "./PersonalizedFilter";
import AddToCalendarModal from "./AddToCalendarModal";
import { AlertTriangle, Bell, Calendar as CalendarIcon, ChevronRight, ExternalLink, Filter, Home, Search, ShieldCheck, Sparkles } from "lucide-react";

interface Props {
  initialItems: ComplianceItem[];
  activeCategory?: string;
  activeMonthYear?: string;
  headingTitle?: string;
  headingDescription?: string;
}

export default function ComplianceHubClient({
  initialItems,
  activeCategory = "all",
  activeMonthYear = "all",
  headingTitle = "India Compliance Calendar 2026",
  headingDescription = "Stay updated with upcoming GST, Income Tax, TDS, ROC, and statutory due dates. Never miss a tax filing deadline.",
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategory);
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalItem, setActiveModalItem] = useState<ComplianceItem | null>(null);

  const filteredItems = initialItems.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesEntity = selectedEntity === "all" || item.applicableEntities.includes(selectedEntity as any);
    const blob = `${item.title} ${item.description} ${item.whoShouldFile} ${item.categoryName}`.toLowerCase();
    const matchesSearch = !searchQuery || blob.includes(searchQuery.toLowerCase().trim());
    return matchesCat && matchesEntity && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-8">
      {/* Modal */}
      <AddToCalendarModal item={activeModalItem} onClose={() => setActiveModalItem(null)} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/" className="flex items-center gap-1 hover:text-[#1A2E7E]">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-[#1A1C1E] font-semibold">Compliance Calendar</span>
      </nav>

      {/* Hero Header */}
      <div className="rounded-2xl border border-[#CBDBF5] bg-linear-to-br from-[#1A2E7E] via-[#12205B] to-[#0A1238] p-6 sm:p-8 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Statutory Compliance Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{headingTitle}</h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">{headingDescription}</p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <Link
              href="/compliance-calendar/today"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-600 transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Due Today</span>
            </Link>
            <Link
              href="/compliance-calendar/this-week"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white border border-white/20 hover:bg-white/25 transition-colors"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Due This Week</span>
            </Link>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
          <Link
            href="/compliance-calendar"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === "all" ? "bg-white text-[#1A2E7E]" : "bg-white/10 text-white hover:bg-white/20"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All Deadlines
          </Link>
          {COMPLIANCE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/compliance-calendar/${cat.slug}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id ? "bg-white text-[#1A2E7E]" : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Personalized Entity Selector */}
      <PersonalizedFilter selectedEntity={selectedEntity} onEntityChange={setSelectedEntity} />

      {/* Search & Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search compliance (e.g., GSTR-3B, TDS, AOC-4)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 bg-white focus:border-[#1A2E7E] outline-hidden shadow-2xs"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="font-extrabold text-[#1A1C1E]">{filteredItems.length}</span> compliance deadlines
        </div>
      </div>

      {/* List of Compliance Deadlines */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-sm">
            No compliance due dates match your active filters.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isRed = item.badgeColor === "red" || item.isUrgent;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  isRed ? "border-red-200 bg-red-50/20" : "border-slate-200 hover:border-[#1A2E7E]"
                }`}
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A2E7E] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {item.categoryName}
                    </span>
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-[#1A2E7E]" /> Due: {item.dueDate}
                    </span>
                    {isRed && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                        High Priority
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-[#1A1C1E]">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.description}</p>
                  
                  <div className="text-[11px] text-slate-500 font-medium pt-1">
                    <strong className="text-slate-700">Applies to:</strong> {item.whoShouldFile}
                  </div>

                  {item.penaltyInfo && (
                    <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 inline-block">
                      ⚠️ Penalty Note: {item.penaltyInfo}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap md:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1A2E7E] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#12205B] transition-colors"
                  >
                    <Bell className="h-3.5 w-3.5 text-amber-300" />
                    <span>Set Reminder</span>
                  </button>

                  {item.officialLink && (
                    <a
                      href={item.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
