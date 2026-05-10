import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, Table, TableRow, TableCell, BorderStyle, WidthType } from "docx";
import { BankAccountValues } from "@/lib/pvt-ltd/bank-account-html";

export const runtime = "nodejs";

function para(text: string, bold = false, align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT, size = 24) {
  return new Paragraph({
    alignment: align,
    children: [new TextRun({ text, bold, font: "Times New Roman", size })],
  });
}

function sigImagePara(base64: string | undefined) {
  if (!base64 || !base64.includes("base64,")) return new Paragraph({ text: "" });
  try {
    const data = Buffer.from(base64.split(",")[1], "base64");
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data,
          transformation: { width: 120, height: 45 },
        } as any),
      ],
    });
  } catch (e) {
    return new Paragraph({ text: "" });
  }
}

function blank() {
  return new Paragraph({ text: "" });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { values?: BankAccountValues } | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const v = body.values;
  const company = (v.companyName || "________________ LIMITED").toUpperCase();
  const cin = v.cin || "________________";
  const address = v.regAddress || "________________";
  const mDate = v.meetingDate || "________________";
  const venue = (v.meetingVenue || "the Registered Office of the Company").toUpperCase();
  const bank = v.bankName || "________________ Bank";
  const branch = v.bankBranch || "________________ Branch";

  const signatories = v.authorizedSignatories || [];

  const doc = new Document({
    sections: [
      {
        children: [
          para(company, true, AlignmentType.CENTER, 32),
          para(`CIN: ${cin}`, false, AlignmentType.CENTER, 20),
          para(`Regd. Office: ${address}`, false, AlignmentType.CENTER, 20),
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
            children: [],
          }),
          blank(),
          para(`CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ${company} HELD ON ${mDate} AT ${venue}`, true, AlignmentType.CENTER),
          blank(),
          para(`"RESOLVED THAT a current account in the name of the Company be opened with ${bank}, ${branch} and the said Bank be and is hereby authorized to honor all cheques, bills of exchange, and other negotiable instruments signed, drawn, accepted, or made on behalf of the Company."`, false, AlignmentType.JUSTIFIED),
          blank(),
          para(`"RESOLVED FURTHER THAT the following directors/officers of the company be and are hereby authorized to operate the said bank account ${v.signingMethod}:"`, false, AlignmentType.JUSTIFIED),
          blank(),
          ...signatories.map(s => para(`• ${s.name}, ${s.designation} (DIN: ${s.din})`)),
          blank(),
          para(`"RESOLVED FURTHER THAT the said Bank be and is hereby instructed to accept and act upon any instructions relating to the said account(s) and/or any other transactions, including any amendment in the operation of the account, provided that such instructions are given in writing and signed as per the signing mandate mentioned above."`, false, AlignmentType.JUSTIFIED),
          blank(),
          para(`"RESOLVED FURTHER THAT a certified true copy of this resolution be furnished to the Bank and they be requested to act thereon."`, false, AlignmentType.JUSTIFIED),
          blank(),
          blank(),
          para(`For ${company}`, true),
          blank(),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [], width: { size: 60, type: WidthType.PERCENTAGE } }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      sigImagePara(v.signatureImage),
                      para(`( ${v.signatoryName || "________________"} )`, true, AlignmentType.CENTER),
                      para(v.signatoryDesignation || "Director", false, AlignmentType.CENTER),
                    ]
                  })
                ]
              })
            ]
          }),
          blank(),
          para(`Place: ${v.place || "________________"}`),
          para(`Date: ${v.date || "________________"}`),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="Bank_Account_Resolution.docx"`,
    },
  });
}
