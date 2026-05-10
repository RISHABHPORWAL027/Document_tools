/** LLP registered-office NOC — MCA-style layout; IDs shown as DPIN for designated partners. */

export type LlpNocRoSignatory = {
  name?: string;
  position?: string;
  dpin?: string;
  pan?: string;
  signatureImage?: string;
};

export type LlpNocRoValues = {
  ownerName?: string;
  ownerAddress?: string;
  ownerSignatureImage?: string;
  date?: string;
  llpName?: string;
  registeredOfficeAddress?: string;
  signatories?: LlpNocRoSignatory[];
};

export function llpNocRoSignatoryIdPlain(dpin?: string, pan?: string): string {
  const d = dpin?.replace(/\D/g, "").trim() ?? "";
  const p = pan?.trim() ?? "";
  if (d.length === 8) return `DPIN: ${d}`;
  if (p) return `PAN: ${p.toUpperCase()}`;
  return "DPIN / PAN: ________________";
}

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
    month: "long",
    year: "numeric",
  });
}

export function buildLlpNocRoHtml(raw: LlpNocRoValues): string {
  const ownerName = raw.ownerName?.trim() || BLANK;
  const ownerAddress = raw.ownerAddress?.trim() || BLANK;
  const date = fmtDate(raw.date?.trim() || "");
  const llpName = raw.llpName?.trim() || BLANK;
  const regAddress = raw.registeredOfficeAddress?.trim() || BLANK;
  const sigs =
    raw.signatories?.length && raw.signatories.length > 0
      ? raw.signatories
      : [{ name: "", position: "", dpin: "", pan: "" }, { name: "", position: "", dpin: "", pan: "" }];

  const sigBlocksHtml = sigs
    .map((s) => {
      const d = s.dpin?.replace(/\D/g, "").trim() ?? "";
      const p = s.pan?.trim() ?? "";
      const idLine =
        d.length === 8
          ? `DPIN: ${e(d)}`
          : p
            ? `PAN: ${e(p.toUpperCase())}`
            : `DPIN / PAN: ${e(BLANK)}`;
      return `
        <div class="sig-block">
          <div style="margin-bottom: 2mm; min-height: 10mm; display: flex; align-items: flex-end;">
            ${s.signatureImage ? `<img src="${s.signatureImage}" style="max-height: 15mm; max-width: 40mm; object-fit: contain;" />` : `<div style="height: 10mm;"></div>`}
          </div>
          <div class="s-name">${e(s.name?.trim() || BLANK)}</div>
          <div class="s-pos">${e(s.position?.trim() || "Designated Partner")}</div>
          <div>${idLine}</div>
        </div>`;
    })
    .join("");

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
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 22mm 20mm 20mm 25mm;
    background: #fff;
  }
  .letterhead {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5mm;
  }
  .from-block { flex: 1; }
  .from-label { margin-bottom: 2mm; font-size: 13pt; }
  .from-name  { font-weight: bold; margin-bottom: 1.5mm; font-size: 13pt; }
  .from-addr  { line-height: 1.55; font-size: 12pt; }
  .date-block {
    text-align: right;
    font-weight: bold;
    font-size: 13pt;
    white-space: nowrap;
    padding-top: 1mm;
  }
  .separator {
    border: none;
    border-top: 1.5px solid #000;
    margin: 0 0 6mm 0;
  }
  .to-section { margin-bottom: 7mm; }
  .to-section p { margin-bottom: 0; line-height: 1.6; font-size: 13pt; }
  .subject {
    font-weight: bold;
    text-align: justify;
    text-transform: uppercase;
    margin-bottom: 6mm;
    line-height: 1.6;
    font-size: 13pt;
  }
  .salutation { font-weight: bold; margin-bottom: 4mm; font-size: 13pt; }
  .body-para  { text-align: justify; line-height: 1.7; margin-bottom: 5mm; font-size: 13pt; }
  .addr-label { margin-bottom: 2mm; font-size: 13pt; }
  .prop-addr  { font-weight: bold; margin-bottom: 8mm; line-height: 1.55; font-size: 13pt; }
  .no-obj     { font-weight: bold; text-align: justify; margin-bottom: 18mm; line-height: 1.7; font-size: 13pt; }
  .sig-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8mm;
    margin-bottom: 2mm;
  }
  .sig-left { flex: 0 0 auto; }
  .sig-line {
    border-top: 1px solid #000;
    width: 50mm;
    margin-bottom: 2mm;
  }
  .sig-owner-name { font-size: 13pt; }
  .sig-right {
    flex: 1;
    max-width: 52%;
    text-align: left;
    font-size: 12pt;
  }
  .accepted-label {
    font-weight: bold;
    font-size: 13pt;
    margin-bottom: 5mm;
  }
  .sig-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm 6mm;
    align-items: start;
  }
  .sig-block .s-name { font-weight: bold; margin-bottom: 1.5mm; }
  .sig-block .s-pos { margin-bottom: 1.5mm; }
  @media print {
    body { padding: 0; }
    .page { margin: 0; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="letterhead">
    <div class="from-block">
      <div class="from-label">From:-</div>
      <div class="from-name">${e(ownerName)}</div>
      <div class="from-addr">${e(ownerAddress)}</div>
    </div>
    <div class="date-block">${e(date)}</div>
  </div>
  <hr class="separator"/>
  <div class="to-section">
    <p>To,</p>
    <p>Central Registration Centre, Ministry of Corporate Affairs</p>
    <p>Indian Institute of Corporate Affairs (IICA),</p>
    <p>Plot no. 6, 7, 8, Sector 5, IMT Manesar,</p>
    <p>Gurgaon, Haryana, India, 122050</p>
  </div>
  <div class="subject">Subject:&nbsp;&nbsp;Regarding use of my address as Registered Office of ${e(llpName)} (Limited Liability Partnership)</div>
  <div class="salutation">Dear Sir/Madam,</div>
  <div class="body-para">
    I, ${e(ownerName)}, being the registered owner of the property, hereby give my consent and permission to use the premises owned by me as the
    Registered Office of <strong>${e(llpName)}</strong>, a Limited Liability Partnership proposed to be registered / under incorporation with the
    Registrar of Companies. A copy of the address proof is attached herewith.
  </div>
  <div class="addr-label">Address of the property is as below:</div>
  <div class="prop-addr">${e(regAddress)}</div>
  <div class="no-obj">
    I have no objection if the said Limited Liability Partnership uses these premises for its business purposes in accordance with law.
  </div>
  <div class="sig-row">
    <div class="sig-left">
      <div style="margin-bottom: 2mm; min-height: 10mm; display: flex; align-items: flex-end;">
        ${raw.ownerSignatureImage ? `<img src="${raw.ownerSignatureImage}" style="max-height: 15mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 10mm;"></div>`}
      </div>
      <div class="sig-line"></div>
      <div class="sig-owner-name">${e(ownerName)}</div>
    </div>
    <div class="sig-right">
      <div class="accepted-label">Accepted &amp; Consented</div>
      <div class="sig-grid">${sigBlocksHtml}</div>
    </div>
  </div>
</div>
</body>
</html>`;
}
