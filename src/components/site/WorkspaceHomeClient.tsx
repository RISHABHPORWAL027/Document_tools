"use client";

import Link from "next/link";
import { Search, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  FLOWS,
  TOOLS,
  getSubflow,
  type FlowDefinition,
} from "@/lib/site/registry";

/* ── Category quick pills ──────────────────────────────────────── */
const QUICK_CATS = [
  { icon: "🏛️", label: "Corporate & MCA", href: "/incorporation" },
  { icon: "👥", label: "HR Documents", href: "/noc" },
  { icon: "🧾", label: "GST & Tax", href: "/gst" },
  { icon: "⚖️", label: "Legal Agreements", href: "/incorporation" },
];

/* ── Steps ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Company data",
    body: "Create or edit a company. Directors and office address stay synced across every document.",
  },
  {
    n: "02",
    title: "Pick a workflow",
    body: "LLP incorporation, bank account, GST — open the flow and choose your sub-stage.",
  },
  {
    n: "03",
    title: "Generate & export",
    body: "Auto-fill from the profile, then download PDF or DOCX or print instantly.",
  },
];

function flowHref(flow: FlowDefinition) {
  return `/${flow.path}`;
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function WorkspaceHomeClient() {
  const [query, setQuery] = useState("");
  const catalogueRef = useRef<HTMLDivElement>(null);

  const liveTools = useMemo(() => TOOLS.filter((t) => t.status === "live"), []);
  const recentTools = useMemo(() => liveTools.slice(0, 3), [liveTools]);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) => {
      const subTitle = getSubflow(t.flowId, t.subflowId)?.title ?? "";
      const blob = `${t.title} ${t.description} ${t.badge} ${t.flowId} ${subTitle} ${(t.tags ?? []).join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query]);

  function scrollToCatalogue() {
    catalogueRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-[1440px] w-full space-y-8 sm:space-y-12 px-0 sm:px-8 lg:px-16 py-4 sm:py-6">

      {/* ── BANNER ────────────────────────────────────────────────── */}
      <div className="w-full max-w-lg mx-auto overflow-hidden rounded-2xl shadow-sm border border-slate-200 mt-1 sm:mt-2">
        <img
          src="/Assets/company_banner.webp"
          alt="Company Banner"
          className="w-full h-auto block"
        />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div className="pt-1 sm:pt-2 text-center">
        <h1
          className="text-2xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-tight text-slate-900"
          style={{ letterSpacing: "-0.03em" }}
        >
          Find the right{" "}
          <span style={{ color: "#1A2E7E" }}>document</span>{" "}
          in seconds.
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
          The ultimate productivity suite for CAs, CSs, and corporate lawyers. Instantly draft automated, precision-engineered legal templates and MCA compliance forms.
        </p>

        {/* Search bar */}
        <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="flex items-center flex-1 min-w-0">
            <Search className="ml-4 sm:ml-5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents, forms…"
              className="flex-1 py-3 sm:py-4 px-3 sm:px-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none bg-transparent min-w-0"
              aria-label="Search templates"
              id="home-search"
            />
          </div>
          <button
            onClick={scrollToCatalogue}
            className="mx-2 mb-2 sm:m-1.5 rounded-xl px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 shrink-0"
            style={{ backgroundColor: "#1A2E7E" }}
          >
            Search
          </button>
        </div>

        {/* Category pills */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-0">
          {QUICK_CATS.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-all shadow-sm"
            >
              <span aria-hidden>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── RECENTLY USED ─────────────────────────────────────────── */}
      {!query && (
        <section aria-label="Recently used documents">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-slate-900">Recently Used</h2>
            <button className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
              View History <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    LIVE
                  </span>
                  <span className="text-slate-300 text-lg">⋯</span>
                </div>
                <div className="flex items-start gap-2.5 mb-2">
                  <span className="text-xl shrink-0 mt-0.5" aria-hidden>{tool.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-[13px] text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                      {tool.title}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-normal">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-2 flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="h-3 w-3" aria-hidden />
                  Opened recently
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── TRENDING WORKFLOWS ─────────────────────────────────────── */}
      {!query && (
        <section aria-label="Trending workflows">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-slate-900">Trending Workflows</h2>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp className="h-3 w-3" /> Based on weekly filings
            </span>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_350px]">
            {/* Large featured card */}
            {FLOWS[0] && (
              <Link
                href={flowHref(FLOWS[0])}
                className="group relative flex flex-col overflow-hidden rounded-2xl text-white"
                style={{ backgroundColor: "#1A2E7E", minHeight: "220px" }}
              >
                {/* Decorative circles */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full opacity-10" style={{ backgroundColor: FLOWS[0].accentColor }} />
                <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-10" style={{ backgroundColor: FLOWS[0].accentColor }} />

                <div className="relative z-10 flex flex-1 flex-col p-7">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 w-fit">
                    {FLOWS[0].icon} {FLOWS.length * 2 + 3} STAGES · POPULAR
                  </div>
                  <h3 className="text-2xl font-extrabold leading-tight" style={{ letterSpacing: "-0.02em" }}>
                    {FLOWS[0].title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70 max-w-sm leading-relaxed">
                    {FLOWS[0].subtitle}. Auto-syncs across all forms.
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all group-hover:opacity-90"
                      style={{ backgroundColor: "#1A2E7E" }}
                    >
                      Start Workflow <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] text-white/50">1,240 businesses filed this month</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Two smaller side cards */}
            <div className="flex flex-col gap-4">
              {FLOWS.slice(1, 3).map((flow) => (
                <Link
                  key={flow.id}
                  href={flowHref(flow)}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xl" aria-hidden>{flow.icon}</span>
                    <TrendingUp className="h-3.5 w-3.5 text-teal-500" aria-hidden />
                  </div>
                  <div className="font-bold text-[13px] text-slate-900 group-hover:text-teal-700 transition-colors">
                    {flow.title}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-normal line-clamp-2">
                    {flow.subtitle}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-teal-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    Active now
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── THREE STEPS ───────────────────────────────────────────── */}
      {!query && (
        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm" aria-label="How it works">
          <div className="grid lg:grid-cols-[1fr_280px]">
            <div className="p-8">
              <h2
                className="text-2xl font-extrabold text-slate-900 leading-tight"
                style={{ letterSpacing: "-0.025em" }}
              >
                Three steps to any<br />document.
              </h2>
              <ol className="mt-6 space-y-5">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="text-xs font-extrabold text-slate-400 mt-0.5 w-5 shrink-0">{s.n}</span>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{s.title}</div>
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {/* Illustration placeholder */}
            <div className="hidden lg:flex items-center justify-center bg-slate-50 border-l border-slate-200 p-6">
              <img
                src="/Assets/working.png"
                alt="Document workflow illustration"
                className="max-h-48 w-auto object-contain opacity-90"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── DOCUMENT CATALOGUE ────────────────────────────────────── */}
      <section
        ref={catalogueRef}
        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        id="document-catalogue"
        aria-label="All document tools"
      >
        <div className="border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">All Document Generators</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live tools open the editor. Fill details → export Word or PDF.</p>
          </div>
          {query && (
            <span className="text-xs text-slate-500">
              <strong className="text-slate-800">{filteredTools.length}</strong> results for &ldquo;{query}&rdquo;
            </span>
          )}
        </div>
        <ul className="divide-y divide-slate-100">
          {filteredTools.map((t) => {
            const flow = FLOWS.find((f) => f.id === t.flowId);
            const live = t.status === "live";
            const href = live && t.href !== "#" ? t.href : null;
            const inner = (
              <div className="flex flex-1 items-center gap-2.5 sm:gap-4 min-w-0">
                <span className="text-xl shrink-0" aria-hidden>{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[14px] text-slate-800">{t.title}</span>
                    {!live ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">Coming soon</span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 border border-emerald-100">Live</span>
                    )}
                    <span className="rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      {flow?.title ?? t.flowId}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
                </div>
                {href && <span className="text-xs font-bold text-teal-600 shrink-0">Open →</span>}
              </div>
            );
            return href ? (
              <li key={t.id}>
                <Link href={href} className="flex items-center px-4 sm:px-6 py-3 sm:py-3.5 hover:bg-slate-50 transition-colors group">
                  {inner}
                </Link>
              </li>
            ) : (
              <li key={t.id} className="flex items-center px-4 sm:px-6 py-3 sm:py-3.5 opacity-50">{inner}</li>
            );
          })}
        </ul>
        {filteredTools.length === 0 && (
          <div className="py-14 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">No results for &ldquo;{query}&rdquo;</p>
            <button onClick={() => setQuery("")} className="mt-3 text-xs font-bold text-teal-600 hover:underline">
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* ── REACH-OUT BANNER ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-2xl px-5 sm:px-8 py-8 sm:py-10 shadow-sm"
        style={{ backgroundColor: "#1A2E7E" }}
        aria-label="Contribute and collaborate"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "#1A2E7E" }} />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: "#7c3aed" }} />

        <div className="relative z-10 flex flex-col gap-5 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-teal-300">Open Collaboration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug" style={{ letterSpacing: "-0.025em" }}>
              Want to help us grow this{" "}
              <span className="text-teal-300">template library for CAs &amp; CSs?</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Contribute documents, suggest new templates, or help us onboard more compliance content. We&apos;d love to hear from you.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <a
              href="mailto:porwal027@gmail.com"
              id="reach-out-email"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-slate-900 shadow-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
            >
              Reach out to us
            </a>
            <p className="text-[11px] text-slate-500">We reply within 24 hours</p>
          </div>
        </div>
      </section>

    </div>
  );
}
