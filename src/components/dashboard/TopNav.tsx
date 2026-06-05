"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { Menu, Search, Building2, ChevronDown } from "lucide-react";
import {
  type GlobalSearchHit,
  searchWorkspace,
} from "@/lib/site/registry";

const SEARCH_DEBOUNCE_MS = 280;

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function hitLabel(hit: GlobalSearchHit): string {
  return hit.kind === "flow" ? hit.flow.title : hit.tool.title;
}

function hitSubLabel(hit: GlobalSearchHit): string {
  if (hit.kind === "flow") return "Workflow · " + hit.flow.subtitle;
  const soon = hit.tool.status === "coming_soon" ? " · Coming soon" : "";
  return hit.flow.title + soon;
}

function hitHref(hit: GlobalSearchHit): string {
  if (hit.kind === "flow") return `/${hit.flow.path}`;
  if (hit.tool.status === "live" && hit.tool.href && hit.tool.href !== "#") {
    return hit.tool.href;
  }
  return `/${hit.flow.path}`;
}

/* ── Breadcrumb helper ─────────────────────────────────────────── */
function useBreadcrumb(pathname: string): string {
  if (pathname === "/") return "Workspace";
  if (pathname.startsWith("/companies/new")) return "New Company";
  if (pathname.startsWith("/companies/")) return "Company Profile";
  if (pathname.startsWith("/companies")) return "Companies";
  if (pathname.startsWith("/incorporation/private-limited")) return "Private Limited Incorporation";
  if (pathname.startsWith("/incorporation/llp")) return "LLP";
  if (pathname.startsWith("/incorporation")) return "Incorporation";
  if (pathname.startsWith("/gst")) return "GST";
  if (pathname.startsWith("/llp")) return "LLP";
  if (pathname.startsWith("/noc-format") || pathname.startsWith("/noc")) return "NOC";
  if (pathname.startsWith("/dir-2-format") || pathname.startsWith("/dir2")) return "DIR-2 Consent Form";
  if (pathname.startsWith("/tools")) return "Document Tool";
  return "Workspace";
}

interface TopNavProps {
  onMenuToggle?: () => void;
}

export default function TopNav({ onMenuToggle }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = useBreadcrumb(pathname);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeHitIndex, setActiveHitIndex] = useState(0);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(
    () => searchWorkspace(debouncedSearch, 12),
    [debouncedSearch],
  );

  const searchPending = searchQuery.trim().length > 0 && searchQuery !== debouncedSearch;
  const showSearchPanel =
    searchOpen &&
    searchQuery.trim().length > 0 &&
    (debouncedSearch.trim().length > 0 || searchPending);

  useEffect(() => { setActiveHitIndex(0); }, [debouncedSearch, searchResults.length]);

  useEffect(() => {
    setBrandMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    function handleClose(ev: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(ev.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [searchOpen]);

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
      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
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

  /* brand menu (company selector) */
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const brandMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!brandMenuOpen) return;
    function handleClose(ev: MouseEvent) {
      if (brandMenuRef.current && !brandMenuRef.current.contains(ev.target as Node)) {
        setBrandMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [brandMenuOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-[56px] items-center gap-2 sm:gap-4 border-b shrink-0 px-3 sm:px-5" style={{ backgroundColor: "#F8F9FF", borderColor: "#C4C6D0" }}>

      {/* ── Mobile hamburger ── */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5 transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" style={{ color: "#1A2E7E" }} />
      </button>

      {/* ── Global search ── */}
      <div ref={searchWrapRef} className="relative flex-1 max-w-sm min-w-0">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: "#44474E" }}
          aria-hidden
        />
        <input
          ref={searchInputRef}
          id="topnav-search"
          type="search"
          role="combobox"
          aria-expanded={showSearchPanel}
          aria-controls="topnav-search-results"
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Quick find tools…"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => { if (searchQuery.trim()) setSearchOpen(true); }}
          onKeyDown={onSearchKeyDown}
          className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition-all focus:ring-2"
          style={{ backgroundColor: "#EFF4FF", borderColor: "#C4C6D0", color: "#1A1C1E" }}
        />

        {showSearchPanel && (
          <div
            id="topnav-search-results"
            role="listbox"
            aria-label="Search results"
            className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-[min(70vh,360px)] w-[min(calc(100vw-2rem),26rem)] overflow-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl"
            onMouseDown={(e) => e.preventDefault()}
          >
            {searchPending ? (
              <div className="px-4 py-4 text-center text-sm text-slate-400">Searching…</div>
            ) : searchResults.length === 0 ? (
              <div className="px-4 py-4 text-center text-sm text-slate-400">
                No results for &ldquo;{debouncedSearch.trim()}&rdquo;
              </div>
            ) : (
              searchResults.map((hit, index) => {
                const href = hitHref(hit);
                const active = index === activeHitIndex;
                const icon = hit.kind === "flow" ? hit.flow.icon : hit.tool.icon;
                return (
                  <Link
                    key={hit.kind === "flow" ? `flow-${hit.flow.id}` : `tool-${hit.tool.id}`}
                    href={href}
                    role="option"
                    aria-selected={active}
                    className={`flex items-start gap-3 px-4 py-2.5 transition-colors ${active ? "bg-slate-50" : "hover:bg-slate-50"}`}
                    onMouseEnter={() => setActiveHitIndex(index)}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  >
                    <span className="text-base leading-none mt-0.5" aria-hidden>{icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold" style={{ color: "#1A1C1E" }}>{hitLabel(hit)}</span>
                      <span className="mt-0.5 line-clamp-1 text-xs" style={{ color: "#44474E" }}>{hitSubLabel(hit)}</span>
                    </span>
                    {hit.kind === "tool" && hit.tool.status === "coming_soon" ? (
                      <span className="shrink-0 self-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase" style={{ backgroundColor: "#EFF4FF", color: "#44474E" }}>Soon</span>
                    ) : (
                      <span className="shrink-0 self-center text-xs font-semibold" style={{ color: "#1A2E7E" }}>Open →</span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── Right utilities ── */}
      <div className="ml-auto flex items-center gap-2">

        {/* Company selector */}
        <div className="relative" ref={brandMenuRef}>
          <button
            type="button"
            onClick={() => setBrandMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
            style={{ borderColor: "#C4C6D0", backgroundColor: "#F8F9FF", color: "#1A1C1E" }}
            aria-expanded={brandMenuOpen}
          >
            <Building2 className="h-3.5 w-3.5" style={{ color: "#1A2E7E" }} aria-hidden />
            <span className="hidden sm:inline">Company Selector</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${brandMenuOpen ? "rotate-180" : ""}`} style={{ color: "#44474E" }} aria-hidden />
          </button>

          {brandMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[200px] rounded-xl border py-1.5 shadow-xl"
              style={{ backgroundColor: "#F8F9FF", borderColor: "#C4C6D0" }}
            >
              <div className="px-3 pt-1.5 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#44474E" }}>Navigate</span>
              </div>
              {[
                { href: "/", label: "Workspace" },
                { href: "/companies", label: "All Companies" },
                { href: "/companies/new", label: "New Company" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: "#1A1C1E" }}
                  onClick={() => setBrandMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Avatar / Logo */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden"
          style={{ backgroundColor: "#F8F9FF", border: "1px solid #C4C6D0" }}
          aria-label="User profile"
        >
          <img
            src="/Assets/logo.webp"
            alt="ComplianceDraft Logo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </header>
  );
}
