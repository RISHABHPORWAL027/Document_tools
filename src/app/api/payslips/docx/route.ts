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

interface SalaryItem {
  label: string;
  amount: number;
}

interface DetailItem {
  label: string;
  value: string;
}

interface PayslipData {
  companyName: string;
  companyAddress: string;
  companyLogo: string;
  payPeriod: string;
  employeeDetails: DetailItem[];
  earnings: SalaryItem[];
  deductions: SalaryItem[];
  templateId: "modern" | "grid" | "list";
  issueDate: string;
}

function fmtDate(isoString: string): string {
  if (!isoString) return "N/A";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
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
    return new ImageRun({
      data,
      transformation: { width, height },
    } as any);
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    values?: PayslipData;
  } | null;

  if (!body?.values) {
    return NextResponse.json({ error: "Missing values" }, { status: 400 });
  }

  const data = body.values;
  const companyName = data.companyName || "Company Name";
  const companyAddress = data.companyAddress || "";
  const payPeriod = data.payPeriod || "";
  const employeeDetails = data.employeeDetails || [];
  const earnings = data.earnings || [];
  const deductions = data.deductions || [];
  const templateId = data.templateId || "modern";
  const issueDate = data.issueDate || "";

  const totalEarnings = earnings.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + (item.amount || 0), 0);
  const netPay = Math.max(0, totalEarnings - totalDeductions);
  const netPayWords = numberToIndianWords(netPay);

  // Styling helper for text paragraph
  const para = (
    text: string,
    bold = false,
    align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT,
    size = 20, // default 10pt
    font = "Arial",
    color?: string
  ) => {
    return new Paragraph({
      alignment: align,
      children: [
        new TextRun({
          text,
          bold: bold || undefined,
          font,
          size,
          color: color || undefined,
        }),
      ],
    });
  };

  const blank = () => new Paragraph({ text: "" });

  let docChildren: any[] = [];

  // Generate layouts based on templateId
  if (templateId === "modern") {
    // ----------------------------------------------------
    // MODERN TEMPLATE (Arial, Orange accents, modern look)
    // ----------------------------------------------------
    const font = "Arial";
    
    // Header section table (Logo + Company vs Payslip title)
    const logoRun = getLogoImageRun(data.companyLogo, 100, 35);
    const headerChildrenLeft: any[] = [];
    if (logoRun) {
      headerChildrenLeft.push(new Paragraph({ children: [logoRun] }), blank());
    }
    headerChildrenLeft.push(
      para(companyName, true, AlignmentType.LEFT, 28, font, "111827"),
      para(companyAddress, false, AlignmentType.LEFT, 17, font, "6B7280")
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
              children: headerChildrenLeft,
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                para("PAYSLIP", true, AlignmentType.RIGHT, 32, font, "F57C00"),
                para(payPeriod, true, AlignmentType.RIGHT, 20, font, "374151"),
                para(`Date of Issue: ${fmtDate(issueDate)}`, false, AlignmentType.RIGHT, 16, font, "9CA3AF"),
              ],
            }),
          ],
        }),
      ],
    });

    // Horizontal Divider Row
    const divider = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 12, color: "F57C00" }, // Orange Line
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
      },
      rows: [new TableRow({ children: [new TableCell({ children: [] })] })],
    });

    // Details Grid (3 columns, grey background, modern style, dynamic fields)
    const cellBorder = {
      top: { style: BorderStyle.SINGLE, size: 1, color: "F3F4F6" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "F3F4F6" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "F3F4F6" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "F3F4F6" },
    };

    const detailsCell = (label: string, val: string) => {
      return new TableCell({
        shading: { fill: "F9FAFB" },
        borders: cellBorder,
        children: [
          para(label.toUpperCase(), true, AlignmentType.LEFT, 16, font, "9CA3AF"),
          para(val, false, AlignmentType.LEFT, 18, font, "374151"),
        ],
      });
    };

    const detailsTableRows = [];
    for (let i = 0; i < employeeDetails.length; i += 3) {
      const f1 = employeeDetails[i];
      const f2 = employeeDetails[i + 1];
      const f3 = employeeDetails[i + 2];
      detailsTableRows.push(
        new TableRow({
          children: [
            f1 ? detailsCell(f1.label, f1.value) : new TableCell({ shading: { fill: "F9FAFB" }, borders: cellBorder, children: [] }),
            f2 ? detailsCell(f2.label, f2.value) : new TableCell({ shading: { fill: "F9FAFB" }, borders: cellBorder, children: [] }),
            f3 ? detailsCell(f3.label, f3.value) : new TableCell({ shading: { fill: "F9FAFB" }, borders: cellBorder, children: [] }),
          ],
        })
      );
    }

    const detailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: detailsTableRows,
    });

    // Earnings and Deductions Table
    const tableBorders = {
      top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
    };

    const maxRows = Math.max(earnings.length, deductions.length);
    const tableRows = [];

    // Header Row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: "1F2937" },
            borders: tableBorders,
            width: { size: 35, type: WidthType.PERCENTAGE },
            children: [para("Earnings", true, AlignmentType.LEFT, 18, font, "FFFFFF")],
          }),
          new TableCell({
            shading: { fill: "1F2937" },
            borders: tableBorders,
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [para("Amount (₹)", true, AlignmentType.RIGHT, 18, font, "FFFFFF")],
          }),
          new TableCell({
            shading: { fill: "1F2937" },
            borders: tableBorders,
            width: { size: 35, type: WidthType.PERCENTAGE },
            children: [para("Deductions", true, AlignmentType.LEFT, 18, font, "FFFFFF")],
          }),
          new TableCell({
            shading: { fill: "1F2937" },
            borders: tableBorders,
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [para("Amount (₹)", true, AlignmentType.RIGHT, 18, font, "FFFFFF")],
          }),
        ],
      })
    );

    // Component Row Entries
    for (let i = 0; i < maxRows; i++) {
      const earn = earnings[i];
      const ded = deductions[i];

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders: tableBorders,
              children: [para(earn ? earn.label : "", false, AlignmentType.LEFT, 18, font, "1F2937")],
            }),
            new TableCell({
              borders: tableBorders,
              children: [para(earn && earn.amount ? earn.amount.toFixed(2) : "", false, AlignmentType.RIGHT, 18, font, "1F2937")],
            }),
            new TableCell({
              borders: tableBorders,
              children: [para(ded ? ded.label : "", false, AlignmentType.LEFT, 18, font, "1F2937")],
            }),
            new TableCell({
              borders: tableBorders,
              children: [para(ded && ded.amount ? ded.amount.toFixed(2) : "", false, AlignmentType.RIGHT, 18, font, "1F2937")],
            }),
          ],
        })
      );
    }

    // Totals Row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: "F9FAFB" },
            borders: tableBorders,
            children: [para("Total Earnings", true, AlignmentType.LEFT, 18, font, "1F2937")],
          }),
          new TableCell({
            shading: { fill: "F9FAFB" },
            borders: tableBorders,
            children: [para(totalEarnings.toFixed(2), true, AlignmentType.RIGHT, 18, font, "1F2937")],
          }),
          new TableCell({
            shading: { fill: "F9FAFB" },
            borders: tableBorders,
            children: [para("Total Deductions", true, AlignmentType.LEFT, 18, font, "1F2937")],
          }),
          new TableCell({
            shading: { fill: "F9FAFB" },
            borders: tableBorders,
            children: [para(totalDeductions.toFixed(2), true, AlignmentType.RIGHT, 18, font, "1F2937")],
          }),
        ],
      })
    );

    const mainTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    });

    // Net Pay Section Table (Single cell highlighted box)
    const netPayBox = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: "FFE8D6" },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "FFE8D6" },
        left: { style: BorderStyle.SINGLE, size: 6, color: "FFE8D6" },
        right: { style: BorderStyle.SINGLE, size: 6, color: "FFE8D6" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "FFF8F1" },
              children: [
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
                        new TableCell({
                          children: [para("Net Salary Payable", true, AlignmentType.LEFT, 22, font, "F57C00")],
                        }),
                        new TableCell({
                          children: [para(`₹ ${netPay.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, true, AlignmentType.RIGHT, 32, font, "D84315")],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Signature Block Table
    const signatureTable = new Table({
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
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB" } },
                  children: [],
                }),
                blank(),
                para("Employer Signature", true, AlignmentType.CENTER, 17, font, "6B7280"),
              ],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB" } },
                  children: [],
                }),
                blank(),
                para("Employee Signature", true, AlignmentType.CENTER, 17, font, "6B7280"),
              ],
            }),
          ],
        }),
      ],
    });

    docChildren = [
      headerTable,
      blank(),
      divider,
      blank(),
      detailsTable,
      blank(),
      mainTable,
      blank(),
      netPayBox,
      blank(),
      para("Amount in Words:", true, AlignmentType.LEFT, 18, font, "4B5563"),
      para(netPayWords, false, AlignmentType.LEFT, 18, font, "1F2937"),
      blank(),
      blank(),
      signatureTable,
      blank(),
      blank(),
      para("This is a system generated payslip and does not require a physical signature.", false, AlignmentType.CENTER, 16, font, "9CA3AF"),
    ];

  } else if (templateId === "grid") {
    // ----------------------------------------------------
    // STANDARD GRID TEMPLATE (Times New Roman, Monochrome)
    // ----------------------------------------------------
    const font = "Times New Roman";

    const detailsBorders = {
      top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    };

    const detailsTableRows = [];
    for (let i = 0; i < employeeDetails.length; i += 2) {
      const f1 = employeeDetails[i];
      const f2 = employeeDetails[i + 1];
      detailsTableRows.push(
        new TableRow({
          children: [
            new TableCell({ borders: detailsBorders, children: [para(f1 ? f1.label + ":" : "", true, AlignmentType.LEFT, 21, font)], width: { size: 25, type: WidthType.PERCENTAGE } }),
            new TableCell({ borders: detailsBorders, children: [para(f1 ? f1.value : "", false, AlignmentType.LEFT, 21, font)], width: { size: 25, type: WidthType.PERCENTAGE } }),
            new TableCell({ borders: detailsBorders, children: [para(f2 ? f2.label + ":" : "", true, AlignmentType.LEFT, 21, font)], width: { size: 25, type: WidthType.PERCENTAGE } }),
            new TableCell({ borders: detailsBorders, children: [para(f2 ? f2.value : "", false, AlignmentType.LEFT, 21, font)], width: { size: 25, type: WidthType.PERCENTAGE } }),
          ],
        })
      );
    }

    const detailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: detailsTableRows,
    });

    const maxRows = Math.max(earnings.length, deductions.length);
    const tableRows = [];

    // Header Row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ borders: detailsBorders, width: { size: 35, type: WidthType.PERCENTAGE }, children: [para("Earnings", true, AlignmentType.LEFT, 21, font)] }),
          new TableCell({ borders: detailsBorders, width: { size: 15, type: WidthType.PERCENTAGE }, children: [para("Amount", true, AlignmentType.RIGHT, 21, font)] }),
          new TableCell({ borders: detailsBorders, width: { size: 35, type: WidthType.PERCENTAGE }, children: [para("Deductions", true, AlignmentType.LEFT, 21, font)] }),
          new TableCell({ borders: detailsBorders, width: { size: 15, type: WidthType.PERCENTAGE }, children: [para("Amount", true, AlignmentType.RIGHT, 21, font)] }),
        ],
      })
    );

    // Dynamic Items
    for (let i = 0; i < maxRows; i++) {
      const earn = earnings[i];
      const ded = deductions[i];

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ borders: detailsBorders, children: [para(earn ? earn.label : "", false, AlignmentType.LEFT, 21, font)] }),
            new TableCell({ borders: detailsBorders, children: [para(earn && earn.amount ? earn.amount.toFixed(2) : "", false, AlignmentType.RIGHT, 21, font)] }),
            new TableCell({ borders: detailsBorders, children: [para(ded ? ded.label : "", false, AlignmentType.LEFT, 21, font)] }),
            new TableCell({ borders: detailsBorders, children: [para(ded && ded.amount ? ded.amount.toFixed(2) : "", false, AlignmentType.RIGHT, 21, font)] }),
          ],
        })
      );
    }

    // Totals Row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ borders: detailsBorders, children: [para("Total Earnings", true, AlignmentType.LEFT, 21, font)] }),
          new TableCell({ borders: detailsBorders, children: [para(totalEarnings.toFixed(2), true, AlignmentType.RIGHT, 21, font)] }),
          new TableCell({ borders: detailsBorders, children: [para("Total Deductions", true, AlignmentType.LEFT, 21, font)] }),
          new TableCell({ borders: detailsBorders, children: [para(totalDeductions.toFixed(2), true, AlignmentType.RIGHT, 21, font)] }),
        ],
      })
    );

    // Net Pay Row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ borders: detailsBorders, columnSpan: 2, children: [para("", false, AlignmentType.LEFT, 21, font)] }),
          new TableCell({ shading: { fill: "EEEEEE" }, borders: detailsBorders, children: [para("Net Pay (Disbursed)", true, AlignmentType.LEFT, 21, font)] }),
          new TableCell({ shading: { fill: "EEEEEE" }, borders: detailsBorders, children: [para(`₹ ${netPay.toFixed(2)}`, true, AlignmentType.RIGHT, 21, font)] }),
        ],
      })
    );

    const mainTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    });

    const sigRow = new Table({
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
              width: { size: 45, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" } },
                  children: [],
                }),
                blank(),
                para("Employer Signature", true, AlignmentType.CENTER, 20, font),
              ],
            }),
            new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [] }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" } },
                  children: [],
                }),
                blank(),
                para("Employee Signature", true, AlignmentType.CENTER, 20, font),
              ],
            }),
          ],
        }),
      ],
    });

    docChildren = [
      para(companyName, true, AlignmentType.CENTER, 28, font),
      para(companyAddress, false, AlignmentType.CENTER, 20, font),
      blank(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "PAYSLIP",
            bold: true,
            underline: {},
            font,
            size: 24,
          }),
        ],
      }),
      blank(),
      detailsTable,
      blank(),
      mainTable,
      blank(),
      para(`Net Pay (in Words): ${netPayWords}`, true, AlignmentType.LEFT, 21, font),
      blank(),
      para("This is a system generated payslip and does not require a physical signature.", false, AlignmentType.LEFT, 18, font),
      blank(),
      blank(),
      sigRow,
    ];

  } else {
    // ----------------------------------------------------
    // SPREADSHEET LIST TEMPLATE (Courier New, Green)
    // ----------------------------------------------------
    const font = "Courier New";
    const greenLine = "10B981";

    const detailsBorders = {
      top: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
    };

    const detailsTableRows = [];
    for (let i = 0; i < employeeDetails.length; i += 2) {
      const f1 = employeeDetails[i];
      const f2 = employeeDetails[i + 1];
      detailsTableRows.push(
        new TableRow({
          children: [
            new TableCell({ shading: { fill: "F9FAFB" }, borders: detailsBorders, children: [para(f1 ? f1.label + ":" : "", true, AlignmentType.LEFT, 20, font)] }),
            new TableCell({ borders: detailsBorders, children: [para(f1 ? f1.value : "", false, AlignmentType.LEFT, 20, font)] }),
            new TableCell({ shading: { fill: "F9FAFB" }, borders: detailsBorders, children: [para(f2 ? f2.label + ":" : "", true, AlignmentType.LEFT, 20, font)] }),
            new TableCell({ borders: detailsBorders, children: [para(f2 ? f2.value : "", false, AlignmentType.LEFT, 20, font)] }),
          ],
        })
      );
    }

    const detailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: detailsTableRows,
    });

    const stackedRows = [];
    const listBorders = {
      top: { style: BorderStyle.SINGLE, size: 2, color: greenLine },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: greenLine },
      left: { style: BorderStyle.SINGLE, size: 2, color: greenLine },
      right: { style: BorderStyle.SINGLE, size: 2, color: greenLine },
    };

    // Table Header
    stackedRows.push(
      new TableRow({
        children: [
          new TableCell({ shading: { fill: "D1FAE5" }, borders: listBorders, width: { size: 70, type: WidthType.PERCENTAGE }, children: [para("Salary Components", true, AlignmentType.LEFT, 20, font, "065F46")] }),
          new TableCell({ shading: { fill: "D1FAE5" }, borders: listBorders, width: { size: 30, type: WidthType.PERCENTAGE }, children: [para("Amount (INR)", true, AlignmentType.RIGHT, 20, font, "065F46")] }),
        ],
      })
    );

    // Earnings Header
    stackedRows.push(
      new TableRow({
        children: [
          new TableCell({ shading: { fill: "F3F4F6" }, borders: listBorders, columnSpan: 2, children: [para("[A] EARNINGS", true, AlignmentType.LEFT, 20, font)] }),
        ],
      })
    );

    // Earnings Items
    earnings.forEach((e) => {
      stackedRows.push(
        new TableRow({
          children: [
            new TableCell({ borders: listBorders, children: [para(e.label, false, AlignmentType.LEFT, 20, font)] }),
            new TableCell({ borders: listBorders, children: [para(e.amount.toFixed(2), false, AlignmentType.RIGHT, 20, font)] }),
          ],
        })
      );
    });

    // Total Earnings (A) Row
    stackedRows.push(
      new TableRow({
        children: [
          new TableCell({ shading: { fill: "ECFDF5" }, borders: listBorders, children: [para("Total Earnings (A)", true, AlignmentType.LEFT, 20, font)] }),
          new TableCell({ shading: { fill: "ECFDF5" }, borders: listBorders, children: [para(totalEarnings.toFixed(2), true, AlignmentType.RIGHT, 20, font)] }),
        ],
      })
    );

    // Deductions Header
    stackedRows.push(
      new TableRow({
        children: [
          new TableCell({ shading: { fill: "F3F4F6" }, borders: listBorders, columnSpan: 2, children: [para("[B] DEDUCTIONS", true, AlignmentType.LEFT, 20, font)] }),
        ],
      })
    );

    // Deductions Items
    deductions.forEach((d) => {
      stackedRows.push(
        new TableRow({
          children: [
            new TableCell({ borders: listBorders, children: [para(d.label, false, AlignmentType.LEFT, 20, font)] }),
            new TableCell({ borders: listBorders, children: [para(d.amount.toFixed(2), false, AlignmentType.RIGHT, 20, font, "B91C1C")] }),
          ],
        })
      );
    });

    // Total Deductions (B) Row
    stackedRows.push(
      new TableRow({
        children: [
          new TableCell({ shading: { fill: "FEF2F2" }, borders: listBorders, children: [para("Total Deductions (B)", true, AlignmentType.LEFT, 20, font, "B91C1C")] }),
          new TableCell({ shading: { fill: "FEF2F2" }, borders: listBorders, children: [para(totalDeductions.toFixed(2), true, AlignmentType.RIGHT, 20, font, "B91C1C")] }),
        ],
      })
    );

    // Net Payable Row (Double border styled or highlighted)
    stackedRows.push(
      new TableRow({
        children: [
          new TableCell({ shading: { fill: "D1FAE5" }, borders: listBorders, children: [para("NET PAYABLE (A - B)", true, AlignmentType.LEFT, 22, font, "047857")] }),
          new TableCell({ shading: { fill: "D1FAE5" }, borders: listBorders, children: [para(`₹ ${netPay.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, true, AlignmentType.RIGHT, 24, font, "047857")] }),
        ],
      })
    );

    const stackedTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: stackedRows,
    });

    // Outer box for Net Salary in Words
    const wordsBox = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.DASHED, size: 4, color: greenLine },
        bottom: { style: BorderStyle.DASHED, size: 4, color: greenLine },
        left: { style: BorderStyle.DASHED, size: 4, color: greenLine },
        right: { style: BorderStyle.DASHED, size: 4, color: greenLine },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                para(`Net Salary in Words: ${netPayWords}`, true, AlignmentType.LEFT, 18, font, "374151"),
                blank(),
                para("* This is a computer generated document and does not require an employer signature.", false, AlignmentType.LEFT, 16, font, "9CA3AF"),
              ],
            }),
          ],
        }),
      ],
    });

    docChildren = [
      para(companyName.toUpperCase(), true, AlignmentType.CENTER, 32, font, "047857"),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 12, color: greenLine },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        rows: [new TableRow({ children: [new TableCell({ children: [] })] })],
      }),
      blank(),
      detailsTable,
      blank(),
      stackedTable,
      blank(),
      wordsBox,
    ];
  }

  // Package docChildren in standard Word document margins & settings
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 0.79 in
              bottom: 1134,
              left: 1134,
              right: 1134,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="Payslip.docx"`,
    },
  });
}
