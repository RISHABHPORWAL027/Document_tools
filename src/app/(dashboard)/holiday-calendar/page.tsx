import type { Metadata } from "next";
import { HOLIDAYS_DATA, INDIAN_STATES, getHolidaysByYear } from "@/lib/calendars/holidays/holidaysData";
import HolidayHubClient from "@/components/holidays/HolidayHubClient";
import HolidaySchema from "@/components/holidays/HolidaySchema";

export const metadata: Metadata = {
  title: "Indian Holiday Calendar 2026 – Public, Bank & State Holidays",
  description: "Check official Indian national, public, bank, festival, and state-wise holidays for 2026. Plan your leaves and long weekend trips in advance.",
  keywords: ["Indian holiday calendar 2026", "Bank holidays 2026 India", "State holidays Karnataka 2026", "Public holidays 2026 India", "Long weekend finder"],
  alternates: {
    canonical: "https://www.compliancedraft.co.in/holiday-calendar",
  },
  openGraph: {
    title: "Indian Holiday Calendar 2026 – ComplianceDraft",
    description: "Complete list of Indian national, bank, festival and state-wise public holidays for 2026.",
    url: "https://www.compliancedraft.co.in/holiday-calendar",
    type: "website",
  },
};

export default function HolidayCalendarPage() {
  const holidays = getHolidaysByYear(2026);

  return (
    <>
      <HolidaySchema holidays={holidays} year={2026} />
      <HolidayHubClient initialHolidays={holidays} year={2026} states={INDIAN_STATES} />
    </>
  );
}
