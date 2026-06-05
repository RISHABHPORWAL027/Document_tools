"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import LegalDatePicker from "@/components/LegalDatePicker";
import { downloadDocx } from "@/lib/render/docx-client";
import { downloadPdf } from "@/lib/render/pdf-client";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import type { CompanyProfile } from "@/lib/profiles/types";
import { getRelatedDocs } from "@/lib/site/registry";
import {
  buildReappointmentHtml,
  formatReappointmentDate,
  type AuditorReappointmentData,
  type ReappointmentDirector,
  type ReappointmentDocumentKind,
} from "@/lib/pvt-ltd/auditor-reappointment/reappointment-html";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";

const DOCUMENT_META: Record<
  ReappointmentDocumentKind,
  {
    title: string;
    description: string;
    filePrefix: string;
    iframeTitle: string;
  }
> = {
  "agm-resolution": {
    title: "AGM Resolution - Reappointment of Auditor",
    description: "Ordinary resolution passed at AGM for statutory auditor reappointment.",
    filePrefix: "AGM_Resolution_Auditor_Reappointment",
    iframeTitle: "AGM Resolution Preview",
  },
  "appointment-letter": {
    title: "Appointment Letter - Reappointment of Auditor",
    description: "Company letter informing the audit firm of reappointment for five financial years.",
    filePrefix: "Appointment_Letter_Auditor_Reappointment",
    iframeTitle: "Appointment Letter Preview",
  },
  "acceptance-letter": {
    title: "Acceptance Letter - Reappointment of Auditor",
    description: "Auditor acceptance letter for reappointment as statutory auditor.",
    filePrefix: "Acceptance_Letter_Auditor_Reappointment",
    iframeTitle: "Acceptance Letter Preview",
  },
  "consent-certificate": {
    title: "Consent Letter and Certificate - Reappointment of Auditor",
    description: "Eligibility certificate and consent under sections 139 and 141.",
    filePrefix: "Consent_Certificate_Auditor_Reappointment",
    iframeTitle: "Consent and Certificate Preview",
  },
};

const DOCUMENT_TOOL_IDS: Record<ReappointmentDocumentKind, string> = {
  "agm-resolution": "auditor-ra-agm-resolution",
  "appointment-letter": "auditor-ra-appointment-letter",
  "acceptance-letter": "auditor-ra-acceptance-letter",
  "consent-certificate": "auditor-ra-consent-certificate",
};

function directorsFromProfile(profile: CompanyProfile): ReappointmentDirector[] {
  const directors = profile.directors.map((director) => ({
    name: director.directorName || "",
    din: director.din || "",
    designation: director.designation || "DIRECTOR",
  }));

  return directors.length > 0
    ? directors
    : [
        { name: "", din: "", designation: "DIRECTOR" },
        { name: "", din: "", designation: "DIRECTOR" },
      ];
}

function initialData(): AuditorReappointmentData {
  const year = new Date().getFullYear().toString();
  return {
    documentDate: new Date().toISOString().split("T")[0],
    appointmentLetterDate: "",
    companyName: "",
    companyCin: "",
    registeredOfficeAddress: "",
    companyContactNo: "",
    companyEmail: "",
    companyPlace: "",
    meetingDay: "",
    meetingDayOfMonth: "",
    meetingMonth: "",
    meetingYear: year,
    meetingDateDisplay: "",
    meetingTime: "",
    auditorFirmName: "",
    auditorFirmType: "CHARTERED ACCOUNTANTS",
    auditorFirmAddress: "",
    auditorFrn: "",
    auditorName: "",
    auditorDesignation: "PROPRIETOR",
    membershipNo: "",
    financialYearEnd: year,
    directors: [
      { name: "", din: "", designation: "DIRECTOR" },
      { name: "", din: "", designation: "DIRECTOR" },
    ],
  };
}

function fileSafe(value: string): string {
  return (value || "Company").replace(/\s+/g, "_").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 34);
}

type Props = {
  documentType: ReappointmentDocumentKind;
};

export default function ReappointmentDocumentPage({ documentType }: Props) {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState<AuditorReappointmentData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("auditor_reappointment_draft");
        if (saved) return JSON.parse(saved);
      } catch (err) {
        // ignore
      }
    }
    return initialData();
  });
  const [busy, setBusy] = useState(false);
  const meta = DOCUMENT_META[documentType];
  const needsDirectors =
    documentType === "agm-resolution" || documentType === "appointment-letter";
  const needsAppointmentDate = documentType === "acceptance-letter";
  const needsFirmAddress = documentType === "appointment-letter";

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    companyCin: (p) => p.cin || "",
    registeredOfficeAddress: (p) => p.registeredAddress || "",
    companyContactNo: (p) => p.mobileNumber || "",
    companyEmail: (p) => p.email || "",
    companyPlace: (p) => p.place || "",
    directors: directorsFromProfile,
  });

  function update<K extends keyof AuditorReappointmentData>(
    field: K,
    value: AuditorReappointmentData[K],
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    sessionStorage.setItem("auditor_reappointment_draft", JSON.stringify(data));
  }, [data]);

  function updateDirector(
    index: number,
    field: keyof ReappointmentDirector,
    value: string,
  ) {
    const directors = [...data.directors];
    directors[index] = { ...directors[index], [field]: value };
    update("directors", directors);
  }

  function applyProfile(nextProfile: CompanyProfile) {
    setData((prev) => ({
      ...prev,
      companyName: nextProfile.companyName || "",
      companyCin: nextProfile.cin || "",
      registeredOfficeAddress: nextProfile.registeredAddress || "",
      companyContactNo: nextProfile.mobileNumber || "",
      companyEmail: nextProfile.email || "",
      companyPlace: nextProfile.place || "",
      directors: directorsFromProfile(nextProfile),
    }));
  }

  const previewHtml = useMemo(
    () => buildReappointmentHtml(documentType, data),
    [data, documentType],
  );

  const relatedDocs = useMemo(() => {
    const currentToolId = DOCUMENT_TOOL_IDS[documentType];
    return getRelatedDocs(currentToolId, "inc-auditor-reappointment");
  }, [documentType]);

  async function download(format: "pdf" | "docx") {
    setBusy(true);
    try {
      const fileName = `${meta.filePrefix}_${fileSafe(data.companyName)}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fileName);
      } else {
        await downloadDocx(previewHtml, fileName);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to generate document";
      alert("Error: " + message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DocumentEditorLayout
      title={meta.title}
      description={meta.description}
      companyId={companyId}
      onProfileSelect={applyProfile}
      busy={busy}
      onDownload={download}
      previewHtml={previewHtml}
      iframeTitle={meta.iframeTitle}
      relatedDocs={relatedDocs}
      inputSection={
        <>
          <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Company and AGM Details
            </h2>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-zinc-500">
                Company Name
              </label>
              <input
                className={inputClass}
                value={data.companyName}
                onChange={(e) => update("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-zinc-500">
                CIN
              </label>
              <input
                className={inputClass}
                value={data.companyCin}
                onChange={(e) => update("companyCin", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-zinc-500">
                Registered Office
              </label>
              <textarea
                className={inputClass}
                rows={2}
                value={data.registeredOfficeAddress}
                onChange={(e) => update("registeredOfficeAddress", e.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Contact No.
                </label>
                <input
                  className={inputClass}
                  value={data.companyContactNo}
                  onChange={(e) => update("companyContactNo", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Email
                </label>
                <input
                  type="email"
                  className={inputClass}
                  value={data.companyEmail}
                  onChange={(e) => update("companyEmail", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Document Date
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={data.documentDate}
                  onChange={(e) => update("documentDate", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Place
                </label>
                <input
                  className={inputClass}
                  value={data.companyPlace}
                  onChange={(e) => update("companyPlace", e.target.value)}
                />
              </div>
            </div>
            {needsAppointmentDate ? (
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Appointment Letter Date
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={data.appointmentLetterDate}
                  onChange={(e) => update("appointmentLetterDate", e.target.value)}
                />
                <div className="text-[10px] text-zinc-400">
                  Preview:{" "}
                  {formatReappointmentDate(data.appointmentLetterDate) ||
                    formatReappointmentDate(data.documentDate) ||
                    "Not selected"}
                </div>
              </div>
            ) : null}
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-zinc-500">
                AGM Date
              </label>
              <LegalDatePicker
                className={inputClass}
                onChange={(parts) => {
                  update("meetingDay", parts.weekdayLower);
                  update("meetingDayOfMonth", parts.ordinalDayLower);
                  update("meetingMonth", parts.monthNameLower);
                  update("meetingYear", parts.year);
                  update(
                    "meetingDateDisplay",
                    `${parts.weekdayLower}, the ${parts.ordinalDayLower} ${parts.monthNameLower} ${parts.year}`,
                  );
                }}
              />
              <div className="text-[10px] text-zinc-400">
                Preview:{" "}
                {data.meetingDay
                  ? `${data.meetingDay}, the ${data.meetingDayOfMonth} Day of ${data.meetingMonth} ${data.meetingYear}`
                  : "Not selected"}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  AGM Time
                </label>
                <input
                  type="time"
                  className={inputClass}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;
                    const [hoursText, minutes] = value.split(":");
                    let hours = Number.parseInt(hoursText, 10);
                    const suffix = hours >= 12 ? "P.M." : "A.M.";
                    hours = hours % 12 || 12;
                    update("meetingTime", `${hours}.${minutes} ${suffix}`);
                  }}
                />
                <div className="text-[10px] text-zinc-400">
                  Preview: {data.meetingTime || "Not selected"}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Financial Year End
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. 2029"
                  value={data.financialYearEnd}
                  onChange={(e) => update("financialYearEnd", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Auditor Firm Details
            </h2>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-zinc-500">
                Firm Name
              </label>
              <input
                className={inputClass}
                placeholder="e.g. XYZ & Company"
                value={data.auditorFirmName}
                onChange={(e) => update("auditorFirmName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-zinc-500">
                Firm Type / Professional Designation
              </label>
              <input
                className={inputClass}
                placeholder="e.g. CHARTERED ACCOUNTANTS"
                value={data.auditorFirmType}
                onChange={(e) => update("auditorFirmType", e.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  FRN
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. 123456W"
                  value={data.auditorFrn}
                  onChange={(e) => update("auditorFrn", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Membership No.
                </label>
                <input
                  className={inputClass}
                  value={data.membershipNo}
                  onChange={(e) => update("membershipNo", e.target.value)}
                />
              </div>
            </div>
            {needsFirmAddress ? (
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Firm Address
                </label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={data.auditorFirmAddress}
                  onChange={(e) => update("auditorFirmAddress", e.target.value)}
                />
              </div>
            ) : null}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Auditor Name
                </label>
                <input
                  className={inputClass}
                  value={data.auditorName}
                  onChange={(e) => update("auditorName", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-zinc-500">
                  Designation
                </label>
                <input
                  className={inputClass}
                  value={data.auditorDesignation}
                  onChange={(e) => update("auditorDesignation", e.target.value)}
                />
              </div>
            </div>
          </div>

          {needsDirectors ? (
            <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Director Signatories
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    update("directors", [
                      ...data.directors,
                      { name: "", din: "", designation: "DIRECTOR" },
                    ])
                  }
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  + Add Director
                </button>
              </div>
              {data.directors.map((director, index) => (
                <div key={index} className="space-y-3 rounded-lg border bg-zinc-50 p-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Director #{index + 1}
                    </span>
                    {data.directors.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          update(
                            "directors",
                            data.directors.filter((_, idx) => idx !== index),
                          )
                        }
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase text-zinc-500">
                      Name
                    </label>
                    <input
                      className={inputClass}
                      value={director.name}
                      onChange={(e) => updateDirector(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-zinc-500">
                        DIN
                      </label>
                      <input
                        className={inputClass}
                        value={director.din}
                        onChange={(e) => updateDirector(index, "din", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium uppercase text-zinc-500">
                        Designation
                      </label>
                      <input
                        className={inputClass}
                        value={director.designation}
                        onChange={(e) =>
                          updateDirector(index, "designation", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </>
      }
    />
  );
}
