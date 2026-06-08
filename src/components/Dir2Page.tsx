"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import ProfileSelector from "@/components/ProfileSelector";
import { cleanDir2Text } from "@/lib/dir2/normalize";
import type { CompanyProfile, DirectorProfile } from "@/lib/profiles/types";
import { getRelatedDocs } from "@/lib/site/registry";

type CompanyItem = {
  companyName: string;
  designation: string;
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
  /** Free-text listing of companies/designations for item 11 */
  directorshipsText: string;
  /** Free-text for item 11 (also auto-filled from company profile) */
  priorDirectorshipDetails: string;
  /** Free-text listing of professional memberships for item 12 */
  membershipText: string;
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
    directorshipsText: "",
    priorDirectorshipDetails: "",
    membershipText: "",
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

  const relatedDocs = useMemo(() => {
    return getRelatedDocs("dir2", "inc-shared");
  }, []);

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
        membershipText:
          profile.professionalMemberships.length > 0
            ? profile.professionalMemberships
                .map((m) => `${m.instituteName} | Membership No: ${m.membershipNumber} | COP No: ${m.certificateOfPracticeNumber}`)
                .join("\n")
            : prev.membershipText,
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
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(previewHtml);
    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
    };
    // Fallback
    setTimeout(() => {
      if (w) {
        w.focus();
        w.print();
      }
    }, 500);
  }

  return (
    <div>
      <div className="mx-auto max-w-[1440px] px-0 py-0">
        {/* BREADCRUMB */}
        <nav className="mb-2.5 flex items-center gap-1.5 text-xs text-[#888888] font-medium" aria-label="Breadcrumb">
          <a href="/" className="hover:text-black transition-colors">Workspace</a>
          <span>/</span>
          <span className="text-[#444444] font-semibold">DIR-2 Consent to Act as Director Format</span>
        </nav>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          DIR-2 Consent to Act as Director Format
        </h1>
        <p className="mt-1 text-sm text-zinc-600 hidden sm:block">
          Fill fields on the left. Preview updates automatically on the right.
        </p>
        <p className="mt-1 text-sm text-zinc-600 sm:hidden">
          Fill the form below, then scroll down for preview.
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

        <div className="mt-2 grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-[3fr_7fr]">
          {/* INPUT SECTION */}
          <section className="lg:max-h-[88vh] overflow-y-auto rounded-xl border bg-white p-3 sm:p-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-600 mb-4">
              <span className="font-bold text-zinc-950 block mb-1.5 uppercase tracking-wider text-[10px]">What is this document?</span>
              Form DIR-2 is the written consent of a proposed director to act in that capacity. Under Section 152(5) of the Companies Act, 2013, a company cannot appoint any director unless they have signed this consent form. It ensures that the appointee is willing to take on the legal responsibilities of directorship and confirms they are not disqualified. It is a mandatory attachment filed with the ROC during company incorporation or director updates.
            </div>
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
                  These appear on the printed form beside your signature. Defaults
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
                  className={inputClass}
                  value={data.existingDirectorships}
                  onChange={(e) => update("existingDirectorships", e.target.value)}
                  placeholder="0"
                />
              </Input>

              {/* EXISTING COMPANIES — free-text field */}
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <label className="mb-1 block text-sm font-semibold text-zinc-900">
                  Existing company details
                </label>
                <p className="mb-2 text-xs leading-relaxed text-zinc-600">
                  List each company where you already act as Director, Managing Director, CEO, Whole-time Director, Company Secretary, CFO, Manager, etc. Type freely — e.g. "1. ABC Pvt Ltd — Director".
                </p>
                <textarea
                  className={inputClass}
                  rows={5}
                  value={data.directorshipsText ?? ""}
                  onChange={(e) => update("directorshipsText", e.target.value)}
                  placeholder={"1. ABC Private Limited — Director\n2. XYZ Pvt Ltd — Managing Director"}
                />
              </div>

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
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <label className="mb-1 block text-sm font-semibold text-zinc-900">
                  Professional Membership Details
                </label>
                <p className="mb-2 text-xs leading-relaxed text-zinc-600">
                  ICAI, ICSI, ICMAI membership if applicable. Type freely — e.g. "1. ICAI | Membership No: 12345 | COP No: 67890".
                </p>
                <textarea
                  className={inputClass}
                  rows={4}
                  value={data.membershipText ?? ""}
                  onChange={(e) => update("membershipText", e.target.value)}
                  placeholder="e.g. ICAI | Membership No: 123456 | COP No: 654321"
                />
              </div>

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
            <div className="max-h-[60vh] lg:max-h-[calc(100vh-12rem)] overflow-auto bg-zinc-100 p-2 sm:p-4 mobile-scroll-hide">
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
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center sm:justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => download("pdf")}
            disabled={busy}
            className="sm:min-w-[160px] rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {busy ? "Generating…" : "⬇ Download PDF"}
          </button>
          <button
            type="button"
            onClick={() => download("docx")}
            disabled={busy}
            className="sm:min-w-[160px] rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          >
            ⬇ Download DOCX
          </button>
          <button
            type="button"
            onClick={printPreview}
            className="sm:min-w-[160px] rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            🖨 Print
          </button>
        </div>

        {relatedDocs && relatedDocs.length > 0 && (
          <div className="mt-8 border-t border-[#eeeeee] pt-6 pb-2 max-w-4xl mx-auto w-full">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#888888] mb-3 text-center sm:text-left">
              Related Compliance Documents
            </h3>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {relatedDocs.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d9d9d9] bg-white px-3 py-2 text-xs font-bold text-[#444444] hover:border-black hover:text-black transition-colors"
                >
                  <span>{doc.icon}</span>
                  <span>{doc.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* SEO Informational Content */}
        <article className="mt-12 border-t pt-8 text-zinc-800">
          <div className="max-w-4xl mx-auto space-y-6">
            <section>
              <h2 className="text-xl font-bold text-zinc-950">What is DIR-2?</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Form DIR-2 is a written consent given by a person to act as a director of a company. Under Rule 8 of the Companies (Appointment and Qualification of Directors) Rules, 2014, every person who is appointed to hold office as a director must sign and submit their consent in this format before their appointment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950">When is DIR-2 Required?</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                DIR-2 is required under the following circumstances:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-zinc-600">
                <li>During incorporation of a new Private Limited, Public Limited, or One Person Company (OPC).</li>
                <li>At the time of appointing a new director to the board of an existing company.</li>
                <li>When designating an alternate director, additional director, or independent director.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950">Who Submits DIR-2?</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                The proposed director must fill out, sign, and submit the consent form to the company. The company then files the form with the Registrar of Companies (ROC) along with Form SPICe+ (for new company incorporation) or Form DIR-12 (for changes in directors of an active company).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950">Legal Provision</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Section 152(5) of the Companies Act, 2013 read with Rule 8 of the Companies (Appointment and Qualification of Directors) Rules, 2014 mandates that no person shall be appointed as a director unless he/she has given consent in writing to act as director in Form DIR-2.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950">DIR-2 Format Download &amp; Editable Template</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Our automated editor lets you fill in the director's details, father's name, DIN, residential address, nationality, occupation, and existing directorships. Once filled, you can instantly download a print-ready PDF or editable Word (DOCX) document containing the verbatim MCA-prescribed legal text.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-950">Frequently Asked Questions (FAQs)</h2>
              <div className="mt-4 space-y-3">
                <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
                    <span>Is a physical signature mandatory on DIR-2?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
                    Yes, the proposed director must physically or digitally sign the DIR-2 consent document. A self-attested copy of the director's identity proof (such as a PAN card or passport) and address proof must be attached to the form.
                  </div>
                </details>

                <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
                    <span>What is the validity of the DIR-2 form?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
                    The DIR-2 form must be signed and dated on or before the date of appointment. It is generally executed close to the incorporation or board resolution date.
                  </div>
                </details>

                <details className="group border border-zinc-200 rounded-xl bg-white transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 p-4 font-semibold text-zinc-950 cursor-pointer list-none select-none hover:bg-zinc-50/50">
                    <span>Can a foreign national act as a director using DIR-2?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
                    Yes, foreign nationals can act as directors. For foreign nationals, their passport must be attached as identity proof, and their residency proof must be apostilled or notarized as per home country rules.
                  </div>
                </details>
              </div>
            </section>
          </div>
        </article>
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
  const val = (s: string) => {
    const value = cleanDir2Text(s);
    return value ? escapeHtml(value) : "";
  };
  const fDate = (d: string) => {
    const value = cleanDir2Text(d);
    return value
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";
  };


  const narrative = cleanDir2Text(data.priorDirectorshipDetails);
  const narrativeHtml = narrative
    ? `<div class="prior-narrative" style="margin-bottom:8px;">${escapeHtml(narrative).replace(/\n/g, "<br>")}</div>`
    : "";

  const directorshipsText = cleanDir2Text(data.directorshipsText);
  const companiesHtml = directorshipsText
    ? `<div class="prior-narrative" style="white-space:pre-wrap;margin-bottom:8px;">${escapeHtml(directorshipsText)}</div>`
    : "";

  const membershipText = cleanDir2Text(data.membershipText);
  const membershipsHtml = membershipText
    ? `<div class="prior-narrative" style="white-space:pre-wrap;margin-bottom:8px;">${escapeHtml(membershipText)}</div>`
    : "";

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
      @page { size: auto; margin: 0; }
      body { padding: 0; margin: 0; }
      .page { max-width: none; padding: 15mm; }
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
      <p>1) I declare that I have not been convicted of any offence in connection with the promotion, formation or management of any company or LLP and have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law in the last five years. I further declare that if appointed my total Directorship in all the companies shall not exceed the prescribed number of companies in which a person can be appointed as a Director.</p>
      <p>2) I am not required to obtain the security clearance from the Ministry of Home Affairs, Government of India under sub-rule (1) of rule 10 before applying for director identification number.</p>
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
      <div style="margin-left: 20px;">
        <div>Proof of Identity</div>
        <div>Proof of Residence</div>
      </div>
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
