"use client";

import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import {
  FLOWS,
  TOOLS,
  subflowsForFlow,
  getSubflow,
  type FlowDefinition,
  type ToolDefinition,
} from "@/lib/site/registry";

function flowHref(flow: FlowDefinition) {
  return `/${flow.path}`;
}

export default function WorkspaceHomeClient() {
  const [query, setQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) => {
      const subTitle = getSubflow(t.flowId, t.subflowId)?.title ?? "";
      const blob = `${t.title} ${t.description} ${t.badge} ${t.flowId} ${subTitle} ${(t.tags ?? []).join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">

      {/* Hero Carousel — Uber style */}
      <div className="relative overflow-hidden" style={{ minHeight: "360px" }}>

        {/* Slide 0 — Workspace Hero */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 flex flex-col justify-center p-8 sm:p-12 bg-white border border-[#eeeeee] text-black ${
            activeSlide === 0 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#888888] mb-3">
            Compliance Workspace
          </p>
          <h1
            className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-black"
            style={{ letterSpacing: "-0.03em" }}
          >
            Find the right<br />document in seconds.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#666666]">
            Save each company once, then open any flow below. Every generator
            pulls from the same profile — no repeated data entry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-bold text-white hover:bg-[#1a1a1a] transition-colors"
            >
              Manage companies
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/companies/new"
              className="inline-flex items-center gap-2 border border-[#d9d9d9] bg-[#f6f6f6] px-5 py-3 text-sm font-bold text-black hover:border-black hover:bg-white transition-colors"
            >
              New company profile
            </Link>
          </div>
        </div>

        {/* Slide 1 — How it works */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 flex flex-col justify-center bg-white border border-[#eeeeee] p-8 sm:p-12 ${
            activeSlide === 1 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#888888] mb-3">
            How it works
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight text-black"
            style={{ letterSpacing: "-0.03em" }}
          >
            Three steps to any document.
          </h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Company data",
                body: "Create or edit a company. Directors and office address stay synced across every document.",
              },
              {
                step: "02",
                title: "Pick a workflow",
                body: "LLP incorporation, bank account, GST — open the flow and choose your sub-stage.",
              },
              {
                step: "03",
                title: "Generate & export",
                body: "Auto-fill from the profile, then download PDF or DOCX or print instantly.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="flex flex-col gap-3 border-t-2 border-[#eeeeee] pt-4"
              >
                <span className="text-[11px] font-black tracking-[0.12em] text-[#888888]">
                  {item.step}
                </span>
                <div className="font-bold text-black text-[15px]">{item.title}</div>
                <p className="text-sm leading-relaxed text-[#666666]">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-5 left-8 flex gap-2 z-20">
          <button
            onClick={() => setActiveSlide(0)}
            className={`h-1 transition-all ${activeSlide === 0 ? "w-8 bg-black" : "w-4 bg-[#d9d9d9]"}`}
            aria-label="Show slide 1"
          />
          <button
            onClick={() => setActiveSlide(1)}
            className={`h-1 transition-all ${activeSlide === 1 ? "w-8 bg-black" : "w-4 bg-[#d9d9d9]"}`}
            aria-label="Show slide 2"
          />
        </div>
      </div>

      {/* Flows section */}
      <section className="text-left">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#eeeeee] pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#888888]">
              Workflows
            </p>
            <h2
              className="mt-1.5 text-xl font-black tracking-tight text-black"
              style={{ letterSpacing: "-0.025em" }}
            >
              Choose a compliance path
            </h2>
            <p className="mt-1 text-sm text-[#666666]">
              Groups of documents for a typical compliance stage.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-[#eeeeee] bg-white px-3 py-2 text-xs font-bold text-black">
            <Layers3 className="h-3.5 w-3.5" aria-hidden />
            {FLOWS.length} workflows
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {FLOWS.map((flow) => {
            const steps = subflowsForFlow(flow.id).filter(
              (s) => s.variant === "numbered",
            );
            return (
              <Link
                key={flow.id}
                href={flowHref(flow)}
                className="group flex min-h-[300px] flex-col overflow-hidden bg-white border border-[#eeeeee] transition-all hover:border-black hover:shadow-xl"
              >
                {/* Color accent line at top */}
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: flow.accentColor }}
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center text-2xl"
                      style={{ backgroundColor: `${flow.accentColor}14` }}
                      aria-hidden
                    >
                      {flow.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold leading-tight text-black transition-colors group-hover:text-black">
                        {flow.title}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-[#666666]">
                        {flow.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#f0f0f0] pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b0b0b0]">
                      Document path
                    </span>
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: `${flow.accentColor}14`,
                        color: flow.accentColor,
                      }}
                    >
                      {steps.length} steps
                    </span>
                  </div>

                  <ol className="mt-3 space-y-2">
                    {steps.slice(0, 4).map((s, index) => (
                      <li key={s.id} className="flex items-center gap-2.5 text-sm text-[#444444]">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: `${flow.accentColor}14`,
                            color: flow.accentColor,
                          }}
                        >
                          {index + 1}
                        </span>
                        <span className="truncate text-[13px]">{s.title}</span>
                      </li>
                    ))}
                    {steps.length > 4 && (
                      <li className="ml-7 text-[13px] font-medium text-[#888888]">
                        and {steps.length - 4} more…
                      </li>
                    )}
                  </ol>

                  <div className="mt-auto pt-5">
                    <span
                      className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white transition-all group-hover:opacity-90"
                      style={{ backgroundColor: flow.accentColor }}
                    >
                      Open workflow
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All tools catalogue */}
      <section className="bg-white border border-[#eeeeee]">
        <div className="border-b border-[#eeeeee] px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              className="text-lg font-black tracking-tight text-black"
              style={{ letterSpacing: "-0.02em" }}
            >
              All document tools
            </h2>
            <p className="mt-1 text-sm text-[#666666]">
              Search every generator. Live tools open the editor; upcoming ones are marked as coming soon.
            </p>
          </div>
          <label className="relative w-full sm:w-64">
            <span className="sr-only">Search tools</span>
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#b0b0b0]"
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
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, tag…"
              className="w-full border border-[#d9d9d9] bg-[#f6f6f6] py-2.5 pl-9 pr-3 text-sm text-black placeholder:text-[#b0b0b0] outline-none focus:border-black focus:bg-white transition-colors"
            />
          </label>
        </div>
        <ul className="divide-y divide-[#f0f0f0]">
          {filteredTools.map((t) => (
            <ToolRow key={t.id} tool={t} />
          ))}
        </ul>
        {filteredTools.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#888888]">
            No tools match that search.
          </p>
        ) : null}
      </section>
    </div>
  );
}

function ToolRow({ tool }: { tool: ToolDefinition }) {
  const flow = FLOWS.find((f) => f.id === tool.flowId);
  const subflow = flow ? getSubflow(flow.id, tool.subflowId) : undefined;
  const live = tool.status === "live";
  const href = live && tool.href !== "#" ? tool.href : null;

  const inner = (
    <div className="flex flex-1 flex-wrap items-center gap-3 sm:gap-4">
      <span className="text-xl" aria-hidden>
        {tool.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[15px] text-black">{tool.title}</span>
          {!live ? (
            <span className="bg-[#f6f6f6] px-2 py-0.5 text-[10px] font-bold uppercase text-[#888888]">
              Coming soon
            </span>
          ) : (
            <span className="bg-black px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Live
            </span>
          )}
          <span className="border border-[#eeeeee] px-2 py-0.5 text-[10px] font-medium text-[#666666]">
            {flow?.title ?? tool.flowId}
            {subflow ? ` · ${subflow.title}` : ""}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-[#666666]">{tool.description}</p>
      </div>
      {href ? (
        <span className="text-sm font-bold text-black">Open →</span>
      ) : (
        <span className="text-sm text-[#d9d9d9]">—</span>
      )}
    </div>
  );

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="flex items-center px-6 py-4 transition-colors hover:bg-[#f6f6f6]"
        >
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li className="flex items-center px-6 py-4 opacity-60">{inner}</li>
  );
}
