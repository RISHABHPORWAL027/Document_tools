import type { Metadata } from "next";
import HRDocumentsClient from "./HRDocumentsClient";

export const metadata: Metadata = {
  title: "HR Documents",
  description: "Create and manage HR documents such as payslips and invoices.",
};

export default function HRDocumentsPage() {
  return <HRDocumentsClient />;
}
