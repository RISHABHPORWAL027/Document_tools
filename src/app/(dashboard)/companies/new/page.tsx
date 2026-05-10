import type { Metadata } from "next";
import CompanyFormPage from "@/components/CompanyFormPage";

export const metadata: Metadata = { title: "New Company" };

export default function NewCompanyPage() {
  return <CompanyFormPage />;
}
