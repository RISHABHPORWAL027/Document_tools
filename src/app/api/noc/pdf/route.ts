import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildNocHtml, type NocValues } from "@/lib/noc/build-html";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { values?: NocValues }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const html = buildNocHtml(body.values);

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
    });
    const arrayBuffer = pdf.buffer.slice(
      pdf.byteOffset,
      pdf.byteOffset + pdf.byteLength,
    ) as ArrayBuffer;

    return new NextResponse(arrayBuffer, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="NOC.pdf"',
      },
    });
  } finally {
    await browser.close();
  }
}
