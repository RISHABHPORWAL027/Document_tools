import { escapeHtml } from "@/lib/utils";

export interface EligibilityConsentData {
  firmName: string;
  firmAddress: string;
  frn: string;
  date: string;
  companyName: string;
  companyAddress: string;
  financialYear: string;
  signatoryName: string;
  designation: string;
  membershipNumber: string;
  signatureImage?: string;
  place: string;
}

export function buildEligibilityConsentHtml(data: EligibilityConsentData) {
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
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .page { max-width: 800px; margin: 0 auto; }
    .firm-header { text-align: left; margin-bottom: 10mm; border-bottom: 2px solid #000; padding-bottom: 2mm; }
    .firm-name { font-size: 14pt; font-weight: bold; text-transform: uppercase; }
    .firm-info { font-size: 10pt; color: #333; }
    
    .date-row { margin-bottom: 6mm; }
    .address-block { margin-bottom: 8mm; }
    
    .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 8mm; font-size: 13pt; }
    
    .content p { margin-bottom: 4mm; text-align: justify; }
    
    .footer { margin-top: 15mm; }
    .sig-block { margin-top: 10mm; }
  </style>
</head>
<body>
  <div class="page">
    <div class="firm-header">
      <div class="firm-name">${escapeHtml(data.firmName)}</div>
      <div class="firm-info">
        Chartered Accountants<br/>
        Address: ${escapeHtml(data.firmAddress)}<br/>
        FRN: ${escapeHtml(data.frn)}
      </div>
    </div>

    <div class="date-row">
      <strong>Date:</strong> ${new Date(data.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
    </div>

    <div class="address-block">
      To,<br/>
      The Board of Directors,<br/>
      <strong>${escapeHtml(data.companyName)}</strong><br/>
      ${escapeHtml(data.companyAddress)}
    </div>

    <div class="title">
      RE: CONSENT AND ELIGIBILITY CERTIFICATE FOR APPOINTMENT AS STATUTORY AUDITORS
    </div>

    <div class="content">
      <p>Dear Sirs,</p>
      <p>We are in receipt of your communication inquiring about our availability and eligibility for appointment as the Statutory Auditors of <strong>${escapeHtml(data.companyName)}</strong> for the financial year ${escapeHtml(data.financialYear)}.</p>
      
      <p>In this connection, we hereby give our consent for the said appointment and further certify that:</p>
      
      <ol style="margin-left: 20px; margin-bottom: 4mm;">
        <li>The firm is eligible for appointment and is not disqualified for appointment under the Companies Act, 2013, the Chartered Accountants Act, 1949 and the rules or regulations made thereunder;</li>
        <li>The proposed appointment is as per the term provided under the Act;</li>
        <li>The proposed appointment is within the limits laid down by or under the authority of the Act;</li>
        <li>There are no proceedings against the auditor or audit firm or any partner of the audit firm pending with respect to professional matters of conduct, as disclosed in the annexure (if any).</li>
      </ol>

      <p>We look forward to a professional relationship with the company.</p>
    </div>

    <div class="footer">
      <div>Yours faithfully,</div>
      <div class="sig-block">
        For <strong>${escapeHtml(data.firmName)}</strong><br/>
        Chartered Accountants<br/>
        <div style="margin-top: 10mm; border-bottom: 1px solid #eee; min-height: 10mm; display: flex; align-items: flex-end;">
          ${data.signatureImage ? `<img src="${data.signatureImage}" style="max-height: 15mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 10mm;"></div>`}
        </div>
        <div style="margin-top: 2mm;">
          <strong>${escapeHtml(data.signatoryName)}</strong><br/>
          (${escapeHtml(data.designation)})<br/>
          Membership No.: ${escapeHtml(data.membershipNumber)}<br/>
          Place: ${escapeHtml(data.place)}
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
