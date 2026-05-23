import { escapeHtml } from "@/lib/utils";

export interface AcknowledgementResignationData {
  date: string;
  resigningDirectorName: string;
  resigningDirectorAddress: string;
  resignationLetterDate: string;
  effectiveDate: string;
  companyName: string;
  companyCin: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  signatory1Name: string;
  signatory1Din: string;
  signatory1Signature?: string;
  signatory2Name: string;
  signatory2Din: string;
  signatory2Signature?: string;
  ackDate: string;
  ackPlace: string;
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

export function buildAcknowledgementResignationHtml(data: AcknowledgementResignationData): string {
  const date = fmtDate(data.date?.trim() || "");
  const resigningName = data.resigningDirectorName?.trim() || BLANK;
  const resigningAddr = data.resigningDirectorAddress?.trim() || BLANK;
  const resignationDate = fmtDate(data.resignationLetterDate?.trim() || "");
  const effectiveDate = fmtDate(data.effectiveDate?.trim() || "");
  const company = data.companyName?.trim() || BLANK;
  const cin = data.companyCin?.trim() || "";
  const companyAddr = data.companyAddress?.trim() || BLANK;
  const companyPhone = data.companyPhone?.trim() || "";
  const companyEmail = data.companyEmail?.trim() || "";
  
  const sig1Name = data.signatory1Name?.trim() || BLANK;
  const sig1Din = data.signatory1Din?.trim() || BLANK;
  const sig2Name = data.signatory2Name?.trim() || BLANK;
  const sig2Din = data.signatory2Din?.trim() || BLANK;
  const ackDate = fmtDate(data.ackDate?.trim() || "");
  const ackPlace = data.ackPlace?.trim() || BLANK;

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

  .header-block {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin-bottom: 8mm;
  }

  .by-hand {
    font-weight: bold;
    text-align: center;
  }

  .date-line {
    text-align: right;
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

  .for-company {
    font-weight: bold;
    text-transform: uppercase;
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
  .dir-din { font-size: 10pt; }

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
  <!-- ── Header Company Details (Letterhead) ── -->
  <div class="header-letterhead">
    <div class="header-company-name">${e(company)}</div>
    ${cin ? `<div class="header-cin">CIN: ${e(cin)}</div>` : ""}
    <div class="header-office">Regd. Office: ${e(companyAddr)}</div>
    <div class="header-contact">
      Contact No.: ${e(companyPhone)} ${companyEmail ? `; Email id: ${e(companyEmail)}` : ""}
    </div>
  </div>

  <div class="header-block">
    <div></div>
    <div class="by-hand">By Hand</div>
    <div class="date-line"><strong>Date:</strong> ${e(date)}</div>
  </div>

  <div class="to-block">
    To,<br/>
    <strong>${e(resigningName)}</strong><br/>
    ${e(resigningAddr)}
  </div>

  <div class="subject">Subject: Acknowledgement for Receipt of Resignation Letter.</div>

  <div class="salutation">Dear Sir,</div>

  <div class="body-para">
    We hereby acknowledge that we have received the Resignation Letter dated <strong>${e(resignationDate)}</strong> for your resignation from the Directorship of our Company w.e.f., closing business hours of <strong>${e(effectiveDate)}</strong> as send by you.
  </div>

  <div class="closing">Thanking you.</div>
  
  <div class="closing">Yours faithfully,</div>
  <div class="for-company">
    BY THE ORDER OF BOARD OF DIRECTORS<br/>
    FOR AND ON BEHALF OF<br/>
    <strong>${e(company)}</strong>
  </div>

  <div class="dir-sig-grid">
    <div class="dir-sig-block">
      <div class="dir-sig-space">
        ${data.signatory1Signature ? `<img src="${data.signatory1Signature}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
      </div>
      <div class="dir-name">${e(sig1Name)}</div>
      <div class="dir-desg">DIRECTOR</div>
      <div class="dir-din">DIN: ${e(sig1Din)}</div>
    </div>
    <div class="dir-sig-block">
      <div class="dir-sig-space">
        ${data.signatory2Signature ? `<img src="${data.signatory2Signature}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
      </div>
      <div class="dir-name">${e(sig2Name)}</div>
      <div class="dir-desg">DIRECTOR</div>
      <div class="dir-din">DIN: ${e(sig2Din)}</div>
    </div>
  </div>

  <div class="meta-info">
    <div><strong>DATE:</strong> ${e(ackDate)}</div>
    <div><strong>PLACE:</strong> ${e(ackPlace)}</div>
  </div>
</div>
</body>
</html>`;
}
