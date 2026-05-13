/** Auditor reappointment templates matched to the source DOCX wording. */

import { escapeHtml } from "@/lib/utils";

export type ReappointmentDocumentKind =
  | "agm-resolution"
  | "appointment-letter"
  | "acceptance-letter"
  | "consent-certificate";

export type ReappointmentDirector = {
  name: string;
  din: string;
  designation: string;
};

export interface AuditorReappointmentData {
  documentDate: string;
  appointmentLetterDate: string;
  companyName: string;
  companyCin: string;
  registeredOfficeAddress: string;
  companyContactNo: string;
  companyEmail: string;
  companyPlace: string;
  meetingDay: string;
  meetingDayOfMonth: string;
  meetingMonth: string;
  meetingYear: string;
  meetingDateDisplay: string;
  meetingTime: string;
  auditorFirmName: string;
  auditorFirmType: string;
  auditorFirmAddress: string;
  auditorFrn: string;
  auditorName: string;
  auditorDesignation: string;
  membershipNo: string;
  financialYearEnd: string;
  directors: ReappointmentDirector[];
}

const BLANK = "________________";

function e(value: string): string {
  return escapeHtml(value || "").replace(/\n/g, "<br/>");
}

function v(value: string): string {
  return value?.trim() || BLANK;
}

export function formatReappointmentDate(iso: string): string {
  if (!iso) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function upper(value: string): string {
  return v(value).toUpperCase();
}

function longMeetingDate(data: AuditorReappointmentData): string {
  const day = v(data.meetingDay);
  const dayOfMonth = v(data.meetingDayOfMonth);
  const month = v(data.meetingMonth);
  const year = v(data.meetingYear);
  return `${day}, the ${dayOfMonth} Day of ${month} ${year}`;
}

function shortMeetingDate(data: AuditorReappointmentData): string {
  return data.meetingDateDisplay?.trim() || longMeetingDate(data);
}

function docDate(data: AuditorReappointmentData): string {
  return formatReappointmentDate(data.documentDate) || BLANK;
}

function appointmentDate(data: AuditorReappointmentData): string {
  return formatReappointmentDate(data.appointmentLetterDate) || docDate(data);
}

function financialYear(data: AuditorReappointmentData): string {
  return v(data.financialYearEnd);
}

function pageCss(fontFamily = `"Times New Roman", Times, serif`): string {
  return `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #f4f4f5;
    color: #000;
    font-family: ${fontFamily};
    font-size: 12pt;
    line-height: 1.34;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #fff;
    padding: 25.4mm 25.4mm;
  }
  .page.narrow { padding: 25.4mm 31.75mm; }
  .page.resolution { padding-top: 38mm; }
  .page.with-company-header { padding-top: 15mm; }
  p { margin: 0 0 12pt; }
  .justify { text-align: justify; }
  .bold { font-weight: 700; }
  .underline { text-decoration: underline; }
  .upper { text-transform: uppercase; }
  .border-title {
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 2pt 0;
    font-weight: 700;
    text-decoration: underline;
    text-align: center;
  }
  .resolution-heading {
    margin-top: 14pt;
    margin-bottom: 12pt;
    font-weight: 700;
    font-size: 13pt;
    text-decoration: underline;
    text-transform: uppercase;
    text-align: center;
  }
  .spacer-sm { height: 8pt; }
  .spacer-md { height: 18pt; }
  .spacer-lg { height: 38pt; }
  .sig-lines {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 38pt;
    margin-top: 38pt;
    font-weight: 700;
  }
  .sig-line { border-top: 1px solid #000; width: 156px; padding-top: 2pt; }
  .single-sig-line {
    border-top: 1px solid #000;
    width: 156px;
    margin-top: 38pt;
  }
  .directors {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 4pt;
    font-weight: 700;
  }
  .directors td {
    width: 50%;
    padding: 0 26pt 2pt 0;
    vertical-align: top;
  }
  .firm-signature {
    margin-top: 24pt;
    font-weight: 700;
    text-transform: uppercase;
  }
  .firm-line {
    border-top: 1px solid #000;
    width: 230px;
    margin-top: 28pt;
    padding-top: 2pt;
  }
  .subject { margin: 16pt 0 12pt; text-align: justify; font-weight: 700; }
  .page-break { break-before: page; page-break-before: always; }
  .company-header {
    margin-bottom: 8mm;
    font-family: "Times New Roman", Times, serif;
    font-weight: 700;
    color: #000;
  }
  .company-header .company-name {
    text-align: center;
    font-size: 16pt;
    line-height: 1.2;
  }
  .company-header .cin {
    text-align: center;
    line-height: 1.35;
  }
  .company-header .office {
    text-align: center;
    line-height: 1.35;
  }
  .company-header .contact {
    border-bottom: 1px solid #000;
    text-align: center;
    line-height: 1.35;
    padding-bottom: 2pt;
  }
  ul.source-list {
    margin: 0 0 12pt 24pt;
    padding: 0;
  }
  ul.source-list li { margin-bottom: 4pt; text-align: justify; }
  @media print {
    body { background: #fff; }
    .page { margin: 0; box-shadow: none; }
  }
  .letterhead-note {
    text-align: center;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12pt;
    color: #000;
    margin-bottom: 12pt;
  }`;
}

function htmlShell(title: string, css: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${e(title)}</title>
<style>${css}</style>
</head>
<body>${body}</body>
</html>`;
}

function directorAt(data: AuditorReappointmentData, index: number): ReappointmentDirector {
  return (
    data.directors[index] ?? {
      name: "",
      din: "",
      designation: "DIRECTOR",
    }
  );
}

function directorsTable(data: AuditorReappointmentData): string {
  const left = directorAt(data, 0);
  const right = directorAt(data, 1);
  return `<table class="directors">
    <tr>
      <td>${e(upper(left.name))}</td>
      <td>${e(upper(right.name))}</td>
    </tr>
    <tr>
      <td>${e(upper(left.designation || "DIRECTOR"))}</td>
      <td>${e(upper(right.designation || "DIRECTOR"))}</td>
    </tr>
    <tr>
      <td>DIN: ${e(v(left.din))}</td>
      <td>DIN: ${e(v(right.din))}</td>
    </tr>
  </table>`;
}

function companyHeader(data: AuditorReappointmentData): string {
  return `<div class="company-header">
    <div class="company-name">${e(upper(data.companyName))}</div>
    <div class="cin">CIN: ${e(v(data.companyCin))}</div>
    <div class="office">Regd. Office: ${e(v(data.registeredOfficeAddress))}</div>
    <div class="contact">Contact No.: ${e(v(data.companyContactNo))}; Email id: ${e(v(data.companyEmail))}</div>
  </div>`;
}

function firmSignature(data: AuditorReappointmentData, includeDate = false): string {
  const firmType = upper(data.auditorFirmType || "CHARTERED ACCOUNTANTS");
  return `<div class="firm-signature">
    <p>FOR ${e(upper(data.auditorFirmName))}</p>
    <p>${e(firmType)}</p>
    <p>(FRN: ${e(v(data.auditorFrn))})</p>
    <div class="firm-line">${e(upper(data.auditorName))}</div>
    <p>${e(upper(data.auditorDesignation || "PROPRIETOR"))}</p>
    <p>MEMBERSHIP NO: ${e(v(data.membershipNo))}</p>
    <p>PLACE: ${e(v(data.companyPlace))}</p>
    ${includeDate ? `<p>DATE: ${e(docDate(data))}</p>` : ""}
  </div>`;
}

export function buildAgmResolutionReappointmentHtml(
  data: AuditorReappointmentData,
): string {
  const company = upper(data.companyName);
  const firm = upper(data.auditorFirmName);
  const firmType = upper(data.auditorFirmType || "CHARTERED ACCOUNTANTS");
  const frn = v(data.auditorFrn);
  const meetingDate = longMeetingDate(data);
  const fy = financialYear(data);

  return htmlShell(
    "AGM Resolution - Reappointment of Auditor",
    pageCss(),
    `<div class="page resolution with-company-header">
      ${companyHeader(data)}
      <p class="border-title">CERTIFIED TRUE COPY OF THE ORDINARY RESOLUTION PASSED AT THE ANNUAL GENERAL MEETING OF MEMBERS OF ${e(company)} HELD ON ${e(meetingDate)} AT THE REGISTERED OFFICE OF THE COMPANY SITUATED AT ${e(v(data.registeredOfficeAddress))} AT ${e(v(data.meetingTime))}</p>

      <p class="resolution-heading">APPOINTMENT OF M/S ${e(firm)}, ${e(firmType)}, (FRN: ${e(frn)}), AS A STATUTORY AUDITOR OF THE COMPANY:</p>

      <p class="justify"><strong>&ldquo;RESOLVED THAT</strong> pursuant to the provisions of Section 139, 142 and other applicable provisions of the Companies Act, 2013 and the Rules made thereunder read with the applicable provisions as contained in the Articles of Association of the Company, <strong>M/S ${e(firm)}, ${e(firmType)}, (FRN: ${e(frn)})</strong>, be and are hereby appointed as a Statutory Auditors of the Company for a term of Five Financial Years, till the conclusion of Annual General Meeting of the Members of the Company to be held for the Financial Year ${e(fy)}, and that the Board of Directors be and is hereby authorized to fix remuneration payable to them from time to time in consultation with the Auditors.</p>

      <p class="justify"><strong>RESOLVED FURTHER THAT</strong> any of the Directors of the Company be and are hereby authorized to do all such acts, deeds, things and matters which are necessary, expedient, ancillary or incidental to give effect to the foregoing resolution, including filing of requisite e-Forms with the Registrar of Companies&rdquo;.</p>

      <div class="spacer-md"></div>
      <p class="bold">//CERTIFIED TRUE COPY//</p>
      <div class="spacer-md"></div>
      <p class="bold">FOR AND ON BEHALF OF</p>
      <p class="bold upper">${e(company)}</p>
      <div class="single-sig-line"></div>
      ${directorsTable(data)}
      <div class="spacer-md"></div>
      <p class="bold">DATE: ${e(docDate(data))}</p>
      <p class="bold">PLACE: ${e(v(data.companyPlace))}</p>
    </div>`,
  );
}

export function buildAppointmentLetterReappointmentHtml(
  data: AuditorReappointmentData,
): string {
  const company = upper(data.companyName);
  const firm = upper(data.auditorFirmName);
  const firmType = upper(data.auditorFirmType || "CHARTERED ACCOUNTANTS");
  const meetingDate = longMeetingDate(data);
  const fy = financialYear(data);

  return htmlShell(
    "Appointment Letter - Reappointment of Auditor",
    pageCss(),
    `<div class="page resolution with-company-header">
      ${companyHeader(data)}
      <p>Date: ${e(docDate(data))}</p>
      <div class="spacer-sm"></div>
      <p>To,</p>
      <p class="bold upper">${e(firm)}</p>
      <p class="bold">${e(firmType)},</p>
      <p class="bold">(FRN: ${e(v(data.auditorFrn))})</p>
      <p><strong>Add:</strong> ${e(v(data.auditorFirmAddress))}</p>

      <p class="subject">Sub: Your appointment as the Statutory Auditors of the Company for the term of Five Financial Years in pursuance of the provisions of section 139 of the Companies Act 2013.</p>

      <p>Dear Sir,</p>
      <p class="justify">This is to inform you that, your firm have been appointed as the Statutory Auditors of the Company, by the members in their Annual General Meeting held on ${e(meetingDate)} for the term of five years, to hold the office until the conclusion of the sixth consecutive Annual General Meeting of the members of the company to be held for the Financial Year ended ${e(fy)}.</p>

      <p>Kindly convey your acceptance letter for your appointment within the statutory period.</p>
      <p>Thanking you.</p>

      <div class="spacer-md"></div>
      <p class="bold">BY THE ORDER OF BOARD OF DIRECTORS</p>
      <p class="bold">FOR AND ON BEHALF OF</p>
      <p class="bold upper">${e(company)}</p>

      <div class="sig-lines">
        <div class="sig-line"></div>
        <div class="sig-line"></div>
      </div>
      ${directorsTable(data)}
      <div class="spacer-md"></div>
      <p class="bold">DATE: ${e(docDate(data))}</p>
      <p class="bold">PLACE: ${e(v(data.companyPlace))}</p>
    </div>`,
  );
}

export function buildAcceptanceLetterReappointmentHtml(
  data: AuditorReappointmentData,
): string {
  const company = upper(data.companyName);
  const meetingDate = shortMeetingDate(data);
  const fy = financialYear(data);

  return htmlShell(
    "Acceptance Letter - Reappointment of Auditor",
    pageCss("Calibri, Arial, sans-serif"),
    `<div class="page narrow">
      <p class="letterhead-note">On the Letter Head of Auditor</p>
      <div class="spacer-sm"></div>
      <p>Date: ${e(docDate(data))}</p>
      <div class="spacer-sm"></div>
      <p>To,</p>
      <p>The Board of Directors</p>
      <p class="bold">${e(company)}</p>
      <p class="bold">${e(v(data.registeredOfficeAddress))}</p>

      <p class="subject">Subject: Acceptance Letter of Appointment as the Statutory Auditor of your Company.</p>
      <p>Reference: Appointment Letter dated ${e(appointmentDate(data))}.</p>
      <p>Dear Sir,</p>

      <p class="justify">This is to inform you that, we are in the receipt of a letter communicating our appointment as the Statutory Auditors of the Company in the Annual General Meeting of the Company held on ${e(meetingDate)}; for the period of Five (5) years, from the conclusion of this Annual General Meeting till the conclusion of the sixth consecutive Annual General Meeting to be held for the financial year ended 31st March ${e(fy)}.</p>

      <p class="justify">In this regard, we hereby accept our appointment as the Statutory Auditor of your company for the said period.</p>
      <p class="justify">Kindly take above acceptance on records and proceed with the procedural formalities in this behalf.</p>

      <p>Thanking You,</p>
      <p>Yours truly,</p>
      ${firmSignature(data, true)}
    </div>`,
  );
}

export function buildConsentCertificateReappointmentHtml(
  data: AuditorReappointmentData,
): string {
  const company = upper(data.companyName);
  const firm = v(data.auditorFirmName);
  const firmType = v(data.auditorFirmType || "Chartered Accountants");
  const fy = financialYear(data);
  const address = v(data.registeredOfficeAddress);

  return htmlShell(
    "Consent Letter and Certificate - Reappointment of Auditor",
    pageCss("Calibri, Arial, sans-serif"),
    `<div class="page narrow">
      <p class="letterhead-note">On the Letter Head of Auditor</p>
      <div class="spacer-sm"></div>
      <p>Date: ${e(docDate(data))}</p>
      <div class="spacer-sm"></div>
      <p>To,</p>
      <p>The Board of Directors</p>
      <p class="bold">${e(company)}</p>
      <p class="bold">${e(address)}</p>

      <p class="subject">Subject: Eligibility Certificate under section 141 of the Companies Act, 2013 to be appointed as the Statutory Auditor of the Company.</p>

      <p>Dear Sir,</p>
      <p class="justify">We certify our appointment as the Statutory Auditors of the Company, if made in the Annual General Meeting to hold the office for five years till the conclusion of Annual General Meeting to be held for the financial year ${e(fy)}.</p>

      <p class="justify">Accordingly, we are therefore eligible and certify the criteria provided under section 141 of the Companies Act 2013 and willing to be appointed as the Statutory Auditor of your Company to hold the office for the five years till the conclusion of Annual General Meeting to be held financial year ${e(fy)}.</p>

      <p class="justify">We further assure you our best professional services at all times.</p>
      <p>Thanking you,</p>
      <p>Yours truly,</p>
      ${firmSignature(data, true)}
    </div>

    <div class="page narrow page-break">
      <p class="letterhead-note">On the Letter Head of Auditor</p>
      <div class="spacer-sm"></div>
      <p>Date: ${e(docDate(data))}</p>
      <div class="spacer-sm"></div>
      <p>To,</p>
      <p>The Board of Directors</p>
      <p class="bold">${e(company)}</p>
      <p class="bold">${e(address)}</p>

      <p class="subject">Subject: Certificate and Consent for appointment as Statutory Auditor of the Company under Section 139 of the Companies Act, 2013.</p>

      <p class="justify">I, the undersigned, the ${e(v(data.auditorDesignation || "Proprietor"))} of M/s ${e(firm)}, ${e(firmType)} (FRN No. ${e(v(data.auditorFrn))}) hereby certify you as per the Second proviso to section 139(1) of Companies Act, 2013 that -</p>

      <ul class="source-list">
        <li>We are eligible for appointment and not disqualified for appointment under the Companies Act, 2013 and the Chartered Accountants Act, 1949 and the rules and Regulations made thereunder.</li>
        <li>The proposed appointment is as per the term provided under the Companies Act, 2013.</li>
        <li>The Proposed appointment is within the limits laid down by or under the authority of the Companies Act, 2013.</li>
        <li>There are no proceedings pending against me or the audit firm pending with respect to professional matters of conduct.</li>
      </ul>

      <p>Thanking you,</p>
      <p>Yours truly,</p>
      ${firmSignature(data, true)}
    </div>`,
  );
}

export function buildReappointmentHtml(
  kind: ReappointmentDocumentKind,
  data: AuditorReappointmentData,
): string {
  switch (kind) {
    case "agm-resolution":
      return buildAgmResolutionReappointmentHtml(data);
    case "appointment-letter":
      return buildAppointmentLetterReappointmentHtml(data);
    case "acceptance-letter":
      return buildAcceptanceLetterReappointmentHtml(data);
    case "consent-certificate":
      return buildConsentCertificateReappointmentHtml(data);
  }
}
