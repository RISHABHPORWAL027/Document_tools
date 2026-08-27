import React from "react";
import { UnifiedCalendarEvent } from "@/lib/calendars/unifiedEngine";

interface Props {
  events: UnifiedCalendarEvent[];
  title: string;
}

export default function UnifiedCalendarSchema({ events, title }: Props) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: "Official Indian public holiday calendar and statutory business compliance filing deadlines.",
    itemListElement: events.map((evt, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Event",
        name: evt.title,
        startDate: evt.date,
        endDate: evt.date,
        description: evt.subtitle,
        eventStatus: "https://schema.org/EventScheduled",
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
