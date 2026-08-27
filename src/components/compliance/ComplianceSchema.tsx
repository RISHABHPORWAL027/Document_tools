import React from "react";
import { ComplianceItem } from "@/lib/calendars/compliance/types";

interface Props {
  items: ComplianceItem[];
  title: string;
}

export default function ComplianceSchema({ items, title }: Props) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: "Official Indian GST, Income Tax, TDS, and ROC compliance due date schedule.",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Event",
        name: `Compliance Due: ${item.title}`,
        startDate: item.dueDate,
        endDate: item.dueDate,
        description: item.description,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          url: item.officialLink || "https://www.compliancedraft.co.in/compliance-calendar",
        },
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
