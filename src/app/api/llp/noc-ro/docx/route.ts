import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } from "docx";
import { type LlpNocRoValues } from "@/lib/llp/noc-ro-html";

export const runtime = "nodejs";

const BLANK = "________________";

function para(
  text: string,
  bold = false,
  align?: (typeof AlignmentType)[keyof typeof AlignmentType],
  size = 26,
  underline = false
) {
  return new Paragraph({
    alignment: align,
    children: [new TextRun({ 
      text, 
      bold, 
      underline: underline ? {} : undefined,
      font: "Times New Roman", 
      size 
    })],
  });
}

function sigImagePara(base64: string | undefined) {
  if (!base64 || !base64.includes("base64,")) return [];
  try {
    const data = Buffer.from(base64.split(",")[1], "base64");
    return [
      new Paragraph({
        children: [
          new ImageRun({
            data,
            transformation: { width: 120, height: 45 },
          } as any),
        ],
      }),
    ];
  } catch (e) {
    return [];
  }
}

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "."); 
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { values?: LlpNocRoValues }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const v = body.values;
  const ownerName = v.ownerName?.trim() || BLANK;
  const ownerAddress = v.ownerAddress?.trim() || BLANK;
  const dateStr = fmtDate(v.date?.trim() || "");
  const llpName = v.llpName?.trim() || BLANK;
  const regAddress = v.registeredOfficeAddress?.trim() || BLANK;
  const dpName = v.designatedPartnerName?.trim() || BLANK;

  const doc = new Document({
    sections: [
      {
        children: [
          para(ownerName, true),
          para(ownerAddress),
          new Paragraph({ text: "" }),
          para(`Dated: ${dateStr}`),
          new Paragraph({ text: "" }),
          para("Central Processing Center/ The Registrar of Companies"),
          para("Ministry of Corporate Affairs"),
          para("Manesar, Gurgaon (Haryana) 122050"),
          new Paragraph({ text: "" }),
          para(`Dated ${dateStr}`, true, AlignmentType.RIGHT),
          new Paragraph({ text: "" }),
          para(`Sub.: NO OBJECTION FOR USE OF PREMISES AS REGISTERED OFFICE OF ${llpName}`, true, AlignmentType.CENTER, 26, true),
          new Paragraph({ text: "" }),
          para("Dear Sir,"),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: "I, ", font: "Times New Roman", size: 26 }),
              new TextRun({ text: ownerName, bold: true, font: "Times New Roman", size: 26 }),
              new TextRun({ text: ", being the owner of the property situated at ", font: "Times New Roman", size: 26 }),
              new TextRun({ text: regAddress, bold: true, font: "Times New Roman", size: 26 }),
              new TextRun({ text: ", do hereby authorize ", font: "Times New Roman", size: 26 }),
              new TextRun({ text: dpName, bold: true, font: "Times New Roman", size: 26 }),
              new TextRun({ text: ", designated partners of ", font: "Times New Roman", size: 26 }),
              new TextRun({ text: llpName, bold: true, font: "Times New Roman", size: 26 }),
              new TextRun({ text: ", to set up an office at ", font: "Times New Roman", size: 26 }),
              new TextRun({ text: regAddress, bold: true, font: "Times New Roman", size: 26 }),
              new TextRun({ text: ".", font: "Times New Roman", size: 26 }),
            ],
          }),
          new Paragraph({ text: "" }),
          para("The proof for having ownership of the said premises Electricity Bill being enclosed herewith."),
          new Paragraph({ text: "" }),
          para("Thanking you"),
          new Paragraph({ text: "" }),
          para("Yours Faithfully"),
          ...sigImagePara(v.ownerSignatureImage),
          para("OWNER", true),
          new Paragraph({ text: "" }),
          para("Encl.: Copy of the Electricity Bill", true),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": 'attachment; filename="LLP-NOC-RO.docx"',
    },
  });
}
