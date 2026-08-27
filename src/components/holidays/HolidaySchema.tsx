import React from "react";
import { HolidayItem } from "@/lib/calendars/holidays/types";

interface Props {
  holidays: HolidayItem[];
  year: number;
}

export default function HolidaySchema({ holidays, year }: Props) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Indian Holiday Calendar ${year}`,
    description: `Official public, bank, national and state holiday calendar for India in ${year}.`,
    itemListElement: holidays.map((h, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Event",
        name: h.title,
        startDate: h.date,
        endDate: h.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: "India",
        },
        description: h.description || `${h.title} - ${h.categoryName}`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
