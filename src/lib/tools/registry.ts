import type { ToolCategory, ToolDefinition, ToolCategoryId } from "./types";
import { boardMeetingNoticeTemplateHtml } from "@/lib/templates/board-meeting-notice";

export const CATEGORIES: ToolCategory[] = [
  {
    id: "company-secretary",
    name: "Company Secretary",
    summary: "Meeting notices, minutes, board resolutions, MCA attachments.",
  },
  {
    id: "chartered-accountant",
    name: "Chartered Accountant",
    summary: "GST, tax summaries, audit letters, client/KYC documents.",
  },
  {
    id: "legal",
    name: "Legal",
    summary: "Agreements like NDA, service agreement, freelancer agreement.",
  },
  {
    id: "compliance-support",
    name: "Compliance Support",
    summary: "Checklists and document requirement generators.",
  },
];

export const TOOLS: Record<string, ToolDefinition> = {
  "board-meeting-notice": {
    id: "board-meeting-notice",
    categoryId: "company-secretary",
    title: "Board Meeting Notice Generator",
    summary:
      "Generate a Board Meeting notice with agenda items, date/time, and venue.",
    keywords: ["board meeting notice", "cs", "companies act", "notice"],
    popularity: 100,
    fields: [
      {
        type: "text",
        name: "companyName",
        label: "Company Name",
        required: true,
        placeholder: "ABC Private Limited",
      },
      {
        type: "text",
        name: "cin",
        label: "CIN (optional)",
        placeholder: "U12345MH2020PTC000000",
      },
      {
        type: "text",
        name: "registeredOfficeAddress",
        label: "Registered Office Address",
        required: true,
        placeholder: "Full address as per records",
      },
      {
        type: "date",
        name: "meetingDate",
        label: "Meeting Date",
        required: true,
      },
      {
        type: "text",
        name: "meetingTime",
        label: "Meeting Time",
        required: true,
        placeholder: "11:00 AM",
      },
      {
        type: "text",
        name: "meetingVenue",
        label: "Meeting Venue",
        required: true,
        placeholder: "Registered Office / Video Conference",
      },
      {
        type: "text",
        name: "noticeDate",
        label: "Notice Date",
        required: true,
        placeholder: "09 May 2026",
      },
      {
        type: "text",
        name: "signatoryName",
        label: "Signatory Name",
        required: true,
        placeholder: "Name of Company Secretary / Director",
      },
      {
        type: "text",
        name: "signatoryDesignation",
        label: "Signatory Designation",
        required: true,
        placeholder: "Company Secretary / Director",
      },
      {
        type: "repeatable",
        name: "agendaItems",
        label: "Agenda Items",
        description: "Add/remove agenda items for the meeting.",
        minItems: 1,
        itemLabel: "Agenda item",
        fields: [
          {
            type: "text",
            name: "title",
            label: "Agenda Title",
            required: true,
            placeholder: "To consider and approve ...",
          },
          {
            type: "textarea",
            name: "details",
            label: "Details (optional)",
            placeholder: "Any short supporting notes",
          },
        ],
      },
    ],
    template: {
      format: "html",
      source: boardMeetingNoticeTemplateHtml,
    },
  },
};

export function getToolsByCategory(categoryId: ToolCategoryId) {
  return Object.values(TOOLS)
    .filter((t) => t.categoryId === categoryId)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
}

export function getTool(toolId: string) {
  return TOOLS[toolId] ?? null;
}

export function getPopularTools(limit = 6) {
  return Object.values(TOOLS)
    .slice()
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, limit);
}

