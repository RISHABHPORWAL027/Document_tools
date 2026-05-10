/** EGM Resolution — Appointment of Auditor to fill Casual Vacancy — pixel-perfect match to source. */

import { escapeHtml } from "@/lib/utils";

export interface EgmResolutionCasualVacancyData {
  companyName: string;
  meetingDay: string;         // e.g. "THURSDAY"
  meetingDayOfMonth: string;  // e.g. "25TH"
  meetingMonth: string;       // e.g. "SEPTEMBER"
  meetingYear: string;        // e.g. "2025"
  registeredOfficeAddress: string;
  meetingTime: string;        // e.g. "04.00 P.M."
  newAuditorName: string;     // e.g. "M/S Arpit Gaur & Company"
  newAuditorType: string;     // e.g. "Chartered Accountants"
  newAuditorFrn: string;      // e.g. "035851C"
  oldAuditorName: string;     // e.g. "M/s Bhavna Jain & Co."
  oldAuditorType: string;     // e.g. "Chartered Accountants"
  oldAuditorFrn: string;      // e.g. "020605C"
  resignationDate: string;    // e.g. "22nd September 2025"
  financialYear: string;      // e.g. "2024-25"
  directors: Array<{
    name: string;
    din: string;
    designation: string;      // e.g. "DIRECTOR"
  }>;
}

function e(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}
const BLANK = "________________";

export function buildEgmResolutionCasualVacancyHtml(data: EgmResolutionCasualVacancyData): string {
  const company = data.companyName?.trim() || BLANK;
  const meetingDay = data.meetingDay?.trim() || BLANK;
  const meetingDayOfMonth = data.meetingDayOfMonth?.trim() || BLANK;
  const meetingMonth = data.meetingMonth?.trim() || BLANK;
  const meetingYear = data.meetingYear?.trim() || BLANK;
  const regAddr = data.registeredOfficeAddress?.trim() || BLANK;
  const meetingTime = data.meetingTime?.trim() || BLANK;
  const newAuditor = data.newAuditorName?.trim() || BLANK;
  const newAuditorType = data.newAuditorType?.trim() || "Chartered Accountants";
  const newFrn = data.newAuditorFrn?.trim() || BLANK;
  const oldAuditor = data.oldAuditorName?.trim() || BLANK;
  const oldAuditorType = data.oldAuditorType?.trim() || "Chartered Accountants";
  const oldFrn = data.oldAuditorFrn?.trim() || BLANK;
  const resignDate = data.resignationDate?.trim() || BLANK;
  const fy = data.financialYear?.trim() || BLANK;
  const dirs = data.directors?.length > 0 ? data.directors : [
    { name: "", din: "", designation: "DIRECTOR" },
    { name: "", din: "", designation: "DIRECTOR" },
  ];

  const directorColumns = dirs.map(d => `
    <div class="dir-col">
      <div class="dir-name">${e(d.name?.trim() || BLANK)}</div>
      <div class="dir-desg">${e(d.designation?.trim() || "DIRECTOR")}</div>
      <div class="dir-din">DIN: ${e(d.din?.trim() || BLANK)}</div>
    </div>
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
    padding: 18mm 22mm;
    background: #fff;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .heading {
    text-align: center;
    font-weight: bold;
    font-size: 11pt;
    text-transform: uppercase;
    margin-bottom: 8mm;
    line-height: 1.5;
  }

  .sub-heading {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 6mm;
    line-height: 1.5;
    font-size: 11pt;
    text-align: justify;
  }

  .body-para {
    text-align: justify;
    line-height: 1.7;
    margin-bottom: 5mm;
    font-size: 12pt;
  }

  .resolution-text {
    text-align: justify;
    line-height: 1.7;
    margin-bottom: 5mm;
    font-size: 12pt;
  }

  .passed {
    font-weight: bold;
    text-align: center;
    margin: 8mm 0;
    font-size: 12pt;
    text-transform: uppercase;
  }

  .certified {
    font-weight: bold;
    text-align: center;
    margin-bottom: 4mm;
    font-size: 12pt;
    text-transform: uppercase;
  }

  .for-line {
    font-weight: bold;
    text-align: center;
    margin-bottom: 8mm;
    font-size: 12pt;
    text-transform: uppercase;
  }

  .directors-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10mm;
    margin-top: 10mm;
  }
  .dir-col {
    text-align: center;
    width: 45%;
    margin-bottom: 5mm;
  }
  .dir-name { font-weight: bold; font-size: 12pt; text-transform: uppercase; }
  .dir-desg { font-size: 11pt; text-transform: uppercase; }
  .dir-din  { font-size: 11pt; }

  @media print {
    body { padding: 0; }
    .page { width: 210mm; margin: 0; padding: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="heading">
    CERTIFIED TRUE COPY OF THE ORDINARY RESOLUTION PASSED AT THE EXTRA ORDINARY GENERAL MEETING OF THE MEMBERS OF ${e(company)} HELD ON ${e(meetingDay)}, THE ${e(meetingDayOfMonth)} DAY OF ${e(meetingMonth)} ${e(meetingYear)} AT THE REGISTERED OFFICE OF THE COMPANY SITUATED AT ${e(regAddr)} AT ${e(meetingTime)}
  </div>

  <div class="sub-heading">
    APPOINTMENT OF ${e(newAuditor)}, ${e(newAuditorType)}, (FRN: ${e(newFrn)}) AS STATUTORY AUDITOR OF THE COMPANY TO FILL IN THE CASUAL VACANCY CAUSED BY RESIGNATION OF ${e(oldAuditor)}, ${e(oldAuditorType)}, (FRN- ${e(oldFrn)}):
  </div>

  <div class="body-para">
    The Chairman apprised the members that <strong>${e(oldAuditor)}, ${e(oldAuditorType)}, (FRN- ${e(oldFrn)})</strong> has shown unwillingness vide resignation letter dated ${e(resignDate)} to continue as Statutory Auditor of the Company due to their preoccupations and certain unavoidable circumstances. Consequent to the resignation of <strong>${e(oldAuditor)}, ${e(oldAuditorType)}, (FRN- ${e(oldFrn)})</strong> as Statutory Auditor of the Company, it is necessary to appoint the Statutory Auditor of the Company to fill the casual vacancy caused.
  </div>

  <div class="body-para">
    The Chairman then updated the members that <strong>${e(newAuditor)}, ${e(newAuditorType)}, (FRN: ${e(newFrn)})</strong> has shown their willingness to hold the office of Statutory Auditor of the Company in casual vacancy, if appointed. Accordingly, <strong>${e(newAuditor)}, ${e(newAuditorType)}, (FRN: ${e(newFrn)})</strong> has submitted the consent and eligibility certificate for being appointed as Statutory Auditor of the Company.
  </div>

  <div class="body-para">The Chairman then proposed following resolution to be passed as an Ordinary Resolution:</div>

  <div class="resolution-text">
    <strong>"RESOLVED THAT</strong> pursuant to the provisions of Section 139 (8) (i), 140 and 141 and other applicable provisions, if any of the Companies Act, 2013, read with the Companies (Audit and Auditors) Rules, 2014 and other applicable provisions as contained in the Memorandum of Association and Articles of Association of the company, <strong>${e(newAuditor)}, ${e(newAuditorType)}, (FRN: ${e(newFrn)}),</strong> be and are hereby appointed as the Statutory Auditor of the company in casual vacancy for the Financial Year ${e(fy)}, to hold the office of the Auditor until the conclusion of the ensuing Annual General Meeting of the members of the company on such remuneration as may be mutually agreed between the auditors and the Directors of the Company.
  </div>

  <div class="resolution-text">
    <strong>RESOLVED FURTHER THAT</strong> any of the Directors of the Company be and are hereby authorized to do all such acts, deeds, matters, things &amp; other incidental matters in relation to the above resolutions, including issuance of appointment letter &amp; filing of necessary e-forms with the MCA".
  </div>

  <div class="passed"><strong>PASSED UNANIMOUSLY AS ORDINARY RESOLUTION</strong></div>

  <div class="certified"><strong>CERTIFIED TRUE COPY</strong></div>

  <div class="for-line"><strong>FOR AND ON BEHALF OF BOARD OF DIRECTORS</strong></div>
  <div class="for-line"><strong>FOR ${e(company)}</strong></div>

  <div class="directors-row">
    ${directorColumns}
  </div>

</div>
</body>
</html>`;
}
