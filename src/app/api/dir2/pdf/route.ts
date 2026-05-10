import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderHtml } from "@/lib/render/renderTemplate";
import {
  dir2ConsentTemplateHtml,
  dir2ConsentCss,
} from "@/lib/templates/dir2-consent";
import { normalizeDir2Values } from "@/lib/dir2/normalize";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { values?: unknown }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const values = normalizeDir2Values(body.values);
  const html = renderHtml(dir2ConsentTemplateHtml, values, {
    title: "DIR-2 Consent to Act as Director",
    css: dir2ConsentCss,
  });

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
        "content-disposition": 'attachment; filename="DIR-2-Consent.pdf"',
      },
    });
  } finally {
    await browser.close();
  }
}
