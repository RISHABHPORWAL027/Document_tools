import { escapeHtml } from "@/lib/utils";

export interface BrFormData {
  companyName: string;
  cin?: string;
  regAddress: string;
  meetingDate: string;
  meetingTime: string;
  meetingVenue: string;
  auditorFirmName: string;
  auditorFrn: string;
  chairmanName: string;
  directors: { name: string; din: string; designation: string }[];
  signatoryName: string;
  signatoryDesignation: string;
  signatureImage?: string;
  place: string;
  date: string;
  resolutions: string[];
}

function e(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}
const BLANK = "________________";

function parseDateParts(iso: string): { dayName: string; dayNum: string; monthName: string; year: string; formatted: string } {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso))
    return { dayName: BLANK, dayNum: BLANK, monthName: BLANK, year: BLANK, formatted: BLANK };
  const d = new Date(iso + "T00:00:00");
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const ord = (n: number) => { const s = ["TH","ST","ND","RD"]; const v = n%100; return s[(v-20)%10]||s[v]||s[0]; };
  return {
    dayName: days[d.getDay()],
    dayNum: String(d.getDate()),
    monthName: months[d.getMonth()],
    year: String(d.getFullYear()),
    formatted: `${days[d.getDay()]}, ${d.getDate()}${ord(d.getDate())} ${months[d.getMonth()]}, ${d.getFullYear()}`,
  };
}

export function buildBrHtml(data: BrFormData) {
  const company = data.companyName?.trim() || BLANK;
  const regAddr = data.regAddress?.trim() || BLANK;
  const venue = data.meetingVenue?.trim() || regAddr;
  const dp = parseDateParts(data.meetingDate);
  const time = data.meetingTime?.trim() || "10:30 AM";
  const auditorFirm = data.auditorFirmName?.trim() || BLANK;
  const auditorFrn = data.auditorFrn?.trim() || BLANK;

  const dirs = data.directors?.length ? data.directors : [
    { name: "", din: "", designation: "Director" },
    { name: "", din: "", designation: "Director" },
  ];

  // Build director signature blocks
  const dirSigBlocks = dirs.map(d => `
    <div class="dir-sig-block">
      <div class="dir-sig-space"></div>
      <div class="dir-name">${e(d.name?.trim() || BLANK)}</div>
      <div class="dir-desg">${e(d.designation?.trim() || "DIRECTOR")}</div>
      <div class="dir-din">DIN: ${e(d.din?.trim() || BLANK)}</div>
    </div>`).join("");

  // Custom resolutions or default auditor appointment
  let resolutionsHtml = "";
  if (data.resolutions?.length && data.resolutions.some(r => r.trim())) {
    resolutionsHtml = data.resolutions
      .filter(r => r.trim())
      .map(res => `<div class="body-para">"<strong>RESOLVED THAT</strong> ${e(res)}"</div>`)
      .join("");
  } else {
    resolutionsHtml = `
    <div class="sub-heading">APPOINTMENT OF STATUTORY AUDITOR OF THE COMPANY</div>

    <div class="body-para">
      "<strong>RESOLVED THAT</strong> pursuant to the provisions of Section 139(6) and other applicable
      provisions, if any, of the Companies Act, 2013 read with the rules made thereunder,
      <strong>M/S ${e(auditorFirm)}, CHARTERED ACCOUNTANTS, (FRN: ${e(auditorFrn)})</strong> be and are hereby
      appointed as the First Statutory Auditors of the Company to hold office from the date of
      incorporation till the conclusion of the first Annual General Meeting, at such remuneration
      as may be mutually agreed between the Board of Directors and the Auditors."
    </div>

    <div class="body-para">
      "<strong>RESOLVED FURTHER THAT</strong> any Director of the Company be and is hereby authorized to sign
      and file necessary forms and do all such acts, deeds and things as may be required to give
      effect to this resolution."
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      background: #fff;
      padding: 0;
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

    /* ── Title ── */
    .title-block {
      text-align: center;
      font-weight: bold;
      font-size: 11pt;
      text-transform: uppercase;
      line-height: 1.7;
      margin-bottom: 8mm;
    }
    .sub-heading {
      text-align: center;
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      margin-bottom: 6mm;
      font-size: 12pt;
    }

    /* ── Body ── */
    .body-para {
      text-align: justify;
      line-height: 1.7;
      margin-bottom: 5mm;
      font-size: 12pt;
    }

    /* ── Certification ── */
    .cert-block {
      text-align: center;
      font-weight: bold;
      font-style: italic;
      margin: 10mm 0 6mm 0;
      font-size: 11pt;
    }

    /* ── Signature ── */
    .for-company {
      font-weight: bold;
      margin-top: 10mm;
      margin-bottom: 8mm;
      font-size: 12pt;
    }
    .dir-sig-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm 12mm;
      margin-top: 4mm;
    }
    .dir-sig-block { min-width: 0; }
    .dir-sig-space { height: 15mm; border-bottom: 1px solid #000; margin-bottom: 2mm; }
    .dir-name { font-weight: bold; font-size: 11pt; word-break: break-word; }
    .dir-desg { font-weight: bold; font-size: 10pt; margin-top: 1mm; }
    .dir-din { font-size: 10pt; margin-top: 1mm; }

    @media print {
      body { padding: 0; }
      .page { width: 210mm; margin: 0; padding: 15mm 20mm; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- ── Title ── -->
    <div class="title-block">
      CERTIFIED TRUE COPY OF THE RESOLUTION PASSED IN THE MEETING OF BOARD OF DIRECTORS OF
      ${e(company)}, HELD ON ${e(dp.formatted)} AT ${e(time)} AT THE REGISTERED OFFICE
      OF THE COMPANY AT ${e(venue)}
    </div>

    <!-- ── Resolutions ── -->
    ${resolutionsHtml}

    <!-- ── Certification ── -->
    <div class="cert-block">//Certified true Copy//</div>

    <!-- ── Signature ── -->
    <div class="for-company">For ${e(company)}</div>
    <div class="dir-sig-grid">
      ${dirSigBlocks}
    </div>

  </div>
</body>
</html>`;
}
