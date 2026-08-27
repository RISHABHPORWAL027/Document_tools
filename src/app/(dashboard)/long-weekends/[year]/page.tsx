import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findLongWeekends } from "@/lib/calendars/holidays/longWeekendEngine";
import LongWeekendClient from "@/components/holidays/LongWeekendClient";

interface Props {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  return [{ year: "2026" }, { year: "2027" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const yr = Number(year);

  if (isNaN(yr)) {
    return { title: "Not Found" };
  }

  const url = `https://www.compliancedraft.co.in/long-weekends/${yr}`;

  return {
    title: `Long Weekends in India ${yr} – List of Long Weekend Dates`,
    description: `Complete list of natural 3-day and 4-day long weekends in India for ${yr}. Plan your leaves and travel dates.`,
    keywords: [`Long weekends ${yr} India`, `Best leave dates ${yr} India`, `Long weekend calendar`],
    alternates: { canonical: url },
  };
}

export default async function LongWeekendsPage({ params }: Props) {
  const { year } = await params;
  const yr = Number(year);

  if (isNaN(yr)) {
    notFound();
  }

  const plans = findLongWeekends(yr);

  return <LongWeekendClient plans={plans} year={yr} />;
}
