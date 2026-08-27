import { ComplianceItem, ComplianceCategoryInfo } from "./types";

export const COMPLIANCE_CATEGORIES: ComplianceCategoryInfo[] = [
  { id: "gst", name: "GST Compliance", slug: "gst", icon: "🧾", description: "GSTR-1, GSTR-3B, CMP-08, GSTR-4 and annual GST returns." },
  { id: "income_tax", name: "Income Tax", slug: "income-tax", icon: "💰", description: "Advance tax installments, ITR filing, Form 3CD Tax Audit." },
  { id: "tds", name: "TDS & TCS", slug: "tds", icon: "📑", description: "Monthly TDS payments and quarterly 24Q / 26Q return filings." },
  { id: "roc", name: "ROC / MCA", slug: "roc", icon: "🏢", description: "Form AOC-4, MGT-7, DIR-3 KYC, LLP Form 11, and ADT-1 auditor filings." },
];

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  // ---------------------------------------------------------------------------
  // AUGUST 2026 DEADLINES
  // ---------------------------------------------------------------------------
  {
    id: "comp-2026-08-07",
    title: "Monthly TDS / TCS Payment Deposit",
    dueDate: "2026-08-07",
    monthYear: "august-2026",
    category: "tds",
    categoryName: "TDS & TCS",
    badgeColor: "amber",
    applicableEntities: ["pvt_ltd", "llp", "employer", "gst_registered"],
    whoShouldFile: "All deductors who deducted TDS/TCS in July 2026",
    description: "Deposit of Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) for deductions made during July 2026.",
    penaltyInfo: "Interest at 1.5% per month from date of deduction until payment.",
    officialLink: "https://www.incometax.gov.in",
    frequency: "monthly",
  },
  {
    id: "comp-2026-08-10",
    title: "GSTR-7 & GSTR-8 Return Filing",
    dueDate: "2026-08-10",
    monthYear: "august-2026",
    category: "gst",
    categoryName: "GST",
    badgeColor: "red",
    applicableEntities: ["gst_registered"],
    whoShouldFile: "Tax deductors (GSTR-7) & e-commerce operators (GSTR-8)",
    description: "Filing monthly return for GST TDS deductors and e-commerce portals collecting TCS.",
    penaltyInfo: "Late fee of ₹50 per day (₹20 for Nil return) up to ₹5,000.",
    officialLink: "https://www.gst.gov.in",
    frequency: "monthly",
  },
  {
    id: "comp-2026-08-11",
    title: "GSTR-1 Outward Supply Return (Monthly)",
    dueDate: "2026-08-11",
    monthYear: "august-2026",
    category: "gst",
    categoryName: "GST",
    badgeColor: "red",
    applicableEntities: ["gst_registered", "pvt_ltd", "llp", "proprietorship"],
    whoShouldFile: "GST registered taxpayers with monthly filing frequency",
    description: "Details of outward supplies of goods or services for July 2026.",
    penaltyInfo: "Late fee of ₹50/day (₹20/day for Nil) + blocking of GSTR-1 for next month.",
    officialLink: "https://www.gst.gov.in",
    frequency: "monthly",
    isUrgent: true,
  },
  {
    id: "comp-2026-08-13",
    title: "IFF (Invoice Furnishing Facility) – QRMP Scheme",
    dueDate: "2026-08-13",
    monthYear: "august-2026",
    category: "gst",
    categoryName: "GST",
    badgeColor: "blue",
    applicableEntities: ["gst_registered"],
    whoShouldFile: "Quarterly taxpayers under QRMP scheme for B2B invoices",
    description: "Optional facility to upload B2B invoices for July 2026.",
    officialLink: "https://www.gst.gov.in",
    frequency: "monthly",
  },
  {
    id: "comp-2026-08-20",
    title: "GSTR-3B Summary Return & Tax Payment",
    dueDate: "2026-08-20",
    monthYear: "august-2026",
    category: "gst",
    categoryName: "GST",
    badgeColor: "red",
    applicableEntities: ["gst_registered", "pvt_ltd", "llp", "proprietorship"],
    whoShouldFile: "All monthly GST registered taxpayers",
    description: "Summary return and net GST liability payment for July 2026.",
    penaltyInfo: "Late fee of ₹50/day + 18% p.a. interest on net cash tax liability.",
    officialLink: "https://www.gst.gov.in",
    frequency: "monthly",
    isUrgent: true,
  },
  {
    id: "comp-2026-08-31",
    title: "Quarterly TDS Certificate Issue (Form 16A)",
    dueDate: "2026-08-31",
    monthYear: "august-2026",
    category: "tds",
    categoryName: "TDS",
    badgeColor: "amber",
    applicableEntities: ["pvt_ltd", "llp", "employer"],
    whoShouldFile: "TDS deductors for non-salary payments in Q1 (Apr-Jun)",
    description: "Issue TDS certificate Form 16A to deductees for Q1 FY 2026-27.",
    penaltyInfo: "Penalty of ₹100 per day under Section 272A(2).",
    officialLink: "https://www.tdscpc.gov.in",
    frequency: "quarterly",
  },

  // ---------------------------------------------------------------------------
  // SEPTEMBER 2026 DEADLINES
  // ---------------------------------------------------------------------------
  {
    id: "comp-2026-09-07",
    title: "Monthly TDS / TCS Payment Deposit",
    dueDate: "2026-09-07",
    monthYear: "september-2026",
    category: "tds",
    categoryName: "TDS",
    badgeColor: "amber",
    applicableEntities: ["pvt_ltd", "llp", "employer"],
    whoShouldFile: "All deductors who deducted TDS/TCS in August 2026",
    description: "Deposit of TDS/TCS for August 2026 deductions.",
    frequency: "monthly",
  },
  {
    id: "comp-2026-09-15",
    title: "Second Installment of Advance Tax (Q2 FY 2026-27)",
    dueDate: "2026-09-15",
    monthYear: "september-2026",
    category: "income_tax",
    categoryName: "Income Tax",
    badgeColor: "red",
    applicableEntities: ["pvt_ltd", "llp", "proprietorship", "employer"],
    whoShouldFile: "All corporate taxpayers and non-corporate assessees with estimated tax > ₹10,000",
    description: "Payment of 45% of total estimated annual income tax liability.",
    penaltyInfo: "Interest under Sec 234C at 1% per month for deferment.",
    officialLink: "https://www.incometax.gov.in",
    frequency: "quarterly",
    isUrgent: true,
  },
  {
    id: "comp-2026-09-30",
    title: "DIR-3 KYC Filing for Directors & Designated Partners",
    dueDate: "2026-09-30",
    monthYear: "september-2026",
    category: "roc",
    categoryName: "ROC / MCA",
    badgeColor: "red",
    applicableEntities: ["pvt_ltd", "llp"],
    whoShouldFile: "Every individual holding a Director Identification Number (DIN/DPIN)",
    description: "Annual verification of director contact details and identity details with MCA.",
    penaltyInfo: "Mandatory penalty of ₹5,000 per DIN if delayed past 30th September.",
    officialLink: "https://www.mca.gov.in",
    frequency: "annual",
    isUrgent: true,
  },
  {
    id: "comp-2026-09-30-2",
    title: "Income Tax Audit Report (Form 3CD / 3CA / 3CB)",
    dueDate: "2026-09-30",
    monthYear: "september-2026",
    category: "income_tax",
    categoryName: "Income Tax",
    badgeColor: "red",
    applicableEntities: ["pvt_ltd", "llp", "proprietorship"],
    whoShouldFile: "Taxpayers subject to audit under Section 44AB (Turnover > ₹1 Cr / ₹10 Cr digital)",
    description: "Filing tax audit report by a practicing Chartered Accountant.",
    penaltyInfo: "Penalty under Sec 271B equal to 0.5% of turnover up to ₹1.5 Lakhs.",
    officialLink: "https://www.incometax.gov.in",
    frequency: "annual",
    isUrgent: true,
  },

  // ---------------------------------------------------------------------------
  // OCTOBER 2026 DEADLINES
  // ---------------------------------------------------------------------------
  {
    id: "comp-2026-10-30",
    title: "Form AOC-4 Financial Statements Filing (MCA)",
    dueDate: "2026-10-30",
    monthYear: "october-2026",
    category: "roc",
    categoryName: "ROC / MCA",
    badgeColor: "red",
    applicableEntities: ["pvt_ltd"],
    whoShouldFile: "All Private Limited and Public Limited Companies",
    description: "Filing audited financial statements, balance sheet, P&L, and Board Report with ROC within 30 days of AGM.",
    penaltyInfo: "Late fee of ₹100 per day per company + additional director penalties.",
    officialLink: "https://www.mca.gov.in",
    frequency: "annual",
    isUrgent: true,
  },
  {
    id: "comp-2026-10-31",
    title: "Form 8 (Statement of Accounts & Solvency - LLP)",
    dueDate: "2026-10-31",
    monthYear: "october-2026",
    category: "roc",
    categoryName: "ROC / MCA",
    badgeColor: "red",
    applicableEntities: ["llp"],
    whoShouldFile: "All Limited Liability Partnerships (LLPs)",
    description: "Filing annual financial statement of accounts and solvency declaration for LLPs.",
    penaltyInfo: "Late fee of ₹100 per day with no upper cap.",
    officialLink: "https://www.mca.gov.in",
    frequency: "annual",
    isUrgent: true,
  },
];

export function getComplianceItems(
  category: string = "all",
  monthYear: string = "all",
  entity: string = "all"
): ComplianceItem[] {
  return COMPLIANCE_ITEMS.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesMonth = monthYear === "all" || item.monthYear === monthYear;
    const matchesEntity = entity === "all" || item.applicableEntities.includes(entity as any);
    return matchesCategory && matchesMonth && matchesEntity;
  });
}

export function getComplianceByDateRange(startDate: string, endDate: string): ComplianceItem[] {
  return COMPLIANCE_ITEMS.filter((item) => item.dueDate >= startDate && item.dueDate <= endDate);
}

export function getCategoryInfo(categorySlug: string): ComplianceCategoryInfo | undefined {
  return COMPLIANCE_CATEGORIES.find((c) => c.slug === categorySlug || c.id === categorySlug);
}
