export interface SeoCalculatorDoc {
  id: string;
  slug: string;
  calculatorSlug: string; // Maps to primary calculator in registry
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  trustBadge: string;
  intro: string;
  whatIsIt: string;
  formulaTitle: string;
  formulaText: string;
  formulaExplanation: string;
  exampleTitle: string;
  exampleScenario: string;
  exampleSteps: { label: string; value: string }[];
  exampleConclusion: string;
  checklistTitle: string;
  checklistItems: string[];
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
}

export const SEO_CALCULATORS: SeoCalculatorDoc[] = [
  {
    id: "seo-calc-in-hand-salary",
    slug: "take-home-salary-calculator-india",
    calculatorSlug: "in-hand-salary-calculator",
    title: "Take-Home Salary Calculator India – Calculate Net Monthly Income from CTC",
    metaTitle: "Take-Home Salary Calculator India – Calculate Net Monthly Pay from CTC",
    metaDescription: "Calculate your net monthly take-home salary from Annual Cost to Company (CTC) in India. Includes Employee PF, Professional Tax, and statutory deductions.",
    keywords: ["take home salary calculator", "net monthly salary calculator India", "in hand salary from CTC", "salary breakdown calculator"],
    trustBadge: "Statutory Compliant 2026",
    intro: "Understanding the exact difference between your Annual Cost to Company (CTC) and the actual net amount credited to your salary account every month is essential for financial planning, rent budgeting, and loan eligibility.",
    whatIsIt: "Take-Home Salary (or In-Hand Salary) is the final net salary an employee receives in their bank account every month after subtracting statutory deductions like Employee Provident Fund (EPF), Professional Tax (PT), Tax Deducted at Source (TDS), and employer-retained components like Employer PF and Gratuity from gross earnings.",
    formulaTitle: "In-Hand Salary Calculation Formula",
    formulaText: "Monthly In-Hand Salary = (Gross Annual CTC - Employer PF - Gratuity) ÷ 12 - Employee PF - Professional Tax - Monthly Income Tax TDS",
    formulaExplanation: "Annual CTC represents total employer expenditure. Direct statutory components (Employer PF 12% basic capped, Gratuity 4.81% basic) are deducted first to calculate Gross Salary, from which employee deductions (Employee PF 12%, State PT ~₹200/mo, TDS) are subtracted.",
    exampleTitle: "Step-by-Step Example Calculation (₹12 Lakh CTC)",
    exampleScenario: "Consider a software engineer offered a ₹12,00,000 per annum CTC in Bangalore, Karnataka:",
    exampleSteps: [
      { label: "Annual CTC Package", value: "₹12,00,000" },
      { label: "Less: Employer PF (12% of ₹15,000 cap)", value: "₹21,600/year (₹1,800/mo)" },
      { label: "Less: Gratuity Contribution Reserve", value: "₹28,800/year" },
      { label: "Annual Gross Earnings", value: "₹11,49,600" },
      { label: "Monthly Gross Salary", value: "₹95,800" },
      { label: "Less: Employee PF Deduction", value: "₹1,800/mo" },
      { label: "Less: Karnataka Professional Tax", value: "₹200/mo" },
      { label: "Estimated Net Monthly Take-Home", value: "₹93,800/mo" },
    ],
    exampleConclusion: "Out of a ₹12 Lakh CTC, the estimated net monthly in-hand salary deposited to the bank account is approximately ₹93,800 (excluding Income Tax TDS).",
    checklistTitle: "Key Components Checklist to Verify on Payslip",
    checklistItems: [
      "Verify Basic Salary is at least 50% of total CTC as per Code on Wages guidelines.",
      "Check whether PF deduction is capped at statutory ₹1,800/mo or calculated on full Basic.",
      "Ensure correct State Professional Tax slab is applied (e.g. ₹200/mo in Karnataka, Maharashtra, WB).",
      "Confirm HRA exemption claim if paying rent in metro or non-metro cities under Old Tax Regime.",
    ],
    sections: [
      {
        heading: "Why CTC Differs From Take-Home Salary in India",
        paragraphs: [
          "Many corporate job offers present an attractive annual CTC figure, but employees are often surprised when their monthly bank credit is significantly lower. This gap occurs because CTC includes indirect employer expenses such as Employer PF contribution, annual insurance premiums, performance bonuses, and gratuity reserves.",
          "To calculate true monthly take-home pay, you must first separate direct earnings (Basic, HRA, Special Allowance) from employer retiral contributions, and then factor in statutory deductions mandated by Indian labor laws.",
        ],
      },
      {
        heading: "Impact of Old vs New Tax Regime on Net Salary",
        paragraphs: [
          "The choice between the Old Tax Regime and the New Tax Regime directly impacts your monthly Tax Deducted at Source (TDS) and net take-home income.",
          "Under the New Tax Regime (default since FY 2023-24), tax slabs are lower, but common exemptions like HRA, LTA, and Section 80C are disallowed. Under the Old Tax Regime, employees claiming high HRA rent exemptions and 80C investments can reduce taxable income substantially.",
        ],
      },
    ],
    faqs: [
      { question: "Is Employee PF mandatory for all salaried employees?", answer: "Employee Provident Fund (EPF) contribution is statutory for employees earning a Basic Salary up to ₹15,000 per month. For basic salaries above ₹15,000, employees can opt to cap PF contribution at ₹1,800 per month." },
      { question: "How does Professional Tax vary across Indian states?", answer: "Professional Tax is governed by state legislation under Constitutional Article 276 (capped at ₹2,500/year). States like Delhi, Haryana, and Rajasthan charge ₹0 PT, whereas Karnataka, Maharashtra, West Bengal, and Tamil Nadu charge up to ₹200/month." },
    ],
  },

  {
    id: "seo-calc-ctc-breakdown",
    slug: "ctc-breakdown-calculator-online",
    calculatorSlug: "ctc-calculator",
    title: "CTC Structure Calculator Online – Break Down Cost to Company Components",
    metaTitle: "CTC Structure Calculator – Salary Component Breakdown Online",
    metaDescription: "Free CTC Calculator to break down Cost to Company into Basic Salary, HRA, Special Allowances, Employer PF, and net monthly take-home pay.",
    keywords: ["CTC breakdown calculator", "Cost to company calculator", "salary structure breakdown", "basic salary percent CTC"],
    trustBadge: "Code on Wages Aligned",
    intro: "Formulating a legal and tax-optimized CTC compensation structure is critical for HR managers, finance teams, and job applicants negotiating salary offers in India.",
    whatIsIt: "Cost to Company (CTC) is the aggregate annual cost borne by an organization for an employee. It combines direct cash compensation (Basic, HRA, Special Allowances) and indirect employee benefits (Employer PF, ESI, Gratuity allocation, Group Insurance).",
    formulaTitle: "CTC Structure Breakdown Formula",
    formulaText: "Annual CTC = Basic Salary + HRA + Special Allowances + Employer PF (12%) + Gratuity Allocation (4.81%)",
    formulaExplanation: "Under standard Indian corporate conventions, Basic Salary is set at 40-50% of CTC, HRA is set at 40-50% of Basic, Employer PF is 12% of Basic, and the remaining unallocated pool forms Special Allowances.",
    exampleTitle: "Example CTC Breakdown (₹10 Lakh CTC)",
    exampleScenario: "Standard CTC allocation for a ₹10,00,000 annual offer:",
    exampleSteps: [
      { label: "Annual CTC", value: "₹10,00,000" },
      { label: "Basic Salary (50% of CTC)", value: "₹5,00,000/year (₹41,667/mo)" },
      { label: "House Rent Allowance (HRA 40%)", value: "₹2,00,000/year (₹16,667/mo)" },
      { label: "Employer PF Contribution (Capped)", value: "₹21,600/year (₹1,800/mo)" },
      { label: "Gratuity Allocation", value: "₹24,000/year" },
      { label: "Special Allowances (Residual)", value: "₹2,54,400/year (₹21,200/mo)" },
    ],
    exampleConclusion: "Monthly Gross Salary is ₹79,534 with an estimated monthly net take-home of ₹77,534.",
    checklistTitle: "Corporate Compensation Compliance Checklist",
    checklistItems: [
      "Ensure Basic Salary constitutes at least 50% of total CTC pool.",
      "Verify statutory EPF employer contribution split between EPF (3.67%) and EPS (8.33%).",
      "Check that special allowances absorb variable pay and bonus components cleanly.",
    ],
    sections: [
      {
        heading: "The 50% Basic Salary Rule (Code on Wages)",
        paragraphs: [
          "Under the Code on Wages guidelines, total allowances provided to an employee should not exceed 50% of total remuneration. Consequently, Basic Salary + Dearness Allowance (DA) must equal at least 50% of the overall CTC package.",
          "A higher Basic salary increases long-term retiral savings via PF and Gratuity while maintaining compliance with Indian labor regulations.",
        ],
      },
    ],
    faqs: [
      { question: "Why is Special Allowance used in CTC structures?", answer: "Special Allowance acts as a flexible balancing component in salary offers to absorb the remaining compensation pool after allocating fixed percentages to Basic and HRA." },
    ],
  },

  {
    id: "seo-calc-epf-interest",
    slug: "epf-interest-calculator-2026",
    calculatorSlug: "pf-calculator",
    title: "EPF Interest Calculator 2026 – Provident Fund Maturity Corpus @ 8.25%",
    metaTitle: "EPF Interest Calculator 2026 – Calculate Provident Fund Corpus @ 8.25%",
    metaDescription: "Calculate Employee Provident Fund (EPF) interest accumulation, monthly employee & employer contribution split, and retirement maturity corpus at 8.25% interest rate.",
    keywords: ["EPF interest calculator", "PF calculation 2026", "EPFO interest rate 8.25%", "EPF maturity corpus calculator"],
    trustBadge: "EPFO Rate 8.25% Validated",
    intro: "The Employee Provident Fund (EPF) is India's premier government-backed retirement savings vehicle for salaried employees, offering attractive compounding returns with EEE tax exemption.",
    whatIsIt: "EPF is a mandatory retiral savings scheme governed by EPFO. Both employee and employer contribute 12% of the basic salary every month, earning compounding annual interest declared by the Ministry of Labour.",
    formulaTitle: "EPF Contribution & Compound Interest Formula",
    formulaText: "Monthly Deposit = Employee PF (12% Basic) + Employer EPF Share (3.67% Basic). Annual Interest Rate = 8.25% p.a. calculated monthly.",
    formulaExplanation: "The employee's full 12% contribution goes into the EPF account. Out of the employer's 12%, 8.33% (up to ₹1,250) is directed to the Employees' Pension Scheme (EPS) and the remaining 3.67% goes to the EPF corpus.",
    exampleTitle: "Example EPF Growth Over 20 Years",
    exampleScenario: "Employee with ₹40,000 monthly Basic salary contributing for 20 years at 8.25% p.a.:",
    exampleSteps: [
      { label: "Monthly Basic Salary", value: "₹40,000" },
      { label: "Employee Monthly Contribution (12%)", value: "₹4,800" },
      { label: "Employer Monthly EPF Share (3.67%)", value: "₹1,468" },
      { label: "Total Monthly Deposit to EPF", value: "₹6,268" },
      { label: "Total Contribution Invested (20 Yrs)", value: "₹15,04,320" },
      { label: "Estimated EPF Corpus at Maturity", value: "₹37,85,410" },
    ],
    exampleConclusion: "Compounding interest generates ₹22,81,090 in pure interest wealth on a total deposit of ₹15,04,320.",
    checklistTitle: "EPF Rules & Tax Exemption Guidelines",
    checklistItems: [
      "Interest on employee contributions up to ₹2.5 Lakh per financial year is 100% tax-free.",
      "Continuous service of 5 years or more ensures zero TDS on withdrawal.",
      "Universal Account Number (UAN) must be seeded with Aadhaar and PAN for seamless online transfer.",
    ],
    sections: [
      {
        heading: "Understanding the Employer EPF vs EPS Split",
        paragraphs: [
          "When an employer deposits 12% of basic salary towards PF, it is split into two distinct funds managed by EPFO.",
          "First, ₹1,250 (8.33% of wage ceiling ₹15,000) goes to EPS pension. Second, the balance (3.67% of basic salary) joins your employee 12% contribution in the EPF passbook, accumulating monthly interest.",
        ],
      },
    ],
    faqs: [
      { question: "What is the current EPFO interest rate?", answer: "The Central Board of Trustees (CBT) and Ministry of Finance approved an 8.25% annual interest rate for EPF contributions." },
    ],
  },

  {
    id: "seo-calc-gst-rate",
    slug: "gst-rate-calculator-18-percent",
    calculatorSlug: "gst-calculator",
    title: "GST Calculator Online – Calculate Inclusive & Exclusive Tax (5%, 12%, 18%, 28%)",
    metaTitle: "GST Calculator Online – Calculate Tax Amount & CGST / SGST Split",
    metaDescription: "Free online GST Calculator to calculate inclusive and exclusive GST tax amounts, net price, gross price, and CGST/SGST/IGST split for all GST rate slabs.",
    keywords: ["GST rate calculator", "18 percent GST calculator", "GST inclusive exclusive calculator", "CGST SGST calculator"],
    trustBadge: "CBIC GST Slabs Verified",
    intro: "Accurate GST tax calculations are essential for issuing valid tax invoices, filing GSTR-1 & GSTR-3B returns, and claiming Input Tax Credit (ITC) under Indian GST law.",
    whatIsIt: "Goods and Services Tax (GST) is a destination-based indirect tax levied on the supply of goods and services in India. Standard tax slabs include 5%, 12%, 18%, and 28%.",
    formulaTitle: "GST Calculation Formulas",
    formulaText: "Exclusive GST: Tax = Amount × Rate ÷ 100 | Inclusive GST: Tax = Amount - [Amount ÷ (1 + Rate ÷ 100)]",
    formulaExplanation: "For intra-state transactions, total GST is divided equally into CGST (Central GST) and SGST (State GST). For inter-state supplies, IGST (Integrated GST) equals full GST rate.",
    exampleTitle: "Example 18% GST Calculation (₹50,000 Net Supply)",
    exampleScenario: "Intra-state supply of professional services valued at ₹50,000 at 18% GST:",
    exampleSteps: [
      { label: "Net Transaction Amount", value: "₹50,000" },
      { label: "GST Rate", value: "18%" },
      { label: "CGST Amount (9%)", value: "₹4,500" },
      { label: "SGST Amount (9%)", value: "₹4,500" },
      { label: "Total GST Tax Payable", value: "₹9,000" },
      { label: "Gross Invoice Value", value: "₹59,000" },
    ],
    exampleConclusion: "The customer pays ₹59,000, comprising ₹50,000 base service price and ₹9,000 total GST.",
    checklistTitle: "GST Invoicing Compliance Checklist",
    checklistItems: [
      "Ensure 15-digit GSTIN of buyer and seller are recorded on tax invoice.",
      "Check appropriate HSN code for goods or SAC code for services.",
      "Split tax into equal CGST + SGST for intra-state or IGST for inter-state billing.",
    ],
    sections: [
      {
        heading: "Difference Between Inclusive and Exclusive GST",
        paragraphs: [
          "Exclusive GST means tax is added on top of the base product price. For example, ₹1,000 base + 18% GST = ₹1,180 total.",
          "Inclusive GST means the listed price already contains tax. To extract tax from a ₹1,180 inclusive tag, divide by 1.18 to find ₹1,000 net price and ₹180 GST.",
        ],
      },
    ],
    faqs: [
      { question: "When is IGST charged instead of CGST and SGST?", answer: "IGST (Integrated GST) is levied on inter-state transactions where supplier location and place of supply are in different states or UTs." },
    ],
  },
];

export function getSeoCalculatorBySlug(slug: string): SeoCalculatorDoc | undefined {
  return SEO_CALCULATORS.find((c) => c.slug === slug);
}
