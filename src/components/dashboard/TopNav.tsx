"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  type GlobalSearchHit,
  searchWorkspace,
} from "@/lib/site/registry";

const MAIN_NAV = [
  { href: "/", label: "WORKSPACE" },
];

const SEARCH_DEBOUNCE_MS = 280;

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function companiesNavActive(pathname: string) {
  return pathname === "/companies" || pathname.startsWith("/companies/");
}

function hitLabel(hit: GlobalSearchHit): string {
  return hit.kind === "flow" ? hit.flow.title : hit.tool.title;
}

function hitSubLabel(hit: GlobalSearchHit): string {
  if (hit.kind === "flow") return "Workflow · " + hit.flow.subtitle;
  const soon =
    hit.tool.status === "coming_soon" ? " · Coming soon" : "";
  return hit.flow.title + soon;
}

function hitHref(hit: GlobalSearchHit): string {
  if (hit.kind === "flow") return `/${hit.flow.path}`;
  if (hit.tool.status === "live" && hit.tool.href && hit.tool.href !== "#") {
    return hit.tool.href;
  }
  return `/${hit.flow.path}`;
}

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const companiesActive = companiesNavActive(pathname);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const brandMenuRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeHitIndex, setActiveHitIndex] = useState(0);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(
    () => searchWorkspace(debouncedSearch, 15),
    [debouncedSearch],
  );

  const searchPending =
    searchQuery.trim().length > 0 && searchQuery !== debouncedSearch;

  useEffect(() => {
    setActiveHitIndex(0);
  }, [debouncedSearch, searchResults.length]);

  useEffect(() => {
    if (!brandMenuOpen) return;
    function handleClose(ev: MouseEvent) {
      if (
        brandMenuRef.current &&
        !brandMenuRef.current.contains(ev.target as Node)
      ) {
        setBrandMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [brandMenuOpen]);

  useEffect(() => {
    setBrandMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    function handleClose(ev: MouseEvent) {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(ev.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [searchOpen]);

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  const showSearchPanel =
    searchOpen &&
    searchQuery.trim().length > 0 &&
    (debouncedSearch.trim().length > 0 || searchPending);

  const goToActiveHit = useCallback(() => {
    if (searchPending) return;
    const hit = searchResults[activeHitIndex];
    if (!hit) return;
    router.push(hitHref(hit));
    setSearchOpen(false);
    setSearchQuery("");
    searchInputRef.current?.blur();
  }, [activeHitIndex, router, searchResults, searchPending]);

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchPanel && e.key === "ArrowDown" && searchQuery.trim()) {
      setSearchOpen(true);
      return;
    }
    if (!showSearchPanel || searchPending || searchResults.length === 0) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveHitIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveHitIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goToActiveHit();
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1a2e7e] text-white shadow-md">
      <div className="mx-auto flex min-h-14 max-w-[1400px] items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
        {/* Brand + workspace menu (Companies lives here — not in main nav) */}
        <div className="relative shrink-0" ref={brandMenuRef}>
          <button
            type="button"
            onClick={() => setBrandMenuOpen((o) => !o)}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left font-bold tracking-tight transition-colors sm:gap-2 sm:px-2.5 ${
              companiesActive
                ? "bg-white/20 text-white"
                : "text-white hover:bg-white/10"
            }`}
            aria-expanded={brandMenuOpen}
            aria-haspopup="menu"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/20 text-sm">
              📋
            </span>
            <span className="hidden text-sm sm:inline">ComplianceDraft</span>
            <svg
              className={`h-4 w-4 shrink-0 opacity-80 transition-transform ${brandMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {brandMenuOpen ? (
            <div
              role="menu"
              className="absolute left-0 top-full z-50 mt-1.5 min-w-[240px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
            >
              <Link
                href="/"
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                onClick={() => setBrandMenuOpen(false)}
              >
                Workspace home
              </Link>
              <Link
                href="/companies"
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                onClick={() => setBrandMenuOpen(false)}
              >
                Registered companies
              </Link>
              <Link
                href="/companies/new"
                role="menuitem"
                className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={() => setBrandMenuOpen(false)}
              >
                New company
              </Link>
            </div>
          ) : null}
        </div>

        {/* Main nav — modules only */}
        <nav
          aria-label="Primary navigation"
          className="-mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-none"
        >
          {MAIN_NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Global search — debounced, dropdown results */}
        <div
          ref={searchWrapRef}
          className="relative ml-auto hidden min-w-0 flex-1 md:block md:max-w-sm"
        >
          <div className="relative w-full">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              role="combobox"
              aria-expanded={showSearchPanel}
              aria-controls="global-search-results"
              aria-autocomplete="list"
              autoComplete="off"
              placeholder="Search tools & workflows…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setSearchOpen(true);
              }}
              onKeyDown={onSearchKeyDown}
              className="w-full rounded-md bg-white/10 py-1.5 pl-8 pr-3 text-sm text-white placeholder:text-blue-300 outline-none focus:bg-white/20"
            />
          </div>

          {showSearchPanel ? (
            <div
              id="global-search-results"
              role="listbox"
              aria-label="Search results"
              className="absolute right-0 top-[calc(100%+6px)] z-50 max-h-[min(70vh,380px)] w-[min(calc(100vw-2rem),22rem)] overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-xl"
              onMouseDown={(e) => e.preventDefault()}
            >
              {searchPending ? (
                <div className="px-3 py-4 text-center text-sm text-zinc-500">
                  Searching…
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-zinc-500">
                  No workflows or tools match &ldquo;{debouncedSearch.trim()}&rdquo;.
                </div>
              ) : (
                searchResults.map((hit, index) => {
                  const href = hitHref(hit);
                  const active = index === activeHitIndex;
                  const icon = hit.kind === "flow" ? hit.flow.icon : hit.tool.icon;
                  return (
                    <Link
                      key={
                        hit.kind === "flow"
                          ? `flow-${hit.flow.id}`
                          : `tool-${hit.tool.id}`
                      }
                      href={href}
                      role="option"
                      aria-selected={active}
                      className={`flex items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                        active ? "bg-blue-50" : "hover:bg-zinc-50"
                      }`}
                      onMouseEnter={() => setActiveHitIndex(index)}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="text-lg leading-none" aria-hidden>
                        {icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-zinc-900">
                          {hitLabel(hit)}
                        </span>
                        <span className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                          {hitSubLabel(hit)}
                        </span>
                      </span>
                      {hit.kind === "tool" &&
                      hit.tool.status === "coming_soon" ? (
                        <span className="shrink-0 self-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-800">
                          Soon
                        </span>
                      ) : (
                        <span className="shrink-0 self-center text-xs text-blue-600">
                          Open
                        </span>
                      )}
                    </Link>
                  );
                })
              )}
            </div>
          ) : null}
        </div>

      </div>
    </header>
  );
}
