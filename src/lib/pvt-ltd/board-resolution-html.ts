import { escapeHtml } from "@/lib/utils";

export interface BrFormData {
  companyName: string;
  cin?: string;
  regAddress: string;
  meetingDate: string;
  meetingVenue: string;
  chairmanName: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatureImage?: string;
  place: string;
  date: string;
  resolutions: string[];
}

export function buildBrHtml(data: BrFormData) {
  const resolutionsHtml = data.resolutions
    .map(
      (res, i) => `
    <div class="resolution-item">
      <p><strong>RESOLVED THAT</strong> ${escapeHtml(res)}</p>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      padding: 20mm;
      background: #fff;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    .page { max-width: 800px; margin: 0 auto; overflow-wrap: break-word; }
    .header { text-align: center; margin-bottom: 10mm; }
    .company-name { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2mm; }
    .company-info { font-size: 10pt; color: #333; margin-bottom: 4mm; }
    
    .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 8mm; font-size: 14pt; }
    
    .meeting-info { margin-bottom: 6mm; text-align: justify; }
    
    .resolution-container { margin-bottom: 10mm; }
    .resolution-item { margin-bottom: 6mm; text-align: justify; }
    
    .footer { margin-top: 15mm; display: flex; justify-content: space-between; align-items: flex-start; }
    .sig-block { text-align: right; min-width: 200px; }
    .sig-line { border-top: 1px solid #000; margin-top: 15mm; padding-top: 2mm; font-weight: bold; }
    
    @media print {
      body { padding: 0; }
      .page { max-width: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="company-name">${escapeHtml(data.companyName)}</div>
      <div class="company-info">
        ${data.cin ? `CIN: ${escapeHtml(data.cin)}<br/>` : ""}
        Regd. Office: ${escapeHtml(data.regAddress)}
      </div>
      <hr style="border: 1px solid #000; margin-top: 4mm;" />
    </div>

    <div class="title">CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ${escapeHtml(
      data.companyName
    )} HELD ON ${new Date(data.meetingDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })} AT ${escapeHtml(data.meetingVenue)}</div>

    <div class="resolution-container">
      ${resolutionsHtml}
    </div>

    <div class="footer">
      <div>
        <strong>Date:</strong> ${new Date(data.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}<br/>
        <strong>Place:</strong> ${escapeHtml(data.place)}
      </div>
      <div class="sig-block">
        <div>For <strong>${escapeHtml(data.companyName)}</strong></div>
        <div style="margin-top: 10mm; border-bottom: 1px solid #000; min-height: 10mm; display: flex; align-items: flex-end; justify-content: flex-end; padding-bottom: 2mm;">
          ${data.signatureImage ? `<img src="${data.signatureImage}" style="max-height: 15mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 10mm;"></div>`}
        </div>
        <div style="margin-top: 2mm; font-weight: bold;">
          ${escapeHtml(data.signatoryName)}<br/>
          (${escapeHtml(data.signatoryDesignation)})
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
