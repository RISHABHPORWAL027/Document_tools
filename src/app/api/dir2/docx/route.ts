import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { renderHtml } from "@/lib/render/renderTemplate";
import {
  dir2ConsentTemplateHtml,
  dir2ConsentCss,
} from "@/lib/templates/dir2-consent";
import { normalizeDir2Values } from "@/lib/dir2/normalize";
import { htmlToText } from "@/lib/render/htmlToText";

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
  const text = htmlToText(html);
  const lines = text.split("\n");

  const doc = new Document({
    sections: [
      {
        children: lines.map((line) =>
          line.trim()
            ? new Paragraph({ children: [new TextRun({ text: line.trim() })] })
            : new Paragraph({ text: "" }),
        ),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": 'attachment; filename="DIR-2-Consent.docx"',
    },
  });
}
