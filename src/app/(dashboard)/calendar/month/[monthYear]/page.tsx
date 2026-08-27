import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUnifiedEvents } from "@/lib/calendars/unifiedEngine";
import UnifiedCalendarHubClient from "@/components/calendar/UnifiedCalendarHubClient";
import UnifiedCalendarSchema from "@/components/calendar/UnifiedCalendarSchema";

interface Props {
  params: Promise<{ monthYear: string }>;
}

const MONTHS_MAP: Record<string, number> = {
  "january-2026": 1,
  "february-2026": 2,
  "march-2026": 3,
  "april-2026": 4,
  "may-2026": 5,
  "june-2026": 6,
  "july-2026": 7,
  "august-2026": 8,
  "september-2026": 9,
  "october-2026": 10,
  "november-2026": 11,
  "december-2026": 12,
};

export async function generateStaticParams() {
  return Object.keys(MONTHS_MAP).map((m) => ({
    monthYear: m,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { monthYear } = await params;
  const monthNum = MONTHS_MAP[monthYear];

  if (!monthNum) {
    return { title: "Month Not Found" };
  }

  const monthName = monthYear.split("-")[0];
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const url = `https://www.compliancedraft.co.in/calendar/month/${monthYear}`;

  return {
    title: `${capitalizedMonth} 2026 Calendar – Holidays & Compliance Due Dates`,
    description: `Check all public holidays, bank holidays, long weekends, and GST/Tax compliance deadlines for ${capitalizedMonth} 2026 in India.`,
    keywords: [`${capitalizedMonth} 2026 calendar`, `Holidays in ${capitalizedMonth} 2026`, `${capitalizedMonth} GST due dates`],
    alternates: { canonical: url },
  };
}

export default async function MonthlyCalendarPage({ params }: Props) {
  const { monthYear } = await params;
  const monthNum = MONTHS_MAP[monthYear];

  if (!monthNum) {
    notFound();
  }

  const monthName = monthYear.split("-")[0];
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const events = getUnifiedEvents(2026, monthNum);

  return (
    <>
      <UnifiedCalendarSchema events={events} title={`${capitalizedMonth} 2026 Calendar`} />
      <UnifiedCalendarHubClient
        initialYear={2026}
        initialMonth={monthNum}
        pageTitle={`${capitalizedMonth} 2026 India Calendar`}
        pageDescription={`Holidays, long weekends, bank closures, and tax compliance due dates for ${capitalizedMonth} 2026.`}
      />
    </>
  );
}
