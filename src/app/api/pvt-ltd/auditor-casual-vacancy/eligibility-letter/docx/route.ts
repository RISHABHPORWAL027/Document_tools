import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat, ImageRun } from "docx";
import { type EligibilityCasualVacancyData } from "@/lib/pvt-ltd/auditor-casual-vacancy/eligibility-letter-html";

export const runtime = "nodejs";

const BLANK = "________________";

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    values: EligibilityCasualVacancyData;
  } | null;

  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const data = body.values;
  const date = fmtDate(data.date?.trim() || "");
  const company = data.companyName?.trim() || BLANK;
  const companyAddr = data.companyAddress?.trim() || BLANK;
  const firm = data.firmName?.trim() || BLANK;
  const egmDate = data.egmDate?.trim() || BLANK;
  const fy = data.financialYear?.trim() || BLANK;
  const pan = data.auditorPan?.trim() || BLANK;
  const frn = data.frn?.trim() || BLANK;
  const firmAddr = data.firmAddress?.trim() || BLANK;
  const city = data.firmCity?.trim() || BLANK;
  const state = data.firmState?.trim() || BLANK;
  const pincode = data.firmPincode?.trim() || BLANK;
  const email = data.auditorEmail?.trim() || BLANK;
  const proprietor = data.proprietorName?.trim() || BLANK;
  const memNo = data.membershipNo?.trim() || BLANK;

  const createPara = (text: string, bold = false) =>
    new Paragraph({
      children: [new TextRun({ text, font: "Times New Roman", size: 24, bold })],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 200, line: 360 },
    });

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "elig-list",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                  spacing: { after: 200, line: 360 },
                },
                run: { font: "Times New Roman", size: 24 },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "ON THE LETTER HEAD OF AUDITOR", bold: true, underline: {}, font: "Times New Roman", size: 22 }),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [new TextRun({ text: date, font: "Times New Roman", size: 24 })],
            spacing: { after: 300 },
          }),

          new Paragraph({ children: [new TextRun({ text: "The Board of Directors,", font: "Times New Roman", size: 24 })] }),
          new Paragraph({ children: [new TextRun({ text: company.toUpperCase(), font: "Times New Roman", size: 24 })] }),
          new Paragraph({ children: [new TextRun({ text: companyAddr, font: "Times New Roman", size: 24 })], spacing: { after: 400 } }),

          createPara("Sub: Certificate of eligibility cum consent to act as auditor (under section 139 read with section 141 of the Companies Act, 2013).", false),

          new Paragraph({ children: [new TextRun({ text: "Dear Sir,", font: "Times New Roman", size: 24 })], spacing: { after: 240 } }),

          createPara(`With reference to your proposal of appointment of our firm as Statutory Auditors of the company in the forthcoming EGM to be held on ${egmDate} till the conclusion of the ensuing AGM of the Company to be held for the year ${fy} to conduct statutory Audit of the company; we thankfully certify and confirm that in case of our firm is being appointed as the auditor we are desirous and ready to act as auditors of the company and do declare that:`),

          ...[
            "None of the disqualifications under Section 141 of the Companies Act, 2013 applies to us and we are qualified for appointment as statutory auditors of the company.",
            "There are no adverse remark/ disciplinary proceedings pending/ initiated against the firm/ any of its partners on the records of ICAI, which would make them ineligible for appointment as auditors.",
            "In addition to the requirement of section 141(3)(d) of the Companies Act, 2013 in regards to indebtness, the spouse, dependent children and wholly or mainly dependent parents, brothers, sisters or any of them, of any of the partners of the firm are not indebted to the company.",
            "None of the partners or their spouses, dependent children and wholly or mainly dependent parents, brothers, sisters or any of them, of any of the partners of the firm has been declared willful defaulters by any bank/ financial institution.",
            "If the Re-appointment of our firm is made as Statutory Auditor, it shall be within the ceiling provided under section 141 of the Companies Act, 2013.",
          ].map(
            (text) =>
              new Paragraph({
                children: [new TextRun({ text, font: "Times New Roman", size: 24 })],
                numbering: { reference: "elig-list", level: 0 },
                alignment: AlignmentType.JUSTIFIED,
              })
          ),

          createPara("We further submit the requisite information as required while filing Form ADT-1 to MCA portal as under:"),

          // Simulating the ADT-1 table as paragraphs (or we could use Table but paragraph matches word exactly too if we use tabs or just colon separated like in word doc text)
          // The source doc actually uses a table, but for simplicity we'll render as "Label: Value" or keep it consistent with PDF.
          ...[
            { l: "Name of the Auditor or Auditor's firm", v: firm },
            { l: "Income Tax PAN of Auditor or auditor's firm", v: pan },
            { l: "Auditor's firm's registration number", v: frn },
            { l: "Address of the Auditor or auditor's firm", v: firmAddr },
            { l: "City", v: city },
            { l: "State", v: state },
            { l: "Pin code", v: pincode },
            { l: "Email id of the auditor or auditor's firm", v: email },
          ].flatMap(r => [
             new Paragraph({ children: [new TextRun({ text: r.l, font: "Times New Roman", size: 22 })] }),
             new Paragraph({ children: [new TextRun({ text: r.v, font: "Times New Roman", size: 22 })], spacing: { after: 100 } }),
          ]),

          new Paragraph({
            children: [new TextRun({ text: "Thanking you,", font: "Times New Roman", size: 24 })],
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Yours faithfully,", font: "Times New Roman", size: 24 })],
            spacing: { after: 400 },
          }),

          new Paragraph({ children: [new TextRun({ text: `For ${firm}`, font: "Times New Roman", size: 24 })] }),
          new Paragraph({ children: [new TextRun({ text: "Chartered Accountants", font: "Times New Roman", size: 24 })], spacing: { after: 600 } }),

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
            : []),

          new Paragraph({ children: [new TextRun({ text: proprietor, font: "Times New Roman", size: 24 })] }),
          new Paragraph({ children: [new TextRun({ text: "Proprietor", font: "Times New Roman", size: 24 })] }),
          new Paragraph({ children: [new TextRun({ text: `Membership No. ${memNo}`, font: "Times New Roman", size: 24 })] }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer as any, {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="Eligibility_Certificate.docx"`,
    },
  });
}
