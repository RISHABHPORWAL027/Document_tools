import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { type LlpSubscriptionValues } from "@/lib/llp/subscription-html";

export const runtime = "nodejs";

const BLANK = "________________";

function para(
  text: string,
  bold = false,
  align?: (typeof AlignmentType)[keyof typeof AlignmentType],
  size = 24,
) {
  return new Paragraph({
    alignment: align,
    children: [new TextRun({ text, bold, font: "Times New Roman", size })],
  });
}

function sigImagePara(base64: string | undefined) {
  if (!base64 || !base64.includes("base64,")) return [];
  try {
    const data = Buffer.from(base64.split(",")[1], "base64");
    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
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

function cell(p: Paragraph | Paragraph[], width = 50) {
  return new TableCell({
    children: Array.isArray(p) ? p : [p],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: "center" as any,
  });
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
    | { values?: LlpSubscriptionValues }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const v = body.values;
  const partners = v.partners?.length ? v.partners : [{ designation: "Designated Partner" }, { designation: "Designated Partner" }];
  const dateStr = fmtDate(v.date || "");

  const partnerTables = partners.map(p => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            cell([
              para(`Name of Designated Partner: ${p.name || BLANK}`),
              para(`Father Name: ${p.fatherName || BLANK}`),
              para(`R/O: ${p.address || BLANK}`),
              para(`PAN: ${p.pan || BLANK}`),
              para(`Date of Birth: ${p.dob || BLANK}`),
              para(`Mobile number-: ${p.mobile || BLANK}`),
              para(`Email Id: ${p.email || BLANK}`),
              para(`Occupation: ${p.occupation || BLANK}`),
              new Paragraph({ text: "" }),
              para(p.designation || "Designated Partner", true),
            ], 70),
            cell([
              ...sigImagePara(p.signatureImage),
              para("(Signature)", false, AlignmentType.CENTER, 18),
            ], 30),
          ],
        }),
      ],
    });
  });

  const witnessTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell([
            para("Name, Address and profession (along with professional membership number) of witness", true),
            new Paragraph({ text: "" }),
            para(v.witnessName || BLANK),
            para(v.witnessAddress || BLANK),
            para(`${v.witnessProfession || BLANK} ${v.witnessMembership ? `(Membership No. ${v.witnessMembership})` : ""}`),
          ], 70),
          cell([
            ...sigImagePara(v.witnessSignatureImage),
            para("(Signature of witness)", false, AlignmentType.CENTER, 18),
          ], 30),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          para("SUBSCRIBER SHEET", true, AlignmentType.CENTER, 28),
          new Paragraph({ text: "" }),
          para("We the several persons, whose names are subscribed below, are desirous of being formed into a LLP for carrying on as lawful business with a view of profit and have entered and agreed to enter into a LLP agreement in writing and we respectively agree to contribute money or other benefit or to perform services for the LLP in accordance with the LLP agreement, the particulars of which are stated against our respective names.", false, AlignmentType.JUSTIFIED),
          new Paragraph({ text: "" }),
          para("We hereby give our consent to become a partner/designated partner/nominee/nominee& designated partner of the LLP pursuant to section 7(4)/ 25(3)(c) of the Limited Liability Partnership Act, 2008:", false, AlignmentType.JUSTIFIED),
          new Paragraph({ text: "" }),
          ...partnerTables.flatMap(t => [t, new Paragraph({ text: "" })]),
          new Paragraph({ text: "" }),
          witnessTable,
          new Paragraph({ text: "" }),
          para(`Date: ${dateStr}`, true),
          para(`Place: ${v.place || BLANK}`, true),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": 'attachment; filename="LLP-Subscription.docx"',
    },
  });
}
