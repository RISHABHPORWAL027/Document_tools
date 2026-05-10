import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs";

type DirectorEntry = {
  name: string;
  designation: string;
};

type SpecimenValues = {
  establishmentName: string;
  companySignatureImageUrl?: string;
  directors: DirectorEntry[];
  place: string;
  date: string;
};

function fDate(d: string) {
  if (!d) return "_______________";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function val(s: string) {
  return s?.trim() ? s : "_______________";
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { values?: unknown }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const data = body.values as SpecimenValues;

  const lines: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: "SPECIMEN SIGNATURE CARD FOR UPLOAD WITH THE ONLINE APPLICATION FOR REGISTRATION OF THE COMPANY",
          bold: true,
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [
        new TextRun({ text: "NAME OF ESTABLISHMENT ", bold: true }),
        new TextRun({ text: " – " }),
        new TextRun({ text: val(data.establishmentName), bold: true }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];

  (data.directors ?? []).forEach((dir, idx) => {
    lines.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Name of the Director ${idx + 1}` }),
          new TextRun({ text: " – " }),
          new TextRun({ text: val(dir.name), bold: true }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Designation" }),
          new TextRun({ text: " – " }),
          new TextRun({ text: val(dir.designation), bold: true }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Specimen Signature : " }),
        ],
      }),
      new Paragraph({ text: "" }),
    );
  });


  const doc = new Document({ sections: [{ children: lines }] });
  const buffer = await Packer.toBuffer(doc);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition":
        'attachment; filename="Specimen-Signature.docx"',
    },
  });
}
