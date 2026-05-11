import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, Table, TableRow, TableCell, BorderStyle, WidthType } from "docx";
import type { LlpForm9Values } from "@/lib/llp/form9-html";

export const runtime = "nodejs";

const BLANK = "________________";

function para(
  text: string,
  bold = false,
  align?: (typeof AlignmentType)[keyof typeof AlignmentType],
  size = 24, // 12pt
  italic = false,
  underline = false
) {
  return new Paragraph({
    alignment: align,
    children: [new TextRun({ 
      text, 
      bold: bold || undefined, 
      italics: italic || undefined,
      underline: underline ? {} : undefined,
      font: "Times New Roman", 
      size 
    })],
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
    month: "long",
    year: "numeric",
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { values?: LlpForm9Values }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const v = body.values;
  const llp = v.llpName?.trim() || BLANK;
  const llpAddress = v.llpAddress?.trim() || BLANK;
  const name = v.partnerName?.trim() || BLANK;
  const father = v.fatherName?.trim() || BLANK;
  const addr = v.residentialAddress?.trim() || BLANK;
  const email = v.email?.trim() || BLANK;
  const mob = v.mobile?.trim() || BLANK;
  const pan = v.pan?.trim().toUpperCase() || BLANK;
  const dpin = v.dpin?.replace(/\D/g, "").trim() || "";
  const dpinLine = dpin.length === 8 ? dpin : BLANK;
  const nominee = v.nomineeDetails?.trim() || BLANK;
  const dateStr = fmtDate(v.date?.trim() || "");
  const sigPrinted = v.signaturePrintedName?.trim() || v.partnerName?.trim() || BLANK;

  const doc = new Document({
    sections: [
      {
        children: [
          para("Form 9", true, AlignmentType.CENTER, 28),
          para("Consent to act as Designated Partner", true, AlignmentType.CENTER, 24),
          para("[Pursuant to Section 7(3) of the Limited Liability Partnership Act, 2008]", false, AlignmentType.CENTER, 20, true),
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, color: "auto", space: 1, size: 12 } as any },
            children: [],
          }),
          new Paragraph({ text: "" }),
          para(`Date: ${dateStr}`, false, AlignmentType.RIGHT),
          new Paragraph({ text: "" }),
          para("To,"),
          para(llp, true),
          para("(under incorporation)", false, undefined, 20, true),
          para(llpAddress),
          new Paragraph({ text: "" }),
          para("Subject: Consent to act as Designated Partner", true),
          new Paragraph({ text: "" }),
          para(`I, ${name} hereby testify my consent to act as designated partner of the ${llp} pursuant to Section 7(3) of the Limited Liability Partnership Act, 2008.`),
          new Paragraph({ text: "" }),
          para("I, also hereby undertake to contribute money or other property or other benefit or to perform services for Limited Liability Partnership as per my obligations described in the Limited Liability Partnership Partnership Agreement."),
          new Paragraph({ text: "" }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [para("S.No.", true, AlignmentType.CENTER)], width: { size: 10, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [para("Subject", true)], width: { size: 40, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [para("Particulars", true)], width: { size: 50, type: WidthType.PERCENTAGE } }),
                ],
              }),
              ...[
                ["1", "Designated Partner Identification Number (DPIN)", dpinLine],
                ["2", "PAN", pan],
                ["3", "Name", name],
                ["4", "Father's / Husband's Name", father],
                ["5", "Present Residential Address", addr],
                ["6", "E-Mail ID", email],
                ["7", "Mobile No.", mob],
                ["8", "Name of the Partnership Firm / LLPIN & Name of LLP / CIN & Name of Company whose nominee the designated partner is.", nominee],
              ].map(([n, s, p]) => new TableRow({
                children: [
                  new TableCell({ children: [para(n, false, AlignmentType.CENTER)] }),
                  new TableCell({ children: [para(s)] }),
                  new TableCell({ children: [para(p)] }),
                ],
              })),
            ],
          }),

          new Paragraph({ text: "" }),
          para("Declaration", true, AlignmentType.CENTER, 24, false, true),
          new Paragraph({
            children: [
              new TextRun({ text: "1. I declare that I have not been convicted of any offence in connection with the promotion, formation or management of any company or LLP and have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act, or any previous company law in the last five years. I further declare that if appointed, my total directorship in all the companies shall not exceed the prescribed number of companies in which a person can be appointed as Director.", font: "Times New Roman", size: 24 })
            ],
            alignment: AlignmentType.JUSTIFIED,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "2. I further declare that –", font: "Times New Roman", size: 24 })
            ],
          }),
          new Paragraph({
            indent: { left: 720 },
            children: [
              new TextRun({ text: "I am not required to obtain the security clearance from the Ministry of Home Affairs, Government of India, under sub-rule (1) of rule 10 before applying for director identification number.", font: "Times New Roman", size: 24 })
            ],
            alignment: AlignmentType.JUSTIFIED,
          }),
          new Paragraph({ text: "" }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      para("Signed:", true, AlignmentType.RIGHT),
                      ...sigImagePara(v.signatureImage, AlignmentType.RIGHT),
                      para(`(${sigPrinted})`, true, AlignmentType.RIGHT),
                    ],
                  }),
                ],
              }),
            ],
          }),
          
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [para(`Date: ${dateStr}`, true)] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          para("Enclosed: Copy of PAN Card and Address Proof", false, undefined, 20, true),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": 'attachment; filename="LLP-Form9.docx"',
    },
  });
}
