/** Appointment Letter — Auditor Casual Vacancy — pixel-perfect match to source. */

import { escapeHtml } from "@/lib/utils";

export interface AppointmentLetterCasualVacancyData {
  date: string;                // ISO date
  auditorFirmName: string;     // e.g. "M/s Arpit Gaur & Company"
  auditorFirmType: string;     // e.g. "Chartered Accountants"
  auditorAddress: string;
  companyName: string;
  financialYear: string;       // e.g. "2024-25"
  meetingDay: string;          // e.g. "Thursday"
  meetingDayOfMonth: string;   // e.g. "25th"
  meetingMonth: string;        // e.g. "September"
  meetingYear: string;         // e.g. "2025"
  signatoryName: string;       // Director who signs
  signatoryDin: string;
  signatureImage?: string;
}

function e(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}
const BLANK = "________________";

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export function buildAppointmentLetterCasualVacancyHtml(data: AppointmentLetterCasualVacancyData): string {
  const date = fmtDate(data.date?.trim() || "");
  const firmName = data.auditorFirmName?.trim() || BLANK;
  const firmType = data.auditorFirmType?.trim() || "Chartered Accountants";
  const firmAddr = data.auditorAddress?.trim() || BLANK;
  const company = data.companyName?.trim() || BLANK;
  const fy = data.financialYear?.trim() || BLANK;
  const mDay = data.meetingDay?.trim() || BLANK;
  const mDom = data.meetingDayOfMonth?.trim() || BLANK;
  const mMonth = data.meetingMonth?.trim() || BLANK;
  const mYear = data.meetingYear?.trim() || BLANK;
  const sigName = data.signatoryName?.trim() || BLANK;
  const sigDin = data.signatoryDin?.trim() || BLANK;

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

  .date-line {
    text-align: right;
    margin-bottom: 8mm;
  }

  .to-block {
    margin-bottom: 8mm;
    line-height: 1.7;
  }

  .subject {
    font-weight: bold;
    margin-bottom: 6mm;
    text-decoration: underline;
  }

  .salutation {
    margin-bottom: 6mm;
  }

  .body-para {
    text-align: justify;
    line-height: 1.7;
    margin-bottom: 5mm;
  }

  .closing {
    margin-top: 8mm;
    margin-bottom: 4mm;
  }

  .for-line {
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 8mm;
    margin-bottom: 10mm;
  }

  .sig-block {
    margin-top: 8mm;
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
    .page { width: 210mm; margin: 0; padding: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="date-line">Date: ${e(date)}</div>

  <div class="to-block">
    To,<br/>
    <strong>${e(firmName)}</strong><br/>
    (${e(firmType)})<br/>
    ${e(firmAddr)}
  </div>

  <div class="subject">Sub.: Your appointment as Statutory Auditor of the Company for the Financial Year ${e(fy)}.</div>

  <div class="salutation">Dear Sir,</div>

  <div class="body-para">
    We wish to inform you that you have been appointed as the Statutory Auditor of the Company for the financial year ${e(fy)} at the Extra Ordinary General Meeting of the Company held on ${e(mDay)}, the ${e(mDom)} Day of ${e(mMonth)}, ${e(mYear)} to hold office of the Statutory Auditor of the Company from the conclusion of this meeting until the conclusion of the ensuing Annual General Meeting.
  </div>

  <div class="body-para">Kindly convey your acceptance for your appointment within the statutory period.</div>

  <div class="closing">Thanking you.</div>

  <div class="for-line"><strong>FOR &amp; ON BEHALF OF BOARD OF DIRECTORS OF<br/>${e(company)}</strong></div>

  <div class="sig-block">
    <div class="sig-line">
      ${data.signatureImage ? `<img src="${data.signatureImage}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
    </div>
    <div class="sig-name"><strong>${e(sigName)}</strong></div>
    <div class="sig-desg"><strong>DIRECTOR</strong></div>
    <div><strong>DIN: ${e(sigDin)}</strong></div>
  </div>

</div>
</body>
</html>`;
}
