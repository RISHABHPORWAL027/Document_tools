"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getCompany, saveCompany } from "@/lib/companies/storage";
import {
  DESIGNATIONS,
  INDIAN_STATES,
  SECTORS,
  emptyCompany,
  emptyDirector,
  type Company,
  type Director,
} from "@/lib/companies/types";

const inputCls =
  "w-full border border-[#d9d9d9] bg-[#f6f6f6] px-3 py-2 text-sm text-black placeholder:text-[#b0b0b0] outline-none focus:border-black focus:bg-white transition-colors";

const labelCls = "mb-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#666666]";

interface Props {
  companyId?: string;
}

export default function CompanyFormPage({ companyId }: Props) {
  const router = useRouter();
  const isEdit = !!companyId;

  const [company, setCompany] = useState<Company>(() => {
    if (companyId) {
      const found = getCompany(companyId);
      if (found) return found;
    }
    return emptyCompany();
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "directors">("details");
  const [expandedDir, setExpandedDir] = useState<string | null>(() => {
    if (companyId) {
      const found = getCompany(companyId);
      if (found) return found.directors[0]?.id ?? null;
    }
    return null;
  });

  // localStorage is not available during SSR; sync once the client store is readable
  useEffect(() => {
    if (!companyId) return;
    const found = getCompany(companyId);
    if (!found) return;
    queueMicrotask(() => {
      setCompany(found);
      setExpandedDir(found.directors[0]?.id ?? null);
    });
  }, [companyId]);

  const updateField = useCallback(
    <K extends keyof Company>(key: K, value: Company[K]) => {
      setCompany((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  function updateDirector<K extends keyof Director>(
    id: string,
    key: K,
    value: Director[K],
  ) {
    setCompany((prev) => ({
      ...prev,
      directors: prev.directors.map((d) =>
        d.id === id ? { ...d, [key]: value } : d,
      ),
    }));
  }

  function addDirector() {
    const dir = emptyDirector();
    setCompany((prev) => ({
      ...prev,
      directors: [...prev.directors, dir],
    }));
    setExpandedDir(dir.id);
  }

  function removeDirector(id: string) {
    setCompany((prev) => ({
      ...prev,
      directors: prev.directors.filter((d) => d.id !== id),
    }));
    setExpandedDir(null);
  }

  function handleSave() {
    if (!company.name.trim()) {
      alert("Company name is required.");
      return;
    }
    setSaving(true);
    saveCompany(company);
    setSaving(false);
    router.push("/companies");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-black pl-4">
          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <button
              onClick={() => router.push("/companies")}
              className="font-medium hover:text-black transition-colors"
            >
              Companies
            </button>
            <span>/</span>
            <span>{isEdit ? "Edit Company" : "New Company"}</span>
          </div>
          <h1
            className="mt-1 text-2xl font-black tracking-tight text-black"
            style={{ letterSpacing: "-0.025em" }}
          >
            {isEdit ? "Edit Company Profile" : "New Company"}
          </h1>
          <p className="mt-0.5 text-sm text-[#666666]">
            Fill in the details below. This data will auto-fill all document
            generators.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-[#eeeeee] bg-white">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 py-3.5 sm:py-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors border-b-2 ${
            activeTab === "details"
              ? "border-black text-black bg-white"
              : "border-transparent text-[#888888] hover:text-black bg-[#f6f6f6]"
          }`}
        >
          Company Details
        </button>
        <button
          onClick={() => setActiveTab("directors")}
          className={`flex-1 py-3.5 sm:py-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors border-b-2 ${
            activeTab === "directors"
              ? "border-black text-black bg-white"
              : "border-transparent text-[#888888] hover:text-black bg-[#f6f6f6]"
          }`}
        >
          Directors ({company.directors.length})
        </button>
      </div>

      {/* Company Details Tab */}
      {activeTab === "details" && (
        <div className="space-y-4 border border-[#eeeeee] bg-white p-4 sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#888888]">Company Details</div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Company Name *</label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. TechNova Solutions Pvt Ltd"
                value={company.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>CIN (if available)</label>
              <input
                type="text"
                className={inputCls}
                placeholder="U72900KA2023PTC143800"
                value={company.cin}
                onChange={(e) => updateField("cin", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Sector</label>
              <select
                className={inputCls}
                value={company.sector}
                onChange={(e) => updateField("sector", e.target.value)}
              >
                <option value="">Select sector</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Business Activity</label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Software Development, Consulting"
                value={company.businessActivity}
                onChange={(e) => updateField("businessActivity", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>
                Registered office — building / street / locality *
              </label>
              <textarea
                className={inputCls}
                rows={3}
                placeholder="Door no., building, street, area, landmark…"
                value={company.registeredAddress}
                onChange={(e) => updateField("registeredAddress", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Place (city / town)</label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Bengaluru"
                value={company.place}
                onChange={(e) => updateField("place", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>PIN code</label>
              <input
                type="text"
                className={inputCls}
                inputMode="numeric"
                maxLength={6}
                placeholder="560001"
                value={company.pincode}
                onChange={(e) =>
                  updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>State</label>
              <select
                className={inputCls}
                value={company.state}
                onChange={(e) => updateField("state", e.target.value)}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                className={inputCls}
                placeholder="company@example.com"
                value={company.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Mobile Number</label>
              <input
                type="tel"
                className={inputCls}
                placeholder="9876543210"
                value={company.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Authorized Capital (₹)</label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. 10,00,000"
                value={company.authorizedCapital}
                onChange={(e) => updateField("authorizedCapital", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Paid-up Capital (₹)</label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. 1,00,000"
                value={company.paidUpCapital}
                onChange={(e) => updateField("paidUpCapital", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#eeeeee] pt-4">
            <button
              onClick={() => setActiveTab("directors")}
              className="bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1a1a1a] transition-colors"
            >
              Next: Directors →
            </button>
          </div>
        </div>
      )}

      {/* Directors Tab */}
      {activeTab === "directors" && (
        <div className="space-y-3">
          {company.directors.map((dir, idx) => (
            <div
              key={dir.id}
              className="overflow-hidden border border-[#eeeeee] bg-white"
            >
              {/* Director header (accordion) */}
              <button
                onClick={() =>
                  setExpandedDir(expandedDir === dir.id ? null : dir.id)
                }
                className="flex w-full items-center justify-between px-5 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center bg-black text-xs font-bold text-white">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">
                      {dir.name || `Director ${idx + 1}`}
                    </div>
                    {dir.designation && (
                      <div className="text-xs text-zinc-500">{dir.designation}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {company.directors.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Remove this director?"))
                          removeDirector(dir.id);
                      }}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                  <svg
                    className={`h-4 w-4 text-zinc-500 transition-transform ${expandedDir === dir.id ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Director form */}
              {expandedDir === dir.id && (
                <div className="border-t px-5 py-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="Director's full name"
                        value={dir.name}
                        onChange={(e) => updateDirector(dir.id, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Designation</label>
                      <select
                        className={inputCls}
                        value={dir.designation}
                        onChange={(e) => updateDirector(dir.id, "designation", e.target.value)}
                      >
                        {DESIGNATIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>DIN</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="Director Identification Number"
                        value={dir.din}
                        onChange={(e) => updateDirector(dir.id, "din", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>PAN</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="ABCDE1234F"
                        value={dir.pan}
                        onChange={(e) => updateDirector(dir.id, "pan", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Aadhaar Number</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="12-digit Aadhaar"
                        value={dir.aadhaar}
                        onChange={(e) => updateDirector(dir.id, "aadhaar", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Father&apos;s Name</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="Father's full name"
                        value={dir.fatherName}
                        onChange={(e) => updateDirector(dir.id, "fatherName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Date of Birth</label>
                      <input
                        type="date"
                        className={inputCls}
                        value={dir.dob}
                        onChange={(e) => updateDirector(dir.id, "dob", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Nationality</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="Indian"
                        value={dir.nationality}
                        onChange={(e) => updateDirector(dir.id, "nationality", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Occupation</label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="e.g. Business"
                        value={dir.occupation}
                        onChange={(e) => updateDirector(dir.id, "occupation", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        type="email"
                        className={inputCls}
                        placeholder="director@email.com"
                        value={dir.email}
                        onChange={(e) => updateDirector(dir.id, "email", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Mobile</label>
                      <input
                        type="tel"
                        className={inputCls}
                        placeholder="9876543210"
                        value={dir.mobile}
                        onChange={(e) => updateDirector(dir.id, "mobile", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Residential Address</label>
                      <textarea
                        className={inputCls}
                        rows={2}
                        placeholder="Building / street / locality"
                        value={dir.address}
                        onChange={(e) => updateDirector(dir.id, "address", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <input
                        className={inputCls}
                        placeholder="City / town"
                        value={dir.city}
                        onChange={(e) => updateDirector(dir.id, "city", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>PIN Code</label>
                      <input
                        className={inputCls}
                        placeholder="6-digit PIN"
                        inputMode="numeric"
                        maxLength={6}
                        value={dir.pincode}
                        onChange={(e) => updateDirector(dir.id, "pincode", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>State</label>
                      <select
                        className={inputCls}
                        value={dir.state}
                        onChange={(e) => updateDirector(dir.id, "state", e.target.value)}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>
                        No. of companies in which I am already a Director and out of such
                        companies the names of the companies in which I am a Managing Director,
                        Chief Executive Officer, Whole time Director, Secretary, Chief Financial
                        Officer, Manager
                      </label>
                      <textarea
                        className={inputCls}
                        rows={4}
                        placeholder="e.g. Total: 2. ABC Pvt Ltd — Managing Director; XYZ Ltd — Director…"
                        value={dir.priorDirectorshipDetails}
                        onChange={(e) =>
                          updateDirector(dir.id, "priorDirectorshipDetails", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addDirector}
            className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-[#d9d9d9] py-3.5 text-sm font-bold text-[#888888] hover:border-black hover:text-black transition-colors"
          >
            + Add Another Director
          </button>
        </div>
      )}

      {/* Save bar */}
      <div className="sticky bottom-0 md:bottom-4 flex items-center justify-between border border-[#d9d9d9] bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-xl" style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}>
        <button
          onClick={() => router.push("/companies")}
          className="text-sm font-medium text-[#888888] hover:text-black transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black px-5 sm:px-7 py-2.5 text-sm font-bold text-white hover:bg-[#1a1a1a] disabled:opacity-40 transition-colors"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Company"}
        </button>
      </div>
    </div>
  );
}
