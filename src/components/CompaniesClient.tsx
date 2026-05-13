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

export default function CompaniesClient() {
  const companies = useSyncExternalStore(
    subscribeToCompanies,
    getCompaniesSnapshot,
    getCompaniesServerSnapshot,
  );
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cin.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase()),
  );

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

  function confirmDelete(id: string, name: string) {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      setDeletingId(id);
      deleteCompany(id);
      setDeletingId(null);
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
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="border-l-4 border-black pl-4">
          <h1
            className="text-2xl font-black tracking-tight text-black"
            style={{ letterSpacing: "-0.025em" }}
          >
            Registered Companies
          </h1>
          <p className="mt-0.5 text-sm text-[#666666]">
            Central directory for all client entities and their document status.
          </p>
        </div>
        <Link
          href="/companies/new"
          className="flex items-center gap-2 bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1a1a1a] transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          NEW ENTITY
        </Link>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-[#eeeeee] bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#b0b0b0]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[#d9d9d9] bg-[#f6f6f6] py-2 pl-9 pr-3 text-sm text-black placeholder:text-[#b0b0b0] outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 border border-[#d9d9d9] bg-white px-3 py-2 text-xs font-bold text-[#444444] hover:border-black hover:text-black transition-colors uppercase tracking-[0.08em]"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3" />
            </svg>
            CSV
          </button>
        </div>
        <div className="text-xs text-[#888888]">
          Showing{" "}
          <span className="font-bold text-black">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "result" : "results"}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-[#eeeeee] bg-white">
        {filtered.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="text-5xl">🏢</div>
            <div
              className="mt-4 text-lg font-black tracking-tight text-black"
              style={{ letterSpacing: "-0.02em" }}
            >
              {companies.length === 0 ? "No companies yet" : "No results found"}
            </div>
            <p className="mt-1.5 text-sm text-[#666666]">
              {companies.length === 0
                ? "Click NEW ENTITY to add your first company and start generating documents."
                : "Try a different search term."}
            </p>
            {companies.length === 0 && (
              <Link
                href="/companies/new"
                className="mt-5 inline-flex items-center gap-2 bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#1a1a1a] transition-colors"
              >
                + Add Company
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#eeeeee] bg-[#f6f6f6] text-left">
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                  Company Details
                </th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                  Sector
                </th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                  State
                </th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                  Directors
                </th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                  Updated
                </th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {filtered.map((company) => (
                <tr key={company.id} className="hover:bg-[#f6f6f6] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-black">
                      {company.name}
                    </div>
                    {company.cin && (
                      <div className="mt-0.5 text-xs text-[#888888] font-mono">
                        {company.cin}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[#444444]">
                    {company.sector || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {company.state ? (
                      <span className="inline-flex items-center justify-center bg-black px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-[0.08em]">
                        {stateCode(company.state)}
                      </span>
                    ) : (
                      <span className="text-[#b0b0b0]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-black">
                      {company.directors.length}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#888888]">
                    {fmtDate(company.updatedAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/companies/${company.id}`}
                        className="text-sm font-bold text-black hover:underline underline-offset-2"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => confirmDelete(company.id, company.name)}
                        disabled={deletingId === company.id}
                        className="text-sm text-[#888888] hover:text-black disabled:opacity-40 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
