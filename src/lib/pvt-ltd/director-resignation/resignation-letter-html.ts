import { escapeHtml } from "@/lib/utils";

export interface ResignationLetterDirectorData {
  date: string; // ISO date or formatted date
  companyName: string;
  companyCin?: string;
  companyAddress: string;
  companyPhone?: string;
  companyEmail?: string;
  directorName: string;
  effectiveDate: string; // ISO date or formatted date
  din: string;
  signatureImage?: string;
}

function e(s: string): string {
  return escapeHtml(s || "").replace(/\n/g, "<br/>");
}

const BLANK = "________________";

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export function buildResignationLetterDirectorHtml(data: ResignationLetterDirectorData): string {
  const date = fmtDate(data.date?.trim() || "");
  const company = data.companyName?.trim() || BLANK;
  const cin = data.companyCin?.trim() || "";
  const companyAddr = data.companyAddress?.trim() || BLANK;
  const companyPhone = data.companyPhone?.trim() || "";
  const companyEmail = data.companyEmail?.trim() || "";
  const directorName = data.directorName?.trim() || BLANK;
  const effectiveDate = fmtDate(data.effectiveDate?.trim() || "");
  const din = data.din?.trim() || BLANK;

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

  /* Header Letterhead */
  .header-letterhead {
    border-bottom: 2px solid #000;
    padding-bottom: 3mm;
    margin-bottom: 8mm;
    text-align: center;
    font-family: "Times New Roman", Times, serif;
    font-weight: bold;
    color: #000;
  }
  .header-company-name {
    font-size: 14pt;
    text-transform: uppercase;
    margin-bottom: 1.5mm;
  }
  .header-cin {
    font-size: 9.5pt;
    font-weight: normal;
    margin-bottom: 1mm;
  }
  .header-office {
    font-size: 9.5pt;
    font-weight: normal;
    margin-bottom: 1mm;
  }
  .header-contact {
    font-size: 9.5pt;
    font-weight: normal;
  }

  .date-line {
    text-align: left;
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
    .page { width: 210mm; margin: 0; padding: 15mm 20mm; }
  }
</style>
</head>
<body>
<div class="page">
  <!-- ── Header Company Details (Letterhead) ── -->
  <div class="header-letterhead">
    <div class="header-company-name">${e(company)}</div>
    <div class="header-cin">CIN: ${e(cin)}</div>
    <div class="header-office">Regd. Office: ${e(companyAddr)}</div>
    <div class="header-contact">Contact No.: ${e(companyPhone)}; Email id: ${e(companyEmail)}</div>
  </div>

  <div class="date-line"><strong>Date:</strong> ${e(date)}</div>

  <div class="to-block">
    To,<br/>
    <strong>The Board of Directors</strong><br/>
    <strong>${e(company)}</strong><br/>
    ${e(companyAddr)}
  </div>

  <div class="subject">Subject: Resignation from the Position of Director</div>

  <div class="salutation">Dear Board,</div>

  <div class="body-para">
    I, <strong>${e(directorName)}</strong>, hereby tender my resignation from the position of Director of <strong>${e(company)}</strong>, with effect from <strong>${e(effectiveDate)}</strong>. Please consider this letter as my formal notice of resignation.
  </div>

  <div class="body-para">
    Due to some unavoidable circumstances, I am unable to continue as a Director on the Board. I thank the Board and my colleagues for the support, trust, and cooperation extended to me during my tenure.
  </div>

  <div class="body-para">
    I request the Board to kindly accept my resignation and arrange for the necessary filings with the Registrar of Companies and other regulatory bodies, as required.
  </div>

  <div class="body-para">
    Please acknowledge the receipt and acceptance of this resignation.
  </div>

  <div class="closing">Yours sincerely,</div>

  <div class="sig-block">
    <div class="sig-line">
      ${data.signatureImage ? `<img src="${data.signatureImage}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
    </div>
    <div class="sig-name"><strong>${e(directorName)}</strong></div>
    <div class="sig-desg"><strong>DIRECTOR</strong></div>
    <div><strong>DIN: ${e(din)}</strong></div>
  </div>

</div>
</body>
</html>`;
}
