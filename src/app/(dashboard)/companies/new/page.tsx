import type { Metadata } from "next";
import dynamic from "next/dynamic";

const CompanyFormPage = dynamic(() => import("@/components/CompanyFormPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = { title: "New Company" };

export default function NewCompanyPage() {
  return <CompanyFormPage />;
}
