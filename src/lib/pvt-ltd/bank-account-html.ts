import { escapeHtml } from "@/lib/utils";

export interface BankAccountValues {
  companyName: string;
  cin: string;
  regAddress: string;
  meetingDate: string;
  meetingTime: string;
  meetingVenue: string;
  bankName: string;
  bankBranch: string;
  contactNumber: string;
  companyEmail: string;
  authorizedSignatories: {
    name: string;
    din: string;
    pan: string;
    designation: string;
  }[];
  signingMethod: "Single" | "Joint" | "Any Two";
  place: string;
  date: string;
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

function parseDateParts(iso: string): { day: string; monthDate: string; year: string } {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return { day: BLANK, monthDate: BLANK, year: BLANK };
  const d = new Date(iso + "T00:00:00");
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  return {
    day: days[d.getDay()],
    monthDate: `${d.getDate()}${getOrdinal(d.getDate())} ${months[d.getMonth()]}`,
    year: String(d.getFullYear()),
  };
}

function getOrdinal(n: number): string {
  const s = ["TH", "ST", "ND", "RD"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function buildBankAccountHtml(v: BankAccountValues): string {
  const company = v.companyName?.trim() || BLANK;
  const cin = v.cin?.trim() || BLANK;
  const regAddr = v.regAddress?.trim() || BLANK;
  const contactNumber = v.contactNumber?.trim() || BLANK;
  const companyEmail = v.companyEmail?.trim() || BLANK;
  const time = v.meetingTime?.trim() || BLANK;
  const regOfficeAddr = v.meetingVenue?.trim() || regAddr;

  const dp = parseDateParts(v.meetingDate);

  const sigs = v.authorizedSignatories || [];
  const sigRows = sigs.length > 0 ? sigs : [{ name: "", din: "", pan: "", designation: "Director" }];

  // Build director signature blocks (two-column layout at bottom)
  const directorBlocks = sigRows.map((s, i) => `
    <div class="dir-sig-block">
      <div class="dir-sig-line"></div>
      <div class="dir-name">${e(s.name?.trim() || BLANK)}</div>
      <div class="dir-desg">DIRECTOR</div>
      <div class="dir-din">DIN: ${e(s.din?.trim() || BLANK)}</div>
    </div>`).join("");

  // Director names inline for the resolution text
  const directorNamesInline = sigRows.map(s =>
    `${e(s.name?.trim() || BLANK)} (DIN: ${e(s.din?.trim() || BLANK)})`
  ).join(" & ");

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
    padding: 0;
    line-height: 1.6;
  }
  .page {
    width: 100%;
    min-height: 297mm;
    margin: 0 auto;
    padding: 20mm 25mm 20mm 25mm;
    background: #fff;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* ── Header ── */
  .header {
    text-align: center;
    margin-bottom: 6mm;
    border-bottom: 2px solid #000;
    padding-bottom: 4mm;
  }
  .company-name {
    font-size: 16pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin-bottom: 2mm;
  }
  .header-info {
    font-size: 10pt;
    color: #222;
    line-height: 1.5;
  }

  /* ── Title block ── */
  .title-block {
    text-align: center;
    font-weight: bold;
    font-size: 11pt;
    margin: 8mm 0 6mm 0;
    text-transform: uppercase;
    line-height: 1.7;
  }

  /* ── Sub-heading ── */
  .sub-heading {
    text-align: center;
    font-weight: bold;
    text-decoration: underline;
    text-transform: uppercase;
    margin-bottom: 6mm;
    font-size: 12pt;
  }

  /* ── Body paragraphs ── */
  .body-para {
    text-align: justify;
    line-height: 1.7;
    margin-bottom: 5mm;
    font-size: 12pt;
  }
  .body-para strong {
    font-weight: bold;
  }

  /* ── Certification block ── */
  .cert-block {
    text-align: center;
    font-weight: bold;
    font-style: italic;
    margin: 10mm 0 6mm 0;
    font-size: 11pt;
  }

  /* ── Signature section ── */
  .for-company {
    font-weight: bold;
    margin-top: 12mm;
    margin-bottom: 8mm;
    font-size: 12pt;
  }
  .dir-sig-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm 12mm;
    margin-top: 4mm;
  }
  .dir-sig-block {
    min-width: 0;
  }
  .dir-sig-line {
    border-bottom: 1px solid #000;
    height: 15mm;
    margin-bottom: 2mm;
  }
  .dir-name {
    font-weight: bold;
    font-size: 11pt;
    word-break: break-word;
  }
  .dir-desg {
    font-weight: bold;
    font-size: 10pt;
    margin-top: 1mm;
  }
  .dir-din {
    font-size: 10pt;
    margin-top: 1mm;
  }

  @media print {
    body { padding: 0; }
    .page { width: 210mm; margin: 0; padding: 15mm 20mm; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- ── Company Header ── -->
  <div class="header">
    <div class="company-name">${e(company)}</div>
    <div class="header-info">
      CIN: ${e(cin)}<br/>
      Regd. Office: ${e(regAddr)}<br/>
      Contact: ${e(contactNumber)} | Email: ${e(companyEmail)}
    </div>
  </div>

  <!-- ── Title ── -->
  <div class="title-block">
    CERTIFIED TRUE COPY OF THE RESOLUTION PASSED IN THE MEETING OF BOARD OF
    DIRECTORS OF ${e(company)}, HELD ON ${e(dp.day)}, ${e(dp.monthDate)}, ${e(dp.year)}
    AT ${e(time)} AT THE REGISTERED OFFICE OF THE COMPANY AT ${e(regOfficeAddr)}
  </div>

  <!-- ── Sub-heading ── -->
  <div class="sub-heading">Opening of Bank Account</div>

  <!-- ── Body ── -->
  <div class="body-para">
    A proposal to open a Current Account with a Bank was placed before the Board for conducting
    its day-to-day financial transactions. After discussions, the Board passed the following
    resolution unanimously:
  </div>

  <div class="body-para">
    <strong>"RESOLVED THAT</strong> the Current Account in the name of the Company, be opened name and
    style as <strong>"${e(company)}"</strong> with a bank and the said bank be and is hereby authorised to
    receive, collect and realise amounts of all cheques, bills of exchange, promissory notes, any
    other negotiable instruments, orders etc. issued and drawn in favor of the Company and / or
    cash deposited to the credit of the said account.
  </div>

  <div class="body-para">
    <strong>RESOLVED FURTHER THAT</strong> the said bank be and is hereby authorised to pay and honour
    all cheques, bills of exchange, promissory notes, any other negotiable instruments, orders etc.,
    expressed to be drawn on behalf of the company and to accept and act upon any instructions
    relating to the said account or accounts kept in the name of the Company or relating to any
    transactions of the Company with the bank, and ${directorNamesInline},
    Director of the Company be and is hereby authorized to sign the same on behalf of the Company.
  </div>

  <div class="body-para">
    <strong>RESOLVED FURTHER THAT</strong> a copy of this resolution along with a copy of the
    Memorandum and Articles of Association of the Company be communicated to the bank, under
    the signature of any director of the Company and this resolution shall remain in force until
    duly rescinded and notice thereof in writing is given to the bank by the Director of the Company."
  </div>

  <!-- ── Certification ── -->
  <div class="cert-block">//CERTIFIED TO BE TRUE COPY//</div>

  <!-- ── Signature ── -->
  <div class="for-company">For ${e(company)}</div>
  <div class="dir-sig-grid">
    ${directorBlocks}
  </div>

</div>
</body>
</html>`;
}
