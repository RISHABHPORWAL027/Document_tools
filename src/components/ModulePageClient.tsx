"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  getFlow,
  type DocCard,
  type FlowId,
  type WorkflowDocGroup,
} from "@/lib/site/registry";
import {
  getCompaniesServerSnapshot,
  getCompaniesSnapshot,
  subscribeToCompanies,
} from "@/lib/companies/storage";
import type { Company } from "@/lib/companies/types";

export type { DocCard };

interface Props {
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  requiredDocs: string[];
  /** Document generators grouped by workflow step (subflow) */
  docGroups: WorkflowDocGroup[];
  /** When set, shows Workspace → flow title breadcrumbs */
  flowId?: FlowId;
}

export default function ModulePageClient({
  title,
  subtitle,
  icon,
  accentColor,
  requiredDocs,
  docGroups,
  flowId,
}: Props) {
  const companies = useSyncExternalStore(
    subscribeToCompanies,
    getCompaniesSnapshot,
    getCompaniesServerSnapshot,
  );
  const [selectedId, setSelectedId] = useState<string>("");

  const selectedCompany: Company | null =
    companies.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="space-y-5">
      {flowId ? (
        <Breadcrumbs
          items={[
            { label: "Workspace", href: "/" },
            { label: getFlow(flowId).title },
          ]}
        />
      ) : null}
      {/* Header */}
      <div
        className={`overflow-hidden rounded-xl border shadow-sm`}
        style={{ borderColor: `${accentColor}33`, background: `${accentColor}08` }}
      >
        <div className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-sm"
              style={{ background: `${accentColor}20` }}
            >
              {icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
              <p className="mt-0.5 text-sm text-zinc-600">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company selector */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-base font-bold text-zinc-950">
              Select Company
            </div>
            <p className="mt-0.5 text-sm font-medium text-zinc-600">
              Fill company details one time and use them everywhere. No need to
              fill each document again, just select and generate.
            </p>
          </div>
          {companies.length > 0 && (
            <Link
              href="/companies/new"
              className="text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline"
            >
              Add company →
            </Link>
          )}
        </div>
        {companies.length === 0 ? (
          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50/70 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-zinc-800">
              No companies saved yet.
            </span>
            <Link
              href="/companies/new"
              className="inline-flex w-fit items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-800"
            >
              Add a company →
            </Link>
          </div>
        ) : (
          <select
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-400"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">— Choose a company to auto-fill documents —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.cin ? `(${c.cin})` : ""}
              </option>
            ))}
          </select>
        )}
        {selectedCompany && (
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
            <span>
              <span className="font-medium text-zinc-700">Place:</span>{" "}
              {selectedCompany.place || "—"}
            </span>
            <span>
              <span className="font-medium text-zinc-700">PIN:</span>{" "}
              {selectedCompany.pincode || "—"}
            </span>
            <span>
              <span className="font-medium text-zinc-700">State:</span>{" "}
              {selectedCompany.state || "—"}
            </span>
            <span>
              <span className="font-medium text-zinc-700">Directors:</span>{" "}
              {selectedCompany.directors.length}
            </span>
            <span>
              <span className="font-medium text-zinc-700">Email:</span>{" "}
              {selectedCompany.email || "—"}
            </span>
            <Link
              href={`/companies/${selectedCompany.id}`}
              className="font-medium text-blue-600 hover:underline"
            >
              Edit profile →
            </Link>
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Required documents */}
        <div className="rounded-xl border bg-white p-4 shadow-sm lg:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base">📋</span>
            <div className="text-sm font-bold text-zinc-800">
              Required Documents
            </div>
          </div>
          <ul className="space-y-1.5">
            {requiredDocs.map((doc) => (
              <li key={doc} className="flex items-start gap-2 text-sm text-zinc-700">
                <span className="mt-0.5 text-green-500">✓</span>
                {doc}
              </li>
            ))}
          </ul>
        </div>

        {/* Generated documents by workflow step */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="text-sm font-bold text-zinc-800">
              Generate Documents
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
              Flow — child steps
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Pick your structure below; document tools are listed under each step.
              Add new generators in the site registry to attach them to a step.
            </p>
          </div>
          {docGroups.map(({ subflow, docs }) => (
            <section
              key={subflow.id}
              className="scroll-mt-24 border-l-2 border-zinc-200 pl-4 sm:pl-5"
              style={{ borderColor: `${accentColor}40` }}
            >
              <div className="mb-3">
                <h2 className="text-base font-bold text-zinc-900">
                  {subflow.variant === "numbered"
                    ? `${subflow.order}) ${subflow.title}`
                    : subflow.title}
                </h2>
                {subflow.summary ? (
                  <p className="mt-1 text-sm text-zinc-600">{subflow.summary}</p>
                ) : null}
              </div>
              {docs.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-500">
                  No document generators linked to this step yet.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {docs.map((doc) =>
                    renderDocCard(doc, accentColor, selectedId),
                  )}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderDocCard(
  doc: DocCard,
  accentColor: string,
  selectedCompanyId: string,
) {
  const href =
    doc.href === "#"
      ? "#"
      : selectedCompanyId
        ? `${doc.href}?company=${selectedCompanyId}`
        : doc.href;
  const cardClass =
    "group flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all";
  const inner = (
    <>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl transition-all"
        style={{ background: `${accentColor}15` }}
      >
        {doc.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`text-sm font-semibold text-zinc-900 ${doc.comingSoon ? "" : "group-hover:text-blue-700"}`}
          >
            {doc.title}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {doc.comingSoon ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                Soon
              </span>
            ) : null}
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: `${accentColor}15`,
                color: accentColor,
              }}
            >
              {doc.badge}
            </span>
          </div>
        </div>
        <p className="mt-0.5 text-xs text-zinc-500">{doc.description}</p>
        <div
          className={`mt-2 text-xs font-medium ${doc.comingSoon ? "text-zinc-400" : "text-blue-600 group-hover:underline"}`}
        >
          {doc.comingSoon ? "Coming soon" : "Open Generator →"}
        </div>
      </div>
    </>
  );
  if (doc.comingSoon) {
    return (
      <div
        key={doc.id}
        className={`${cardClass} cursor-not-allowed border-dashed opacity-75`}
      >
        {inner}
      </div>
    );
  }
  return (
    <Link
      key={doc.id}
      href={href}
      className={`${cardClass} hover:border-blue-400 hover:shadow-md`}
    >
      {inner}
    </Link>
  );
}
