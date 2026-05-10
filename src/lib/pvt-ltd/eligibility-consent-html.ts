import { escapeHtml } from "@/lib/utils";

export interface EligibilityConsentData {
  companyName: string;
  companyAddress: string;
  firmName: string;
  firmAddress: string;
  frn: string;
  date: string;
  auditorPan: string;
  auditorMembershipNo: string;
  auditorEmail: string;
  signatoryName: string;
  designation: string;
  membershipNumber: string;
  signatureImage?: string;
  place: string;
  financialYear: string;
}

function e(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}
const BLANK = "________________";

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export function buildEligibilityConsentHtml(data: EligibilityConsentData) {
  const company = data.companyName?.trim() || BLANK;
  const companyAddr = data.companyAddress?.trim() || BLANK;
  const firm = data.firmName?.trim() || BLANK;
  const firmAddr = data.firmAddress?.trim() || BLANK;
  const frn = data.frn?.trim() || BLANK;
  const date = fmtDate(data.date?.trim() || "");
  const pan = data.auditorPan?.trim() || BLANK;
  const memNo = data.auditorMembershipNo?.trim() || data.membershipNumber?.trim() || BLANK;
  const email = data.auditorEmail?.trim() || BLANK;
  const signatory = data.signatoryName?.trim() || BLANK;
  const desg = data.designation?.trim() || "PARTNER";

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
      background: #fff;
      padding: 0;
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

    .to-block { margin-bottom: 6mm; line-height: 1.7; font-size: 12pt; }
    .subject { font-weight: bold; margin-bottom: 6mm; font-size: 12pt; text-align: justify; line-height: 1.6; }
    .body-para { text-align: justify; line-height: 1.7; margin-bottom: 5mm; font-size: 12pt; }
    .body-para strong { font-weight: bold; }
    ol.declarations { margin-left: 20px; margin-bottom: 6mm; }
    ol.declarations li { margin-bottom: 4mm; text-align: justify; line-height: 1.6; font-size: 12pt; }

    /* ── ADT-1 table ── */
    .adt-table {
      width: 100%;
      border-collapse: collapse;
      margin: 6mm 0;
      font-size: 11pt;
    }
    .adt-table th, .adt-table td {
      border: 1px solid #000;
      padding: 6px 10px;
      text-align: left;
      vertical-align: top;
    }
    .adt-table th {
      background: #f0f0f0;
      font-weight: bold;
      text-align: center;
    }
    .adt-table .col-num { width: 40px; text-align: center; }

    /* ── Footer / Signature ── */
    .closing { margin-top: 8mm; font-size: 12pt; }
    .sig-block { margin-top: 10mm; }
    .sig-line {
      border-bottom: 1px solid #000;
      min-height: 12mm;
      display: flex;
      align-items: flex-end;
      margin-bottom: 2mm;
      max-width: 200px;
    }
    .sig-name { font-weight: bold; font-size: 12pt; }
    .sig-detail { font-size: 11pt; margin-top: 1mm; }

    @media print {
      body { padding: 0; }
      .page { width: 210mm; margin: 0; padding: 15mm 20mm; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- ── To ── -->
    <div class="to-block">
      To<br/>
      The Board of Directors,<br/>
      <strong>${e(company)}</strong><br/>
      ${e(companyAddr)}
    </div>

    <!-- ── Subject ── -->
    <div class="subject">
      <u>Sub</u>: Certificate of eligibility cum consent to act as auditor (under section 139
      read with section 141 of the Companies Act, 2013).
    </div>

    <!-- ── Body ── -->
    <div class="body-para">Dear Sir,</div>

    <div class="body-para">
      With reference to your proposal of appointment of our firm as Statutory Auditors of the
      Company, to hold office until the conclusion of the First Annual General Meeting of the
      Company, we thankfully certify and confirm that in case of our firm is being appointed as
      the auditor we are desirous and ready to act as auditors of the company and do declare that:
    </div>

    <ol class="declarations">
      <li>None of the disqualifications under Section 141 of the Companies Act, 2013 applies to
      us and we are qualified for appointment as statutory auditors of the company.</li>
      <li>There are no adverse remark/ disciplinary proceedings pending/ initiated against the
      firm/ any of its partners on the records of ICAI, which would make them ineligible for
      appointment as auditors.</li>
      <li>In addition to the requirement of section 141(3)(d) of the Companies Act, 2013 in
      regards to indebtness, the spouse, dependent children and wholly or mainly dependent parents,
      brothers, sisters or any of them, of any of the partners of the firm are not indebted to
      the company.</li>
      <li>None of the partners or their spouses, dependent children and wholly or mainly dependent
      parents, brothers, sisters or any of them, of any of the partners of the firm has been
      declared willful defaulters by any bank/ financial institution.</li>
      <li>If the Re-appointment of our firm is made as Statutory Auditor, it shall be within the
      ceiling provided under section 141 of the Companies Act, 2013.</li>
    </ol>

    <div class="body-para">
      We further submit the requisite information as required while filing Form ADT-1 to MCA
      portal as under:
    </div>

    <!-- ── ADT-1 Table ── -->
    <table class="adt-table">
      <thead>
        <tr>
          <th class="col-num">S.No.</th>
          <th>Particulars</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-num">1</td>
          <td>Income Tax PAN of Auditor or auditor's firm</td>
          <td>${e(pan)}</td>
        </tr>
        <tr>
          <td class="col-num">2</td>
          <td>Name of the Auditor or Auditor's firm</td>
          <td>${e(firm)}</td>
        </tr>
        <tr>
          <td class="col-num">3</td>
          <td>Membership Number of Auditor or auditor's firm's reg. number Mem. No</td>
          <td>${e(memNo)}</td>
        </tr>
        <tr>
          <td class="col-num">4</td>
          <td>Address of the Auditor</td>
          <td>${e(firmAddr)}</td>
        </tr>
        <tr>
          <td class="col-num">5</td>
          <td>Email id</td>
          <td>${e(email)}</td>
        </tr>
      </tbody>
    </table>

    <!-- ── Closing ── -->
    <div class="closing">
      Thanking you,<br/><br/>
      Yours faithfully,
    </div>

    <div class="sig-block">
      <strong>FOR M/S ${e(firm)}</strong><br/>
      <strong>CHARTERED ACCOUNTANTS</strong><br/>
      <strong>(FRN: ${e(frn)})</strong>
      <div class="sig-line">
        ${data.signatureImage ? `<img src="${data.signatureImage}" style="max-height: 12mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 12mm;"></div>`}
      </div>
      <div class="sig-name">${e(signatory)}</div>
      <div class="sig-detail">${e(desg)}</div>
      <div class="sig-detail">MEMBERSHIP NO: ${e(memNo)}</div>
    </div>

  </div>
</body>
</html>`;
}
