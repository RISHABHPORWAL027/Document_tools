import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { getTool } from "@/lib/tools/registry";
import { renderHtml } from "@/lib/render/renderTemplate";
import { htmlToText } from "@/lib/render/htmlToText";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ toolId: string }> },
) {
  const { toolId } = await params;
  const tool = getTool(toolId);
  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as
    | { values?: unknown }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const html = renderHtml(tool.template.source, body.values, { title: tool.title });
  const text = htmlToText(html);
  const lines = text.split("\n");

  const doc = new Document({
    sections: [
      {
        children: lines.map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return new Paragraph({ text: "" });
          return new Paragraph({
            children: [new TextRun({ text: trimmed })],
          });
        }),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="${toolId}.docx"`,
    },
  });
}

