import type { Metadata } from "next";
import { COMPLIANCE_ITEMS } from "@/lib/calendars/compliance/complianceData";
import ComplianceHubClient from "@/components/compliance/ComplianceHubClient";
import ComplianceSchema from "@/components/compliance/ComplianceSchema";

export const metadata: Metadata = {
  title: "Statutory Compliance Due This Week – GST, Tax & MCA Deadlines",
  description: "View all Indian statutory tax, GST, TDS, and ROC deadlines expiring this week.",
  keywords: ["Compliance due this week", "GST deadline this week"],
  alternates: {
    canonical: "https://www.compliancedraft.co.in/compliance-calendar/this-week",
  },
};

export default function ComplianceThisWeekPage() {
  const items = COMPLIANCE_ITEMS.slice(0, 6);

  return (
    <>
      <ComplianceSchema items={items} title="Statutory Compliance Due This Week" />
      <ComplianceHubClient
        initialItems={items}
        headingTitle="Statutory Compliance Due This Week"
        headingDescription="Upcoming statutory deadlines scheduled for filing in the current week."
      />
    </>
  );
}
