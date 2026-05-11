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
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">
            Registered Companies
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Central directory for all client entities and their document status.
          </p>
        </div>
        <Link
          href="/companies/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          NEW ENTITY
        </Link>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
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
              className="rounded-lg border border-zinc-200 py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-400"
            />
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3" />
            </svg>
            CSV
          </button>
        </div>
        <div className="text-sm text-zinc-500">
          Showing{" "}
          <span className="font-semibold text-zinc-900">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "result" : "results"}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="text-4xl">🏢</div>
            <div className="mt-3 text-base font-semibold text-zinc-700">
              {companies.length === 0 ? "No companies yet" : "No results found"}
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              {companies.length === 0
                ? "Click NEW ENTITY to add your first company and start generating documents."
                : "Try a different search term."}
            </p>
            {companies.length === 0 && (
              <Link
                href="/companies/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                + Add Company
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50 text-left">
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Company Details
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Sector
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  State
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Directors
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Updated
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((company) => (
                <tr key={company.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-zinc-900">
                      {company.name}
                    </div>
                    {company.cin && (
                      <div className="mt-0.5 text-xs text-zinc-400">
                        {company.cin}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {company.sector || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {company.state ? (
                      <span className="inline-flex items-center justify-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                        {stateCode(company.state)}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-900">
                      {company.directors.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {fmtDate(company.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/companies/${company.id}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => confirmDelete(company.id, company.name)}
                        disabled={deletingId === company.id}
                        className="text-red-500 hover:underline disabled:opacity-50"
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
