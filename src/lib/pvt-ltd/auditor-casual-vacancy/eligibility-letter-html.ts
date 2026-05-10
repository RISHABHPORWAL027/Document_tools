/** Eligibility Cum Consent Letter — Auditor Casual Vacancy — pixel-perfect match to source. */

import { escapeHtml } from "@/lib/utils";

export interface EligibilityCasualVacancyData {
  date: string;                // ISO or formatted
  companyName: string;
  companyAddress: string;
  firmName: string;            // e.g. "Arpit Gaur & Company"
  egmDate: string;             // e.g. "25th September, 2025"
  financialYear: string;       // e.g. "2024-25"
  auditorPan: string;
  frn: string;                 // e.g. "035851C"
  firmAddress: string;
  firmCity: string;
  firmState: string;
  firmPincode: string;
  auditorEmail: string;
  proprietorName: string;      // Person who signs
  membershipNo: string;
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
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
}

export function buildEligibilityCasualVacancyHtml(data: EligibilityCasualVacancyData): string {
  const date = fmtDate(data.date?.trim() || "");
  const company = data.companyName?.trim() || BLANK;
  const companyAddr = data.companyAddress?.trim() || BLANK;
  const firm = data.firmName?.trim() || BLANK;
  const egmDate = data.egmDate?.trim() || BLANK;
  const fy = data.financialYear?.trim() || BLANK;
  const pan = data.auditorPan?.trim() || BLANK;
  const frn = data.frn?.trim() || BLANK;
  const firmAddr = data.firmAddress?.trim() || BLANK;
  const city = data.firmCity?.trim() || BLANK;
  const state = data.firmState?.trim() || BLANK;
  const pincode = data.firmPincode?.trim() || BLANK;
  const email = data.auditorEmail?.trim() || BLANK;
  const proprietor = data.proprietorName?.trim() || BLANK;
  const memNo = data.membershipNo?.trim() || BLANK;

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

  .letterhead-note {
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: underline;
    margin-bottom: 5mm;
    font-size: 11pt;
  }

  .date-line {
    margin-bottom: 6mm;
  }

  .to-block {
    margin-bottom: 6mm;
    line-height: 1.7;
  }

  .subject {
    font-weight: bold;
    margin-bottom: 6mm;
    text-align: justify;
    line-height: 1.6;
  }

  .salutation {
    margin-bottom: 5mm;
  }

  .body-para {
    text-align: justify;
    line-height: 1.7;
    margin-bottom: 5mm;
  }

  ol.declarations {
    margin-left: 20px;
    margin-bottom: 6mm;
  }
  ol.declarations li {
    margin-bottom: 4mm;
    text-align: justify;
    line-height: 1.6;
  }

  .adt-table {
    width: 100%;
    border-collapse: collapse;
    margin: 6mm 0;
    font-size: 11pt;
  }
  .adt-table td {
    border: 1px solid #000;
    padding: 5px 8px;
    vertical-align: top;
  }
  .adt-table .label-col {
    width: 50%;
    font-weight: bold;
  }

  .closing {
    margin-top: 8mm;
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
  .sig-name { font-weight: bold; }

  @media print {
    body { padding: 0; }
    .page { width: 210mm; margin: 0; padding: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="letterhead-note">ON THE LETTER HEAD OF AUDITOR</div>

  <div class="date-line">${e(date)}</div>

  <div class="to-block">
    The Board of Directors,<br/>
    <strong>${e(company)}</strong><br/>
    ${e(companyAddr)}
  </div>

  <div class="subject">
    Sub: Certificate of eligibility cum consent to act as auditor (under section 139 read with section 141 of the Companies Act, 2013).
  </div>

  <div class="salutation">Dear Sir,</div>

  <div class="body-para">
    With reference to your proposal of appointment of our firm as Statutory Auditors of the company in the forthcoming EGM to be held on ${e(egmDate)} till the conclusion of the ensuing AGM of the Company to be held for the year ${e(fy)} to conduct statutory Audit of the company; we thankfully certify and confirm that in case of our firm is being appointed as the auditor we are desirous and ready to act as auditors of the company and do declare that:
  </div>

  <ol class="declarations">
    <li>None of the disqualifications under Section 141 of the Companies Act, 2013 applies to us and we are qualified for appointment as statutory auditors of the company.</li>
    <li>There are no adverse remark/ disciplinary proceedings pending/ initiated against the firm/ any of its partners on the records of ICAI, which would make them ineligible for appointment as auditors.</li>
    <li>In addition to the requirement of section 141(3)(d) of the Companies Act, 2013 in regards to indebtness, the spouse, dependent children and wholly or mainly dependent parents, brothers, sisters or any of them, of any of the partners of the firm are not indebted to the company.</li>
    <li>None of the partners or their spouses, dependent children and wholly or mainly dependent parents, brothers, sisters or any of them, of any of the partners of the firm has been declared willful defaulters by any bank/ financial institution.</li>
    <li>If the Re-appointment of our firm is made as Statutory Auditor, it shall be within the ceiling provided under section 141 of the Companies Act, 2013.</li>
  </ol>

  <div class="body-para">
    We further submit the requisite information as required while filing Form ADT-1 to MCA portal as under:
  </div>

  <table class="adt-table">
    <tbody>
      <tr>
        <td class="label-col">Name of the Auditor or Auditor's firm</td>
        <td>${e(firm)}</td>
      </tr>
      <tr>
        <td class="label-col">Income Tax PAN of Auditor or auditor's firm</td>
        <td>${e(pan)}</td>
      </tr>
      <tr>
        <td class="label-col">Auditor's firm's registration number</td>
        <td>${e(frn)}</td>
      </tr>
      <tr>
        <td class="label-col">Address of the Auditor or auditor's firm</td>
        <td>${e(firmAddr)}</td>
      </tr>
      <tr>
        <td class="label-col">City</td>
        <td>${e(city)}</td>
      </tr>
      <tr>
        <td class="label-col">State</td>
        <td>${e(state)}</td>
      </tr>
      <tr>
        <td class="label-col">Pin code</td>
        <td>${e(pincode)}</td>
      </tr>
      <tr>
        <td class="label-col">Email id of the auditor or auditor's firm</td>
        <td>${e(email)}</td>
      </tr>
    </tbody>
  </table>

  <div class="closing">
    Thanking you,<br/><br/>
    Yours faithfully,
  </div>

  <div class="sig-block">
    <strong>For ${e(firm)}</strong><br/>
    <strong>Chartered Accountants</strong>
    <div class="sig-line">
      ${data.signatureImage ? `<img src="${data.signatureImage}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
    </div>
    <div class="sig-name">${e(proprietor)}</div>
    <div>Proprietor</div>
    <div>Membership No. ${e(memNo)}</div>
  </div>

</div>
</body>
</html>`;
}
