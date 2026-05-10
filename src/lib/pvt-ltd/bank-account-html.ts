import { escapeHtml } from "@/lib/utils";

export interface BankAccountValues {
  companyName: string;
  cin: string;
  regAddress: string;
  meetingDate: string;
  meetingVenue: string;
  bankName: string;
  bankBranch: string;
  bankAddress: string;
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

export function buildBankAccountHtml(v: BankAccountValues): string {
  const company = escapeHtml(v.companyName || "________________ LIMITED");
  const cin = escapeHtml(v.cin || "________________");
  const address = escapeHtml(v.regAddress || "________________");
  const bank = escapeHtml(v.bankName || "________________ Bank");
  const branch = escapeHtml(v.bankBranch || "________________ Branch");
  const mDate = v.meetingDate || "________________";
  const venue = escapeHtml(v.meetingVenue || "the Registered Office of the Company");
  
  const sigs = v.authorizedSignatories || [];
  const signatoriesList = sigs.map(s => `<li><strong>${escapeHtml(s.name)}</strong>, ${escapeHtml(s.designation)} (DIN: ${escapeHtml(s.din)})</li>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 20mm; }
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
    margin: 0;
    padding: 0;
  }
  .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
  .company-name { font-size: 16pt; font-weight: bold; text-transform: uppercase; }
  .cin { font-size: 10pt; }
  .address { font-size: 10pt; }
  .title { text-align: center; font-weight: bold; text-decoration: underline; margin: 20px 0; font-size: 14pt; }
  .content { text-align: justify; }
  .resolution-box { margin: 20px 0; }
  .resolution-text { margin-bottom: 15px; }
  .signatory-section { margin-top: 50px; display: flex; flex-direction: column; align-items: flex-end; }
  .signature-box { text-align: center; width: 250px; }
  .signature-img { max-height: 60px; max-width: 200px; object-fit: contain; margin-bottom: 5px; }
  .footer { margin-top: 30px; }
</style>
</head>
<body>
  <div class="header">
    <div class="company-name">${company}</div>
    <div class="cin">CIN: ${cin}</div>
    <div class="address">Regd. Office: ${address}</div>
  </div>

  <div class="title">
    CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ${company.toUpperCase()} HELD ON ${mDate} AT ${venue.toUpperCase()}
  </div>

  <div class="content">
    <div class="resolution-box">
      <div class="resolution-text">
        "<strong>RESOLVED THAT</strong> a current account in the name of the Company be opened with <strong>${bank}</strong>, ${branch} and the said Bank be and is hereby authorized to honor all cheques, bills of exchange, and other negotiable instruments signed, drawn, accepted, or made on behalf of the Company."
      </div>

      <div class="resolution-text">
        "<strong>RESOLVED FURTHER THAT</strong> the following directors/officers of the company be and are hereby authorized to operate the said bank account <strong>${escapeHtml(v.signingMethod)}</strong>:"
      </div>
      
      <ul>
        ${signatoriesList}
      </ul>

      <div class="resolution-text">
        "<strong>RESOLVED FURTHER THAT</strong> the said Bank be and is hereby instructed to accept and act upon any instructions relating to the said account(s) and/or any other transactions, including any amendment in the operation of the account, provided that such instructions are given in writing and signed as per the signing mandate mentioned above."
      </div>

      <div class="resolution-text">
        "<strong>RESOLVED FURTHER THAT</strong> a certified true copy of this resolution be furnished to the Bank and they be requested to act thereon."
      </div>
    </div>
  </div>

  <div class="footer">
    <div><strong>For ${company}</strong></div>
    <div class="signatory-section">
      <div class="signature-box">
        ${v.signatureImage ? `<img src="${v.signatureImage}" class="signature-img" />` : `<div style="height: 60px;"></div>`}
        <div style="font-weight: bold;">( ${escapeHtml(v.signatoryName || "________________")} )</div>
        <div>${escapeHtml(v.signatoryDesignation || "Director")}</div>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <div>Place: ${escapeHtml(v.place || "________________")}</div>
      <div>Date: ${escapeHtml(v.date || "________________")}</div>
    </div>
  </div>
</body>
</html>`;
}
