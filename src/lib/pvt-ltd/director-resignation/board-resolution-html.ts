import { escapeHtml } from "@/lib/utils";

export interface BoardResolutionResignationData {
  companyName: string;
  companyCin?: string;
  companyPhone?: string;
  companyEmail?: string;
  meetingDay: string; // e.g. "Thursday"
  meetingDate: string; // ISO date
  meetingTime: string; // e.g. "11:00 AM"
  registeredOffice: string;
  resigningDirectorName: string;
  resigningDirectorDin: string;
  effectiveDate: string; // ISO date or formatted string
  signatory1Name: string;
  signatory1Din: string;
  signatory1Signature?: string;
  signatory2Name: string;
  signatory2Din: string;
  signatory2Signature?: string;
  resolutionDate: string; // ISO date
  resolutionPlace: string;
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

function parseDateParts(iso: string): { dayName: string; formatted: string } {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso))
    return { dayName: BLANK, formatted: BLANK };
  const d = new Date(iso + "T00:00:00");
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const ord = (n: number) => { const s = ["TH", "ST", "ND", "RD"]; const v = n % 100; return s[(v - 20) % 10] || s[v] || s[0]; };
  return {
    dayName: days[d.getDay()],
    formatted: `${d.getDate()}${ord(d.getDate())} ${months[d.getMonth()]}, ${d.getFullYear()}`,
  };
}

export function buildBoardResolutionResignationHtml(data: BoardResolutionResignationData): string {
  const company = data.companyName?.trim() || BLANK;
  const cin = data.companyCin?.trim() || "";
  const companyPhone = data.companyPhone?.trim() || "";
  const companyEmail = data.companyEmail?.trim() || "";
  const dp = parseDateParts(data.meetingDate);
  const mDay = (data.meetingDay?.trim() || dp.dayName).toUpperCase();
  const mDateStr = (dp.formatted !== BLANK ? dp.formatted : data.meetingDate?.trim() || BLANK).toUpperCase();
  const time = data.meetingTime?.trim() || BLANK;
  const regOffice = data.registeredOffice?.trim() || BLANK;

  const resigningName = data.resigningDirectorName?.trim() || BLANK;
  const resigningDin = data.resigningDirectorDin?.trim() || BLANK;
  const effectiveDate = fmtDate(data.effectiveDate?.trim() || "");

  const sig1Name = data.signatory1Name?.trim() || BLANK;
  const sig1Din = data.signatory1Din?.trim() || BLANK;
  const sig2Name = data.signatory2Name?.trim() || BLANK;
  const sig2Din = data.signatory2Din?.trim() || BLANK;
  const resDate = fmtDate(data.resolutionDate?.trim() || "");
  const resPlace = data.resolutionPlace?.trim() || BLANK;

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
  .cert-para {
    font-weight: bold;
    margin-bottom: 6mm;
    line-height: 1.7;
  }
  .sub-heading {
    font-weight: bold;
    margin-bottom: 5mm;
  }
  .cert-copy {
    text-align: left;
    font-weight: bold;
    margin-top: 10mm;
    margin-bottom: 6mm;
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

  .body-para {
    text-align: justify;
    line-height: 1.7;
    margin-bottom: 5mm;
  }

  .for-company {
    font-weight: bold;
    margin-top: 6mm;
    margin-bottom: 8mm;
  }

  .dir-sig-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm 12mm;
    margin-top: 4mm;
    margin-bottom: 6mm;
  }

  .dir-sig-block { min-width: 0; }
  .dir-sig-space {
    border-bottom: 1px solid #000;
    min-height: 15mm;
    display: flex;
    align-items: flex-end;
    margin-bottom: 2mm;
    max-width: 200px;
  }
  .dir-name { font-weight: bold; font-size: 11pt; text-transform: uppercase; }
  .dir-desg { font-weight: bold; font-size: 10pt; }
  .dir-din { font-weight: bold; font-size: 10pt; }

  .meta-info {
    margin-top: 4mm;
    font-size: 10pt;
    line-height: 1.4;
  }

  @media print {
    body { padding: 0; }
    .page { width: 210mm; margin: 0; padding: 15mm 20mm; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="header-letterhead">
    <div class="header-company-name">${e(company)}</div>
    <div class="header-cin">CIN: ${e(cin)}</div>
    <div class="header-office">Regd. Office: ${e(regOffice)}</div>
    <div class="header-contact">Contact No.: ${e(companyPhone)}; Email id: ${e(companyEmail)}</div>
  </div>

  <p class="cert-para">CERTIFIED TRUE COPY OF THE RESOLUTION PASSED IN THE MEETING OF BOARD OF DIRECTORS OF ${e(company)}, HELD ON ${e(mDay)}, ${e(mDateStr)} AT ${e(time)} AT THE REGISTERED OFFICE OF THE COMPANY AT ${e(regOffice)}.</p>

  <p class="sub-heading">RESIGNATION OF DIRECTOR</p>

  <div class="body-para">
    The Board considered the resignation and passed the following resolution:
  </div>

  <div class="body-para">
    <strong>RESOLVED THAT </strong>pursuant to
  </div>

  <div class="body-para">
    (a) provisions of Sections 168 and all other applicable provisions of the Companies Act, 2013 read along with the rules framed thereunder (including any statutory modifications, amendments thereto or re-enactment thereof, the circulars, notifications, regulations, rules, guidelines, if any, issued by the Government of India) ("Act");
  </div>

  <div class="body-para">
    (b) the memorandum of association and articles of association of the Company, the Board of Directors of the Company ("Board") be and hereby accept the resignation tendered by ${e(resigningName)}, (DIN: ${e(resigningDin)}), from the office of Director of the Company with effect from ${e(effectiveDate)}.
  </div>

  <div class="body-para">
    <strong>RESOLVED FURTHER THAT </strong>any of the Directors of the Company, be and is hereby authorized to file the necessary e-form(s) with the Registrar of Companies (RoC) and to do all such acts, deeds and things as may be necessary to give effect to this resolution.
  </div>

  <p class="cert-copy"><strong>///Certified True Copy///</strong></p>

  <div class="for-company">
    <strong>BY THE ORDER OF BOARD OF DIRECTORS</strong><br/>
    <strong>FOR AND ON BEHALF OF</strong><br/>
    <strong>${e(company)}</strong>
  </div>

  <div class="dir-sig-grid">
    <div class="dir-sig-block">
      <div class="dir-sig-space">
        ${data.signatory1Signature ? `<img src="${data.signatory1Signature}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
      </div>
      <div class="dir-name"><strong>${e(sig1Name)}</strong></div>
      <div class="dir-desg"><strong>DIRECTOR</strong></div>
      <div class="dir-din"><strong>DIN: ${e(sig1Din)}</strong></div>
    </div>
    <div class="dir-sig-block">
      <div class="dir-sig-space">
        ${data.signatory2Signature ? `<img src="${data.signatory2Signature}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
      </div>
      <div class="dir-name"><strong>${e(sig2Name)}</strong></div>
      <div class="dir-desg"><strong>DIRECTOR</strong></div>
      <div class="dir-din"><strong>DIN: ${e(sig2Din)}</strong></div>
    </div>
  </div>

  <div class="meta-info">
    <div><strong>DATE: </strong>${e(resDate)}</div>
    <div><strong>PLACE: </strong>${e(resPlace)}</div>
  </div>

</div>
</body>
</html>`;
}
