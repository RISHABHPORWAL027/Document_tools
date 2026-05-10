/** Form 9 — Consent to act as Designated Partner (LLP) — generator-friendly layout. */

export type LlpForm9Values = {
  llpName?: string;
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
  place?: string;
  date?: string;
  /**
   * Printed under “Signature of Designated Partner”. If blank, uses partner name.
   */
  signaturePrintedName?: string;
  witnessName?: string;
  witnessAddress?: string;
  /** Legacy single field — if set without witnessName, still shown */
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
  const place = v.place?.trim() || BLANK;
  const date = fmtDate(v.date?.trim() || "");
  const sigPrinted =
    v.signaturePrintedName?.trim() || v.partnerName?.trim() || BLANK;
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
    font-size: 12.5pt;
    color: #111;
    background: #fff;
    line-height: 1.55;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 18mm 22mm;
    background: #fff;
  }
  .title {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin-bottom: 10mm;
    border-bottom: 2px solid #111;
    padding-bottom: 4mm;
  }
  .field-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 2mm 4mm;
    margin-bottom: 3mm;
    align-items: baseline;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .label { font-weight: 600; font-size: 11pt; color: #333; flex-shrink: 0; }
  .value { 
    border-bottom: 1px solid #ccc; 
    min-height: 1.3em; 
    padding-bottom: 1mm;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .block { margin-top: 6mm; text-align: justify; }
  .witness { margin-top: 14mm; display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; }
  .sig-box { border-top: 1px solid #000; padding-top: 2mm; font-size: 11pt; }
  @media print { body { padding: 0; } .page { margin: 0; } }
</style>
</head>
<body>
<div class="page">
  <div class="title">Consent to act as Designated Partner<br/><span style="font-size:11pt;font-weight:normal;">(LLP Form 9 — illustrative draft)</span></div>

  <div class="field-row"><span class="label">Name of LLP</span><span class="value">${e(llp)}</span></div>
  <div class="field-row"><span class="label">Designated Partner</span><span class="value">${e(name)}</span></div>
  <div class="field-row"><span class="label">Father / Mother&apos;s name</span><span class="value">${e(father)}</span></div>
  <div class="field-row"><span class="label">Residential address</span><span class="value">${e(addr)}</span></div>
  <div class="field-row"><span class="label">Nationality</span><span class="value">${e(nat)}</span></div>
  <div class="field-row"><span class="label">Occupation</span><span class="value">${e(occ)}</span></div>
  <div class="field-row"><span class="label">Date of birth</span><span class="value">${e(dob)}</span></div>
  <div class="field-row"><span class="label">PAN</span><span class="value">${e(pan)}</span></div>
  <div class="field-row"><span class="label">DPIN</span><span class="value">${e(dpinLine)}</span></div>
  <div class="field-row"><span class="label">Email</span><span class="value">${e(email)}</span></div>
  <div class="field-row"><span class="label">Mobile</span><span class="value">${e(mob)}</span></div>

  <div class="block">
    I, <strong>${e(name)}</strong>, hereby consent to become the Designated Partner of <strong>${e(llp)}</strong>
    and undertake to comply with the provisions of the Limited Liability Partnership Act, 2008 and rules made thereunder,
    including filing of statutory documents and payment of fees as applicable.
  </div>

  <div style="margin-top:10mm;display:flex;justify-content:space-between;gap:8mm;">
    <div>
      <div style="margin-bottom:2mm;font-weight:600;">Place</div>
      <div class="value" style="min-width:45mm;">${e(place)}</div>
    </div>
    <div style="text-align:right;">
      <div style="margin-bottom:2mm;font-weight:600;">Date</div>
      <div class="value" style="min-width:45mm;display:inline-block;">${e(date)}</div>
    </div>
  </div>

  <div class="witness">
    <div class="sig-box">
      <strong>Signature of Designated Partner</strong><br/>
      <div style="margin: 4mm 0; border-bottom: 1px solid #eee; min-height: 10mm; display: flex; align-items: flex-end;">
        ${v.signatureImage ? `<img src="${v.signatureImage}" style="max-height: 15mm; max-width: 45mm; object-fit: contain;" />` : `<div style="height: 10mm;"></div>`}
      </div>
      (${e(sigPrinted)})
    </div>
    <div class="sig-box">
      <strong>Witness (Name &amp; Address)</strong><br/><br/><br/>
      ${e(witness)}
    </div>
  </div>
</div>
</body>
</html>`;
}
