import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } from "docx";
import { type AppointmentLetterCasualVacancyData } from "@/lib/pvt-ltd/auditor-casual-vacancy/appointment-letter-html";

export const runtime = "nodejs";

const BLANK = "________________";

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    values: AppointmentLetterCasualVacancyData;
  } | null;

  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const data = body.values;
  const date = fmtDate(data.date?.trim() || "");
  const firmName = data.auditorFirmName?.trim() || BLANK;
  const firmType = data.auditorFirmType?.trim() || "Chartered Accountants";
  const firmAddr = data.auditorAddress?.trim() || BLANK;
  const company = data.companyName?.trim() || BLANK;
  const fy = data.financialYear?.trim() || BLANK;
  const mDay = data.meetingDay?.trim() || BLANK;
  const mDom = data.meetingDayOfMonth?.trim() || BLANK;
  const mMonth = data.meetingMonth?.trim() || BLANK;
  const mYear = data.meetingYear?.trim() || BLANK;
  const sigName = data.signatoryName?.trim() || BLANK;
  const sigDin = data.signatoryDin?.trim() || BLANK;

  const createPara = (children: TextRun[]) =>
    new Paragraph({
      children,
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 240, line: 360 },
    });

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `Date: ${date}`, font: "Times New Roman", size: 24 }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [new TextRun({ text: "To,", font: "Times New Roman", size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: firmName, bold: true, font: "Times New Roman", size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `(${firmType})`, font: "Times New Roman", size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: firmAddr, font: "Times New Roman", size: 24 })],
            spacing: { after: 400 },
          }),

          createPara([
            new TextRun({ text: "Sub.: Your appointment as Statutory Auditor of the Company for the Financial Year ", font: "Times New Roman", size: 24, bold: true, underline: {} }),
            new TextRun({ text: `${fy}.`, font: "Times New Roman", size: 24, bold: true, underline: {} }),
          ]),

          new Paragraph({
            children: [new TextRun({ text: "Dear Sir,", font: "Times New Roman", size: 24 })],
            spacing: { after: 300 },
          }),

          createPara([
            new TextRun({ text: `We wish to inform you that you have been appointed as the Statutory Auditor of the Company for the financial year ${fy} at the Extra Ordinary General Meeting of the Company held on ${mDay}, the ${mDom} Day of ${mMonth}, ${mYear} to hold office of the Statutory Auditor of the Company from the conclusion of this meeting until the conclusion of the ensuing Annual General Meeting.`, font: "Times New Roman", size: 24 }),
          ]),

          createPara([
            new TextRun({ text: "Kindly convey your acceptance for your appointment within the statutory period.", font: "Times New Roman", size: 24 }),
          ]),

          new Paragraph({
            children: [new TextRun({ text: "Thanking you.", font: "Times New Roman", size: 24 })],
            spacing: { after: 600 },
          }),

          new Paragraph({
            children: [new TextRun({ text: "FOR & ON BEHALF OF BOARD OF DIRECTORS OF", bold: true, font: "Times New Roman", size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: company.toUpperCase(), bold: true, font: "Times New Roman", size: 24 })],
            spacing: { after: 600 },
          }),

          // Signature logic here if image
          ...(data.signatureImage && data.signatureImage.startsWith("data:image/")
            ? [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: Buffer.from(data.signatureImage.split(",")[1], "base64"),
                      transformation: { width: 170, height: 45 },
                    } as any),
                  ],
                }),
              ]
            : [new Paragraph({ children: [new TextRun({ text: " ", font: "Times New Roman", size: 24 })], spacing: { after: 400 } })]),

          new Paragraph({
            children: [new TextRun({ text: sigName.toUpperCase(), bold: true, font: "Times New Roman", size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "DIRECTOR", bold: true, font: "Times New Roman", size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `DIN: ${sigDin}`, bold: true, font: "Times New Roman", size: 24 })],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer as any, {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="Appointment_Letter.docx"`,
    },
  });
}
