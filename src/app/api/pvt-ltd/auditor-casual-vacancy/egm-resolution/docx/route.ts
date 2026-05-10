import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { type EgmResolutionCasualVacancyData } from "@/lib/pvt-ltd/auditor-casual-vacancy/egm-resolution-html";

export const runtime = "nodejs";

const BLANK = "________________";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    values: EgmResolutionCasualVacancyData;
  } | null;

  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const data = body.values;
  const company = data.companyName?.trim() || BLANK;
  const meetingDay = data.meetingDay?.trim() || BLANK;
  const meetingDom = data.meetingDayOfMonth?.trim() || BLANK;
  const meetingMonth = data.meetingMonth?.trim() || BLANK;
  const meetingYear = data.meetingYear?.trim() || BLANK;
  const regAddr = data.registeredOfficeAddress?.trim() || BLANK;
  const meetingTime = data.meetingTime?.trim() || BLANK;
  const newAuditor = data.newAuditorName?.trim() || BLANK;
  const newType = data.newAuditorType?.trim() || "Chartered Accountants";
  const newFrn = data.newAuditorFrn?.trim() || BLANK;
  const oldAuditor = data.oldAuditorName?.trim() || BLANK;
  const oldType = data.oldAuditorType?.trim() || "Chartered Accountants";
  const oldFrn = data.oldAuditorFrn?.trim() || BLANK;
  const resignDate = data.resignationDate?.trim() || BLANK;
  const fy = data.financialYear?.trim() || BLANK;
  const dirs = data.directors?.length > 0 ? data.directors : [
    { name: "", din: "", designation: "DIRECTOR" },
    { name: "", din: "", designation: "DIRECTOR" }
  ];

  const createPara = (children: TextRun[]) =>
    new Paragraph({
      children,
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 240, line: 360 }, // 1.5 line spacing
    });

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `CERTIFIED TRUE COPY OF THE ORDINARY RESOLUTION PASSED AT THE EXTRA ORDINARY GENERAL MEETING OF THE MEMBERS OF ${company} HELD ON ${meetingDay}, THE ${meetingDom} DAY OF ${meetingMonth} ${meetingYear} AT THE REGISTERED OFFICE OF THE COMPANY SITUATED AT ${regAddr} AT ${meetingTime}`.toUpperCase(),
                bold: true,
                font: "Times New Roman",
                size: 24, // 12pt
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400, line: 360 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `APPOINTMENT OF ${newAuditor}, ${newType}, (FRN: ${newFrn}) AS STATUTORY AUDITOR OF THE COMPANY TO FILL IN THE CASUAL VACANCY CAUSED BY RESIGNATION OF ${oldAuditor}, ${oldType}, (FRN- ${oldFrn}):`.toUpperCase(),
                bold: true,
                font: "Times New Roman",
                size: 24,
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400, line: 360 },
          }),

          createPara([
            new TextRun({ text: "The Chairman apprised the members that ", font: "Times New Roman", size: 24 }),
            new TextRun({ text: `${oldAuditor}, ${oldType}, (FRN- ${oldFrn})`, bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: ` has shown unwillingness vide resignation letter dated ${resignDate} to continue as Statutory Auditor of the Company due to their preoccupations and certain unavoidable circumstances. Consequent to the resignation of `, font: "Times New Roman", size: 24 }),
            new TextRun({ text: `${oldAuditor}, ${oldType}, (FRN- ${oldFrn})`, bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: " as Statutory Auditor of the Company, it is necessary to appoint the Statutory Auditor of the Company to fill the casual vacancy caused.", font: "Times New Roman", size: 24 }),
          ]),

          createPara([
            new TextRun({ text: "The Chairman then updated the members that ", font: "Times New Roman", size: 24 }),
            new TextRun({ text: `${newAuditor}, ${newType}, (FRN: ${newFrn})`, bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: " has shown their willingness to hold the office of Statutory Auditor of the Company in casual vacancy, if appointed. Accordingly, ", font: "Times New Roman", size: 24 }),
            new TextRun({ text: `${newAuditor}, ${newType}, (FRN: ${newFrn})`, bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: " has submitted the consent and eligibility certificate for being appointed as Statutory Auditor of the Company.", font: "Times New Roman", size: 24 }),
          ]),

          createPara([
            new TextRun({ text: "The Chairman then proposed following resolution to be passed as an Ordinary Resolution:", font: "Times New Roman", size: 24 }),
          ]),

          createPara([
            new TextRun({ text: '"', font: "Times New Roman", size: 24 }),
            new TextRun({ text: "RESOLVED THAT", bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: ` pursuant to the provisions of Section 139 (8) (i), 140 and 141 and other applicable provisions, if any of the Companies Act, 2013, read with the Companies (Audit and Auditors) Rules, 2014 and other applicable provisions as contained in the Memorandum of Association and Articles of Association of the company, `, font: "Times New Roman", size: 24 }),
            new TextRun({ text: `${newAuditor}, ${newType}, (FRN: ${newFrn}),`, bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: ` be and are hereby appointed as the Statutory Auditor of the company in casual vacancy for the Financial Year ${fy}, to hold the office of the Auditor until the conclusion of the ensuing Annual General Meeting of the members of the company on such remuneration as may be mutually agreed between the auditors and the Directors of the Company.`, font: "Times New Roman", size: 24 }),
          ]),

          createPara([
            new TextRun({ text: "RESOLVED FURTHER THAT ", bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: 'any of the Directors of the Company be and are hereby authorized to do all such acts, deeds, matters, things & other incidental matters in relation to the above resolutions, including issuance of appointment letter & filing of necessary e-forms with the MCA".', font: "Times New Roman", size: 24 }),
          ]),

          new Paragraph({
            children: [
              new TextRun({ text: "PASSED UNANIMOUSLY AS ORDINARY RESOLUTION", bold: true, font: "Times New Roman", size: 24 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "CERTIFIED TRUE COPY", bold: true, font: "Times New Roman", size: 24 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "FOR AND ON BEHALF OF BOARD OF DIRECTORS", bold: true, font: "Times New Roman", size: 24 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `FOR ${company}`.toUpperCase(), bold: true, font: "Times New Roman", size: 24 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          new Paragraph({
            children: dirs.map((d, i) => {
              const prefix = i > 0 ? "\t\t\t\t" : "";
              return new TextRun({ text: prefix + d.name.toUpperCase(), bold: true, font: "Times New Roman", size: 24 });
            }),
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            children: dirs.map((d, i) => {
              const prefix = i > 0 ? "\t\t\t\t\t" : "";
              return new TextRun({ text: prefix + (d.designation || "DIRECTOR").toUpperCase(), bold: true, font: "Times New Roman", size: 22 });
            }),
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            children: dirs.map((d, i) => {
              const prefix = i > 0 ? "\t\t\t\t\t" : "";
              return new TextRun({ text: prefix + `DIN: ${d.din}`, bold: true, font: "Times New Roman", size: 22 });
            }),
            alignment: AlignmentType.LEFT,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer as any, {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="EGM_Resolution.docx"`,
    },
  });
}
