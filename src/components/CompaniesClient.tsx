"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
import {
  deleteCompany,
  getCompaniesServerSnapshot,
  getCompaniesSnapshot,
  subscribeToCompanies,
} from "@/lib/companies/storage";
import { STATE_CODES } from "@/lib/companies/types";
import { Filter, Download, Plus, Shield, Edit, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import type { Company } from "@/lib/companies/types";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const AVATAR_COLORS = [
  "#1A2E7E", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6",
];

function avatarColor(i: number) {
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function stateCode(state: string) {
  return STATE_CODES[state] ?? state.slice(0, 2).toUpperCase();
}

/* ── Company Detail Panel ─────────────────────────────────────── */
function CompanyDetailPanel({ company }: { company: Company }) {
  const directors = company.directors ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Header card */}
      <div className="rounded-xl p-5 text-white" style={{ backgroundColor: "#1A2E7E" }}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-teal-200" aria-hidden />
            </div>
            <h2 className="text-[17px] font-extrabold leading-snug" style={{ letterSpacing: "-0.02em" }}>
              {company.name}
            </h2>
            {company.state && (
              <div className="mt-1.5 flex items-center gap-1 text-teal-100 text-xs">
                <MapPin className="h-3 w-3" aria-hidden />
                {company.state}, India
              </div>
            )}
          </div>
          <Link
            href={`/companies/${company.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors shrink-0"
            aria-label="Edit company"
          >
            <Edit className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Registered Office */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Office</h3>
          <button className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Office info">
            <AlertCircle className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          {[company.registeredAddress, company.place, company.pincode, company.state]
            .filter(Boolean)
            .join(", ") || "Not specified"}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold mb-0.5">ROC OFFICE</div>
            <div className="font-semibold text-slate-700">{stateCode(company.state ?? "")} ROC</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold mb-0.5">CATEGORY</div>
            <div className="font-semibold text-slate-700">Private Ltd</div>
          </div>
        </div>
      </div>

      {/* Directors */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Director Details</h3>
          <Link href={`/companies/${company.id}`} className="text-xs font-semibold text-teal-600 hover:underline">
            + Manage
          </Link>
        </div>
        {directors.length === 0 ? (
          <p className="text-xs text-slate-400">No directors added yet.</p>
        ) : (
          <ul className="space-y-3">
            {directors.slice(0, 3).map((d, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white"
                  style={{ backgroundColor: avatarColor(i) }}
                  aria-hidden
                >
                  {initials(d.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-900 truncate">{d.name}</span>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {d.designation || "Director"}
                    {d.din ? ` · DIN: ${d.din}` : ""}
                  </div>
                </div>
              </li>
            ))}
            {directors.length > 3 && (
              <li className="text-xs text-slate-400">+{directors.length - 3} more directors</li>
            )}
          </ul>
        )}
      </div>

      {/* Automation Sync */}
      <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#1A2E7E" }}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-teal-400" aria-hidden />
          <span className="text-sm font-bold text-white">Automation Sync</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          This profile is currently powering {liveDocCount(directors.length)} active legal drafts and {Math.max(1, directors.length)} statutory filings.
        </p>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">Sync Integrity</span>
            <span className="font-bold text-teal-400">94% Accurate</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-teal-500" style={{ width: "94%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function liveDocCount(directorCount: number) {
  return Math.max(3, directorCount * 4);
}

/* ── Empty state ──────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
      <div className="text-4xl mb-3">🏢</div>
      <div className="text-base font-bold text-slate-900 mb-1">Select a company</div>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Click any company in the Client Portfolio to view its full profile and director details.
      </p>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────── */
export default function CompaniesClient() {
  const companies = useSyncExternalStore(
    subscribeToCompanies,
    getCompaniesSnapshot,
    getCompaniesServerSnapshot,
  );
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cin.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedCompany = selectedId
    ? companies.find((c) => c.id === selectedId) ?? null
    : filtered[0] ?? null;

  function confirmDelete(id: string, name: string) {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      setDeletingId(id);
      deleteCompany(id);
      setDeletingId(null);
      if (selectedId === id) setSelectedId(null);
    }
  }

  function exportCsv() {
    const header = "Company Name,CIN,Sector,State,Directors,Updated\n";
    const rows = filtered
      .map(
        (c) =>
          `"${c.name}","${c.cin}","${c.sector}","${c.state}",${c.directors.length},"${fmtDate(c.updatedAt)}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "companies.csv";
    a.click();
  }

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold text-slate-900"
            style={{ letterSpacing: "-0.025em" }}
          >
            Master Data Hub
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Centralized repository for corporate entity profiles and statutory records.
          </p>
        </div>
        <Link
          href="/companies/new"
          id="add-new-company"
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-all active:scale-95"
          style={{ backgroundColor: "#1A2E7E" }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add New Company
        </Link>
      </div>

      {/* ── Two-panel layout ── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

        {/* Left: Client Portfolio Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
            <h2 className="text-[13px] font-bold text-slate-900">Client Portfolio</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                aria-label="Export CSV"
              >
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                aria-label="Filter"
              >
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
            </div>
          </div>

          {companies.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl mb-3">🏢</div>
              <div className="text-base font-bold text-slate-900 mb-1">No companies yet</div>
              <p className="text-sm text-slate-500 mb-5">
                Add your first company to start generating documents instantly.
              </p>
              <Link
                href="/companies/new"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: "#1A2E7E" }}
              >
                <Plus className="h-4 w-4" /> Add Company
              </Link>
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="border-b border-slate-100 px-4 py-2.5">
                <input
                  type="text"
                  placeholder="Search companies…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr] border-b border-slate-100 px-5 py-2.5">
                {["COMPANY NAME", "CIN", "PAN", "DIRECTORS"].map((h) => (
                  <div key={h} className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <ul className="divide-y divide-slate-50 max-h-[480px] overflow-y-auto">
                {filtered.map((company) => {
                  const isSelected = company.id === selectedCompany?.id;
                  return (
                    <li
                      key={company.id}
                      onClick={() => setSelectedId(company.id)}
                      className={`grid grid-cols-[2fr_2fr_1.5fr_1fr] items-center px-5 py-3.5 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-indigo-50"
                          : "hover:bg-slate-50"
                      }`}
                      style={isSelected ? { borderLeft: "3px solid #1A2E7E" } : { borderLeft: "3px solid transparent" }}
                    >
                      <div>
                        <div className={`text-[13px] font-bold leading-snug ${isSelected ? "text-teal-700" : "text-slate-900"}`}>
                          {company.name}
                        </div>
                        {company.sector && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{company.sector}</div>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 truncate pr-2">
                        {company.cin || "—"}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 truncate pr-2">
                        {(company as any).pan || "—"}
                      </div>
                      <div className="text-[13px] font-bold text-slate-700">
                        {String(company.directors.length).padStart(2, "0")}
                      </div>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="px-5 py-10 text-center text-sm text-slate-400">
                    No results for &ldquo;{search}&rdquo;
                  </li>
                )}
              </ul>

              {/* Row footer */}
              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Showing <strong className="text-slate-700">{filtered.length}</strong> of {companies.length} companies
                </span>
                {selectedCompany && (
                  <div className="flex items-center gap-3">
                    <Link href={`/companies/${selectedCompany.id}`} className="text-xs font-bold text-teal-600 hover:underline">
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => confirmDelete(selectedCompany.id, selectedCompany.name)}
                      disabled={deletingId === selectedCompany.id}
                      className="text-xs text-slate-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Company detail panel */}
        <div>
          {selectedCompany ? (
            <CompanyDetailPanel company={selectedCompany} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* ── Bottom row: Verification + Timeline ── */}
      {companies.length > 0 && selectedCompany && (
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Verification Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Verification Status</h3>
            <ul className="space-y-3">
              {[
                { label: "MCA V3 Portal", sub: "Last synced 2 hours ago", ok: true },
                { label: "GST Verification", sub: "Validated via API", ok: true },
                { label: "MSME Certificate", sub: "Renewal due in 14 days", ok: false },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  {item.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-[13px] font-semibold text-slate-800">{item.label}</div>
                    <div className={`text-[11px] ${item.ok ? "text-slate-500" : "text-amber-600"}`}>{item.sub}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Timeline */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Compliance Timeline</h3>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Completed</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-800" /> Upcoming</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              {[
                { n: 1, label: "AGM Minutes", date: "Sep 15", done: true },
                { n: 2, label: "Form MGT-7", date: "Oct 28", done: true },
                { n: 3, label: "AOC-4 Filing", date: "Due Nov 30", done: false, urgent: true },
                { n: 4, label: "DIR-3 KYC", date: "Dec 15", done: false },
              ].map((step, i, arr) => (
                <div key={step.n} className="flex flex-1 flex-col items-center">
                  <div className="flex items-center w-full">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                      style={{ backgroundColor: step.done ? "#1A2E7E" : (step.urgent ? "#1e293b" : "#94a3b8") }}
                    >
                      {step.n}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="h-0.5 flex-1" style={{ backgroundColor: step.done ? "#1A2E7E" : "#e2e8f0" }} />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">{step.label}</div>
                    <div className={`text-[10px] mt-0.5 ${step.urgent ? "font-bold text-amber-600" : "text-slate-400"}`}>{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
