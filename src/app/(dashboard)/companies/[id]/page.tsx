import type { Metadata } from "next";
import CompanyEditClient from "@/components/CompanyEditClient";

export const metadata: Metadata = { title: "Edit Company" };

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyEditClient id={id} />;
}
