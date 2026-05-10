"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getCompaniesServerSnapshot,
  getCompaniesSnapshot,
  subscribeToCompanies,
} from "@/lib/companies/storage";
import type { CompanyProfile } from "@/lib/profiles/types";
import { formatRegisteredOfficeLine, type Company } from "@/lib/companies/types";

import { toCompanyProfile } from "@/lib/profiles/use-profiles";

type Props = {
  onSelect: (profile: CompanyProfile) => void;
  /** Legacy prop — kept for API compat but save is now handled by the Companies page */
  onSaveRequest?: () => CompanyProfile;
  /** e.g. from ?company= — auto-select once when storage is readable */
  initialCompanyId?: string | null;
};

export default function ProfileSelector({
  onSelect,
  initialCompanyId,
}: Props) {
  const companies = useSyncExternalStore(
    subscribeToCompanies,
    getCompaniesSnapshot,
    getCompaniesServerSnapshot,
  );
  const [selectedId, setSelectedId] = useState<string>("");
  const [filled, setFilled] = useState(false);
  const appliedUrlCompanyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initialCompanyId) {
      appliedUrlCompanyRef.current = null;
      return;
    }
    const co = companies.find((c) => c.id === initialCompanyId);
    if (!co) return;
    if (appliedUrlCompanyRef.current === initialCompanyId) return;
    appliedUrlCompanyRef.current = initialCompanyId;
    setSelectedId(initialCompanyId);
    onSelect(toCompanyProfile(co));
    setFilled(true);
  }, [companies, initialCompanyId, onSelect]);

  function handleSelect(id: string) {
    setSelectedId(id);
    const co = companies.find((c) => c.id === id);
    if (co) {
      onSelect(toCompanyProfile(co));
      setFilled(true);
    } else {
      setFilled(false);
    }
  }

  return (
    <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-semibold text-blue-900">Auto-fill from</div>

        {companies.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <span>No companies saved.</span>
            <Link
              href="/companies/new"
              className="font-semibold underline hover:text-blue-900"
            >
              Add company →
            </Link>
          </div>
        ) : (
          <>
            <select
              className="rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={selectedId}
              onChange={(e) => handleSelect(e.target.value)}
            >
              <option value="">— Select saved company —</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {filled && (
              <span className="text-xs font-medium text-green-700">
                ✓ Auto-filled
              </span>
            )}
          </>
        )}

        <Link
          href="/companies"
          className="ml-auto text-xs font-medium text-blue-700 hover:underline"
        >
          Manage Companies →
        </Link>
      </div>
    </div>
  );
}
