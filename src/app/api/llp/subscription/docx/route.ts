import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import type { LlpSubscriptionValues } from "@/lib/llp/subscription-html";

export const runtime = "nodejs";

function para(
  text: string,
  bold = false,
  align?: (typeof AlignmentType)[keyof typeof AlignmentType],
) {
  return new Paragraph({
    alignment: align,
    children: [new TextRun({ text, bold, font: "Times New Roman", size: 24 })],
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
          transformation: { width: 100, height: 40 },
        } as any),
      ],
    });
  } catch (e) {
    return new Paragraph({ text: "" });
  }
}

function cell(p: Paragraph | Paragraph[]) {
  return new TableCell({
    children: Array.isArray(p) ? p : [p],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
    verticalAlign: "center" as any,
  });
}

function blank() {
  return new Paragraph({ text: "" });
}

function fmtLong(iso: string): string {
  if (!iso) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
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
  const rows =
    v.rows?.filter((r) => r.partnerName?.trim() || r.contributionRs?.trim()) ??
    [];
  const display =
    rows.length > 0
      ? rows
      : [{ partnerName: "", contributionRs: "" }, { partnerName: "", contributionRs: "" }];

  const totalRs = display.reduce((acc, r) => {
    const n = parseFloat(String(r.contributionRs ?? "").replace(/,/g, ""));
    return acc + (Number.isFinite(n) ? n : 0);
  }, 0);

  const headerRow = new TableRow({
    children: [
      cell(para("Sl.", true, AlignmentType.CENTER)),
      cell(para("Partner Name", true)),
      cell(para("Contribution (₹)", true, AlignmentType.RIGHT)),
      cell(para("Signature", true, AlignmentType.CENTER)),
    ],
  });

  const bodyRows = display.map((r, i) => {
    return new TableRow({
      children: [
        cell(para(String(i + 1), false, AlignmentType.CENTER)),
        cell(para(r.partnerName || "")),
        cell(para(r.contributionRs || "", false, AlignmentType.RIGHT)),
        cell(sigImagePara(r.signatureImage)),
      ],
    });
  });

  const totalRow = new TableRow({
    children: [
      new TableCell({
        children: [para("Total", true, AlignmentType.RIGHT)],
        columnSpan: 2,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
      }),
      cell(para(totalRs.toLocaleString("en-IN", { maximumFractionDigits: 2 }), true, AlignmentType.RIGHT)),
      cell(para("")),
    ],
  });

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows, totalRow],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          para("SUBSCRIPTION SHEET — LIMITED LIABILITY PARTNERSHIP", true, AlignmentType.CENTER),
          blank(),
          para(`Name of LLP (proposed): ${v.llpName?.trim() || ""}`),
          para(`Place: ${v.place?.trim() || ""}`),
          para(`Date: ${fmtLong(v.date?.trim() || "")}`),
          blank(),
          table,
          blank(),
          para(
            "Each subscriber confirms the contribution amounts stated above. Align figures with FiLLiP / incorporation documents.",
            false,
            AlignmentType.JUSTIFIED,
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": 'attachment; filename="LLP-Subscription-Sheet.docx"',
    },
  });
}
