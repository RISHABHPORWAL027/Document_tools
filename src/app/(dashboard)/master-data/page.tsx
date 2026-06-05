import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Entity Management",
  description: "Manage company profiles and persons in a centralized hub.",
};

export default function MasterDataHubPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 space-y-8 md:space-y-12"
      style={{ backgroundColor: "#F8F9FF" }}
    >
      <div className="w-full max-w-lg mx-auto overflow-hidden rounded-2xl shadow-sm border border-slate-200 mb-4">
        <img src="/Assets/company_banner.webp" alt="Company Banner" className="w-full h-auto block" />
      </div>
      <h1 className="text-3xl font-bold" style={{ color: "#1A2E7E" }}>
        Master Data Hub
      </h1>
      <p className="text-lg" style={{ color: "#1A1C1E" }}>
        Centralized repository for corporate entity profiles and statutory records.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Add Company Section */}
        <div
          className="flex flex-col items-center p-6 rounded-xl shadow-lg transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #E0E7FF, #DDE7FF)",
            border: "1px solid #C4C6D0",
          }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "#1A2E7E" }}>
            Add Company
          </h2>
          <p className="text-center mb-6" style={{ color: "#44474E" }}>
            Create a new company profile that will be used for invoices, payslips, and statutory filings.
          </p>
          <Link
            href="/companies"
            className="bg-[#1A2E7E] text-[#F8F9FF] px-5 py-2 rounded-md hover:opacity-90 transition"
          >
            Go to Companies
          </Link>
        </div>
        {/* Add Person Section */}
        <div
          className="flex flex-col items-center p-6 rounded-xl shadow-lg transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #FFE0E8, #FFDDE5)",
            border: "1px solid #C4C6D0",
          }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "#1A2E7E" }}>
            Add Person / User
          </h2>
          <p className="text-center mb-6" style={{ color: "#44474E" }}>
            Manage individuals who will appear on invoices and payslips.
          </p>
          <Link
            href="/persons"
            className="bg-[#1A2E7E] text-[#F8F9FF] px-5 py-2 rounded-md hover:opacity-90 transition"
          >
            Go to Persons
          </Link>
        </div>
      </div>
    </div>
  );
}
