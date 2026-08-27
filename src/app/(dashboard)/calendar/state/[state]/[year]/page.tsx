import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDIAN_STATES, getStateBySlug } from "@/lib/calendars/holidays/holidaysData";
import { getUnifiedEvents } from "@/lib/calendars/unifiedEngine";
import UnifiedCalendarHubClient from "@/components/calendar/UnifiedCalendarHubClient";
import UnifiedCalendarSchema from "@/components/calendar/UnifiedCalendarSchema";

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

  const url = `https://www.compliancedraft.co.in/calendar/state/${state}/${yr}`;

  return {
    title: `${stateInfo.name} Holiday & Compliance Calendar ${yr}`,
    description: `Official public, bank, and festival holiday calendar for ${stateInfo.name} in ${yr} alongside statutory GST, Income Tax, TDS and MCA due dates.`,
    keywords: [`${stateInfo.name} calendar ${yr}`, `Holidays ${stateInfo.name} ${yr}`, `${stateInfo.capital} bank holidays`],
    alternates: { canonical: url },
  };
}

export default async function StateUnifiedCalendarPage({ params }: Props) {
  const { state, year } = await params;
  const stateInfo = getStateBySlug(state);
  const yr = Number(year);

  if (!stateInfo || isNaN(yr)) {
    notFound();
  }

  const events = getUnifiedEvents(yr, 0, state);

  return (
    <>
      <UnifiedCalendarSchema events={events} title={`${stateInfo.name} Calendar ${yr}`} />
      <UnifiedCalendarHubClient
        initialYear={yr}
        initialMonth={8}
        initialState={state}
        pageTitle={`${stateInfo.name} Holiday & Compliance Calendar ${yr}`}
        pageDescription={`State public holidays in ${stateInfo.name} (${stateInfo.capital}) and statutory business compliance due dates for ${yr}.`}
      />
    </>
  );
}
