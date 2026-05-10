import { escapeHtml } from "@/lib/utils";

export interface AppointmentLetterData {
  companyName: string;
  cin: string;
  regAddress: string;
  date: string;
  appointeeName: string;
  appointeeFrn: string;
  appointeeAddress: string;
  meetingDate: string;
  designation: string;
  effectiveDate: string;
  termYears: string;
  directors: { name: string; din: string; designation: string }[];
  signatoryName: string;
  signatoryDesignation: string;
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

function fmtDateSlash(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const parts = iso.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function parseDateParts(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return BLANK;
  const d = new Date(iso + "T00:00:00");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const ord = (n: number) => { const s = ["th","st","nd","rd"]; const v = n%100; return s[(v-20)%10]||s[v]||s[0]; };
  return `${d.getDate()}${ord(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function buildAppointmentLetterHtml(data: AppointmentLetterData) {
  const company = data.companyName?.trim() || BLANK;
  const appointee = data.appointeeName?.trim() || BLANK;
  const appointeeFrn = data.appointeeFrn?.trim() || "";
  const appointeeAddr = data.appointeeAddress?.trim() || BLANK;
  const date = fmtDateSlash(data.date?.trim() || "");
  const meetingDateText = parseDateParts(data.meetingDate?.trim() || "");

  const dirs = data.directors?.length ? data.directors : [
    { name: "", din: "", designation: "Director" },
    { name: "", din: "", designation: "Director" },
  ];

  const dirSigBlocks = dirs.map(d => `
    <div class="dir-sig-block">
      <div class="dir-sig-space"></div>
      <div class="dir-name">${e(d.name?.trim() || BLANK)}</div>
      <div class="dir-desg">${e(d.designation?.trim() || "DIRECTOR")}</div>
      <div class="dir-din">DIN: ${e(d.din?.trim() || BLANK)}</div>
    </div>`).join("");

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
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 20mm 25mm;
      background: #fff;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .date-row { margin-bottom: 6mm; font-size: 12pt; }
    .to-block { margin-bottom: 6mm; font-size: 12pt; line-height: 1.7; }
    .subject {
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 6mm;
      font-size: 12pt;
    }
    .body-para {
      text-align: justify;
      line-height: 1.7;
      margin-bottom: 5mm;
      font-size: 12pt;
    }
    .closing { margin-top: 6mm; font-size: 12pt; }

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
      .page { margin: 0; padding: 15mm 20mm; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- ── Date ── -->
    <div class="date-row">Date: ${e(date)}</div>

    <!-- ── To ── -->
    <div class="to-block">
      <strong>To,</strong><br/>
      <strong>M/S ${e(appointee)}</strong><br/>
      <strong>CHARTERED ACCOUNTANTS</strong><br/>
      ${appointeeFrn ? `<strong>(FRN: ${e(appointeeFrn)})</strong><br/>` : ""}
      <strong>Regd Add</strong>: ${e(appointeeAddr)}
    </div>

    <!-- ── Subject ── -->
    <div class="subject">SUBJECT: APPOINTMENT AS STATUTORY AUDITOR OF THE COMPANY</div>

    <!-- ── Body ── -->
    <div class="body-para">Dear Sir,</div>

    <div class="body-para">
      This is to inform you that, your firm have been appointed as the Statutory Auditors of the
      Company at the Board Meeting of the company held on ${e(meetingDateText)} to hold office from
      the date of incorporation till the conclusion of the first Annual General Meeting.
    </div>

    <div class="body-para">
      Kindly convey your acceptance letter for your appointment within the statutory period.
    </div>

    <div class="closing">Thanking you.</div>

    <!-- ── Signature ── -->
    <div class="for-company">For ${e(company)}</div>
    <div class="dir-sig-grid">
      ${dirSigBlocks}
    </div>

  </div>
</body>
</html>`;
}
