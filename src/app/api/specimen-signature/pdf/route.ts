import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";

type DirectorEntry = {
  name: string;
  designation: string;
  signatureImageUrl: string;
};

type SpecimenValues = {
  establishmentName: string;
  companySignatureImageUrl?: string;
  directors: DirectorEntry[];
  place: string;
  date: string;
};

function buildHtml(data: SpecimenValues): string {
  const val = (s: string) => (s?.trim() ? esc(s) : "_______________");
  const fDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "_______________";

  const compSig = (data.companySignatureImageUrl ?? "").trim();
  const companyBlock = compSig
    ? `<div class="company-sig" style="border:1px dashed #4338ca;padding:12px;margin-bottom:16px;background:#fafaff;">
         <div style="font-size:11pt;font-weight:bold;color:#4338ca;margin-bottom:6px;">Company / Common seal (specimen)</div>
         <img src="${compSig.replace(/"/g, "&quot;")}" alt="Company" style="max-height:80px;max-width:280px;object-fit:contain;" />
       </div>`
    : `<div class="company-sig" style="border:1px dashed #4338ca;padding:12px;margin-bottom:16px;background:#fafaff;">
         <div style="font-size:11pt;font-weight:bold;color:#4338ca;">Company / Common seal (specimen)</div>
         <div style="color:#999;">_______________</div>
       </div>`;

  const directorCards = (data.directors ?? [])
    .map(
      (dir, idx) => `
    <div class="dir-card">
      <div class="dir-row">
        <span class="dir-label">Name of the Director ${idx + 1}</span>
        <span class="dir-sep"> &ndash; </span>
        <span class="dir-val">${val(dir.name)}</span>
      </div>
      <div class="dir-row">
        <span class="dir-label">Designation</span>
        <span class="dir-sep"> &ndash; </span>
        <span class="dir-val">${val(dir.designation)}</span>
      </div>
      <div class="dir-row dir-sig-row">
        <span class="dir-label">Specimen Signature :</span>
        <span class="dir-sig">
          ${
            dir.signatureImageUrl
              ? `<img src="${dir.signatureImageUrl}" alt="Signature" style="max-height:60px;max-width:200px;object-fit:contain;" />`
              : '<div style="width:200px;height:60px;border:1px solid #ccc;"></div>'
          }
        </span>
      </div>
    </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:"Times New Roman",serif; font-size:12pt; color:#000; padding:20px; }
    .page { max-width:800px; margin:0 auto; }
    .header { text-align:center; font-weight:bold; text-decoration:underline; font-size:13pt; margin-bottom:20px; text-transform:uppercase; }
    .establishment { margin-bottom:20px; }
    .establishment .label { font-size:11pt; color:#555; }
    .establishment .value { font-size:13pt; font-weight:bold; }
    .dir-card { border:1px solid #000; padding:16px; margin-bottom:16px; }
    .dir-row { display:flex; align-items:flex-start; margin-bottom:10px; gap:4px; }
    .dir-row:last-child { margin-bottom:0; }
    .dir-label { min-width:200px; }
    .dir-val { font-weight:bold; }
    .footer { margin-top:24px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      Specimen Signature Card for Upload with the Online Application<br/>
      for Registration of the Company
    </div>
    <div class="establishment">
      <div class="label">NAME OF ESTABLISHMENT</div>
      <div class="value">${val(data.establishmentName)}</div>
    </div>
    ${companyBlock}
    ${directorCards}
    <div class="footer">
      <div><strong>Date:</strong> ${fDate(data.date)}</div>
      <div><strong>Place:</strong> ${val(data.place)}</div>
    </div>
  </div>
</body>
</html>`;
}

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { values?: unknown }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const html = buildHtml(body.values as SpecimenValues);
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
    });
    const arrayBuffer = pdf.buffer.slice(
      pdf.byteOffset,
      pdf.byteOffset + pdf.byteLength,
    ) as ArrayBuffer;
    return new NextResponse(arrayBuffer, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="Specimen-Signature.pdf"',
      },
    });
  } finally {
    await browser.close();
  }
}
