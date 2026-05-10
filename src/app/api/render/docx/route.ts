import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { htmlToText } from "@/lib/render/htmlToText";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    html: string;
    fileName: string;
  } | null;

  if (!body?.html) {
    return NextResponse.json({ error: "Missing HTML content" }, { status: 400 });
  }

  const text = htmlToText(body.html);
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
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="${body.fileName || "document.docx"}"`,
    },
  });
}
