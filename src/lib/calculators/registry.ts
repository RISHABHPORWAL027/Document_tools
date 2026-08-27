import { CalculatorConfig } from "./types";
import {
  calculateInHandSalary,
  calculateCtc,
  calculatePf,
  calculateHra,
  calculateGratuity,
} from "./engines/salaryEngine";
import {
  calculateEmi,
  calculateSip,
  calculateFd,
  calculateCompoundInterest,
  calculateSimpleInterest,
  calculateGst,
} from "./engines/financeEngine";
import {
  calculateBreakeven,
  calculateProfitMargin,
  calculateDiscount,
  calculateInvoiceDueDate,
} from "./engines/businessEngine";

export const CALCULATORS: CalculatorConfig[] = [
  // ---------------------------------------------------------------------------
  // SALARY CALCULATORS
  // ---------------------------------------------------------------------------
  {
    id: "in-hand-salary-calculator",
    slug: "in-hand-salary-calculator",
    title: "In-Hand Salary Calculator India",
    shortDescription:
      "Calculate your estimated monthly and yearly in-hand take-home salary based on your CTC, salary structure, PF, professional tax, and deductions.",
    category: "salary",
    categoryName: "Salary Calculators",
    icon: "💵",
    badge: "Most Popular",
    hasModeToggle: true,
    modeToggleOptions: [
      { label: "Quick CTC Mode", value: "quick" },
      { label: "Detailed Components", value: "detailed" },
    ],
    inputs: [
      {
        id: "ctc",
        label: "Annual CTC (Cost to Company)",
        type: "currency",
        defaultValue: 1200000,
        min: 100000,
        max: 10000000,
        step: 50000,
        group: "common",
        tooltip: "Total annual package offered by employer",
      },
      {
        id: "basicSalary",
        label: "Annual Basic Salary",
        type: "currency",
        defaultValue: 600000,
        group: "detailed",
        tooltip: "Typically 40% to 50% of annual CTC",
      },
      {
        id: "hra",
        label: "Annual HRA",
        type: "currency",
        defaultValue: 240000,
        group: "detailed",
        tooltip: "House Rent Allowance component",
      },
      {
        id: "employeePf",
        label: "Employee Monthly PF",
        type: "currency",
        defaultValue: 1800,
        group: "detailed",
        tooltip: "Default statuatory cap is ₹1,800/month or 12% of Basic",
      },
      {
        id: "employerPf",
        label: "Employer Monthly PF",
        type: "currency",
        defaultValue: 1800,
        group: "detailed",
      },
      {
        id: "state",
        label: "State of Employment (for Professional Tax)",
        type: "select",
        defaultValue: "maharashtra",
        group: "common",
        tooltip: "Professional Tax varies by state (e.g. Maharashtra/Karnataka ₹200/mo, Delhi ₹0)",
        options: [
          { label: "Maharashtra (₹200/mo)", value: "maharashtra" },
          { label: "Karnataka (₹200/mo)", value: "karnataka" },
          { label: "Delhi / NCR (No PT - ₹0)", value: "delhi" },
          { label: "Tamil Nadu (₹208/mo)", value: "tamil_nadu" },
          { label: "West Bengal (₹200/mo)", value: "west_bengal" },
          { label: "Telangana / AP (₹200/mo)", value: "telangana" },
          { label: "Gujarat (₹200/mo)", value: "gujarat" },
          { label: "Other State / No PT (₹0)", value: "no_pt" },
        ],
      },
      {
        id: "professionalTax",
        label: "Monthly Professional Tax (PT)",
        type: "currency",
        defaultValue: 200,
        group: "common",
        tooltip: "Standard state tax, capped at ₹200/month in most states",
      },
      {
        id: "bonus",
        label: "Annual Bonus / Variable Pay",
        type: "currency",
        defaultValue: 0,
        group: "common",
      },
      {
        id: "otherDeductions",
        label: "Other Monthly Deductions",
        type: "currency",
        defaultValue: 0,
        group: "detailed",
        tooltip: "Insurance, LWF, or voluntary deductions",
      },
    ],
    calculate: calculateInHandSalary,
    formulaText: "In-Hand Salary = Gross Monthly Salary - (Employee PF + Professional Tax + Custom Deductions)",
    formulaDescription:
      "Gross monthly salary is calculated by subtracting Employer PF and Gratuity from annual CTC. Take-home pay is the net amount deposited in your bank account after mandatory employee statutory deductions.",
    seoMeta: {
      title: "In-Hand Salary Calculator India – Calculate Take Home Salary",
      description:
        "Free In-Hand Salary Calculator India. Calculate your estimated monthly take home salary from CTC, Basic, PF, HRA, PT, and tax deductions in 2026.",
      keywords: [
        "In hand salary calculator",
        "Take home salary calculator",
        "CTC to in hand salary",
        "Salary slip calculation India",
        "PF deduction calculator",
      ],
    },
    whatIs: {
      title: "What is In-Hand Salary?",
      content:
        "In-Hand Salary (or take-home salary) is the actual net amount an employee receives in their bank account every month after all mandatory statutory deductions (like Employee Provident Fund and Professional Tax) and employer-held contributions (like Employer PF and Gratuity) are subtracted from the gross Annual Cost to Company (CTC).",
    },
    howItWorks: {
      title: "How is In-Hand Salary Calculated from CTC?",
      content:
        "Your total CTC includes both direct compensation and indirect employer contributions. The step-by-step formula is: 1) Subtract Employer PF and Gratuity from CTC to arrive at Annual Gross Salary. 2) Divide Gross Salary by 12 to get Monthly Gross Pay. 3) Deduct Employee PF (12% of basic or statutory ₹1,800 cap) and Professional Tax (typically ₹200/month) to calculate net monthly take-home salary.",
    },
    exampleCalculation: {
      title: "Example In-Hand Salary Calculation",
      scenario: "Consider an employee with an Annual CTC of ₹12,00,000 (₹12 Lakhs per annum):",
      steps: [
        { label: "Annual CTC", value: "₹12,00,000" },
        { label: "Employer PF Contribution (Annual)", value: "₹21,600 (₹1,800/mo)" },
        { label: "Annual Gross Salary", value: "₹11,78,400" },
        { label: "Monthly Gross Salary", value: "₹98,200" },
        { label: "Employee PF Deduction (Monthly)", value: "₹1,800" },
        { label: "Professional Tax (Monthly)", value: "₹200" },
        { label: "Net Monthly In-Hand Salary", value: "₹96,200" },
      ],
      conclusion: "Thus, for a ₹12 Lakh CTC, the estimated monthly in-hand salary is approximately ₹96,200.",
    },
    factorsAffecting: {
      title: "Factors Affecting Your Take-Home Pay",
      factors: [
        { name: "Salary Breakdown Ratio", impact: "Higher Basic salary increases PF contribution, reducing monthly take-home slightly but building larger retiral savings." },
        { name: "PF Capping", impact: "Opting for statutory PF cap (₹1,800) maximizes monthly take-home compared to uncapped 12% basic contribution." },
        { name: "Professional Tax State Rules", impact: "Varies between ₹0 to ₹2,500/year depending on state of employment (e.g. Maharashtra, Karnataka, Tamil Nadu)." },
        { name: "Income Tax Slabs", impact: "Choice between Old Tax Regime (with HRA/80C exemptions) vs New Tax Regime determines monthly TDS deductions." },
      ],
    },
    faqs: [
      { question: "Why is in-hand salary different from monthly CTC?", answer: "Monthly CTC includes employer contributions like Employer PF, Gratuity, and insurance premiums which are retained by the employer. In-hand salary is what reaches your bank account after deducting both employer components and your employee statutory deductions." },
      { question: "Is Employee PF mandatory for all employees?", answer: "PF is statutory for employees with a Basic salary up to ₹15,000/month. For higher salaries, employees and employers can opt for the statutory cap of ₹1,800/month or 12% of actual basic." },
      { question: "How does HRA exemption increase in-hand salary?", answer: "HRA exemption under Old Tax Regime reduces your taxable income, lowering income tax TDS deducted by your employer and directly increasing net monthly take-home." },
      { question: "What is the maximum Professional Tax deducted per month?", answer: "As per Indian Constitution Article 276, maximum Professional Tax is capped at ₹2,500 per year (approx ₹200/month, with ₹300 in February in some states)." },
      { question: "Can I download my salary calculation report?", answer: "Yes! Click the 'Download PDF' button above to generate a downloadable breakdown report for your records or loan applications." },
    ],
    relatedCalculatorSlugs: ["ctc-calculator", "pf-calculator", "hra-calculator", "gratuity-calculator"],
    relatedComplianceTools: [
      { id: "payslips", title: "Salary Slip Generator", description: "Create professional employee payslips with company logo and instant PDF export.", href: "/payslips", badge: "Payroll", icon: "📄" },
      { id: "appointment-letter", title: "Appointment Letter Format", description: "Generate formal legal appointment letters with detailed compensation breakdown.", href: "/incorporation/private-limited/appointment-letter", badge: "HR Legal", icon: "✉️" },
    ],
  },

  {
    id: "ctc-calculator",
    slug: "ctc-calculator",
    title: "CTC Calculator – Cost to Company Breakdown",
    shortDescription: "Break down your Annual CTC into Monthly CTC, Basic Salary, HRA, Allowances, PF, and estimated take-home pay.",
    category: "salary",
    categoryName: "Salary Calculators",
    icon: "💼",
    badge: "Popular",
    inputs: [
      { id: "ctc", label: "Annual CTC", type: "currency", defaultValue: 1000000, min: 100000, max: 10000000, step: 50000 },
      { id: "basicPercent", label: "Basic Salary % of CTC", type: "slider", defaultValue: 50, min: 30, max: 60, unit: "%" },
      { id: "hraPercent", label: "HRA % of Basic", type: "slider", defaultValue: 40, min: 30, max: 50, unit: "%" },
    ],
    calculate: calculateCtc,
    formulaText: "Annual CTC = Basic Salary + HRA + Special Allowances + Employer PF + Bonuses + Employer Benefits",
    formulaDescription: "Cost to Company (CTC) represents the complete total expense incurred by an employer on an employee for one year.",
    seoMeta: {
      title: "CTC Calculator India – Calculate Cost to Company & In-Hand Breakdown",
      description: "Free CTC Calculator to structure monthly compensation, basic salary, HRA, PF allowances, and take home pay.",
      keywords: ["CTC calculator", "Cost to company calculation", "CTC to gross salary", "Salary structure breakdown"],
    },
    whatIs: { title: "What is CTC (Cost to Company)?", content: "Cost to Company (CTC) is the total annual expenditure a business incurs to hire and retain an employee. It encompasses gross salary, employer PF contributions, bonuses, gratuity reserve, and other perks." },
    howItWorks: { title: "How CTC Structure is Built", content: "Typically, Indian companies allocate 40-50% of CTC to Basic Salary. HRA is configured at 40% (non-metro) or 50% (metro) of Basic. The residual balance forms Special Allowances and statutory contributions." },
    exampleCalculation: {
      title: "Example CTC Calculation",
      scenario: "For a ₹10,00,000 CTC package:",
      steps: [
        { label: "Annual CTC", value: "₹10,00,000" },
        { label: "Basic Salary (50%)", value: "₹5,00,000" },
        { label: "HRA (40% of Basic)", value: "₹2,00,000" },
        { label: "Employer PF (12% of Basic capped)", value: "₹21,600" },
        { label: "Special Allowances", value: "₹2,78,400" },
      ],
      conclusion: "Monthly gross salary is ₹81,533 with estimated take-home of ₹79,533.",
    },
    factorsAffecting: {
      title: "Key Elements of CTC Structure",
      factors: [
        { name: "Direct Benefits", value: "Monthly Gross pay, Basic, HRA, Special Allowances." },
        { name: "Indirect Benefits", value: "Employer PF, Gratuity allocation, Group Mediclaim insurance." },
      ],
    },
    faqs: [
      { question: "What is the ideal Basic Salary percentage in CTC?", answer: "Under Code on Wages 2019 guidelines, Basic Salary + DA should ideally be at least 50% of total CTC." },
      { question: "Is variable bonus included in CTC?", answer: "Yes, performance-linked variable pay and target annual bonuses are included in the overall CTC figure." },
    ],
    relatedCalculatorSlugs: ["in-hand-salary-calculator", "pf-calculator", "hra-calculator"],
    relatedComplianceTools: [
      { id: "payslips", title: "Salary Slip Generator", description: "Generate payslips based on your calculated CTC structure.", href: "/payslips", badge: "Payroll", icon: "📄" },
    ],
  },

  {
    id: "pf-calculator",
    slug: "pf-calculator",
    title: "EPF Calculator – Employee Provident Fund",
    shortDescription: "Calculate monthly EPF contributions, employer share, interest accumulation, and estimated retirement corpus.",
    category: "salary",
    categoryName: "Salary Calculators",
    icon: "🏦",
    badge: "EPF 8.25%",
    inputs: [
      { id: "basicSalary", label: "Monthly Basic Salary + DA", type: "currency", defaultValue: 30000, min: 5000, max: 500000, step: 5000 },
      { id: "employeeContribPct", label: "Employee Contribution (%)", type: "number", defaultValue: 12, unit: "%" },
      { id: "employerContribPct", label: "Employer Contribution (%)", type: "number", defaultValue: 12, unit: "%" },
      { id: "years", label: "Investment Period (Years)", type: "slider", defaultValue: 15, min: 1, max: 40, step: 1, unit: "Yrs" },
      { id: "interestRate", label: "EPF Interest Rate (% p.a.)", type: "number", defaultValue: 8.25, step: 0.05, unit: "%" },
    ],
    calculate: calculatePf,
    formulaText: "Monthly PF = Employee (12% of Basic) + Employer EPF (3.67% of Basic). Compound Interest @ 8.25% p.a.",
    formulaDescription: "EPF contributions are collected monthly. 8.33% of employer's 12% goes to EPS pension (up to ₹1,250), and balance 3.67% goes to EPF corpus alongside 12% employee contribution.",
    seoMeta: {
      title: "EPF Calculator India – Calculate Provident Fund Interest & Maturity Corpus",
      description: "Free EPF Calculator to estimate monthly PF contribution, employer EPS split, interest accumulated, and maturity corpus.",
      keywords: ["EPF calculator", "PF calculation", "Provident fund interest rate 8.25%", "EPF maturity corpus"],
    },
    whatIs: { title: "What is EPF (Employee Provident Fund)?", content: "EPF is a government-backed retirement scheme managed by EPFO India. Employees and employers contribute 12% of basic salary every month, earning compounding annual interest." },
    howItWorks: { title: "How EPF Interest and Split Work", content: "Employee's 12% goes entirely to EPF. Employer's 12% is split into EPS (Pension Scheme: 8.33%, capped at ₹1,250) and EPF (remaining 3.67%). Interest is calculated monthly and credited annually." },
    exampleCalculation: {
      title: "Example EPF Growth",
      scenario: "Basic Salary ₹30,000/month over 15 years at 8.25% interest:",
      steps: [
        { label: "Employee Monthly PF (12%)", value: "₹3,600" },
        { label: "Employer Monthly EPF (3.67%)", value: "₹1,101" },
        { label: "Employer EPS Pension", value: "₹1,250" },
        { label: "Total Monthly Deposit to EPF", value: "₹4,701" },
        { label: "Total Invested (15 Yrs)", value: "₹8,46,180" },
        { label: "Estimated Corpus at Maturity", value: "₹16,42,890" },
      ],
      conclusion: "Compounding generates ₹7,96,710 in pure interest wealth.",
    },
    factorsAffecting: {
      title: "Key EPF Rules",
      factors: [
        { name: "EPFO Interest Rate", value: "Set annually by Ministry of Labour (currently 8.25% p.a.)." },
        { name: "Tax Exemptions", value: "EPF enjoys EEE (Exempt-Exempt-Exempt) tax status up to ₹2.5 Lakh annual employee contribution." },
      ],
    },
    faqs: [
      { question: "Is EPF interest taxable above ₹2.5 Lakh?", answer: "Yes, interest on employee contributions exceeding ₹2,50,000 in a financial year is taxable as per Income Tax rules." },
    ],
    relatedCalculatorSlugs: ["in-hand-salary-calculator", "ctc-calculator", "hra-calculator", "gratuity-calculator"],
    relatedComplianceTools: [
      { id: "payslips", title: "Salary Slip Generator", description: "Auto-calculate PF line items on employee monthly payslips.", href: "/payslips", badge: "Payroll", icon: "📄" },
    ],
  },

  {
    id: "hra-calculator",
    slug: "hra-calculator",
    title: "HRA Exemption Calculator",
    shortDescription: "Calculate your eligible House Rent Allowance (HRA) tax exemption under Indian Income Tax Act Sec 10(13A).",
    category: "salary",
    categoryName: "Salary Calculators",
    icon: "🏠",
    badge: "Tax Saver",
    inputs: [
      { id: "basicSalary", label: "Monthly Basic Salary", type: "currency", defaultValue: 40000, min: 5000, max: 500000, step: 5000 },
      { id: "hraReceived", label: "Monthly HRA Received", type: "currency", defaultValue: 16000, min: 0, max: 250000, step: 2000 },
      { id: "rentPaid", label: "Monthly Rent Paid", type: "currency", defaultValue: 18000, min: 0, max: 250000, step: 2000 },
      {
        id: "cityType",
        label: "City Type",
        type: "select",
        defaultValue: "metro",
        options: [
          { label: "Metro (Delhi, Mumbai, Kolkata, Chennai)", value: "metro" },
          { label: "Non-Metro City", value: "non_metro" },
        ],
      },
    ],
    calculate: calculateHra,
    formulaText: "Exempt HRA = Minimum of (Actual HRA, 50%/40% of Basic, Rent Paid - 10% of Basic)",
    formulaDescription: "Under Sec 10(13A) of Income Tax Act, HRA exemption is calculated as the lowest of three conditions based on rent paid and basic salary.",
    seoMeta: {
      title: "HRA Exemption Calculator – Calculate Tax-Free House Rent Allowance",
      description: "Free HRA Calculator to calculate tax exempt HRA under Section 10(13A) for metro and non-metro cities.",
      keywords: ["HRA calculator", "HRA exemption calculation", "House rent allowance tax exemption", "Section 10 13A"],
    },
    whatIs: { title: "What is HRA Exemption?", content: "HRA (House Rent Allowance) is a component of salary provided by employers to cover rental accommodation costs. Employees paying rent can claim tax exemption on HRA under the Old Tax Regime." },
    howItWorks: { title: "Calculation Rules for HRA Exemption", content: "The exempt amount is the MINIMUM of: 1) Actual HRA received from employer, 2) 50% of Basic salary for metro cities or 40% for non-metro, 3) Actual Rent paid minus 10% of annual basic salary." },
    exampleCalculation: {
      title: "Example HRA Exemption",
      scenario: "Monthly Basic ₹40,000, HRA ₹16,000, Rent Paid ₹18,000 in Mumbai (Metro):",
      steps: [
        { label: "1. Actual HRA Received", value: "₹1,92,000/yr" },
        { label: "2. 50% of Basic (Metro)", value: "₹2,40,000/yr" },
        { label: "3. Rent Paid minus 10% Basic", value: "₹1,68,000/yr (₹2.16L - ₹48K)" },
        { label: "Eligible Exempt HRA (Lowest)", value: "₹1,68,000/yr (₹14,000/mo)" },
      ],
      conclusion: "Out of ₹1.92L HRA received, ₹1.68L is tax-free and ₹24,000 is taxable.",
    },
    factorsAffecting: {
      title: "Important HRA Requirements",
      factors: [
        { name: "Rent Receipts & PAN", value: "Rent Receipts and landlord PAN mandatory if annual rent exceeds ₹1,00,000." },
        { name: "Tax Regime Choice", value: "HRA exemption is available ONLY under the Old Tax Regime." },
      ],
    },
    faqs: [
      { question: "Is PAN card mandatory for claiming HRA exemption?", answer: "Yes, providing your landlord's PAN is compulsory if rent exceeds ₹1,00,000 per financial year." },
    ],
    relatedCalculatorSlugs: ["in-hand-salary-calculator", "ctc-calculator", "pf-calculator", "gratuity-calculator"],
    relatedComplianceTools: [
      { id: "payslips", title: "Salary Slip Generator", description: "Generate salary slips with exempt HRA component.", href: "/payslips", badge: "Payroll", icon: "📄" },
      { id: "noc", title: "NOC from Property Owner", description: "Generate property owner NOC format for office / residential proof.", href: "/noc-format", badge: "Legal", icon: "🏠" },
    ],
  },

  {
    id: "gratuity-calculator",
    slug: "gratuity-calculator",
    title: "Gratuity Calculator India",
    shortDescription: "Calculate estimated gratuity payout based on last drawn basic salary and completed years of service.",
    category: "salary",
    categoryName: "Salary Calculators",
    icon: "🎁",
    badge: "Sec 10(10)",
    inputs: [
      { id: "lastDrawnSalary", label: "Last Drawn Monthly Basic + DA", type: "currency", defaultValue: 50000, min: 5000, max: 1000000, step: 5000 },
      { id: "yearsOfService", label: "Completed Years of Service", type: "slider", defaultValue: 7, min: 1, max: 40, step: 1, unit: "Yrs" },
    ],
    calculate: calculateGratuity,
    formulaText: "Gratuity = (15 × Last Drawn Basic Salary × Years of Service) ÷ 26",
    formulaDescription: "Calculated per Payment of Gratuity Act 1972 assuming 15 days of salary for every completed year of service based on a 26-day working month.",
    seoMeta: {
      title: "Gratuity Calculator India – Calculate Gratuity Amount & Tax Exemption",
      description: "Free Gratuity Calculator India to calculate your lump sum gratuity entitlement after 5+ years of service.",
      keywords: ["Gratuity calculator", "Gratuity calculation formula", "Payment of gratuity act", "Gratuity tax exemption limit"],
    },
    whatIs: { title: "What is Gratuity?", content: "Gratuity is a monetary reward paid by an employer to an employee for rendering continuous service for 5 or more years upon resignation, retirement, or termination." },
    howItWorks: { title: "Gratuity Formula Breakdown", content: "Formula: Gratuity = (15 × Last Drawn Salary × Tenure in Years) / 26. Months over 6 months are rounded up to the next full year." },
    exampleCalculation: {
      title: "Example Gratuity Calculation",
      scenario: "Last drawn Basic + DA = ₹50,000 for 7 years of service:",
      steps: [
        { label: "Last Drawn Monthly Basic", value: "₹50,000" },
        { label: "15 Days Salary", value: "₹28,846 (₹50,000 × 15 / 26)" },
        { label: "Completed Years", value: "7 Years" },
        { label: "Total Gratuity Payable", value: "₹2,01,923" },
      ],
      conclusion: "The full payout of ₹2,01,923 is completely tax-exempt under the statutory ₹20 Lakh cap.",
    },
    factorsAffecting: {
      title: "Gratuity Rules & Limits",
      factors: [
        { name: "5-Year Minimum Service", value: "Continuous 5-year service is mandatory except in cases of death or disablement." },
        { name: "₹20 Lakh Tax Exemption Cap", value: "Gratuity up to ₹20,00,000 is 100% tax-free for non-government employees." },
      ],
    },
    faqs: [
      { question: "Is 4 years 8 months eligible for gratuity?", answer: "Under court rulings, 4 years and 240 days (or >6 months in 5th year) qualifies as 5 completed years of service." },
    ],
    relatedCalculatorSlugs: ["in-hand-salary-calculator", "ctc-calculator", "pf-calculator", "hra-calculator"],
    relatedComplianceTools: [
      { id: "payslips", title: "Salary Slip Generator", description: "Generate salary slips for offboarding employees.", href: "/payslips", badge: "Payroll", icon: "📄" },
      { id: "director-resignation-letter", title: "Resignation Acceptance Pack", description: "Generate official resignation acknowledgement and board resolutions.", href: "/incorporation/private-limited/director-resignation/acknowledgement", badge: "Corporate", icon: "📄" },
    ],
  },

  // ---------------------------------------------------------------------------
  // FINANCE CALCULATORS
  // ---------------------------------------------------------------------------
  {
    id: "gst-calculator",
    slug: "gst-calculator",
    title: "GST Calculator India – Inclusive & Exclusive Tax",
    shortDescription: "Calculate Goods and Services Tax (GST) amount, CGST, SGST, IGST split for standard rates (5%, 12%, 18%, 28%).",
    category: "finance",
    categoryName: "Finance Calculators",
    icon: "🧾",
    badge: "GST Rates 2026",
    inputs: [
      { id: "amount", label: "Amount (₹)", type: "currency", defaultValue: 10000, min: 100, max: 10000000, step: 500 },
      {
        id: "gstRate",
        label: "GST Rate (%)",
        type: "select",
        defaultValue: 18,
        options: [
          { label: "0% (Exempt)", value: 0 },
          { label: "5% (Essential Goods)", value: 5 },
          { label: "12% (Standard Lower)", value: 12 },
          { label: "18% (Standard Services & Goods)", value: 18 },
          { label: "28% (Luxury / Sin Goods)", value: 28 },
        ],
      },
      {
        id: "taxType",
        label: "Tax Type",
        type: "select",
        defaultValue: "exclusive",
        options: [
          { label: "GST Exclusive (Add GST to amount)", value: "exclusive" },
          { label: "GST Inclusive (Remove GST from total)", value: "inclusive" },
        ],
      },
      {
        id: "transactionType",
        label: "Transaction Type",
        type: "select",
        defaultValue: "intrastate",
        options: [
          { label: "Intra-State (CGST + SGST)", value: "intrastate" },
          { label: "Inter-State (IGST)", value: "interstate" },
        ],
      },
    ],
    calculate: calculateGst,
    formulaText: "Exclusive: GST = Amount × (Rate/100) | Inclusive: Net Amount = Amount / (1 + Rate/100)",
    formulaDescription: "GST exclusive adds tax to net price. GST inclusive extracts original net price and tax portion from total price.",
    seoMeta: {
      title: "GST Calculator India – Calculate GST Online (Inclusive & Exclusive)",
      description: "Free online GST Calculator for 5%, 12%, 18%, 28% tax rates. Calculate CGST, SGST, IGST and total invoice value.",
      keywords: ["GST calculator", "Calculate GST online", "GST inclusive calculator", "GST rate 18%", "CGST SGST IGST calculator"],
    },
    whatIs: { title: "What is GST (Goods and Services Tax)?", content: "GST is an indirect destination-based tax levied on the supply of goods and services across India, replacing complex multi-layered taxes." },
    howItWorks: { title: "How CGST, SGST, and IGST Are Split", content: "For Intra-State sales within the same state, GST is split 50:50 into Central GST (CGST) and State GST (SGST). For Inter-State sales between different states, Integrated GST (IGST) applies." },
    exampleCalculation: {
      title: "Example GST Calculation",
      scenario: "₹10,000 exclusive amount at 18% GST (Intra-state):",
      steps: [
        { label: "Base Net Amount", value: "₹10,000" },
        { label: "CGST (9%)", value: "₹900" },
        { label: "SGST (9%)", value: "₹900" },
        { label: "Total GST Amount", value: "₹1,800" },
        { label: "Final Invoice Total", value: "₹11,800" },
      ],
      conclusion: "Final gross total is ₹11,800.",
    },
    factorsAffecting: {
      title: "GST Slab Structure",
      factors: [
        { name: "5% Rate", value: "Packaged foods, transport, basic items." },
        { name: "12% & 18% Rates", value: "IT services, corporate consulting, consumer electronics, invoices." },
        { name: "28% Rate", value: "Automobiles, luxury goods, aerated drinks." },
      ],
    },
    faqs: [
      { question: "How to generate GST compliant invoices?", answer: "Use our ready-made GST Invoice Generator tool to build print-ready GST invoices with tax breakdown." },
    ],
    relatedCalculatorSlugs: ["profit-margin-calculator", "discount-calculator", "invoice-due-date-calculator"],
    relatedComplianceTools: [
      { id: "invoice-generator", title: "GST Invoice Generator", description: "Create professional GST compliant invoices with auto tax breakdown.", href: "/invoice", badge: "Invoicing", icon: "🧾" },
    ],
  },

  {
    id: "emi-calculator",
    slug: "emi-calculator",
    title: "EMI Calculator – Home, Personal & Car Loan",
    shortDescription: "Calculate your monthly EMI payment, total interest payable, and amortized repayment breakdown.",
    category: "finance",
    categoryName: "Finance Calculators",
    icon: "📊",
    badge: "Amortization",
    inputs: [
      { id: "loanAmount", label: "Loan Amount (₹)", type: "currency", defaultValue: 2500000, min: 10000, max: 50000000, step: 50000 },
      { id: "interestRate", label: "Interest Rate (% p.a.)", type: "number", defaultValue: 8.5, min: 1, max: 30, step: 0.1, unit: "%" },
      { id: "tenure", label: "Loan Tenure (Years)", type: "slider", defaultValue: 20, min: 1, max: 30, step: 1, unit: "Yrs" },
    ],
    calculate: calculateEmi,
    formulaText: "EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]",
    formulaDescription: "Where P = Principal, R = Monthly Interest Rate (Annual Rate / 12 / 100), N = Loan Tenure in Months.",
    seoMeta: {
      title: "EMI Calculator – Home Loan, Personal Loan & Car Loan EMI",
      description: "Free EMI Calculator to estimate monthly loan payments, total interest cost, and amortization schedule.",
      keywords: ["EMI calculator", "Home loan EMI calculator", "Personal loan EMI", "Amortization table"],
    },
    whatIs: { title: "What is EMI (Equated Monthly Installment)?", content: "EMI is a fixed payment made by a borrower to a lender at a specified date each month to repay both principal and interest over a fixed tenure." },
    howItWorks: { title: "How Loan EMI Repayment Works", content: "In initial years, a higher portion of EMI goes towards paying interest. As the loan matures, a larger portion pays down principal." },
    exampleCalculation: {
      title: "Example Home Loan EMI",
      scenario: "₹25 Lakh loan at 8.5% p.a. for 20 years (240 months):",
      steps: [
        { label: "Loan Amount", value: "₹25,000,000" },
        { label: "Monthly EMI", value: "₹21,696" },
        { label: "Total Interest Payable", value: "₹27,07,040" },
        { label: "Total Amount Paid", value: "₹52,07,040" },
      ],
      conclusion: "Monthly EMI is ₹21,696.",
    },
    factorsAffecting: {
      title: "Loan Factors",
      factors: [{ name: "Interest Rate & Tenure", value: "Longer tenure lowers monthly EMI but increases overall interest paid." }],
    },
    faqs: [
      { question: "Does prepaying principal lower total EMI cost?", answer: "Yes, prepaying principal reduces remaining loan balance, significantly lowering interest accumulated." },
    ],
    relatedCalculatorSlugs: ["sip-calculator", "fd-calculator", "compound-interest-calculator"],
    relatedComplianceTools: [
      { id: "board-resolution-bank", title: "Bank Loan Resolution Format", description: "Generate board resolutions for company borrowing and bank credit facilities.", href: "/incorporation/private-limited/bank-account", badge: "Banking", icon: "🏦" },
    ],
  },

  {
    id: "sip-calculator",
    slug: "sip-calculator",
    title: "SIP Calculator – Mutual Fund Wealth Growth",
    shortDescription: "Calculate projected mutual fund wealth, total investment, and compound returns from monthly SIPs.",
    category: "finance",
    categoryName: "Finance Calculators",
    icon: "📈",
    badge: "Wealth Growth",
    inputs: [
      { id: "monthlyInvestment", label: "Monthly Investment (₹)", type: "currency", defaultValue: 10000, min: 500, max: 1000000, step: 500 },
      { id: "expectedReturn", label: "Expected Annual Return (% p.a.)", type: "number", defaultValue: 12, min: 1, max: 30, step: 0.5, unit: "%" },
      { id: "years", label: "Investment Duration (Years)", type: "slider", defaultValue: 10, min: 1, max: 40, step: 1, unit: "Yrs" },
    ],
    calculate: calculateSip,
    formulaText: "M = P × [{(1 + i)^n - 1} / i] × (1 + i)",
    formulaDescription: "Where P = Monthly SIP amount, i = Monthly interest rate, n = Total number of monthly installments.",
    seoMeta: {
      title: "SIP Calculator – Mutual Fund Systematic Investment Plan Calculator",
      description: "Free SIP Calculator to calculate expected mutual fund returns and compound wealth accumulation.",
      keywords: ["SIP calculator", "Mutual fund SIP calculator", "Systematic investment plan", "SIP return calculator"],
    },
    whatIs: { title: "What is a Systematic Investment Plan (SIP)?", content: "SIP allows investors to invest a fixed amount regularly in mutual funds, benefiting from rupee cost averaging and compounding power." },
    howItWorks: { title: "Power of Compounding in SIPs", content: "Investing consistently allows reinvested earnings to generate their own returns, exponentially expanding wealth in later years." },
    exampleCalculation: {
      title: "Example 10-Year SIP Growth",
      scenario: "₹10,000 monthly SIP at 12% expected annual returns for 10 years:",
      steps: [
        { label: "Total Invested", value: "₹12,00,000" },
        { label: "Estimated Wealth Gain", value: "₹11,23,391" },
        { label: "Maturity Corpus", value: "₹23,23,391" },
      ],
      conclusion: "Nearly doubles your invested capital.",
    },
    factorsAffecting: {
      title: "Investment Drivers",
      factors: [{ name: "Time Horizon", value: "Doubling duration quadruples wealth gains due to compounding." }],
    },
    faqs: [{ question: "Is SIP return guaranteed?", answer: "Mutual fund SIP returns depend on market performance and are not fixed like bank FDs." }],
    relatedCalculatorSlugs: ["fd-calculator", "compound-interest-calculator", "emi-calculator"],
    relatedComplianceTools: [
      { id: "payslips", title: "Salary Slip Generator", description: "Plan monthly SIP allocations directly from net take-home salary.", href: "/payslips", badge: "Payroll", icon: "📄" },
    ],
  },

  {
    id: "fd-calculator",
    slug: "fd-calculator",
    title: "FD Calculator – Fixed Deposit Maturity",
    shortDescription: "Calculate bank fixed deposit interest earnings and maturity amount with compounding options.",
    category: "finance",
    categoryName: "Finance Calculators",
    icon: "💰",
    badge: "Fixed Return",
    inputs: [
      { id: "depositAmount", label: "Total Deposit Amount (₹)", type: "currency", defaultValue: 200000, min: 1000, max: 10000000, step: 10000 },
      { id: "interestRate", label: "Interest Rate (% p.a.)", type: "number", defaultValue: 7.25, min: 1, max: 15, step: 0.1, unit: "%" },
      { id: "tenure", label: "Deposit Tenure (Years)", type: "slider", defaultValue: 5, min: 1, max: 10, step: 1, unit: "Yrs" },
      {
        id: "compoundingFrequency",
        label: "Compounding Frequency",
        type: "select",
        defaultValue: "quarterly",
        options: [
          { label: "Quarterly Compounding (Standard)", value: "quarterly" },
          { label: "Half-Yearly Compounding", value: "half_yearly" },
          { label: "Annual Compounding", value: "yearly" },
          { label: "Monthly Compounding", value: "monthly" },
        ],
      },
    ],
    calculate: calculateFd,
    formulaText: "A = P × (1 + r/n)^(n × t)",
    formulaDescription: "Where P = Deposit Principal, r = Annual Interest Rate, n = Compounding frequency per year, t = Tenure in years.",
    seoMeta: {
      title: "FD Calculator – Bank Fixed Deposit Interest & Maturity Calculator",
      description: "Free FD Calculator to calculate interest income and maturity value for fixed deposits across Indian banks.",
      keywords: ["FD calculator", "Fixed deposit interest calculator", "FD maturity amount", "Quarterly compounding FD"],
    },
    whatIs: { title: "What is a Fixed Deposit (FD)?", content: "A Fixed Deposit is a secure financial instrument offered by banks and NBFCs providing higher guaranteed interest rates than standard savings accounts." },
    howItWorks: { title: "How FD Interest is Compounded", content: "Most Indian commercial banks compound FD interest on a quarterly basis, adding earned interest to principal every 3 months." },
    exampleCalculation: {
      title: "Example FD Maturity",
      scenario: "₹2,00,000 deposit at 7.25% p.a. quarterly compounded for 5 years:",
      steps: [
        { label: "Deposit Amount", value: "₹2,00,000" },
        { label: "Total Interest Earned", value: "₹86,281" },
        { label: "Maturity Payout", value: "₹2,86,281" },
      ],
      conclusion: "Earns ₹86,281 guaranteed interest.",
    },
    factorsAffecting: {
      title: "FD Taxation",
      factors: [{ name: "TDS Deduction", value: "Banks deduct 10% TDS if annual FD interest exceeds ₹40,000 (₹50,000 for senior citizens)." }],
    },
    faqs: [{ question: "Is senior citizen FD rate higher?", answer: "Yes, banks usually offer 0.50% extra interest rate to senior citizens." }],
    relatedCalculatorSlugs: ["compound-interest-calculator", "simple-interest-calculator", "sip-calculator"],
    relatedComplianceTools: [
      { id: "board-resolution-bank", title: "Bank Resolution Format", description: "Generate corporate resolutions to open fixed deposit accounts.", href: "/incorporation/private-limited/bank-account", badge: "Banking", icon: "🏦" },
    ],
  },

  {
    id: "compound-interest-calculator",
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    shortDescription: "Calculate compound interest growth over time with annual, quarterly, monthly, or daily compounding.",
    category: "finance",
    categoryName: "Finance Calculators",
    icon: "⚡",
    badge: "Albert Einstein 8th Wonder",
    inputs: [
      { id: "principalAmount", label: "Principal Amount (₹)", type: "currency", defaultValue: 100000, min: 1000, max: 10000000, step: 5000 },
      { id: "interestRate", label: "Annual Interest Rate (%)", type: "number", defaultValue: 10, min: 0.1, max: 50, step: 0.5, unit: "%" },
      { id: "timePeriod", label: "Time Period (Years)", type: "slider", defaultValue: 5, min: 1, max: 30, step: 1, unit: "Yrs" },
      {
        id: "compoundingFrequency",
        label: "Compounding Interval",
        type: "select",
        defaultValue: "yearly",
        options: [
          { label: "Annual Compounding", value: "yearly" },
          { label: "Half-Yearly (2x / Yr)", value: "half_yearly" },
          { label: "Quarterly (4x / Yr)", value: "quarterly" },
          { label: "Monthly (12x / Yr)", value: "monthly" },
          { label: "Daily (365x / Yr)", value: "daily" },
        ],
      },
    ],
    calculate: calculateCompoundInterest,
    formulaText: "A = P(1 + r/n)^(nt) | Compound Interest = A - P",
    formulaDescription: "Compound interest adds earned interest back to the principal, so future interest is earned on previous interest.",
    seoMeta: {
      title: "Compound Interest Calculator – Calculate Compounded Returns Online",
      description: "Free Compound Interest Calculator with daily, monthly, quarterly, and annual compounding schedules.",
      keywords: ["Compound interest calculator", "Compounding formula", "Compound interest growth", "Calculate compound return"],
    },
    whatIs: { title: "What is Compound Interest?", content: "Compound interest is interest calculated on the initial principal as well as all accumulated interest from previous periods." },
    howItWorks: { title: "Compounding Frequency Impact", content: "More frequent compounding intervals (e.g. monthly vs annual) yield higher overall final amounts." },
    exampleCalculation: {
      title: "Example Compound Interest",
      scenario: "₹1,00,000 principal at 10% p.a. annual compounding for 5 years:",
      steps: [
        { label: "Initial Principal", value: "₹1,00,000" },
        { label: "Total Compound Interest", value: "₹61,051" },
        { label: "Final Value", value: "₹1,61,051" },
      ],
      conclusion: "Generates ₹61,051 in compound growth.",
    },
    factorsAffecting: {
      title: "Key Compounding Factors",
      factors: [{ name: "Compounding Frequency", value: "Daily > Monthly > Quarterly > Annual." }],
    },
    faqs: [{ question: "What is Rule of 72?", answer: "Divide 72 by annual interest rate to find approximate years needed to double your money." }],
    relatedCalculatorSlugs: ["simple-interest-calculator", "fd-calculator", "sip-calculator"],
    relatedComplianceTools: [
      { id: "invoice-generator", title: "Invoice Generator", description: "Generate invoices with custom payment schedules and interest terms.", href: "/invoice", badge: "Invoicing", icon: "📄" },
    ],
  },

  {
    id: "simple-interest-calculator",
    slug: "simple-interest-calculator",
    title: "Simple Interest Calculator",
    shortDescription: "Calculate simple interest and total accumulated maturity value for personal or business loans.",
    category: "finance",
    categoryName: "Finance Calculators",
    icon: "🧮",
    badge: "Basic Formula",
    inputs: [
      { id: "principalAmount", label: "Principal Amount (₹)", type: "currency", defaultValue: 50000, min: 1000, max: 10000000, step: 5000 },
      { id: "interestRate", label: "Interest Rate (% p.a.)", type: "number", defaultValue: 8, min: 0.1, max: 50, step: 0.5, unit: "%" },
      { id: "timePeriod", label: "Time Period (Years)", type: "slider", defaultValue: 3, min: 1, max: 30, step: 1, unit: "Yrs" },
    ],
    calculate: calculateSimpleInterest,
    formulaText: "Simple Interest (SI) = (P × R × T) / 100",
    formulaDescription: "Where P = Principal Amount, R = Annual Rate of Interest, T = Time Period in Years.",
    seoMeta: {
      title: "Simple Interest Calculator – Calculate SI & Total Maturity Amount",
      description: "Free Simple Interest Calculator to calculate simple interest earnings and repayment amounts.",
      keywords: ["Simple interest calculator", "SI formula calculator", "Calculate simple interest", "P R T formula"],
    },
    whatIs: { title: "What is Simple Interest?", content: "Simple interest is calculated exclusively on the original principal amount throughout the entire tenure without compounding." },
    howItWorks: { title: "Simple Interest Calculation", content: "Because interest is not added back to principal, yearly interest remains identical every single year." },
    exampleCalculation: {
      title: "Example Simple Interest",
      scenario: "₹50,000 principal at 8% p.a. for 3 years:",
      steps: [
        { label: "Principal P", value: "₹50,000" },
        { label: "Simple Interest Earned", value: "₹12,000" },
        { label: "Total Payable", value: "₹62,000" },
      ],
      conclusion: "Annual interest is fixed at ₹4,000 per year.",
    },
    factorsAffecting: {
      title: "Simple Interest Characteristics",
      factors: [{ name: "Linear Growth", value: "Simple interest grows linearly, whereas compound interest grows exponentially." }],
    },
    faqs: [{ question: "Where is simple interest used?", answer: "Short-term micro-loans, inter-company advances, and certain government bonds." }],
    relatedCalculatorSlugs: ["compound-interest-calculator", "fd-calculator", "emi-calculator"],
    relatedComplianceTools: [
      { id: "invoice-generator", title: "Invoice Generator", description: "Create invoices with simple interest terms for late payments.", href: "/invoice", badge: "Invoicing", icon: "🧾" },
    ],
  },

  // ---------------------------------------------------------------------------
  // BUSINESS CALCULATORS
  // ---------------------------------------------------------------------------
  {
    id: "break-even-calculator",
    slug: "break-even-calculator",
    title: "Break-Even Calculator – Business Feasibility",
    shortDescription: "Calculate break-even units and revenue required to cover fixed and variable costs.",
    category: "business",
    categoryName: "Business Calculators",
    icon: "⚖️",
    badge: "Feasibility",
    inputs: [
      { id: "fixedCosts", label: "Total Fixed Costs (₹)", type: "currency", defaultValue: 200000, min: 1000, max: 10000000, step: 10000, tooltip: "Rent, salaries, utilities, software" },
      { id: "sellingPrice", label: "Selling Price Per Unit (₹)", type: "currency", defaultValue: 500, min: 1, max: 100000, step: 50 },
      { id: "variableCost", label: "Variable Cost Per Unit (₹)", type: "currency", defaultValue: 200, min: 0, max: 100000, step: 50, tooltip: "Raw materials, shipping, transaction fees" },
    ],
    calculate: calculateBreakeven,
    formulaText: "Break-Even Units = Fixed Costs / (Selling Price - Variable Cost)",
    formulaDescription: "Contribution Margin = Selling Price minus Variable Cost per unit. Break-even occurs when total revenue equals total costs.",
    seoMeta: {
      title: "Break-Even Calculator – Calculate Break-Even Point Units & Revenue",
      description: "Free Break-Even Calculator for business planning. Find minimum sales volume needed to cover costs.",
      keywords: ["Break even calculator", "Break even point formula", "Break even revenue", "Contribution margin calculator"],
    },
    whatIs: { title: "What is a Break-Even Point?", content: "The break-even point is the production or sales volume at which total revenue equals total expenses, resulting in zero net profit or loss." },
    howItWorks: { title: "How Contribution Margin Works", content: "Every unit sold contributes its profit margin (Selling Price - Variable Cost) towards covering fixed overhead costs." },
    exampleCalculation: {
      title: "Example Break-Even Calculation",
      scenario: "Fixed Costs ₹2,00,000, Selling Price ₹500, Variable Cost ₹200:",
      steps: [
        { label: "Contribution Margin / Unit", value: "₹300 (₹500 - ₹200)" },
        { label: "Break-Even Units", value: "667 Units (₹2,00,000 / ₹300)" },
        { label: "Break-Even Revenue", value: "₹3,33,333" },
      ],
      conclusion: "Selling 667 units achieves break-even.",
    },
    factorsAffecting: {
      title: "Cost Structure Dynamics",
      factors: [{ name: "Fixed vs Variable Costs", value: "Reducing fixed overhead lowers unit sales threshold required to achieve profitability." }],
    },
    faqs: [{ question: "Why is break-even analysis crucial for startups?", answer: "It determines financial viability and helps set target sales goals before launching products." }],
    relatedCalculatorSlugs: ["profit-margin-calculator", "discount-calculator", "gst-calculator"],
    relatedComplianceTools: [
      { id: "invoice-generator", title: "Invoice Generator", description: "Generate sales invoices and track unit revenue for your business.", href: "/invoice", badge: "Sales", icon: "📄" },
    ],
  },

  {
    id: "profit-margin-calculator",
    slug: "profit-margin-calculator",
    title: "Profit Margin & Markup Calculator",
    shortDescription: "Calculate gross profit margin percentage, net profit amount, and cost markup percentage.",
    category: "business",
    categoryName: "Business Calculators",
    icon: "🎯",
    badge: "Profitability",
    inputs: [
      { id: "costPrice", label: "Cost Price (Cost to Produce/Buy)", type: "currency", defaultValue: 800, min: 1, max: 1000000, step: 50 },
      { id: "sellingPrice", label: "Selling Price (Revenue)", type: "currency", defaultValue: 1200, min: 1, max: 1000000, step: 50 },
    ],
    calculate: calculateProfitMargin,
    formulaText: "Profit Margin % = (Profit / Selling Price) × 100 | Markup % = (Profit / Cost Price) × 100",
    formulaDescription: "Margin measures profit relative to selling price; markup measures profit relative to cost price.",
    seoMeta: {
      title: "Profit Margin Calculator – Calculate Gross Profit & Cost Markup %",
      description: "Free Profit Margin Calculator to calculate profit percentage, net margin, and cost markup for products.",
      keywords: ["Profit margin calculator", "Gross profit percentage", "Markup calculator", "Calculate profit margin"],
    },
    whatIs: { title: "What is Profit Margin?", content: "Profit margin represents the percentage of total sales revenue that a company retains as net profit after deducting cost of goods sold." },
    howItWorks: { title: "Margin vs Markup Difference", content: "Margin is calculated as Profit / Selling Price. Markup is calculated as Profit / Cost Price. A 50% markup equals a 33.33% margin." },
    exampleCalculation: {
      title: "Example Margin & Markup",
      scenario: "Cost Price ₹800, Selling Price ₹1,200:",
      steps: [
        { label: "Net Profit Amount", value: "₹400" },
        { label: "Profit Margin (%)", value: "33.33% (₹400 / ₹1,200)" },
        { label: "Cost Markup (%)", value: "50.00% (₹400 / ₹800)" },
      ],
      conclusion: "Yields a 33.33% profit margin.",
    },
    factorsAffecting: {
      title: "Pricing Drivers",
      factors: [{ name: "Pricing Strategy", value: "Ensures selling prices account for overheads and target net profitability." }],
    },
    faqs: [{ question: "What is a healthy profit margin for retail?", answer: "Standard retail profit margins range from 15% to 30%, whereas software SaaS margins often exceed 70%." }],
    relatedCalculatorSlugs: ["discount-calculator", "break-even-calculator", "gst-calculator"],
    relatedComplianceTools: [
      { id: "invoice-generator", title: "Invoice Generator", description: "Generate invoices reflecting correct selling prices and margins.", href: "/invoice", badge: "Invoicing", icon: "🧾" },
    ],
  },

  {
    id: "discount-calculator",
    slug: "discount-calculator",
    title: "Discount & Savings Calculator",
    shortDescription: "Calculate final price after discount, total customer savings, and percentage price reductions.",
    category: "business",
    categoryName: "Business Calculators",
    icon: "🏷️",
    badge: "Sale Price",
    inputs: [
      { id: "originalPrice", label: "Original Price (₹)", type: "currency", defaultValue: 2500, min: 10, max: 1000000, step: 100 },
      { id: "discountPercentage", label: "Discount Percentage (%)", type: "slider", defaultValue: 20, min: 1, max: 99, step: 1, unit: "%" },
    ],
    calculate: calculateDiscount,
    formulaText: "Discount Amount = Original Price × (Discount % / 100) | Final Price = Original Price - Discount Amount",
    formulaDescription: "Calculates total savings deducted from the list price to determine final customer checkout price.",
    seoMeta: {
      title: "Discount Calculator – Calculate Sale Price & Total Savings",
      description: "Free Discount Calculator to find final price after percentage off and total savings amount.",
      keywords: ["Discount calculator", "Calculate percentage off", "Discount savings calculator", "Sale price calculator"],
    },
    whatIs: { title: "What is a Price Discount?", content: "A discount is a reduction in the basic price of goods or services offered by sellers to boost sales volume or clear inventory." },
    howItWorks: { title: "Percentage Off Formula", content: "Multiply list price by discount rate to determine total money saved." },
    exampleCalculation: {
      title: "Example Discount Calculation",
      scenario: "Original Price ₹2,500 with 20% discount:",
      steps: [
        { label: "Original Price", value: "₹2,500" },
        { label: "Discount Saved (20%)", value: "₹500" },
        { label: "Final Price", value: "₹2,000" },
      ],
      conclusion: "Customer pays ₹2,000.",
    },
    factorsAffecting: {
      title: "Discounting Dynamics",
      factors: [{ name: "Promotional Pricing", value: "Helps businesses offer competitive pricing while preserving margins." }],
    },
    faqs: [{ question: "Can discounts be applied alongside GST?", answer: "Yes, trade discounts are subtracted from list price BEFORE calculating GST on the final price." }],
    relatedCalculatorSlugs: ["profit-margin-calculator", "gst-calculator", "break-even-calculator"],
    relatedComplianceTools: [
      { id: "invoice-generator", title: "Invoice Generator", description: "Apply line-item or total invoice discounts automatically on client bills.", href: "/invoice", badge: "Invoicing", icon: "📄" },
    ],
  },

  {
    id: "invoice-due-date-calculator",
    slug: "invoice-due-date-calculator",
    title: "Invoice Due Date & Credit Term Calculator",
    shortDescription: "Calculate payment due date from invoice issue date and payment credit terms (Due on Receipt, Net 7, 15, 30, 45, 60).",
    category: "business",
    categoryName: "Business Calculators",
    icon: "📅",
    badge: "Cash Flow",
    inputs: [
      { id: "invoiceDate", label: "Invoice Issue Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
      {
        id: "paymentTerms",
        label: "Payment Credit Terms",
        type: "select",
        defaultValue: "net_30",
        options: [
          { label: "Due on Receipt (Immediate)", value: "receipt" },
          { label: "Net 7 Days", value: "net_7" },
          { label: "Net 15 Days", value: "net_15" },
          { label: "Net 30 Days (Standard Corporate)", value: "net_30" },
          { label: "Net 45 Days", value: "net_45" },
          { label: "Net 60 Days", value: "net_60" },
          { label: "Custom Days", value: "custom" },
        ],
      },
      { id: "customDays", label: "Custom Days (if selected)", type: "number", defaultValue: 90, min: 1, max: 365, group: "common" },
    ],
    calculate: calculateInvoiceDueDate,
    formulaText: "Payment Due Date = Invoice Date + Payment Term Days",
    formulaDescription: "Adds credit term days to invoice issue date to calculate exact deadline for client payment under commercial contracts.",
    seoMeta: {
      title: "Invoice Due Date Calculator – Net 30, Net 60 Payment Terms",
      description: "Free Invoice Due Date Calculator to calculate client payment deadlines from Net 7, 15, 30, 45, 60 credit terms.",
      keywords: ["Invoice due date calculator", "Net 30 payment terms calculator", "Calculate invoice due date", "Payment term calculator"],
    },
    whatIs: { title: "What are Invoice Payment Terms?", content: "Payment terms state when a buyer must pay the seller for delivered goods or services (e.g., Net 30 means payment is due within 30 calendar days)." },
    howItWorks: { title: "How Credit Terms Impact Cash Flow", content: "Setting clear payment terms on invoices avoids ambiguities and enables accurate cash flow forecasting." },
    exampleCalculation: {
      title: "Example Net 30 Due Date",
      scenario: "Invoice issued on 1st March with Net 30 terms:",
      steps: [
        { label: "Issue Date", value: "01 Mar 2026" },
        { label: "Credit Term", value: "Net 30 Days" },
        { label: "Official Due Date", value: "31 Mar 2026" },
      ],
      conclusion: "Payment must be received on or before 31st March.",
    },
    factorsAffecting: {
      title: "Regulatory Factors",
      factors: [{ name: "MSME 45-Day Rule", value: "Under Sec 43B(h) of Income Tax Act, payments to registered MSMEs must be settled within 45 days." }],
    },
    faqs: [{ question: "What is MSME Sec 43B(h) rule in India?", answer: "Buyers must pay micro and small enterprises within 45 days (if written agreement exists) or 15 days, else tax deductions are disallowed." }],
    relatedCalculatorSlugs: ["gst-calculator", "profit-margin-calculator", "discount-calculator"],
    relatedComplianceTools: [
      { id: "invoice-generator", title: "Invoice Generator", description: "Create professional invoices with automated payment terms and due dates.", href: "/invoice", badge: "Invoicing", icon: "🧾" },
    ],
  },
];

export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorConfig[] {
  if (category === "all") return CALCULATORS;
  return CALCULATORS.filter((c) => c.category === category);
}

export function getRelatedCalculators(slugs: string[]): CalculatorConfig[] {
  return CALCULATORS.filter((c) => slugs.includes(c.slug));
}
