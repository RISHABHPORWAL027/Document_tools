import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUnifiedEvents } from "@/lib/calendars/unifiedEngine";
import UnifiedCalendarHubClient from "@/components/calendar/UnifiedCalendarHubClient";
import UnifiedCalendarSchema from "@/components/calendar/UnifiedCalendarSchema";

interface Props {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  return [{ year: "2026" }, { year: "2027" }, { year: "2028" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const yr = Number(year);

  if (isNaN(yr) || yr < 2025 || yr > 2030) {
    return { title: "Year Not Found" };
  }

  const url = `https://www.compliancedraft.co.in/calendar/${yr}`;

  return {
    title: `India Calendar ${yr} – Holidays, Long Weekends & Compliance Due Dates`,
    description: `Official calendar for ${yr} covering Indian public, bank, festival, state holidays, and GST/Tax compliance deadlines.`,
    keywords: [`India calendar ${yr}`, `Holidays ${yr}`, `Tax due dates ${yr}`],
    alternates: { canonical: url },
  };
}

export default async function UnifiedCalendarYearPage({ params }: Props) {
  const { year } = await params;
  const yr = Number(year);

  if (isNaN(yr) || yr < 2025 || yr > 2030) {
    notFound();
  }

  const events = getUnifiedEvents(yr);

  return (
    <>
      <UnifiedCalendarSchema events={events} title={`India Calendar ${yr}`} />
      <UnifiedCalendarHubClient initialYear={yr} initialMonth={1} pageTitle={`India Calendar ${yr}`} />
    </>
  );
}
