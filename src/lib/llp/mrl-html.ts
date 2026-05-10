import { escapeHtml } from "@/lib/utils";

export interface LlpMrlValues {
  date: string;
  firmName: string;
  auditorName: string;
  firmType: string;
  firmAddress: string;
  llpName: string;
  partners: Array<{
    name: string;
    dpin: string;
    pan: string;
    address: string;
    signatureImage?: string;
  }>;
}

const BLANK = "________________";

function e(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "/");
}

export function buildLlpMrlHtml(data: LlpMrlValues): string {
  const dateStr = fmtDate(data.date?.trim() || "");
  const firmName = data.firmName?.trim() || BLANK;
  const auditorName = data.auditorName?.trim() || BLANK;
  const firmType = data.firmType?.trim() || "Practicing Chartered Accountant";
  const firmAddress = data.firmAddress?.trim() || BLANK;
  const llpName = data.llpName?.trim() || BLANK;
  const partners = data.partners?.length ? data.partners : [
    { name: "", dpin: "", pan: "", address: "" },
    { name: "", dpin: "", pan: "", address: "" }
  ];

  const partnerBlocks = partners.map(p => {
    const idLine = p.dpin?.trim() 
      ? `DIN / DPIN: ${e(p.dpin.trim())}` 
      : `PAN: ${e(p.pan?.trim() || BLANK)}`;
    return `
      <div class="partner-block">
        <div class="sig-line">
          ${p.signatureImage ? `<img src="${p.signatureImage}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
        </div>
        <div>Name of Designated Partner: ${e(p.name?.trim() || BLANK)}</div>
        <div>${idLine}</div>
        <div>Address: ${e(p.address?.trim() || BLANK)}</div>
      </div>
    `;
  }).join("");

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
    line-height: 1.5;
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

  .main-heading {
    text-align: center;
    font-weight: bold;
    text-decoration: underline;
    text-transform: uppercase;
    font-size: 14pt;
    margin-bottom: 8mm;
  }

  .date-line {
    margin-bottom: 6mm;
  }

  .to-block {
    margin-bottom: 6mm;
    line-height: 1.5;
  }

  .subject {
    font-weight: bold;
    margin-bottom: 6mm;
  }

  .salutation {
    margin-bottom: 4mm;
  }

  .body-para {
    text-align: justify;
    margin-bottom: 4mm;
  }

  ol.declarations {
    margin-left: 20px;
    margin-bottom: 4mm;
  }
  ol.declarations li {
    margin-bottom: 4mm;
    text-align: justify;
    padding-left: 5px;
  }

  .closing {
    margin-top: 6mm;
    margin-bottom: 6mm;
  }

  .for-llp {
    font-weight: bold;
    margin-bottom: 8mm;
  }

  .partner-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm 12mm;
    margin-bottom: 8mm;
  }
  .partner-block {
    line-height: 1.5;
  }
  .sig-line {
    border-bottom: 1px solid #000;
    min-height: 12mm;
    display: flex;
    align-items: flex-end;
    margin-bottom: 1mm;
    width: 60mm;
  }
  .sig-line::before {
    content: "Signature: ";
    margin-right: 5px;
    margin-bottom: 2px;
  }

  @media print {
    body { padding: 0; }
    .page { width: 210mm; margin: 0; padding: 15mm 20mm; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="main-heading">MANAGEMENT REPRESENTATION LETTER</div>

  <div class="date-line">Date: ${e(dateStr)}</div>

  <div class="to-block">
    To,<br/>
    ${e(firmName)}<br/>
    ${e(auditorName)}<br/>
    ${e(firmType)}<br/>
    ${e(firmAddress)}
  </div>

  <div class="subject">Subject: Management Representation for Incorporation of LLP</div>

  <div class="salutation">Dear Sir/Madam,</div>

  <div class="body-para">
    This representation letter is provided in connection with the incorporation of M/s ${e(llpName)} under the provisions of the Limited Liability Partnership Act, 2008 and rules made thereunder.
  </div>

  <div class="body-para">
    I/We, the undersigned Designated Partner(s) of the proposed LLP, hereby represent and confirm the following:
  </div>

  <ol class="declarations">
    <li>That all the documents, information, declarations, and details provided by us for the purpose of incorporation of the LLP are true, correct, complete and authentic to the best of our knowledge and belief.</li>
    <li>That no material information has been suppressed or concealed while providing the details for incorporation.</li>
    <li>That the identity proofs, address proofs, photographs, and other documents submitted by the partners/designated partners are genuine and belong to the respective persons.</li>
    <li>That we shall be fully responsible for the accuracy and authenticity of the information and documents submitted to the Ministry of Corporate Affairs (MCA).</li>
    <li>We understand that you are relying on the information and documents provided by us for the purpose of certification and filing of incorporation forms with the Registrar of Companies (ROC).</li>
    <li>We undertake to indemnify you against any loss, liability, or consequences arising due to any incorrect or misleading information provided by us.</li>
  </ol>

  <div class="body-para">
    This representation is given to enable you to proceed with the necessary certification and filing for the incorporation of the LLP.
  </div>

  <div class="closing">Thanking You.</div>

  <div class="for-llp">For M/s ${e(llpName)}</div>
  <div class="partner-grid">
    ${partnerBlocks}
  </div>

</div>
</body>
</html>`;
}
