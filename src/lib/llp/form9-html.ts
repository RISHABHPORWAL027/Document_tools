/** Form 9 — Consent to act as Designated Partner (LLP) — pixel-perfect match to original document. */

export type LlpForm9Values = {
  llpName?: string;
  llpAddress?: string;
  partnerName?: string;
  fatherName?: string;
  residentialAddress?: string;
  nationality?: string;
  occupation?: string;
  dateOfBirth?: string;
  email?: string;
  mobile?: string;
  pan?: string;
  dpin?: string;
  /** Nominee LLP/Company details */
  nomineeDetails?: string;
  place?: string;
  date?: string;
  signaturePrintedName?: string;
  witnessName?: string;
  witnessAddress?: string;
  witnessNameAddress?: string;
  signatureImage?: string;
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
    month: "long",
    year: "numeric",
  });
}

export function buildLlpForm9Html(v: LlpForm9Values): string {
  const llp = v.llpName?.trim() || BLANK;
  const llpAddress = v.llpAddress?.trim() || BLANK;
  const name = v.partnerName?.trim() || BLANK;
  const father = v.fatherName?.trim() || BLANK;
  const addr = v.residentialAddress?.trim() || BLANK;
  const nat = v.nationality?.trim() || "Indian";
  const occ = v.occupation?.trim() || BLANK;
  const dob = v.dateOfBirth ? fmtDate(v.dateOfBirth.trim()) : BLANK;
  const email = v.email?.trim() || BLANK;
  const mob = v.mobile?.trim() || BLANK;
  const pan = v.pan?.trim().toUpperCase() || BLANK;
  const dpin = v.dpin?.replace(/\D/g, "").trim() || "";
  const dpinLine = dpin.length === 8 ? dpin : BLANK;
  const nominee = v.nomineeDetails?.trim() || BLANK;
  const place = v.place?.trim() || BLANK;
  const date = fmtDate(v.date?.trim() || "");
  const sigPrinted = v.signaturePrintedName?.trim() || v.partnerName?.trim() || BLANK;
  const wName = v.witnessName?.trim() ?? "";
  const wAddr = v.witnessAddress?.trim() ?? "";
  const witnessCombined =
    wName || wAddr
      ? [wName, wAddr].filter(Boolean).join("\n")
      : v.witnessNameAddress?.trim() || "";
  const witness = witnessCombined || BLANK;

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
    line-height: 1.5;
  }
  .page {
    width: 100%;
    min-height: 297mm;
    margin: 0 auto;
    padding: 18mm 22mm;
    background: #fff;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* ── Header ── */
  .header {
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 4mm;
    margin-bottom: 6mm;
  }
  .header .form-title {
    font-size: 14pt;
    font-weight: bold;
  }
  .header .form-subtitle {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 2mm;
  }
  .header .form-rule {
    font-size: 10pt;
    font-style: italic;
    margin-top: 2mm;
  }

  /* ── Date row ── */
  .date-row {
    text-align: right;
    margin-bottom: 4mm;
    font-size: 12pt;
  }

  /* ── To section ── */
  .to-block {
    margin-bottom: 5mm;
    font-size: 12pt;
    line-height: 1.6;
  }

  /* ── Subject ── */
  .subject {
    font-weight: bold;
    margin-bottom: 5mm;
    font-size: 12pt;
  }

  /* ── Consent paragraphs ── */
  .body-para {
    text-align: justify;
    line-height: 1.7;
    margin-bottom: 5mm;
    font-size: 12pt;
  }

  /* ── Details table ── */
  .details-table {
    width: 100%;
    border-collapse: collapse;
    margin: 6mm 0;
    font-size: 11pt;
  }
  .details-table th, .details-table td {
    border: 1px solid #000;
    padding: 5px 8px;
    text-align: left;
    vertical-align: top;
  }
  .details-table th {
    background: #f0f0f0;
    font-weight: bold;
    text-align: center;
  }
  .col-num { width: 40px; text-align: center !important; }
  .col-label { width: 45%; }

  /* ── Declaration ── */
  .declaration {
    margin: 6mm 0;
    font-size: 12pt;
  }
  .declaration .heading {
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
    margin-bottom: 4mm;
  }
  .declaration ol {
    margin-left: 20px;
    margin-bottom: 4mm;
  }
  .declaration li {
    text-align: justify;
    margin-bottom: 4mm;
    line-height: 1.6;
  }
  .declaration .indent {
    margin-left: 40px;
    margin-top: 2mm;
    font-size: 11.5pt;
  }

  /* ── Signature section ── */
  .sig-section {
    margin-top: 8mm;
    display: flex;
    justify-content: flex-end;
  }
  .sig-box {
    font-size: 11pt;
  }
  .sig-box .label {
    font-weight: bold;
    margin-bottom: 3mm;
  }
  .sig-space {
    border-bottom: 1px solid #000;
    min-height: 12mm;
    display: flex;
    align-items: flex-end;
    margin-bottom: 2mm;
  }
  .sig-name {
    font-weight: bold;
    margin-top: 2mm;
  }

  .meta-row {
    display: flex;
    margin-top: 6mm;
    font-size: 12pt;
  }

  .enclosure {
    margin-top: 6mm;
    font-size: 11pt;
    font-style: italic;
  }

  @media print { 
    @page { size: auto; margin: 0; }
    body { padding: 0; margin: 0; } 
    .page { width: 210mm; margin: 0; padding: 18mm 22mm; } 
  }
</style>
</head>
<body>
<div class="page">

  <!-- ── Header ── -->
  <div class="header">
    <div class="form-title">Form 9</div>
    <div class="form-subtitle">Consent to act as Designated Partner</div>
    <div class="form-rule">[Pursuant to Section 7(3) of the Limited Liability Partnership Act, 2008]</div>
  </div>

  <!-- ── Date ── -->
  <div class="date-row">Date: ${e(date)}</div>

  <!-- ── To ── -->
  <div class="to-block">
    To,<br/>
    <strong>${e(llp)}</strong><br/>
    <em>(under incorporation)</em><br/>
    ${e(llpAddress)}
  </div>

  <!-- ── Subject ── -->
  <div class="subject">Subject: Consent to act as Designated Partner</div>

  <!-- ── Consent body ── -->
  <div class="body-para">
    I, <strong>${e(name)}</strong> hereby testify my consent to act as designated partner of the
    <strong>${e(llp)}</strong> pursuant to Section 7(3) of the Limited Liability Partnership Act, 2008.
  </div>

  <div class="body-para">
    I, also hereby undertake to contribute money or other property or other benefit or to perform
    services for Limited Liability Partnership as per my obligations described in the Limited
    Liability Partnership Agreement.
  </div>

  <!-- ── Details table ── -->
  <table class="details-table">
    <thead>
      <tr>
        <th class="col-num">S.No.</th>
        <th class="col-label">Subject</th>
        <th>Particulars</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="col-num">1</td><td>Designated Partner Identification Number (DPIN)</td><td>${e(dpinLine)}</td></tr>
      <tr><td class="col-num">2</td><td>PAN</td><td>${e(pan)}</td></tr>
      <tr><td class="col-num">3</td><td>Name</td><td>${e(name)}</td></tr>
      <tr><td class="col-num">4</td><td>Father's / Husband's Name</td><td>${e(father)}</td></tr>
      <tr><td class="col-num">5</td><td>Present Residential Address</td><td>${e(addr)}</td></tr>
      <tr><td class="col-num">6</td><td>E-Mail ID</td><td>${e(email)}</td></tr>
      <tr><td class="col-num">7</td><td>Mobile No.</td><td>${e(mob)}</td></tr>
      <tr>
        <td class="col-num">8</td>
        <td>Name of the Partnership Firm / LLPIN & Name of LLP / CIN & Name of Company whose nominee the designated partner is.</td>
        <td>${e(nominee)}</td>
      </tr>
    </tbody>
  </table>

  <!-- ── Declaration ── -->
  <div class="declaration">
    <div class="heading">Declaration</div>
    <ol>
      <li>I declare that I have not been convicted of any offence in connection with the promotion,
      formation or management of any company or LLP and have not been found guilty of any fraud or
      misfeasance or of any breach of duty to any company under this Act, or any previous company law
      in the last five years. I further declare that if appointed, my total directorship in all the
      companies shall not exceed the prescribed number of companies in which a person can be appointed
      as Director.</li>
      <li>I further declare that –
        <div class="indent">I am not required to obtain the security clearance from the Ministry of Home
        Affairs, Government of India, under sub-rule (1) of rule 10 before applying for director
        identification number.</div>
      </li>
    </ol>
  </div>

  <!-- ── Signature ── -->
  <div class="sig-section">
    <div class="sig-box">
      <div class="label">Signed:</div>
      <div class="sig-space">
        ${v.signatureImage ? `<img src="${v.signatureImage}" style="max-height: 12mm; max-width: 40mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
      </div>
      <div class="sig-name">(${e(sigPrinted)})</div>
    </div>
  </div>

  <!-- ── Date ── -->
  <div class="meta-row">
    <div><strong>Date:</strong> ${e(date)}</div>
  </div>

  <!-- ── Enclosure ── -->
  <div class="enclosure">Enclosed: Copy of PAN Card and Address Proof</div>

</div>
</body>
</html>`;
}
