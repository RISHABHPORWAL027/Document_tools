import type { Metadata } from "next";
import { COMPLIANCE_ITEMS } from "@/lib/calendars/compliance/complianceData";
import ComplianceHubClient from "@/components/compliance/ComplianceHubClient";
import ComplianceSchema from "@/components/compliance/ComplianceSchema";

export const metadata: Metadata = {
  title: "Statutory Compliance Due Today – Tax & ROC Filings",
  description: "Check Indian tax, GST, TDS, and ROC statutory filings due today. Avoid late fees and interest penalties.",
  keywords: ["Compliance due today", "GST due today", "TDS deadline today"],
  alternates: {
    canonical: "https://www.compliancedraft.co.in/compliance-calendar/today",
  },
};

export default function ComplianceTodayPage() {
  const todayStr = new Date().toISOString().split("T")[0];
  const items = COMPLIANCE_ITEMS.filter((i) => i.dueDate === todayStr || i.isUrgent);

  return (
    <>
      <ComplianceSchema items={items} title="Statutory Compliance Due Today" />
      <ComplianceHubClient
        initialItems={items.length > 0 ? items : COMPLIANCE_ITEMS.slice(0, 5)}
        headingTitle="Statutory Compliance Due Today"
        headingDescription="Urgent statutory tax and MCA deadlines requiring immediate filing action."
      />
    </>
  );
}
