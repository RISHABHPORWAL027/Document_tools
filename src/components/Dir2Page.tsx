"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import ProfileSelector from "@/components/ProfileSelector";
import type { CompanyProfile, DirectorProfile } from "@/lib/profiles/types";

type CompanyItem = {
  companyName: string;
  designation: string;
};

type MembershipItem = {
  instituteName: string;
  membershipNumber: string;
  certificateOfPracticeNumber: string;
};

type Dir2FormData = {
  companyName: string;
  directorName: string;
  din: string;
  fatherName: string;
  address: string;
  email: string;
  mobileNumber: string;
  pan: string;
  occupation: string;
  dateOfBirth: string;
  nationality: string;
  existingDirectorships: string;
  directorCompanies: CompanyItem[];
  /** Free-text for item 11 (also auto-filled from company profile) */
  priorDirectorshipDetails: string;
  professionalMembership: MembershipItem[];
  place: string;
  date: string;
  identityProofName: string;
  addressProofName: string;
  /** If no file upload — type what document is attached (e.g. "Aadhaar copy") */
  identityProofDetails: string;
  addressProofDetails: string;
  signatureImage?: string;
};

const designationOptions = [
  "Director",
  "Managing Director",
  "CEO",
  "Whole Time Director",
  "Company Secretary",
  "CFO",
  "Manager",
];

function isoToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function createInitialFormData(): Dir2FormData {
  return {
    companyName: "",
    directorName: "",
    din: "",
    fatherName: "",
    address: "",
    email: "",
    mobileNumber: "",
    pan: "",
    occupation: "",
    dateOfBirth: "",
    nationality: "",
    existingDirectorships: "",
    directorCompanies: [{ companyName: "", designation: "Director" }],
    priorDirectorshipDetails: "",
    professionalMembership: [
      { instituteName: "", membershipNumber: "", certificateOfPracticeNumber: "" },
    ],
    place: "",
    date: isoToday(),
    identityProofName: "",
    addressProofName: "",
    identityProofDetails: "",
    addressProofDetails: "",
    signatureImage: "",
  };
}

export default function Dir2Page() {
  const searchParams = useSearchParams();
  const companyFromUrl = searchParams.get("company");
  const directorFromUrl = searchParams.get("director");

  const [data, setData] = useState<Dir2FormData>(() => createInitialFormData());
  const [busy, setBusy] = useState(false);
  const [activeProfile, setActiveProfile] = useState<CompanyProfile | null>(null);
  /** 0-based index into activeProfile.directors */
  const [directorIndex, setDirectorIndex] = useState(0);
  const previewHtml = useMemo(() => buildDir2Html(data), [data]);

  function update<K extends keyof Dir2FormData>(key: K, value: Dir2FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  const applyDirectorToForm = useCallback(
    (profile: CompanyProfile, dirIdx: number) => {
      const dir: DirectorProfile | undefined = profile.directors[dirIdx];
      setData((prev) => ({
        ...prev,
        companyName: profile.companyName || prev.companyName,
        directorName: dir?.directorName ?? "",
        din: dir?.din ?? "",
        fatherName: dir?.fatherName ?? "",
        address: dir?.address ?? "",
        email: dir?.email ?? "",
        mobileNumber: dir?.mobileNumber ?? "",
        pan: dir?.pan ?? "",
        occupation: dir?.occupation ?? "",
        dateOfBirth: dir?.dateOfBirth ?? "",
        nationality: dir?.nationality ?? "",
        place: (dir?.city ?? "").trim() || profile.place || prev.place,
        priorDirectorshipDetails: dir?.priorDirectorshipDetails ?? "",
        professionalMembership:
          profile.professionalMemberships.length > 0
            ? profile.professionalMemberships
            : prev.professionalMembership,
      }));
    },
    [],
  );

  const handleProfileSelect = useCallback(
    (profile: CompanyProfile) => {
      setActiveProfile(profile);

      let idx = 0;
      if (
        companyFromUrl &&
        profile.id === companyFromUrl &&
        directorFromUrl
      ) {
        const n = parseInt(directorFromUrl, 10);
        if (
          !Number.isNaN(n) &&
          n >= 1 &&
          n <= profile.directors.length
        ) {
          idx = n - 1;
        }
      }

      setDirectorIndex(idx);
      applyDirectorToForm(profile, idx);
    },
    [applyDirectorToForm, companyFromUrl, directorFromUrl],
  );

  function handleDirectorPickerChange(raw: string) {
    const idx = parseInt(raw, 10);
    if (Number.isNaN(idx) || !activeProfile) return;
    setDirectorIndex(idx);
    applyDirectorToForm(activeProfile, idx);
  }


  async function download(kind: "pdf" | "docx") {
    setBusy(true);
    try {
      const res = await fetch(`/api/dir2/${kind}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ values: data }),
      });
      if (!res.ok) throw new Error(`Failed to generate ${kind.toUpperCase()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DIR-2-Consent.${kind}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  function printPreview() {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.open();
    w.document.write(previewHtml);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div>
      <div className="mx-auto max-w-[1440px] px-0 py-0">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          DIR-2 Consent to Act as Director
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Fill fields on the left. Preview updates automatically on the right.
        </p>

        <div className="mt-4">
          <ProfileSelector
            onSelect={handleProfileSelect}
            initialCompanyId={companyFromUrl}
          />
        </div>

        {activeProfile && activeProfile.directors.length > 1 && (
          <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
            <label className="mb-1 block text-xs font-semibold text-violet-900">
              Director for this DIR-2 form
            </label>
            <p className="mb-2 text-xs text-violet-700">
              This company has {activeProfile.directors.length} directors. Choose
              whose details fill this single DIR-2 (one form per director).
            </p>
            <select
              className="w-full max-w-md rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={String(directorIndex)}
              onChange={(e) => handleDirectorPickerChange(e.target.value)}
            >
              {activeProfile.directors.map((d, i) => (
                <option key={`${d.directorName}-${i}`} value={String(i)}>
                  {i + 1}. {d.directorName?.trim() || `Director ${i + 1}`}
                  {d.designation ? ` — ${d.designation}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-2 grid gap-5 lg:grid-cols-[3fr_7fr]">
          {/* INPUT SECTION */}
          <section className="max-h-[88vh] overflow-y-auto rounded-xl border bg-white p-4">
            <div className="grid gap-3">
              <Input label="Company Name" required>
                <input
                  className={inputClass}
                  value={data.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  placeholder="ABC Private Limited"
                />
              </Input>
              <Input label="Director Full Name" required>
                <input
                  className={inputClass}
                  value={data.directorName}
                  onChange={(e) => update("directorName", e.target.value)}
                  placeholder="Full name as per records"
                />
              </Input>

              <div className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/90 p-3">
                <div className="mb-1 text-sm font-semibold text-amber-950">
                  Place &amp; date of signing
                </div>
                <p className="mb-3 text-xs leading-relaxed text-amber-900">
                  These appear on the printed form as{" "}
                  <strong>Date: _______</strong> and{" "}
                  <strong>Place: _______</strong> beside your signature. Defaults
                  to today&apos;s date; you can change it.{" "}
                  <strong>Place</strong> is auto-filled from the director&apos;s{" "}
                  <strong>city</strong> when you load a saved company profile.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Place (city of signing)" required>
                    <input
                      className={inputClass}
                      value={data.place}
                      onChange={(e) => update("place", e.target.value)}
                      placeholder="Auto-filled from director city, or type here"
                    />
                  </Input>
                  <Input label="Date" required>
                    <input
                      type="date"
                      className={inputClass}
                      value={data.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                  </Input>
                </div>
              </div>

              <Input label="DIN (Director Identification Number)" required>
                <input
                  className={inputClass}
                  value={data.din}
                  onChange={(e) => update("din", e.target.value)}
                  placeholder="00000000"
                />
              </Input>
              <Input label="Father's Full Name" required>
                <input
                  className={inputClass}
                  value={data.fatherName}
                  onChange={(e) => update("fatherName", e.target.value)}
                  placeholder="Father's full name"
                />
              </Input>
              <Input label="Residential Address" required>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={data.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Full residential address"
                />
              </Input>
              <Input label="Email ID" required>
                <input
                  type="email"
                  className={inputClass}
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </Input>
              <Input label="Mobile Number" required>
                <input
                  type="tel"
                  className={inputClass}
                  value={data.mobileNumber}
                  onChange={(e) => update("mobileNumber", e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                />
              </Input>
              <Input label="PAN Number" required>
                <input
                  className={inputClass}
                  value={data.pan}
                  onChange={(e) => update("pan", e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </Input>
              <Input label="Occupation" required>
                <input
                  className={inputClass}
                  value={data.occupation}
                  onChange={(e) => update("occupation", e.target.value)}
                  placeholder="Business / Professional / Service"
                />
              </Input>
              <Input label="Date of Birth" required>
                <input
                  type="date"
                  className={inputClass}
                  value={data.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                />
              </Input>
              <Input label="Nationality" required>
                <input
                  className={inputClass}
                  value={data.nationality}
                  onChange={(e) => update("nationality", e.target.value)}
                  placeholder="Indian"
                />
              </Input>
              <Input label="No. of existing companies as Director (total count)" required>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={data.existingDirectorships}
                  onChange={(e) => update("existingDirectorships", e.target.value)}
                  placeholder="0"
                />
              </Input>

              {/* EXISTING COMPANIES */}
              <DynamicCard
                title="Existing company details"
                description="List each company where you already act as Director, Managing Director, CEO, Whole-time Director, Company Secretary, CFO, Manager, etc. Use + Add for more rows."
                onAdd={() =>
                  update("directorCompanies", [
                    ...data.directorCompanies,
                    { companyName: "", designation: "Director" },
                  ])
                }
              >
                {data.directorCompanies.map((row, idx) => (
                  <div key={`company-${idx}`} className="rounded-lg border bg-white p-3">
                    <div className="grid gap-2">
                      <input
                        className={inputClass}
                        placeholder="Company Name"
                        value={row.companyName}
                        onChange={(e) => {
                          const next = [...data.directorCompanies];
                          next[idx] = { ...next[idx], companyName: e.target.value };
                          update("directorCompanies", next);
                        }}
                      />
                      <select
                        className={inputClass}
                        value={row.designation}
                        onChange={(e) => {
                          const next = [...data.directorCompanies];
                          next[idx] = { ...next[idx], designation: e.target.value };
                          update("directorCompanies", next);
                        }}
                      >
                        {designationOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className={removeBtnClass}
                        onClick={() => {
                          const next = data.directorCompanies.filter((_, i) => i !== idx);
                          update(
                            "directorCompanies",
                            next.length
                              ? next
                              : [{ companyName: "", designation: "Director" }],
                          );
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </DynamicCard>

              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <label className="mb-1 block text-sm font-semibold text-zinc-900">
                  Item 11 — narrative (optional)
                </label>
                <p className="mb-2 text-xs leading-relaxed text-zinc-600">
                  No. of companies in which I am already a Director and out of such companies the
                  names of the companies in which I am a Managing Director, Chief Executive Officer,
                  Whole time Director, Secretary, Chief Financial Officer, Manager. This is
                  auto-filled from the director&apos;s answer saved under Manage Companies; you can
                  edit it here.
                </p>
                <textarea
                  className={inputClass}
                  rows={5}
                  value={data.priorDirectorshipDetails}
                  onChange={(e) => update("priorDirectorshipDetails", e.target.value)}
                  placeholder="Free-text answer (appears in the form together with the count and list below, if any)"
                />
              </div>

              {/* PROFESSIONAL MEMBERSHIP */}
              <DynamicCard
                title="Professional Membership Details"
                description="ICAI, ICSI, ICMAI membership if applicable"
                onAdd={() =>
                  update("professionalMembership", [
                    ...data.professionalMembership,
                    {
                      instituteName: "",
                      membershipNumber: "",
                      certificateOfPracticeNumber: "",
                    },
                  ])
                }
              >
                {data.professionalMembership.map((row, idx) => (
                  <div key={`membership-${idx}`} className="rounded-lg border bg-white p-3">
                    <div className="grid gap-2">
                      <input
                        className={inputClass}
                        placeholder="Institute Name (e.g. ICAI)"
                        value={row.instituteName}
                        onChange={(e) => {
                          const next = [...data.professionalMembership];
                          next[idx] = { ...next[idx], instituteName: e.target.value };
                          update("professionalMembership", next);
                        }}
                      />
                      <input
                        className={inputClass}
                        placeholder="Membership Number"
                        value={row.membershipNumber}
                        onChange={(e) => {
                          const next = [...data.professionalMembership];
                          next[idx] = { ...next[idx], membershipNumber: e.target.value };
                          update("professionalMembership", next);
                        }}
                      />
                      <input
                        className={inputClass}
                        placeholder="Certificate of Practice Number"
                        value={row.certificateOfPracticeNumber}
                        onChange={(e) => {
                          const next = [...data.professionalMembership];
                          next[idx] = {
                            ...next[idx],
                            certificateOfPracticeNumber: e.target.value,
                          };
                          update("professionalMembership", next);
                        }}
                      />
                      <button
                        type="button"
                        className={removeBtnClass}
                        onClick={() => {
                          const next = data.professionalMembership.filter(
                            (_, i) => i !== idx,
                          );
                          update(
                            "professionalMembership",
                            next.length
                              ? next
                              : [
                                  {
                                    instituteName: "",
                                    membershipNumber: "",
                                    certificateOfPracticeNumber: "",
                                  },
                                ],
                          );
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </DynamicCard>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-sm font-semibold text-zinc-900">
                  Proof of Identity (optional)
                </div>
                <p className="mt-1 text-xs text-zinc-600">
                  Upload a file to record its name on the form, or describe the
                  document you will attach if you are not uploading now.
                </p>
                <input
                  type="file"
                  className={`${inputClass} mt-2`}
                  onChange={(e) =>
                    update("identityProofName", e.target.files?.[0]?.name ?? "")
                  }
                />
                <textarea
                  className={`${inputClass} mt-2`}
                  rows={2}
                  placeholder="e.g. Aadhaar Card (self-attested copy) / Passport / Voter ID…"
                  value={data.identityProofDetails}
                  onChange={(e) => update("identityProofDetails", e.target.value)}
                />
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-sm font-semibold text-zinc-900">
                  Proof of Residence (optional)
                </div>
                <p className="mt-1 text-xs text-zinc-600">
                  Upload a file, or type which address proof will be attached (e.g.
                  utility bill, bank statement).
                </p>
                <input
                  type="file"
                  className={`${inputClass} mt-2`}
                  onChange={(e) =>
                    update("addressProofName", e.target.files?.[0]?.name ?? "")
                  }
                />
                <textarea
                  className={`${inputClass} mt-2`}
                  rows={2}
                  placeholder="e.g. Electricity bill dated … / Bank passbook…"
                  value={data.addressProofDetails}
                  onChange={(e) => update("addressProofDetails", e.target.value)}
                />
              </div>
            </div>


          </section>

          {/* PREVIEW SECTION */}
          <section className="flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Live Preview
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-auto bg-zinc-100 p-4">
              <div
                style={{
                  transform: "scale(0.9)",
                  transformOrigin: "top center",
                }}
              >
                <iframe
                  title="DIR-2 Preview"
                  className="mx-auto w-[210mm] min-h-[1100px] bg-white shadow-sm border-none"
                  srcDoc={previewHtml}
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Action buttons — centered below both panels ── */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => download("pdf")}
            disabled={busy}
            className="min-w-[160px] rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {busy ? "Generating…" : "⬇ Download PDF"}
          </button>
          <button
            type="button"
            onClick={() => download("docx")}
            disabled={busy}
            className="min-w-[160px] rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          >
            ⬇ Download DOCX
          </button>
          <button
            type="button"
            onClick={printPreview}
            className="min-w-[160px] rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            🖨 Print
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-zinc-900">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </div>
      {children}
    </label>
  );
}

function DynamicCard({
  title,
  description,
  children,
  onAdd,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-xl border bg-zinc-50 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {description && (
            <div className="text-xs text-zinc-500">{description}</div>
          )}
        </div>
        <button type="button" className={secondaryBtnClass} onClick={onAdd}>
          + Add
        </button>
      </div>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function buildDir2Html(data: Dir2FormData) {
  const val = (s: string) => (s.trim() ? escapeHtml(s) : '<span class="blank">_______________</span>');
  const fDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : '<span class="blank">_______________</span>';

  function proofAttachmentRow(
    label: string,
    fileName: string,
    details: string,
  ): string {
    const f = fileName.trim();
    const t = details.trim();
    if (f) {
      return `${label} <em>(file)</em>: ${escapeHtml(f)}`;
    }
    if (t) {
      return `${label}: ${escapeHtml(t)}`;
    }
    return `${label}: <span class="blank">_______________</span>`;
  }

  const narrative = data.priorDirectorshipDetails?.trim();
  const narrativeHtml = narrative
    ? `<div class="prior-narrative" style="margin-bottom:8px;">${escapeHtml(narrative).replace(/\n/g, "<br>")}</div>`
    : "";

  const companies = data.directorCompanies.filter(
    (x) => x.companyName.trim() || x.designation.trim(),
  );
  const memberships = data.professionalMembership.filter(
    (x) =>
      x.instituteName.trim() ||
      x.membershipNumber.trim() ||
      x.certificateOfPracticeNumber.trim(),
  );

  const companiesHtml = companies.length
    ? companies
        .map(
          (c, i) =>
            `<div class="sub-item">${i + 1}. ${val(c.companyName)} — ${val(c.designation)}</div>`,
        )
        .join("")
    : '<span class="blank">N/A</span>';

  const membershipsHtml = memberships.length
    ? memberships
        .map(
          (m, i) =>
            `<div class="sub-item">${i + 1}. ${val(m.instituteName)} | Membership No: ${val(m.membershipNumber)} | COP No: ${val(m.certificateOfPracticeNumber)}</div>`,
        )
        .join("")
    : '<span class="blank">N/A</span>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Form DIR-2</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 1.4;
      color: #000;
      padding: 20px;
      background: #fff;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    .page { max-width: 800px; margin: 0 auto; overflow-wrap: break-word; }

    /* Header Box */
    .header-box {
      background: #eaeaea;
      border: 1px solid #999;
      padding: 12px 16px;
      text-align: center;
      margin-bottom: 16px;
    }
    .header-box .title {
      font-size: 14pt;
      font-weight: bold;
      font-family: Georgia, serif;
    }
    .header-box .subtitle {
      font-size: 12pt;
      margin-top: 4px;
      font-family: Georgia, serif;
    }
    .header-box .rule {
      font-size: 10pt;
      font-style: italic;
      margin-top: 4px;
      font-family: Georgia, serif;
    }

    /* Addressee */
    .to-section {
      margin-bottom: 12px;
    }
    .to-section .label {
      font-weight: bold;
    }
    .to-section .company-name {
      font-weight: bold;
      color: #000;
      overflow-wrap: break-word;
    }

    /* Subject */
    .subject {
      margin-bottom: 8px;
    }
    .subject .label {
      font-weight: bold;
    }

    /* Consent paragraph */
    .consent-para {
      text-align: justify;
      margin-bottom: 16px;
      overflow-wrap: break-word;
    }
    .consent-para .highlight {
      font-weight: bold;
    }

    /* Table */
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      table-layout: fixed;
    }
    .details-table th,
    .details-table td {
      border: 1px solid #000;
      padding: 6px 8px;
      vertical-align: top;
      text-align: left;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    .details-table .col-num {
      width: 40px;
      text-align: center;
      font-weight: normal;
    }
    .details-table .col-label {
      width: 55%;
    }
    .details-table .col-value {
      width: auto;
    }
    .sub-item {
      margin-left: 12px;
      margin-top: 4px;
      overflow-wrap: break-word;
    }

    /* Declaration */
    .declaration {
      margin-bottom: 16px;
    }
    .declaration .heading {
      font-weight: bold;
      text-decoration: underline;
      margin-bottom: 8px;
    }
    .declaration p {
      text-align: justify;
      margin-bottom: 8px;
    }

    /* Signature */
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      margin-bottom: 20px;
      gap: 20px;
    }
    .signature-left div {
      margin-bottom: 4px;
      overflow-wrap: break-word;
    }
    .signature-right {
      text-align: right;
      min-width: 200px;
      max-width: 300px;
      overflow-wrap: break-word;
    }
    .signature-right .line {
      border-top: 1px solid #000;
      padding-top: 4px;
      margin-top: 30px;
    }

    /* Attachments */
    .attachments .heading {
      font-weight: bold;
      margin-bottom: 6px;
    }
    .attachments ol {
      margin-left: 20px;
    }
    .attachments li {
      margin-bottom: 4px;
      overflow-wrap: break-word;
    }

    .blank {
      color: #888;
    }

    @media print {
      body { padding: 0; }
      .page { max-width: none; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- HEADER BOX -->
    <div class="header-box">
      <div class="title">Form DIR-2</div>
      <div class="subtitle">Consent to act as Director of a Company</div>
      <div class="rule">[Pursuant to section 152(5) and rule 8 of Companies (Appointment and Qualification of Directors) Rules, 2014]</div>
    </div>

    <!-- TO -->
    <div class="to-section">
      <div class="label">To</div>
      <div class="company-name">${val(data.companyName)}</div>
    </div>

    <!-- SUBJECT -->
    <div class="subject">
      <span class="label">Subject:</span> Consent to act as Director.
    </div>

    <!-- CONSENT PARAGRAPH -->
    <div class="consent-para">
      I, <span class="highlight">${val(data.directorName)}</span>, hereby give my consent to act as Director of <span class="highlight">${val(data.companyName)}</span> (Company under Incorporation), pursuant to sub-section (5) of section 152 of the Companies Act, 2013 and certify that I am not disqualified to become a director under the Companies Act, 2013.
    </div>

    <!-- DETAILS TABLE -->
    <table class="details-table">
      <tr>
        <td class="col-num">1.</td>
        <td class="col-label">Director Identification Number (DIN):</td>
        <td class="col-value">${val(data.din)}</td>
      </tr>
      <tr>
        <td class="col-num">2.</td>
        <td class="col-label">Name (in full):</td>
        <td class="col-value">${val(data.directorName)}</td>
      </tr>
      <tr>
        <td class="col-num">3.</td>
        <td class="col-label">Father's Name (in full):</td>
        <td class="col-value">${val(data.fatherName)}</td>
      </tr>
      <tr>
        <td class="col-num">4.</td>
        <td class="col-label">Address:</td>
        <td class="col-value">${val(data.address).replace(/\n/g, "<br>")}</td>
      </tr>
      <tr>
        <td class="col-num">5.</td>
        <td class="col-label">E-mail id:</td>
        <td class="col-value">${val(data.email)}</td>
      </tr>
      <tr>
        <td class="col-num">6.</td>
        <td class="col-label">Mobile no.:</td>
        <td class="col-value">${val(data.mobileNumber)}</td>
      </tr>
      <tr>
        <td class="col-num">7.</td>
        <td class="col-label">Income-tax PAN:</td>
        <td class="col-value">${val(data.pan)}</td>
      </tr>
      <tr>
        <td class="col-num">8.</td>
        <td class="col-label">Occupation:</td>
        <td class="col-value">${val(data.occupation)}</td>
      </tr>
      <tr>
        <td class="col-num">9.</td>
        <td class="col-label">Date of birth:</td>
        <td class="col-value">${fDate(data.dateOfBirth)}</td>
      </tr>
      <tr>
        <td class="col-num">10.</td>
        <td class="col-label">Nationality:</td>
        <td class="col-value">${val(data.nationality)}</td>
      </tr>
      <tr>
        <td class="col-num">11.</td>
        <td class="col-label">No. of companies in which I am already a Director and out of such companies the names of the companies in which I am a Managing Director, Chief Executive Officer, Whole time Director, Secretary, Chief Financial Officer, Manager:</td>
        <td class="col-value">
          ${narrativeHtml}
          <div><strong>${val(data.existingDirectorships)}</strong></div>
          ${companiesHtml}
        </td>
      </tr>
      <tr>
        <td class="col-num">12.</td>
        <td class="col-label">Particulars of membership No. and Certificate of practice No. if the applicant is a member of any professional Institute:</td>
        <td class="col-value">${membershipsHtml}</td>
      </tr>
    </table>

    <!-- DECLARATION -->
    <div class="declaration">
      <div class="heading">Declaration</div>
      <p>I declare that I have not been convicted of any offence in connection with the promotion, formation or management of any company or LLP and have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law in the last five years. I further declare that if appointed my total Directorship in all the companies shall not exceed the prescribed number of companies in which a person can be appointed as a Director.</p>
      <p>I am not required to obtain the security clearance from the Ministry of Home Affairs, Government of India under sub-rule (1) of rule 10 before applying for director identification number.</p>
    </div>

    <!-- SIGNATURE -->
    <div class="signature-section">
      <div class="signature-left">
        <div><strong>Date:</strong> ${fDate(data.date)}</div>
        <div><strong>Place:</strong> ${val(data.place)}</div>
      </div>
      <div class="signature-right">
        <div style="border-bottom: 1px solid #000; min-height: 10mm; display: flex; align-items: flex-end; justify-content: flex-end; padding-bottom: 1mm;">
          ${data.signatureImage ? `<img src="${data.signatureImage}" style="max-height: 15mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 10mm;"></div>`}
        </div>
        <div class="line">
          <div><strong>${val(data.directorName)}</strong></div>
          <div>(PAN: ${val(data.pan)})</div>
        </div>
      </div>
    </div>

    <!-- ATTACHMENTS -->
    <div class="attachments">
      <div class="heading">Attachments:</div>
      <ol>
        <li>${proofAttachmentRow("Proof of Identity", data.identityProofName, data.identityProofDetails)}</li>
        <li>${proofAttachmentRow("Proof of Residence", data.addressProofName, data.addressProofDetails)}</li>
      </ol>
    </div>

  </div>
</body>
</html>`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";
const primaryBtnClass =
  "rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60";
const secondaryBtnClass =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60";
const removeBtnClass =
  "rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50";
