import { escapeHtml } from "@/lib/utils";

export interface AppointmentLetterData {
  companyName: string;
  cin: string;
  regAddress: string;
  date: string;
  appointeeName: string;
  appointeeAddress: string;
  designation: string;
  effectiveDate: string;
  termYears: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatureImage?: string;
}

export function buildAppointmentLetterHtml(data: AppointmentLetterData) {
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
      padding: 20mm;
      background: #fff;
    }
    .page { max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 10mm; }
    .company-name { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2mm; }
    .company-info { font-size: 10pt; color: #333; margin-bottom: 4mm; }
    
    .date-row { margin-bottom: 6mm; text-align: left; }
    .appointee-block { margin-bottom: 8mm; }
    
    .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 8mm; font-size: 13pt; }
    
    .content p { margin-bottom: 4mm; text-align: justify; }
    .content ul { margin-left: 30px; margin-bottom: 4mm; }
    
    .sig-row { margin-top: 15mm; display: flex; justify-content: space-between; }
    .sig-block { min-width: 250px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="company-name">${escapeHtml(data.companyName)}</div>
      <div class="company-info">
        CIN: ${escapeHtml(data.cin)}<br/>
        Regd. Office: ${escapeHtml(data.regAddress)}
      </div>
      <hr style="border: 1px solid #000; margin-top: 4mm;" />
    </div>

    <div class="date-row">
      <strong>Date:</strong> ${new Date(data.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
    </div>

    <div class="appointee-block">
      To,<br/>
      <strong>${escapeHtml(data.appointeeName)}</strong><br/>
      ${escapeHtml(data.appointeeAddress)}
    </div>

    <div class="title">
      SUB: LETTER OF APPOINTMENT AS ${escapeHtml(data.designation).toUpperCase()}
    </div>

    <div class="content">
      <p>Dear ${escapeHtml(data.appointeeName)},</p>
      <p>We are pleased to inform you that the Board of Directors of <strong>${escapeHtml(data.companyName)}</strong> (the "Company") has approved your appointment as <strong>${escapeHtml(data.designation)}</strong> of the Company with effect from <strong>${new Date(data.effectiveDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</strong>.</p>
      
      <p>The terms and conditions of your appointment are as follows:</p>
      
      <ol style="margin-left: 20px;">
        <li><strong>Term:</strong> Your appointment is for a term of ${escapeHtml(data.termYears)} years, subject to the provisions of the Companies Act, 2013.</li>
        <li><strong>Role and Duties:</strong> Your role and duties will be those normally associated with the position of ${escapeHtml(data.designation)} under the Companies Act, 2013 and the Articles of Association of the Company.</li>
        <li><strong>Code of Conduct:</strong> You are expected to adhere to the Company's Code of Conduct and maintain the highest standards of integrity.</li>
        <li><strong>Confidentiality:</strong> You shall maintain absolute confidentiality regarding the Company's business and affairs.</li>
      </ol>

      <p>Please sign and return a copy of this letter as a token of your acceptance.</p>
      <p>We look forward to your valuable contribution to the growth of the Company.</p>
    </div>

    <div class="sig-row">
      <div class="sig-block">
        <div>For <strong>${escapeHtml(data.companyName)}</strong></div>
        <div style="margin-top: 10mm; border-bottom: 1px solid #eee; min-height: 10mm; display: flex; align-items: flex-end;">
          ${data.signatureImage ? `<img src="${data.signatureImage}" style="max-height: 15mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 10mm;"></div>`}
        </div>
        <div style="margin-top: 2mm;">
          <strong>${escapeHtml(data.signatoryName)}</strong><br/>
          (${escapeHtml(data.signatoryDesignation)})
        </div>
      </div>
      <div class="sig-block" style="text-align: right;">
        <div>Accepted by:</div>
        <div style="margin-top: 15mm;">
          <strong>${escapeHtml(data.appointeeName)}</strong>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
