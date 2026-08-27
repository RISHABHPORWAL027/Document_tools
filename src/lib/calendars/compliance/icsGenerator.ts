import { ComplianceItem } from "./types";

export function generateGoogleCalendarUrl(item: ComplianceItem): string {
  const title = encodeURIComponent(`Compliance Deadline: ${item.title}`);
  const details = encodeURIComponent(
    `${item.description}\n\nApplicable to: ${item.whoShouldFile}\nPenalty if missed: ${item.penaltyInfo || "N/A"}\n\nComplianceDraft: https://www.compliancedraft.co.in/compliance-calendar`
  );

  // Format YYYYMMDD
  const dateParts = item.dueDate.split("-");
  const dateStr = dateParts.join("");
  const datesParam = `${dateStr}/${dateStr}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${datesParam}`;
}

export function downloadIcsFile(item: ComplianceItem) {
  const dateParts = item.dueDate.split("-");
  const dateStr = dateParts.join("");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ComplianceDraft//India Compliance Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `SUMMARY:Compliance Due: ${item.title}`,
    `DESCRIPTION:${item.description} - Applicable to ${item.whoShouldFile}`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${dateStr}`,
    "STATUS:CONFIRMED",
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${item.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
