import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import { type NocValues, nocSignatoryIdPlain } from "@/lib/noc/build-html";

export const runtime = "nodejs";

function para(text: string, bold = false, align?: (typeof AlignmentType)[keyof typeof AlignmentType]) {
  return new Paragraph({
    alignment: align,
    children: [new TextRun({ text, bold, font: "Times New Roman", size: 26 })],
  });
}

function blank() {
  return new Paragraph({ text: "" });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { values?: NocValues }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const v = body.values;
  const ownerName = v.ownerName?.trim() || "";
  const ownerAddress = v.ownerAddress?.trim() || "";
  const rawDate = v.date?.trim() || "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
    ? new Date(rawDate + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : rawDate;
  const companyName = v.companyName?.trim() || "";
  const regAddress = v.registeredOfficeAddress?.trim() || "";
  const sigs =
    v.signatories?.length && v.signatories.length > 0 ? v.signatories : [{}, {}];

  const signatoryParagraphs: ReturnType<typeof para>[] = [];
  sigs.forEach((s, i) => {
    signatoryParagraphs.push(
      para(s.name?.trim() || "________________", true),
      para(s.position?.trim() || "________________"),
      para(nocSignatoryIdPlain(s.din, s.pan)),
    );
    if (i < sigs.length - 1) signatoryParagraphs.push(blank());
  });

  const doc = new Document({
    sections: [
      {
        children: [
          para("From:-"),
          para(ownerName, true),
          para(ownerAddress),
          blank(),
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, color: "auto", space: 1, size: 6 } as any },
            children: [],
          }),
          blank(),
          para(date, true, AlignmentType.RIGHT),
          blank(),
          para("To,"),
          para("Central Registration Centre, Ministry of Corporate Affairs"),
          para("Indian Institute of Corporate Affairs (IICA),"),
          para("Plot no. 6, 7, 8, Sector 5, IMT Manesar,"),
          para("Gurgaon, Haryana, India, 122050"),
          blank(),
          para(
            `SUBJECT:  REGARDING USE OF MY ADDRESS AS REGISTERED OFFICE OF ${companyName.toUpperCase()}`,
            true,
            AlignmentType.JUSTIFIED,
          ),
          blank(),
          para("Dear Sir/Mam,", true),
          blank(),
          para(
            `I, ${ownerName}, being registered owner of the property, hereby give my consent and permission to use the property owned by me as registered office of ${companyName}, a company under Incorporation. A copy of the address Proof is attached.`,
            false,
            AlignmentType.JUSTIFIED,
          ),
          blank(),
          para("Address of the property is as below:"),
          para(regAddress, true),
          blank(),
          para(
            "I have no objection if the company use this premises for its business purpose.",
            true,
            AlignmentType.JUSTIFIED,
          ),
          blank(),
          blank(),
          blank(),
          para(ownerName),
          blank(),
          para("Accepted & Consented", true),
          blank(),
          ...signatoryParagraphs,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer as any, {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": 'attachment; filename="NOC.docx"',
    },
  });
}
