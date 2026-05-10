/** LLP Subscription sheet — partner contributions (FiLLiP pack style). */

export type LlpSubscriptionRow = {
  partnerName?: string;
  contributionRs?: string;
  signatureImage?: string;
};

export type LlpSubscriptionValues = {
  llpName?: string;
  place?: string;
  date?: string;
  rows?: LlpSubscriptionRow[];
};

function e(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

const BLANK = "—";

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
  const llp = raw.llpName?.trim() || "________________";
  const place = raw.place?.trim() || "________________";
  const date = fmtDate(raw.date?.trim() || "");
  const rows =
    raw.rows?.filter((r) => r.partnerName?.trim() || r.contributionRs?.trim()) ??
    [];
  const displayRows =
    rows.length > 0
      ? rows
      : [
          { partnerName: "", contributionRs: "" },
          { partnerName: "", contributionRs: "" },
        ];

  const totalRs = displayRows.reduce((acc, r) => {
    const n = parseFloat(String(r.contributionRs ?? "").replace(/,/g, ""));
    return acc + (Number.isFinite(n) ? n : 0);
  }, 0);
  const totalLabel =
    totalRs > 0
      ? totalRs.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : "________";

  const tbody = displayRows
    .map((r, i) => {
      const nm = r.partnerName?.trim() || BLANK;
      const rs = r.contributionRs?.trim() || BLANK;
      return `<tr>
        <td style="text-align:center;padding:8px;border:1px solid #333;">${i + 1}</td>
        <td style="padding:8px;border:1px solid #333;">${e(nm)}</td>
        <td style="padding:8px;border:1px solid #333;text-align:right;">${e(rs)}</td>
        <td style="padding:4px;border:1px solid #333;text-align:center;vertical-align:middle;">
          ${r.signatureImage ? `<img src="${r.signatureImage}" style="max-height:12mm;max-width:30mm;object-fit:contain;" />` : ""}
        </td>
      </tr>`;
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
    font-size: 12pt;
    color: #111;
    background: #fff;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 18mm 16mm;
  }
  h1 {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 2mm;
    letter-spacing: 0.04em;
  }
  .sub {
    text-align: center;
    font-size: 11pt;
    color: #444;
    margin-bottom: 8mm;
  }
  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4mm;
    margin-bottom: 6mm;
    font-size: 11pt;
  }
  table { width: 100%; border-collapse: collapse; margin-bottom: 6mm; }
  th {
    background: #f4f4f5;
    font-weight: 700;
    font-size: 10pt;
    padding: 8px;
    border: 1px solid #333;
    text-align: left;
  }
  .note {
    font-size: 10.5pt;
    text-align: justify;
    line-height: 1.5;
    margin-top: 6mm;
    color: #333;
  }
  @media print { .page { margin: 0; } }
</style>
</head>
<body>
<div class="page">
  <h1>Subscription Sheet</h1>
  <div class="sub">Limited Liability Partnership — contribution by partners</div>
  <div class="meta">
    <div><strong>Name of LLP (proposed):</strong> ${e(llp)}</div>
    <div style="text-align:right;"><strong>Date:</strong> ${e(date)}</div>
    <div><strong>Place:</strong> ${e(place)}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:8%;text-align:center;">Sl.</th>
        <th style="width:38%;">Name of Partner / Designated Partner</th>
        <th style="width:22%;text-align:right;">Contribution (₹)</th>
        <th style="width:32%;">Signature</th>
      </tr>
    </thead>
    <tbody>${tbody}
      <tr>
        <td colspan="2" style="padding:8px;border:1px solid #333;text-align:right;font-weight:bold;">Total</td>
        <td style="padding:8px;border:1px solid #333;text-align:right;font-weight:bold;">${e(totalLabel)}</td>
        <td style="border:1px solid #333;"></td>
      </tr>
    </tbody>
  </table>
  <p class="note">
    Each subscriber confirms subscription to the contribution amounts stated above towards the formation of the LLP.
    Figures should match supportings filed with FiLLiP / incorporation documents. This sheet is for drafting convenience —
    align wording with your professional advisor and latest MCA forms.
  </p>
</div>
</body>
</html>`;
}
