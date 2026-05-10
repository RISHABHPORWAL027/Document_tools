export type NocValues = {
  ownerName?: string;
  ownerAddress?: string;
  date?: string;
  companyName?: string;
  registeredOfficeAddress?: string;
  signatories?: Array<{
    name?: string;
    position?: string;
    din?: string;
    pan?: string;
    signatureImage?: string;
  }>;
  ownerSignatureImage?: string;
};

/** Document line: prefer DIN when present, else PAN. */
export function nocSignatoryIdPlain(
  din?: string,
  pan?: string,
): string {
  const d = din?.trim() ?? "";
  const p = pan?.trim() ?? "";
  if (d) return `DIN: ${d}`;
  if (p) return `PAN: ${p.toUpperCase()}`;
  return "DIN / PAN: ________________";
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
  // If already formatted (not ISO), return as-is
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function buildNocHtml(raw: NocValues): string {
  const ownerName = raw.ownerName?.trim() || BLANK;
  const ownerAddress = raw.ownerAddress?.trim() || BLANK;
  const date = fmtDate(raw.date?.trim() || "");
  const companyName = raw.companyName?.trim() || BLANK;
  const regAddress = raw.registeredOfficeAddress?.trim() || BLANK;
  const sigs =
    raw.signatories?.length && raw.signatories.length > 0
      ? raw.signatories
      : [
          { name: "", position: "", din: "", pan: "" },
          { name: "", position: "", din: "", pan: "" },
        ];
  const sigBlocksHtml = sigs
    .map((s) => {
      const d = s.din?.trim() ?? "";
      const p = s.pan?.trim() ?? "";
      const idLine =
        d
          ? `DIN: ${e(d)}`
          : p
            ? `PAN: ${e(p.toUpperCase())}`
            : `DIN / PAN: ${e(BLANK)}`;
      return `
        <div class="sig-block">
          <div style="border-bottom: 1px solid #eee; min-height: 8mm; display: flex; align-items: flex-end; margin-bottom: 1mm;">
            ${s.signatureImage ? `<img src="${s.signatureImage}" style="max-height: 12mm; max-width: 35mm; object-fit: contain;" />` : `<div style="height: 8mm;"></div>`}
          </div>
          <div class="s-name">${e(s.name?.trim() || BLANK)}</div>
          <div class="s-pos">${e(s.position?.trim() || BLANK)}</div>
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
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* ── Header: From (left) + Date (right) ────────────────── */
  .letterhead {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5mm;
    gap: 4mm;
  }
  .from-block { flex: 1; min-width: 0; }
  .from-label { margin-bottom: 2mm; font-size: 13pt; }
  .from-name  { font-weight: bold; margin-bottom: 1.5mm; font-size: 13pt; overflow-wrap: break-word; }
  .from-addr  { line-height: 1.55; font-size: 12pt; overflow-wrap: break-word; }
  .date-block {
    text-align: right;
    font-weight: bold;
    font-size: 13pt;
    white-space: nowrap;
    padding-top: 1mm;
    flex-shrink: 0;
  }

  /* ── Separator ─────────────────────────────────────────── */
  .separator {
    border: none;
    border-top: 1.5px solid #000;
    margin: 0 0 6mm 0;
  }

  /* ── To section ─────────────────────────────────────────── */
  .to-section { margin-bottom: 7mm; }
  .to-section p { margin-bottom: 0; line-height: 1.6; font-size: 13pt; overflow-wrap: break-word; }

  /* ── Subject ────────────────────────────────────────────── */
  .subject {
    font-weight: bold;
    text-align: justify;
    text-transform: uppercase;
    margin-bottom: 6mm;
    line-height: 1.6;
    font-size: 13pt;
    overflow-wrap: break-word;
  }

  /* ── Body ───────────────────────────────────────────────── */
  .salutation { font-weight: bold; margin-bottom: 4mm; font-size: 13pt; }
  .body-para  { text-align: justify; line-height: 1.7; margin-bottom: 5mm; font-size: 13pt; overflow-wrap: break-word; }
  .addr-label { margin-bottom: 2mm; font-size: 13pt; }
  .prop-addr  { font-weight: bold; margin-bottom: 8mm; line-height: 1.55; font-size: 13pt; overflow-wrap: break-word; }
  .no-obj     { font-weight: bold; text-align: justify; margin-bottom: 18mm; line-height: 1.7; font-size: 13pt; overflow-wrap: break-word; }

  /* ── Signature row: owner left | acceptance + signatories right ── */
  .sig-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8mm;
    margin-bottom: 2mm;
  }
  .sig-left {
    flex: 0 0 auto;
  }
  .sig-line {
    border-top: 1px solid #000;
    width: 50mm;
    margin-bottom: 2mm;
  }
  .sig-owner-name { font-size: 13pt; }
  /* Right stack: heading first, then each director block underneath */
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
  /* Two signatories per row; extra rows wrap below */
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

  <!-- ── Letterhead: From (left) + Date (right) ── -->
  <div class="letterhead">
    <div class="from-block">
      <div class="from-label">From:-</div>
      <div class="from-name">${e(ownerName)}</div>
      <div class="from-addr">${e(ownerAddress)}</div>
    </div>
    <div class="date-block">${e(date)}</div>
  </div>

  <!-- ── Full-width separator ── -->
  <hr class="separator"/>

  <!-- ── To ── -->
  <div class="to-section">
    <p>To,</p>
    <p>Central Registration Centre, Ministry of Corporate Affairs</p>
    <p>Indian Institute of Corporate Affairs (IICA),</p>
    <p>Plot no. 6, 7, 8, Sector 5, IMT Manesar,</p>
    <p>Gurgaon, Haryana, India, 122050</p>
  </div>

  <!-- ── Subject ── -->
  <div class="subject">Subject:&nbsp;&nbsp;Regarding Use of My Address as Registered Office of ${e(companyName)}</div>

  <!-- ── Salutation + body ── -->
  <div class="salutation">Dear Sir/Mam,</div>

  <div class="body-para">
    I, ${e(ownerName)}, being registered owner of the property, hereby give my consent and
    permission to use the property owned by me as registered office of ${e(companyName)}, a company
    under Incorporation. A copy of the address Proof is attached.
  </div>

  <!-- ── Property address ── -->
  <div class="addr-label">Address of the property is as below:</div>
  <div class="prop-addr">${e(regAddress)}</div>

  <!-- ── No-objection statement ── -->
  <div class="no-obj">I have no objection if the company use this premises for its business purpose.</div>

  <!-- ── Signature: owner left | Accepted & Consented, then directors below ── -->
  <div class="sig-row">
    <div class="sig-left">
      <div style="border-bottom: 1px solid #000; min-height: 10mm; display: flex; align-items: flex-end; width: 50mm; margin-bottom: 2mm;">
        ${raw.ownerSignatureImage ? `<img src="${raw.ownerSignatureImage}" style="max-height: 15mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 10mm;"></div>`}
      </div>
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
