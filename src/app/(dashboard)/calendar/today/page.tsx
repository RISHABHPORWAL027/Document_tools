import type { Metadata } from "next";
import { getUnifiedEvents } from "@/lib/calendars/unifiedEngine";
import UnifiedCalendarHubClient from "@/components/calendar/UnifiedCalendarHubClient";

export const metadata: Metadata = {
  title: "Today Calendar – Is Today a Holiday or Compliance Due Date?",
  description: "Check if today is a public or bank holiday in India, and view statutory tax and MCA deadlines expiring today.",
  keywords: ["Today holiday India", "Is today a bank holiday", "Compliance due today"],
  alternates: {
    canonical: "https://www.compliancedraft.co.in/calendar/today",
  },
};

export default function UnifiedTodayCalendarPage() {
  return (
    <UnifiedCalendarHubClient
      initialYear={2026}
      pageTitle="Today – India Holiday & Compliance Calendar"
      pageDescription="Real-time dashboard showing today's holiday status, upcoming long weekend countdowns, and pending statutory tax filings."
    />
  );
}
