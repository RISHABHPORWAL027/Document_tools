import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDIAN_STATES, getStateBySlug, getStateHolidays } from "@/lib/calendars/holidays/holidaysData";
import StateHolidayClient from "@/components/holidays/StateHolidayClient";
import HolidaySchema from "@/components/holidays/HolidaySchema";

interface Props {
  params: Promise<{ state: string; year: string }>;
}

export async function generateStaticParams() {
  const years = ["2026", "2027"];
  const paramsList: { state: string; year: string }[] = [];

  for (const st of INDIAN_STATES) {
    for (const yr of years) {
      paramsList.push({ state: st.slug, year: yr });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, year } = await params;
  const stateInfo = getStateBySlug(state);
  const yr = Number(year);

  if (!stateInfo || isNaN(yr)) {
    return { title: "State Calendar Not Found" };
  }

  const url = `https://www.compliancedraft.co.in/holiday-calendar/state/${state}/${yr}`;

  return {
    title: `${stateInfo.name} Holiday Calendar ${yr} – Bank & State Holidays`,
    description: `Official government, public, and bank holiday list for ${stateInfo.name} in ${yr}. Capital: ${stateInfo.capital}.`,
    keywords: [`${stateInfo.name} holiday calendar ${yr}`, `Public holidays ${stateInfo.name}`, `Bank holidays ${stateInfo.capital}`],
    alternates: { canonical: url },
  };
}

export default async function StateHolidayPage({ params }: Props) {
  const { state, year } = await params;
  const stateInfo = getStateBySlug(state);
  const yr = Number(year);

  if (!stateInfo || isNaN(yr)) {
    notFound();
  }

  const holidays = getStateHolidays(state, yr);

  return (
    <>
      <HolidaySchema holidays={holidays} year={yr} />
      <StateHolidayClient stateInfo={stateInfo} holidays={holidays} year={yr} />
    </>
  );
}
