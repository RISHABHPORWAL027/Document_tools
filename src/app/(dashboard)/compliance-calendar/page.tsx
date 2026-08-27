import type { Metadata } from "next";
import { COMPLIANCE_ITEMS, getComplianceItems } from "@/lib/calendars/compliance/complianceData";
import ComplianceHubClient from "@/components/compliance/ComplianceHubClient";
import ComplianceSchema from "@/components/compliance/ComplianceSchema";

export const metadata: Metadata = {
  title: "India Compliance Calendar 2026 – GST, Income Tax, TDS & ROC Due Dates",
  description: "Track all statutory Indian tax & corporate compliance deadlines. Set reminders for GSTR-1, GSTR-3B, Advance Tax, TDS, Form 11, and AOC-4.",
  keywords: ["Compliance calendar 2026 India", "GST due date calendar", "Income tax compliance dates", "TDS return filing due date", "ROC filing calendar"],
  alternates: {
    canonical: "https://www.compliancedraft.co.in/compliance-calendar",
  },
  openGraph: {
    title: "India Statutory Compliance Calendar 2026 – ComplianceDraft",
    description: "Statutory filing schedule and reminder tool for GST, Income Tax, TDS, and ROC.",
    url: "https://www.compliancedraft.co.in/compliance-calendar",
    type: "website",
  },
};

export default function ComplianceCalendarPage() {
  const items = getComplianceItems();

  return (
    <>
      <ComplianceSchema items={items} title="India Compliance Calendar 2026" />
      <ComplianceHubClient initialItems={items} />
    </>
  );
}
