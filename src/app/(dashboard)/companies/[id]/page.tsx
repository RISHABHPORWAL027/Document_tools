import type { Metadata } from "next";
import dynamic from "next/dynamic";

const CompanyEditClient = dynamic(() => import("@/components/CompanyEditClient"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = { title: "Edit Company" };

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyEditClient id={id} />;
}
