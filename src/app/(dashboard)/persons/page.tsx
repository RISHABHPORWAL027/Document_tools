import type { Metadata } from "next";
import PersonsClient from "./PersonsClient";

export const metadata: Metadata = {
  title: "Company & Person Management",
  description: "Import company data or add a person for invoices and payslips.",
};

export default function PersonsPage() {
  return <PersonsClient />;
}
