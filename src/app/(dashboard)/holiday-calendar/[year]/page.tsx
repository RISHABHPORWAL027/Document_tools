import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDIAN_STATES, getHolidaysByYear } from "@/lib/calendars/holidays/holidaysData";
import HolidayHubClient from "@/components/holidays/HolidayHubClient";
import HolidaySchema from "@/components/holidays/HolidaySchema";

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

  const url = `https://www.compliancedraft.co.in/holiday-calendar/${yr}`;

  return {
    title: `Indian Holiday Calendar ${yr} – Public, Bank & State Holidays`,
    description: `Official list of Indian public, bank, festival and state-wise holidays for ${yr}. Plan your long weekend trips and annual leave requests.`,
    keywords: [`Holiday calendar ${yr} India`, `Bank holidays ${yr}`, `Public holidays ${yr} India`],
    alternates: { canonical: url },
  };
}

export default async function HolidayYearPage({ params }: Props) {
  const { year } = await params;
  const yr = Number(year);

  if (isNaN(yr) || yr < 2025 || yr > 2030) {
    notFound();
  }

  const holidays = getHolidaysByYear(yr);

  return (
    <>
      <HolidaySchema holidays={holidays} year={yr} />
      <HolidayHubClient initialHolidays={holidays} year={yr} states={INDIAN_STATES} />
    </>
  );
}
