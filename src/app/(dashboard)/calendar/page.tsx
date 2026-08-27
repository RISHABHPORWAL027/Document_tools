import type { Metadata } from "next";
import { getUnifiedEvents } from "@/lib/calendars/unifiedEngine";
import UnifiedCalendarHubClient from "@/components/calendar/UnifiedCalendarHubClient";
import UnifiedCalendarSchema from "@/components/calendar/UnifiedCalendarSchema";

export const metadata: Metadata = {
  title: "India Calendar 2026 – Holidays, Long Weekends & Compliance Due Dates",
  description: "Check Indian national, public, bank, festival, and state-wise holidays alongside statutory GST, Income Tax, TDS, and ROC compliance due dates.",
  keywords: ["India calendar 2026", "Holiday & compliance calendar", "Bank holidays 2026 India", "GST due date calendar 2026", "Long weekends 2026 India"],
  alternates: {
    canonical: "https://www.compliancedraft.co.in/calendar",
  },
  openGraph: {
    title: "India Calendar 2026 – ComplianceDraft",
    description: "Holidays, long weekends, leave opportunities and statutory tax compliance due dates all in one place.",
    url: "https://www.compliancedraft.co.in/calendar",
    type: "website",
  },
};

export default function UnifiedCalendarPage() {
  const events = getUnifiedEvents(2026);

  return (
    <>
      <UnifiedCalendarSchema events={events} title="India Calendar 2026" />
      <UnifiedCalendarHubClient initialYear={2026} initialMonth={8} />
    </>
  );
}
