import { escapeHtml } from "@/lib/utils";

export interface AttendanceSheetData {
  companyName: string;
  meetingDay: string; // e.g. "Thursday"
  meetingDate: string; // ISO date
  meetingTime: string; // e.g. "11:00 AM"
  registeredOffice: string;
  directors: { name: string; designation: string; signatureImage?: string }[];
  chairmanName: string;
  chairmanDin: string;
  chairmanSignature?: string;
}

function e(s: string): string {
  return escapeHtml(s || "").replace(/\n/g, "<br/>");
}

const BLANK = "________________";

function parseDateParts(iso: string): { dayName: string; formatted: string } {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso))
    return { dayName: BLANK, formatted: BLANK };
  const d = new Date(iso + "T00:00:00");
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const ord = (n: number) => { const s = ["TH","ST","ND","RD"]; const v = n%100; return s[(v-20)%10]||s[v]||s[0]; };
  return {
    dayName: days[d.getDay()],
    formatted: `${d.getDate()}${ord(d.getDate())} ${months[d.getMonth()]} , ${d.getFullYear()}`,
  };
}

export function buildAttendanceSheetHtml(data: AttendanceSheetData): string {
  const company = data.companyName?.trim() || BLANK;
  const dp = parseDateParts(data.meetingDate);
  const mDay = (data.meetingDay?.trim() || dp.dayName).toUpperCase();
  const mDateStr = (dp.formatted !== BLANK ? dp.formatted : data.meetingDate?.trim() || BLANK).toUpperCase();
  const time = data.meetingTime?.trim() || BLANK;
  const regOffice = data.registeredOffice?.trim() || BLANK;
  
  const chairman = data.chairmanName?.trim() || BLANK;
  const chairmanDin = data.chairmanDin?.trim() || BLANK;

  const dirs = data.directors && data.directors.length > 0 ? data.directors : [
    { name: "", designation: "Director" },
    { name: "", designation: "Director" }
  ];

  const tableRows = dirs.map((d, index) => `
    <tr>
      <td style="text-align: center; padding: 12px; border: 1px solid #000;">${index + 1}</td>
      <td style="padding: 12px; border: 1px solid #000;"><strong>${e(d.name?.trim() || BLANK)}</strong></td>
      <td style="padding: 12px; border: 1px solid #000;">${e(d.designation?.trim() || "DIRECTOR")}</td>
      <td style="padding: 12px; border: 1px solid #000; text-align: center; min-width: 45mm; height: 16mm; vertical-align: middle;">
        ${d.signatureImage ? `<img src="${d.signatureImage}" style="max-height: 12mm; max-width: 40mm; object-fit: contain;" />` : ""}
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    color: #000;
    background: #fff;
    line-height: 1.6;
  }
  .page {
    width: 100%;
    min-height: 297mm;
    margin: 0 auto;
    padding: 20mm 25mm;
    background: #fff;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .title-block {
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.7;
    margin-bottom: 8mm;
    font-size: 11pt;
  }

  .attendance-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8mm;
    font-size: 11pt;
  }
  .attendance-table th {
    background-color: #f5f5f5;
    font-weight: bold;
    text-align: left;
    padding: 12px;
    border: 1px solid #000;
    text-transform: uppercase;
  }

  .body-para {
    text-align: justify;
    line-height: 1.7;
    margin-bottom: 5mm;
  }

  .sig-block {
    margin-top: 12mm;
  }
  .sig-line {
    border-bottom: 1px solid #000;
    min-height: 12mm;
    display: flex;
    align-items: flex-end;
    margin-bottom: 2mm;
    max-width: 200px;
  }
  .sig-name { font-weight: bold; text-transform: uppercase; }
  .sig-desg { text-transform: uppercase; }

  @media print {
    body { padding: 0; }
    .page { width: 210mm; margin: 0; padding: 15mm 20mm; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="title-block">
    ATTENDANCE OF THE BOARD OF DIRECTORS OF <strong>${e(company)}</strong> AT THEIR MEETING HELD ON <strong>${e(mDay)}</strong>, <strong>${e(mDateStr)}</strong> AT <strong>${e(time)}</strong> AT THE REGISTERED OFFICE OF THE COMPANY AT <strong>${e(regOffice)}</strong>.
  </div>

  <table class="attendance-table">
    <thead>
      <tr>
        <th style="width: 10%; text-align: center;">S.No.</th>
        <th style="width: 45%;">Name of Director</th>
        <th style="width: 25%;">Designation</th>
        <th style="width: 20%; text-align: center;">Signature</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="body-para" style="margin-top: 8mm;">
    The notice of the BM was served to all the Board Members and the above said members have signed the attendance register in my presence.
  </div>

  <div class="sig-block">
    <div class="sig-line">
      ${data.chairmanSignature ? `<img src="${data.chairmanSignature}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
    </div>
    <div class="sig-name"><strong>${e(chairman)}</strong></div>
    <div class="sig-desg"><strong>DIRECTOR</strong></div>
    <div><strong>DIN: ${e(chairmanDin)}</strong></div>
  </div>

</div>
</body>
</html>`;
}
