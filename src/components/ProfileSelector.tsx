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
    <div className="mb-4 border border-[#eeeeee] bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#888888]">
          Auto-fill from
        </span>

        {companies.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <span>No companies saved.</span>
            <Link
              href="/companies/new"
              className="font-bold text-black underline underline-offset-2 hover:no-underline"
            >
              Add company →
            </Link>
          </div>
        ) : (
          <>
            <select
              className="border border-[#d9d9d9] bg-[#f6f6f6] px-3 py-1.5 text-sm text-black focus:outline-none focus:border-black focus:bg-white transition-colors"
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
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-black">
                ✓ Auto-filled
              </span>
            )}
          </>
        )}

        <Link
          href="/companies"
          className="ml-auto text-xs font-bold text-[#888888] hover:text-black transition-colors"
        >
          Manage Companies →
        </Link>
      </div>
    </div>
  );
}
