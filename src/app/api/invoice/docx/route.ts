// Invoice DOCX generation route
import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
} from "docx";
import { numberToIndianWords } from "@/lib/utils/number-words";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  invoiceNumber: string;
  senderDetails: string;
  billTo: string;
  shipTo: string;
  date: string;
  paymentTerms: string;
  dueDate: string;
  poNumber: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  taxPercent: number;
  discount: number;
  shipping: number;
  amountPaid: number;
  currency: string;
}

function fmtDate(isoString: string): string {
  if (!isoString) return "N/A";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getLogoImageRun(logoPathOrBase64: string | undefined, width = 100, height = 40) {
  if (!logoPathOrBase64) return null;
  try {
    let data: Buffer;
    if (logoPathOrBase64.includes("base64,")) {
      data = Buffer.from(logoPathOrBase64.split(",")[1], "base64");
    } else if (logoPathOrBase64.startsWith("/")) {
      const fullPath = path.join(process.cwd(), "public", logoPathOrBase64);
      if (fs.existsSync(fullPath)) {
        data = fs.readFileSync(fullPath);
      } else {
        return null;
      }
    } else {
      return null;
    }
    return new ImageRun({ data, transformation: { width, height } } as any);
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    values?: InvoiceData;
  } | null;

  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const d = body.values;

  // Calculations
  const subtotal = d.items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
  const taxAmount = subtotal * (d.taxPercent / 100);
  const total = Math.max(
    0,
    subtotal + taxAmount + d.shipping - d.discount
  );
  const balanceDue = total - d.amountPaid;

  const totalWords = numberToIndianWords(total);

  // Helper for quick paragraph creation
  const para = (
    text: string,
    bold = false,
    align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT,
    size = 20,
    color?: string
  ) =>
    new Paragraph({
      alignment: align,
      children: [
        new TextRun({
          text,
          bold: bold || undefined,
          size,
          color: color || undefined,
          font: "Arial",
        }),
      ],
    });

  const blank = () => new Paragraph({ text: "" });

  // Header with logo and company details
  const logoRun = getLogoImageRun(d.companyLogo, 120, 40);
  const headerLeft: any[] = [];
  if (logoRun) headerLeft.push(new Paragraph({ children: [logoRun] }), blank());
  headerLeft.push(
    para(d.companyName, true, AlignmentType.LEFT, 28, "111827"),
    para(d.companyAddress, false, AlignmentType.LEFT, 18, "6B7280")
  );

  const headerTable = new Table({
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
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: headerLeft,
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              para("INVOICE", true, AlignmentType.RIGHT, 32, "4F46E5"),
              para(`Invoice #${d.invoiceNumber}`, true, AlignmentType.RIGHT, 20, "4F46E5"),
              para(`Date: ${fmtDate(d.date)}`, false, AlignmentType.RIGHT, 16, "6B7280"),
              para(`Due: ${fmtDate(d.dueDate)}`, false, AlignmentType.RIGHT, 16, "6B7280"),
            ],
          }),
        ],
      }),
    ],
  });

  // Billing details section
  const addressTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              para("Bill To", true, AlignmentType.LEFT, 18, "4F46E5"),
              para(d.billTo, false, AlignmentType.LEFT, 16, "111827"),
            ],
          }),
          new TableCell({
            children: [
              para("Ship To", true, AlignmentType.LEFT, 18, "4F46E5"),
              para(d.shipTo || "-", false, AlignmentType.LEFT, 16, "111827"),
            ],
          }),
        ],
      }),
    ],
  });

  // Items table
  const itemHeader = new TableRow({
    children: [
      new TableCell({
        shading: { fill: "1F2937" },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" } },
        children: [para("Description", true, AlignmentType.LEFT, 18, "FFFFFF")],
      }),
      new TableCell({
        shading: { fill: "1F2937" },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" } },
        children: [para("Qty", true, AlignmentType.CENTER, 18, "FFFFFF")],
      }),
      new TableCell({
        shading: { fill: "1F2937" },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" } },
        children: [para("Rate", true, AlignmentType.RIGHT, 18, "FFFFFF")],
      }),
      new TableCell({
        shading: { fill: "1F2937" },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" } },
        children: [para("Amount", true, AlignmentType.RIGHT, 18, "FFFFFF")],
      }),
    ],
  });

  const itemRows = d.items.map((it) =>
    new TableRow({
      children: [
        new TableCell({ children: [para(it.description, false, AlignmentType.LEFT, 16)] }),
        new TableCell({ children: [para(String(it.quantity), false, AlignmentType.CENTER, 16)] }),
        new TableCell({ children: [para(`${d.currency} ${it.rate.toFixed(2)}`, false, AlignmentType.RIGHT, 16)] }),
        new TableCell({ children: [para(`${d.currency} ${(it.quantity * it.rate).toFixed(2)}`, false, AlignmentType.RIGHT, 16)] }),
      ],
    })
  );

  const itemsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [itemHeader, ...itemRows],
  });

  // Summary table
  const summaryRows = [] as TableRow[];
  const addSummary = (label: string, value: string, highlight = false) => {
    summaryRows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 3,
            shading: highlight ? { fill: "F9FAFB" } : undefined,
            children: [para(label, true, AlignmentType.RIGHT, 16)],
          }),
          new TableCell({
            shading: highlight ? { fill: "F9FAFB" } : undefined,
            children: [para(value, true, AlignmentType.RIGHT, 16)],
          }),
        ],
      })
    );
  };

  addSummary("Subtotal", `${d.currency} ${subtotal.toFixed(2)}`);
  if (d.taxPercent > 0) addSummary(`Tax (${d.taxPercent}%)`, `${d.currency} ${taxAmount.toFixed(2)}`);
  if (d.shipping > 0) addSummary("Shipping", `${d.currency} ${d.shipping.toFixed(2)}`);
  if (d.discount > 0) addSummary("Discount", `- ${d.currency} ${d.discount.toFixed(2)}`);
  addSummary("Total", `${d.currency} ${total.toFixed(2)}`, true);
  addSummary("Amount Paid", `${d.currency} ${d.amountPaid.toFixed(2)}`);
  addSummary("Balance Due", `${d.currency} ${balanceDue.toFixed(2)}`, true);

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: summaryRows,
  });

  // Notes & Terms
  const notesParagraphs = [] as Paragraph[];
  if (d.notes) {
    notesParagraphs.push(para("Notes", true, AlignmentType.LEFT, 18, "4F46E5"));
    notesParagraphs.push(para(d.notes, false, AlignmentType.LEFT, 14, "111827"));
  }
  if (d.terms) {
    notesParagraphs.push(blank());
    notesParagraphs.push(para("Terms & Conditions", true, AlignmentType.LEFT, 18, "4F46E5"));
    notesParagraphs.push(para(d.terms, false, AlignmentType.LEFT, 14, "111827"));
  }

  // Assemble document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5in margins
          },
        },
        children: [
          headerTable,
          blank(),
          para("Invoice Details", true, AlignmentType.LEFT, 20, "4F46E5"),
          addressTable,
          blank(),
          itemsTable,
          blank(),
          summaryTable,
          blank(),
          para("Amount in Words:", true, AlignmentType.LEFT, 16, "4F46E5"),
          para(totalWords, false, AlignmentType.LEFT, 16, "111827"),
          ...notesParagraphs,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

  const headers = new Headers();
  headers.set(
    "Content-Disposition",
    `attachment; filename=Invoice_${d.invoiceNumber || "1"}.docx`
  );
  return new NextResponse(arrayBuffer, { status: 200, headers });
}
