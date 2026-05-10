import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } from "docx";
import {
  llpNocRoSignatoryIdPlain,
  type LlpNocRoValues,
} from "@/lib/llp/noc-ro-html";

export const runtime = "nodejs";

function para(
  text: string,
  bold = false,
  align?: (typeof AlignmentType)[keyof typeof AlignmentType],
) {
  return new Paragraph({
    alignment: align,
    children: [new TextRun({ text, bold, font: "Times New Roman", size: 26 })],
  });
}

function sigImagePara(base64: string | undefined, align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT) {
  if (!base64 || !base64.includes("base64,")) return [];
  try {
    const data = Buffer.from(base64.split(",")[1], "base64");
    return [
      new Paragraph({
        alignment: align,
        children: [
          new ImageRun({
            data,
            transformation: { width: 100, height: 40 },
          } as any),
        ],
      }),
    ];
  } catch (e) {
    return [];
  }
}

function blank() {
  return new Paragraph({ text: "" });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { values?: LlpNocRoValues }
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
  const llpName = v.llpName?.trim() || "";
  const regAddress = v.registeredOfficeAddress?.trim() || "";
  const sigs =
    v.signatories?.length && v.signatories.length > 0
      ? v.signatories
      : [];

  const signatoryParagraphs: Paragraph[] = [];
  sigs.forEach((s, i) => {
    signatoryParagraphs.push(...sigImagePara(s.signatureImage));
    signatoryParagraphs.push(
      para(s.name?.trim() || "________________", true),
      para(s.position?.trim() || "Designated Partner"),
      para(llpNocRoSignatoryIdPlain(s.dpin, s.pan)),
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
          para(date, true, AlignmentType.RIGHT),
          blank(),
          para("To,"),
          para("Central Registration Centre, Ministry of Corporate Affairs"),
          para("Indian Institute of Corporate Affairs (IICA),"),
          para("Plot no. 6, 7, 8, Sector 5, IMT Manesar,"),
          para("Gurgaon, Haryana, India, 122050"),
          blank(),
          para(
            `SUBJECT:  REGARDING USE OF MY ADDRESS AS REGISTERED OFFICE OF ${llpName.toUpperCase()} (LIMITED LIABILITY PARTNERSHIP)`,
            true,
            AlignmentType.JUSTIFIED,
          ),
          blank(),
          para("Dear Sir/Madam,", true),
          blank(),
          para(
            `I, ${ownerName}, being the registered owner of the property, hereby give my consent and permission to use the premises owned by me as the Registered Office of ${llpName}, a Limited Liability Partnership proposed to be registered / under incorporation with the Registrar of Companies. A copy of the address proof is attached herewith.`,
            false,
            AlignmentType.JUSTIFIED,
          ),
          blank(),
          para("Address of the property is as below:"),
          para(regAddress, true),
          blank(),
          para(
            "I have no objection if the said Limited Liability Partnership uses these premises for its business purposes in accordance with law.",
            true,
            AlignmentType.JUSTIFIED,
          ),
          blank(),
          blank(),
          ...sigImagePara(v.ownerSignatureImage as any),
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
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition":
        'attachment; filename="LLP-NOC-Registered-Office.docx"',
    },
  });
}
