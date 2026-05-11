"use client";

import Link from "next/link";
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
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 text-center sm:px-6 lg:px-8">
      {/* Auto-sliding Carousel for Hero and How it works */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm min-h-[400px] sm:min-h-[300px]">
        
        {/* Slide 0: Compliance Workspace Hero */}
        <div className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center items-center p-6 sm:p-8 bg-gradient-to-br from-[#1a2e7e] to-[#243a9e] text-white ${activeSlide === 0 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
            Compliance workspace
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Find the right document in one place
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100">
            Save each company once, then open any flow below. Every generator pulls from
            the same profile — add new tools to the catalogue as you grow.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/companies"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#1a2e7e] shadow-sm hover:bg-blue-50"
            >
              Manage companies
            </Link>
            <Link
              href="/companies/new"
              className="inline-flex items-center rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              New company profile
            </Link>
          </div>
        </div>

        {/* Slide 1: How it works */}
        <div className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center items-center bg-[#eef4ff] p-6 sm:p-8 ${activeSlide === 1 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            How it works
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto text-left">
            {[
              {
                step: "1",
                title: "Company data",
                body: "Create or edit a company under Manage companies. Directors and office address stay synced everywhere.",
              },
              {
                step: "2",
                title: "Pick a workflow",
                body: "Company / LLP incorporation, bank account, or GST — open the flow, choose your sub-stage, then generate.",
              },
              {
                step: "3",
                title: "Generate",
                body: "Open a tool, auto-fill from the profile, then download PDF or Word or print.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="flex flex-col items-center text-center gap-3 rounded-lg border border-blue-100 bg-white/90 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                  {item.step}
                </span>
                <div>
                  <div className="font-semibold text-zinc-900">{item.title}</div>
                  <p className="mt-1 text-sm leading-snug text-zinc-600">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          <button 
            onClick={() => setActiveSlide(0)} 
            className={`h-2 w-8 rounded-full transition-colors ${activeSlide === 0 ? 'bg-blue-400' : 'bg-zinc-300'}`} 
            aria-label="Show slide 1"
          />
          <button 
            onClick={() => setActiveSlide(1)} 
            className={`h-2 w-8 rounded-full transition-colors ${activeSlide === 1 ? 'bg-blue-400' : 'bg-zinc-300'}`} 
            aria-label="Show slide 2"
          />
        </div>
      </div>

      {/* Flows */}
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Workflows</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Groups of documents for a typical compliance stage.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {FLOWS.map((flow) => {
            const steps = subflowsForFlow(flow.id).filter(
              (s) => s.variant === "numbered",
            );
            return (
              <Link
                key={flow.id}
                href={flowHref(flow)}
                className="group flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-2xl transition-colors group-hover:bg-blue-50">
                    {flow.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-900 group-hover:text-blue-700">
                      {flow.title}
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{flow.subtitle}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Flow
                  </div>
                  <ol className="mt-1.5 space-y-0.5 text-xs font-medium text-zinc-700">
                    {steps.map((s) => (
                      <li key={s.id} className="flex gap-1.5">
                        <span className="text-zinc-400">{s.order})</span>
                        <span>{s.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
                  Open flow →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All tools catalogue */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">All document tools</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Search every generator. Live tools open the editor; upcoming ones stay
              marked as coming soon.
            </p>
          </div>
          <label className="relative w-full sm:w-64">
            <span className="sr-only">Search tools</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, tag…"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </label>
        </div>
        <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-100">
          {filteredTools.map((t) => (
            <ToolRow key={t.id} tool={t} />
          ))}
        </ul>
        {filteredTools.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">No tools match that search.</p>
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
          <span className="font-medium text-zinc-900">{tool.title}</span>
          {!live ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
              Coming soon
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-800">
              Live
            </span>
          )}
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
            {flow?.title ?? tool.flowId}
            {subflow ? ` · ${subflow.title}` : ""}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-zinc-600">{tool.description}</p>
      </div>
      {href ? (
        <span className="text-sm font-semibold text-blue-600">Open →</span>
      ) : (
        <span className="text-sm text-zinc-400">—</span>
      )}
    </div>
  );

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="flex items-center px-3 py-3 transition-colors hover:bg-blue-50/60 sm:px-4"
        >
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li className="flex items-center px-3 py-3 opacity-75 sm:px-4">{inner}</li>
  );
}
