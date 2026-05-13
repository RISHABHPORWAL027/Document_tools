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
    <header className="sticky top-0 z-40 bg-black text-white border-b border-white/10">
      <div className="mx-auto flex min-h-[60px] max-w-[1400px] items-center gap-4 px-4 py-2 sm:px-6">

        {/* Brand */}
        <div className="relative shrink-0" ref={brandMenuRef}>
          <button
            type="button"
            onClick={() => setBrandMenuOpen((o) => !o)}
            className={`flex items-center gap-2.5 rounded-none px-2 py-2 text-left transition-colors ${
              companiesActive
                ? "text-white"
                : "text-white hover:text-white/70"
            }`}
            aria-expanded={brandMenuOpen}
            aria-haspopup="menu"
          >
            {/* Uber-style wordmark */}
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-black text-sm font-black"
              style={{ background: "#ffffff" }}
            >
              CD
            </span>
            <span className="hidden text-[15px] font-bold tracking-tight sm:inline">
              ComplianceDraft
            </span>
            <svg
              className={`h-3.5 w-3.5 shrink-0 opacity-60 transition-transform ${brandMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {brandMenuOpen ? (
            <div
              role="menu"
              className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-none border border-white/10 bg-black py-1 shadow-2xl"
            >
              <div className="px-4 pt-2 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                  Navigation
                </span>
              </div>
              <Link
                href="/"
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                onClick={() => setBrandMenuOpen(false)}
              >
                Workspace home
              </Link>
              <Link
                href="/companies"
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                onClick={() => setBrandMenuOpen(false)}
              >
                Registered companies
              </Link>
              <Link
                href="/companies/new"
                role="menuitem"
                className="block px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => setBrandMenuOpen(false)}
              >
                New company
              </Link>
            </div>
          ) : null}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-white/20 shrink-0" />

        {/* Main nav */}
        <nav
          aria-label="Primary navigation"
          className="-mx-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-none"
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
                className={`shrink-0 rounded-none px-4 py-2 text-xs font-bold tracking-[0.12em] transition-colors border-b-2 ${
                  active
                    ? "border-white text-white"
                    : "border-transparent text-white/50 hover:text-white hover:border-white/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Global search */}
        <div
          ref={searchWrapRef}
          className="relative ml-auto hidden min-w-0 flex-1 md:block md:max-w-sm"
        >
          <div className="relative w-full">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40"
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
              className="w-full rounded-none border border-white/20 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-white/50 transition-colors"
            />
          </div>

          {showSearchPanel ? (
            <div
              id="global-search-results"
              role="listbox"
              aria-label="Search results"
              className="absolute right-0 top-[calc(100%+4px)] z-50 max-h-[min(70vh,380px)] w-[min(calc(100vw-2rem),22rem)] overflow-auto border border-white/10 bg-black py-1 shadow-2xl"
              onMouseDown={(e) => e.preventDefault()}
            >
              {searchPending ? (
                <div className="px-4 py-4 text-center text-sm text-white/40">
                  Searching…
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-4 text-center text-sm text-white/40">
                  No results for &ldquo;{debouncedSearch.trim()}&rdquo;
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
                      className={`flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                        active ? "bg-white/10" : "hover:bg-white/5"
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
                        <span className="block text-sm font-semibold text-white">
                          {hitLabel(hit)}
                        </span>
                        <span className="mt-0.5 line-clamp-2 text-xs text-white/40">
                          {hitSubLabel(hit)}
                        </span>
                      </span>
                      {hit.kind === "tool" &&
                      hit.tool.status === "coming_soon" ? (
                        <span className="shrink-0 self-center rounded-none bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-white/60">
                          Soon
                        </span>
                      ) : (
                        <span className="shrink-0 self-center text-xs font-semibold text-white/50">
                          Open →
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
