import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } from "docx";
import type { LlpForm9Values } from "@/lib/llp/form9-html";

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
            transformation: { width: 120, height: 45 },
          }),
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
    | { values?: LlpForm9Values }
    | null;
  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const v = body.values;
  const dpin = v.dpin?.replace(/\D/g, "").trim() ?? "";
  const dpinLine = dpin.length === 8 ? dpin : "____________";
  const sigPrinted =
    v.signaturePrintedName?.trim() || v.partnerName?.trim() || "____________";
  const wN = v.witnessName?.trim() ?? "";
  const wA = v.witnessAddress?.trim() ?? "";
  const witnessBlock =
    wN || wA
      ? [wN, wA].filter(Boolean).join("\n")
      : v.witnessNameAddress?.trim() || "";

  const doc = new Document({
    sections: [
      {
        children: [
          para(
            "CONSENT TO ACT AS DESIGNATED PARTNER (LLP FORM 9 — ILLUSTRATIVE DRAFT)",
            true,
            AlignmentType.CENTER,
          ),
          blank(),
          blank(),
          para(`Name of LLP: ${v.llpName?.trim() || ""}`),
          para(`Designated Partner: ${v.partnerName?.trim() || ""}`, true),
          para(`Father / Mother's name: ${v.fatherName?.trim() || ""}`),
          para(`Residential address: ${v.residentialAddress?.trim() || ""}`),
          para(`Nationality: ${v.nationality?.trim() || "Indian"}`),
          para(`Occupation: ${v.occupation?.trim() || ""}`),
          para(`Date of birth: ${fmtLong(v.dateOfBirth?.trim() || "")}`),
          para(`PAN: ${v.pan?.trim().toUpperCase() || ""}`),
          para(`DPIN: ${dpinLine}`),
          para(`Email: ${v.email?.trim() || ""}`),
          para(`Mobile: ${v.mobile?.trim() || ""}`),
          blank(),
          para(
            `I, ${v.partnerName?.trim() || "____________"}, hereby consent to become the Designated Partner of ${v.llpName?.trim() || "____________"} and undertake to comply with the provisions of the Limited Liability Partnership Act, 2008 and rules made thereunder, including filing of statutory documents and payment of fees as applicable.`,
            false,
            AlignmentType.JUSTIFIED,
          ),
          blank(),
          blank(),
          para(`Place: ${v.place?.trim() || ""}`),
          para(`Date: ${fmtLong(v.date?.trim() || "")}`),
          blank(),
          blank(),
          ...sigImagePara(v.signatureImage),
          para("Signature of Designated Partner", true),
          para(`(${sigPrinted})`),
          blank(),
          blank(),
          para("Witness (Name & Address)", true),
          blank(),
          ...(witnessBlock
            ? witnessBlock.split(/\r?\n/).map((line) => para(line))
            : [para("________________"), blank(), blank()]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition":
        'attachment; filename="LLP-Form-9-Consent-Designated-Partner.docx"',
    },
  });
}
