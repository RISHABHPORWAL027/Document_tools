import type { Metadata } from "next";
import dynamic from "next/dynamic";

const CompaniesClient = dynamic(() => import("@/components/CompaniesClient"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "Companies",
  description: "Manage your registered company profiles, directors, addresses, and compliance master data hubs on ComplianceDraft.",
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}
