/** LLP registered-office NOC — MCA-style layout; IDs shown as DPIN for designated partners. */

export type LlpNocRoValues = {
  ownerName?: string;
  ownerAddress?: string;
  ownerSignatureImage?: string;
  date?: string;
  llpName?: string;
  registeredOfficeAddress?: string; // Property address
  designatedPartnerName?: string; // The one being authorized
  /** Custom enclosure note; defaults to "Copy of the Electricity Bill" */
  electricityBillNote?: string;
};

function e(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

const BLANK = "________________";

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "."); 
}

export function buildLlpNocRoHtml(raw: LlpNocRoValues): string {
  const ownerName = raw.ownerName?.trim() || BLANK;
  const ownerAddress = raw.ownerAddress?.trim() || BLANK;
  const date = fmtDate(raw.date?.trim() || "");
  const llpName = raw.llpName?.trim() || BLANK;
  const regAddress = raw.registeredOfficeAddress?.trim() || BLANK;
  const dpName = raw.designatedPartnerName?.trim() || BLANK;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 13pt;
    color: #000;
    background: #fff;
    padding: 0;
  }
  .page {
    width: 100%;
    min-height: 297mm;
    margin: 0 auto;
    padding: 22mm 20mm 20mm 25mm;
    background: #fff;
    line-height: 1.6;
  }
  
  .owner-info {
    margin-bottom: 5mm;
  }
  .owner-name { font-weight: bold; }
  
  .date-top {
    text-align: left;
    margin-bottom: 5mm;
  }

  .to-section {
    margin-bottom: 8mm;
  }
  .to-section p {
    margin-bottom: 0;
    line-height: 1.4;
  }

  .date-right {
    text-align: right;
    margin-bottom: 5mm;
    font-weight: bold;
  }

  .subject {
    font-weight: bold;
    text-align: center;
    text-decoration: underline;
    margin-bottom: 8mm;
    text-transform: uppercase;
  }

  .salutation {
    margin-bottom: 5mm;
  }

  .body-text {
    text-align: justify;
    margin-bottom: 8mm;
  }

  .closing {
    margin-top: 15mm;
  }
  .sig-placeholder {
    height: 15mm;
    display: flex;
    align-items: flex-end;
  }

  .enclosure {
    margin-top: 10mm;
    font-weight: bold;
  }

  @media print {
    @page { size: auto; margin: 0; }
    body { padding: 0; margin: 0; }
    .page { width: 210mm; margin: 0; border: none; padding: 22mm 20mm 20mm 25mm; }
  }
</style>
</head>
<body>
<div class="page">
  
  <div class="owner-info">
    <div class="owner-name">${e(ownerName)}</div>
    <div class="owner-addr">${e(ownerAddress)}</div>
  </div>

  <div class="date-top">Dated: ${e(date)}</div>

  <div class="to-section">
    <p>Central Processing Center/ The Registrar of Companies</p>
    <p>Ministry of Corporate Affairs</p>
    <p>Manesar, Gurgaon (Haryana) 122050</p>
  </div>

  <div class="date-right">Dated ${e(date)}</div>

  <div class="subject">Sub.: NO OBJECTION FOR USE OF PREMISES AS REGISTERED OFFICE OF ${e(llpName)}</div>

  <div class="salutation">Dear Sir,</div>

  <div class="body-text">
    I, <strong>${e(ownerName)}</strong>, being the owner of the property situated at <strong>${e(regAddress)}</strong>, do hereby authorize <strong>${e(dpName)}</strong>, designated partners of <strong>${e(llpName)}</strong>, to set up an office at <strong>${e(regAddress)}</strong>.
  </div>

  <div class="body-text">
    The proof for having ownership of the said premises Electricity Bill being enclosed herewith.
  </div>

  <div class="body-text">Thanking you</div>

  <div class="closing">
    <div>Yours Faithfully</div>
    <div class="sig-placeholder">
      ${raw.ownerSignatureImage ? `<img src="${raw.ownerSignatureImage}" style="max-height: 15mm; max-width: 50mm; object-fit: contain;" />` : ""}
    </div>
    <div style="font-weight: bold; margin-top: 2mm;">OWNER</div>
  </div>

  <div class="enclosure">Encl.: ${raw.electricityBillNote?.trim() ? e(raw.electricityBillNote.trim()) : "Copy of the Electricity Bill"}</div>

</div>
</body>
</html>`;
}
