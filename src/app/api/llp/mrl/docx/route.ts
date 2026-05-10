import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  LevelFormat,
  NumberFormat,
  HeadingLevel,
  ImageRun,
} from "docx";
import { type LlpMrlValues } from "@/lib/llp/mrl-html";

export const runtime = "nodejs";

const BLANK = "________________";

function fmtDate(iso: string): string {
  if (!iso) return BLANK;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "/");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    values: LlpMrlValues;
  } | null;

  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const data = body.values;
  const dateStr = fmtDate(data.date?.trim() || "");
  const firmName = data.firmName?.trim() || BLANK;
  const auditorName = data.auditorName?.trim() || BLANK;
  const firmType = data.firmType?.trim() || "Practicing Chartered Accountant";
  const firmAddress = data.firmAddress?.trim() || BLANK;
  const llpName = data.llpName?.trim() || BLANK;
  const partners = data.partners?.length ? data.partners : [
    { name: "", dpin: "", pan: "", address: "" },
    { name: "", dpin: "", pan: "", address: "" }
  ];

  const createPara = (text: string, opts?: any) =>
    new Paragraph({
      children: [new TextRun({ text, font: "Times New Roman", size: 26, ...opts })],
      spacing: { after: 200, line: 360 }, // 1.5 spacing
      alignment: AlignmentType.JUSTIFIED,
    });

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "mrl-list",
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
                run: { font: "Times New Roman", size: 26 },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 1134, right: 1417, bottom: 1134, left: 1417 } },
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "MANAGEMENT REPRESENTATION LETTER",
                bold: true,
                underline: {},
                font: "Times New Roman",
                size: 28, // 14pt
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Date: ", font: "Times New Roman", size: 26 }),
              new TextRun({ text: dateStr, font: "Times New Roman", size: 26 }),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "To,", font: "Times New Roman", size: 26 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: firmName, font: "Times New Roman", size: 26 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: auditorName, font: "Times New Roman", size: 26 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: firmType, font: "Times New Roman", size: 26 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: firmAddress, font: "Times New Roman", size: 26 }),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Subject: Management Representation for Incorporation of LLP",
                bold: true,
                font: "Times New Roman",
                size: 26,
              }),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Dear Sir/Madam,", font: "Times New Roman", size: 26 }),
            ],
            spacing: { after: 300 },
          }),

          createPara(
            `This representation letter is provided in connection with the incorporation of M/s ${llpName} under the provisions of the Limited Liability Partnership Act, 2008 and rules made thereunder.`
          ),

          createPara(
            `I/We, the undersigned Designated Partner(s) of the proposed LLP, hereby represent and confirm the following:`
          ),

          ...[
            "That all the documents, information, declarations, and details provided by us for the purpose of incorporation of the LLP are true, correct, complete and authentic to the best of our knowledge and belief.",
            "That no material information has been suppressed or concealed while providing the details for incorporation.",
            "That the identity proofs, address proofs, photographs, and other documents submitted by the partners/designated partners are genuine and belong to the respective persons.",
            "That we shall be fully responsible for the accuracy and authenticity of the information and documents submitted to the Ministry of Corporate Affairs (MCA).",
            "We understand that you are relying on the information and documents provided by us for the purpose of certification and filing of incorporation forms with the Registrar of Companies (ROC).",
            "We undertake to indemnify you against any loss, liability, or consequences arising due to any incorrect or misleading information provided by us.",
          ].map(
            (text) =>
              new Paragraph({
                children: [new TextRun({ text, font: "Times New Roman", size: 26 })],
                numbering: { reference: "mrl-list", level: 0 },
                alignment: AlignmentType.JUSTIFIED,
              })
          ),

          createPara(
            `This representation is given to enable you to proceed with the necessary certification and filing for the incorporation of the LLP.`
          ),

          new Paragraph({
            children: [new TextRun({ text: "Thanking You.", font: "Times New Roman", size: 26 })],
            spacing: { before: 200, after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `For M/s ${llpName}`, font: "Times New Roman", size: 26, bold: true }),
            ],
            spacing: { after: 400 },
          }),

          ...partners.flatMap((p) => {
            const idLine = p.dpin?.trim() 
              ? `DIN / DPIN: ${p.dpin.trim()}` 
              : `PAN: ${p.pan?.trim() || BLANK}`;

            // Note: We don't inline base64 images in DOCX API directly unless parsed,
            // we will just print "Signature: ________" as standard. 
            // In a real advanced app, we could fetch the image buffer if p.signatureImage is a data URI.
            // Let's implement signature image conversion if present.

            const pChildren: any[] = [];
            if (p.signatureImage && p.signatureImage.startsWith("data:image/")) {
              try {
                const base64Data = p.signatureImage.split(",")[1];
                const buffer = Buffer.from(base64Data, "base64");
                pChildren.push(
                  new TextRun({ text: "Signature: ", font: "Times New Roman", size: 26 }),
                  new ImageRun({
                    data: buffer,
                    transformation: { width: 170, height: 45 },
                  } as any)
                );
              } catch (e) {
                pChildren.push(new TextRun({ text: "Signature: " + BLANK, font: "Times New Roman", size: 26 }));
              }
            } else {
              pChildren.push(new TextRun({ text: "Signature: " + BLANK, font: "Times New Roman", size: 26 }));
            }

            return [
              new Paragraph({ children: pChildren }),
              new Paragraph({ children: [new TextRun({ text: `Name of Designated Partner: ${p.name?.trim() || BLANK}`, font: "Times New Roman", size: 26 })] }),
              new Paragraph({ children: [new TextRun({ text: idLine, font: "Times New Roman", size: 26 })] }),
              new Paragraph({ children: [new TextRun({ text: `Address: ${p.address?.trim() || BLANK}`, font: "Times New Roman", size: 26 })], spacing: { after: 400 } }),
            ];
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer as any, {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="LLP_MRL.docx"`,
    },
  });
}
