/** LLP Subscription sheet — pixel-perfect match to original document. */

export type LlpSubscriptionPartner = {
  name?: string;
  fatherName?: string;
  address?: string;
  pan?: string;
  dob?: string;
  mobile?: string;
  email?: string;
  occupation?: string;
  designation?: string; // e.g. Designated Partner
  signatureImage?: string;
};

export type LlpSubscriptionValues = {
  llpName?: string;
  place?: string;
  date?: string;
  witnessName?: string;
  witnessAddress?: string;
  witnessProfession?: string;
  witnessMembership?: string;
  witnessSignatureImage?: string;
  partners?: LlpSubscriptionPartner[];
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

export function buildLlpSubscriptionHtml(raw: LlpSubscriptionValues): string {
  const partners = raw.partners?.length ? raw.partners : [{ designation: "Designated Partner" }, { designation: "Designated Partner" }];
  const date = fmtDate(raw.date || "");
  const place = raw.place || BLANK;
  
  const witnessName = raw.witnessName || BLANK;
  const witnessAddr = raw.witnessAddress || BLANK;
  const witnessProf = raw.witnessProfession || BLANK;
  const witnessMem = raw.witnessMembership || "";

  const partnerBlocks = partners.map((p, i) => `
    <div class="partner-section">
      <div class="partner-details">
        <div class="row"><strong>Name of Designated Partner:</strong> ${e(p.name || BLANK)}</div>
        <div class="row"><strong>Father Name:</strong> ${e(p.fatherName || BLANK)}</div>
        <div class="row"><strong>R/O:</strong> ${e(p.address || BLANK)}</div>
        <div class="row"><strong>PAN:</strong> ${e(p.pan || BLANK)}</div>
        <div class="row"><strong>Date of Birth:</strong> ${e(p.dob || BLANK)}</div>
        <div class="row"><strong>Mobile number-:</strong> ${e(p.mobile || BLANK)}</div>
        <div class="row"><strong>Email Id:</strong> ${e(p.email || BLANK)}</div>
        <div class="row"><strong>Occupation:</strong> ${e(p.occupation || BLANK)}</div>
        <div class="row" style="margin-top: 10px; font-weight: bold;">${e(p.designation || "Designated Partner")}</div>
      </div>
      <div class="partner-sig">
        <div class="sig-box">
          ${p.signatureImage ? `<img src="${p.signatureImage}" style="max-height: 20mm; max-width: 45mm; object-fit: contain;" />` : ""}
        </div>
        <div style="text-align: center; font-size: 9pt; margin-top: 2mm;">(Signature)</div>
      </div>
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 11pt;
    color: #000;
    background: #fff;
    line-height: 1.4;
  }
  .page {
    width: 100%;
    min-height: 297mm;
    margin: 0 auto;
    padding: 20mm;
    background: #fff;
  }
  
  .title {
    text-align: center;
    font-weight: bold;
    text-decoration: underline;
    font-size: 14pt;
    margin-bottom: 6mm;
  }

  .intro-text {
    text-align: justify;
    margin-bottom: 5mm;
  }

  .consent-text {
    margin-bottom: 8mm;
  }

  .partner-section {
    display: flex;
    border: 1px solid #000;
    margin-bottom: -1px; /* collapse borders */
  }
  .partner-details {
    flex: 2;
    padding: 10px;
    border-right: 1px solid #000;
  }
  .partner-sig {
    flex: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .sig-box {
    width: 100%;
    min-height: 25mm;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .row {
    margin-bottom: 2mm;
  }

  .witness-section {
    display: flex;
    border: 1px solid #000;
    margin-top: 10mm;
  }
  .witness-details {
    flex: 2;
    padding: 10px;
    border-right: 1px solid #000;
  }
  .witness-sig {
    flex: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .meta-row {
    margin-top: 10mm;
    font-weight: bold;
  }

  @media print {
    @page { size: auto; margin: 0; }
    body { padding: 0; margin: 0; }
    .page { width: 210mm; margin: 0; padding: 20mm; border: none; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="title">SUBSCRIBER SHEET</div>

  <div class="intro-text">
    We the several persons, whose names are subscribed below, are desirous of being formed into a LLP for carrying on as lawful business with a view of profit and have entered and agreed to enter into a LLP agreement in writing and we respectively agree to contribute money or other benefit or to perform services for the LLP in accordance with the LLP agreement, the particulars of which are stated against our respective names.
  </div>

  <div class="consent-text">
    We hereby give our consent to become a partner/designated partner/nominee/nominee&amp; designated partner of the LLP pursuant to section 7(4)/ 25(3)(c) of the Limited Liability Partnership Act, 2008:
  </div>

  ${partnerBlocks}

  <div class="witness-section">
    <div class="witness-details">
      <div class="row"><strong>Name, Address and profession (along with professional membership number) of witness</strong></div>
      <div style="margin-top: 4mm;">
        ${e(witnessName)}<br/>
        ${e(witnessAddr)}<br/>
        ${e(witnessProf)} ${witnessMem ? `(Membership No. ${e(witnessMem)})` : ""}
      </div>
    </div>
    <div class="witness-sig">
      <div class="sig-box">
        ${raw.witnessSignatureImage ? `<img src="${raw.witnessSignatureImage}" style="max-height: 20mm; max-width: 45mm; object-fit: contain;" />` : ""}
      </div>
      <div style="text-align: center; font-size: 9pt; margin-top: 2mm;">(Signature of witness)</div>
    </div>
  </div>

  <div class="meta-row">
    <div>Date: ${e(date)}</div>
    <div>Place: ${e(place)}</div>
  </div>

</div>
</body>
</html>`;
}
