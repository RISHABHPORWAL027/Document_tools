import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    html: string;
    fileName: string;
  } | null;

  if (!body?.html) {
    return NextResponse.json({ error: "Missing HTML content" }, { status: 400 });
  }

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(body.html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
    });

    const arrayBuffer = pdf.buffer.slice(
      pdf.byteOffset,
      pdf.byteOffset + pdf.byteLength,
    ) as ArrayBuffer;

    return new NextResponse(arrayBuffer as any, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${body.fileName || "document.pdf"}"`,
      },
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await browser.close();
  }
}
