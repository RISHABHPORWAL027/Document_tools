import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Users,
  Building2,
  Briefcase,
} from "lucide-react";
import FaqSection from "./FaqSection";

const GENERATOR_URL = "/payslips";

const FAQS = [
  {
    question: "What is a salary slip?",
    answer:
      "A salary slip is a monthly payroll document showing an employee's earnings, deductions, and net salary for a specific pay period.",
  },
  {
    question: "Is a salary slip proof of income?",
    answer:
      "Yes. Salary slips are commonly accepted by banks, financial institutions, and government authorities as proof of income.",
  },
  {
    question: "Can salary slips be used for loan applications?",
    answer:
      "Yes. Most banks require recent salary slips (typically 3–6 months) while processing personal loans, car loans, and home loans.",
  },
  {
    question: "Is a salary slip mandatory?",
    answer:
      "Employers are generally expected to provide salary details to employees. Specific requirements may vary based on applicable labour laws and organizational policies.",
  },
  {
    question: "Can I generate salary slips online?",
    answer:
      "Yes. You can use ComplianceDraft's Salary Slip Generator to create professional salary slips instantly and download PDF.",
  },
  {
    question: "What format is best for salary slips?",
    answer:
      "PDF is generally considered the most professional and widely accepted format for sharing with employees and banks.",
  },
  {
    question: "What is the difference between salary slip format in Word and Excel?",
    answer:
      "Word formats are easier to customise for letterhead and printing. Excel formats suit formula-based payroll for multiple employees. Our generator exports print-ready PDF without manual spreadsheet maintenance.",
  },
  {
    question: "What should a monthly salary slip format include?",
    answer:
      "Company details, employee ID, pay period, earnings breakup (basic, HRA, allowances), deductions (PF, TDS, professional tax), gross and net salary in figures and words.",
  },
];

function GeneratorCta({
  label = "Generate Salary Slip Free",
  large = false,
}: {
  label?: string;
  large?: boolean;
}) {
  return (
    <Link
      href={GENERATOR_URL}
      className={
        large
          ? "inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#1A2E7E] rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-0.5"
          : "inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#1A2E7E] rounded-xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5"
      }
    >
      {label}
      <ChevronRight className="w-5 h-5 ml-2" />
    </Link>
  );
}

function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mt-16 mb-6 first:mt-0 scroll-mt-24"
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-xl font-semibold text-zinc-900 mt-8 mb-3">{children}</h3>;
}

export default function SalarySlipLandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1A2E7E] selection:text-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-mesh-gradient-1">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-6">
            <Sparkles className="w-4 h-4 text-[#1A2E7E]" />
            <span className="text-sm font-medium text-zinc-800">Free Payslip Generator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
            Salary Slip Format:{" "}
            <span className="text-[#1A2E7E]">Free Template, Sample &amp; Generator</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-700 leading-relaxed mb-4 max-w-3xl mx-auto">
            Download salary slip format templates, view a filled sample, and generate professional
            monthly payslips online — Word, Excel-style breakup, and PDF export in minutes.
          </p>
          <p className="text-base text-zinc-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Built for HR teams, startups, accountants, and small businesses who need an{" "}
            <strong>employee salary slip format</strong> without complex spreadsheets.
          </p>
          <GeneratorCta large />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              PDF &amp; print ready
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              PF, TDS, HRA breakup
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              No signup required
            </span>
          </div>
        </div>
      </section>

      {/* Long-form article */}
      <article className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading id="overview">
          Salary Slip Format – Download, Create &amp; Generate Professional Salary Slips Online
        </SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A salary slip is one of the most important documents provided by employers to employees.
          It serves as proof of income, salary structure, deductions, and employment details.
          Whether you are an HR professional, business owner, startup founder, accountant, or
          employee, having access to a proper <strong>salary slip format</strong> can save time and
          ensure compliance.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          With ComplianceDraft&apos;s free <strong>salary slip generator</strong>, you can instantly
          create professional salary slips without using complicated spreadsheet templates. Generate,
          download, and customize payslips in minutes.
        </p>
        <GeneratorCta label="Open Free Salary Slip Generator" />

        <SectionHeading id="what-is">What Is a Salary Slip?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A salary slip, also known as a payslip, salary statement, or wage slip, is a document
          issued by an employer that details an employee&apos;s earnings and deductions for a specific
          pay period.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">The document generally contains:</p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-6">
          <li>Employee information</li>
          <li>Employer information</li>
          <li>Salary breakup</li>
          <li>Earnings and deductions</li>
          <li>Net salary payable</li>
          <li>Pay period details</li>
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">Salary slips are widely used for:</p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600">
          <li>Bank loan and credit card applications</li>
          <li>Income tax filing and visa applications</li>
          <li>Employment verification and financial record keeping</li>
        </ul>

        <SectionHeading id="why-important">Why Is a Salary Slip Important?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          A salary slip is more than just a monthly record of salary payments.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <SubHeading>For Employees</SubHeading>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
              <li>Proof of employment and income</li>
              <li>Helps in tax planning</li>
              <li>Required for personal and home loans</li>
              <li>Required for visa applications</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <SubHeading>For Employers</SubHeading>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
              <li>Payroll transparency</li>
              <li>Compliance and documentation</li>
              <li>Employee record maintenance</li>
              <li>Salary dispute prevention</li>
            </ul>
          </div>
        </div>

        <SectionHeading id="standard-format">Standard Salary Slip Format</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          A professional <strong>monthly salary slip format</strong> generally contains these
          sections:
        </p>
        <div className="space-y-6">
          {[
            {
              n: "1",
              title: "Company Details",
              items: ["Company Name", "Address", "Contact Information", "GST Number (optional)"],
            },
            {
              n: "2",
              title: "Employee Information",
              items: ["Employee Name", "Employee ID", "Designation", "Department", "Date of Joining"],
            },
            {
              n: "3",
              title: "Salary Period",
              items: ["Month & Year", "Working Days", "Paid Days", "LOP if any"],
            },
            {
              n: "4",
              title: "Earnings",
              items: [
                "Basic Salary",
                "House Rent Allowance (HRA)",
                "Conveyance & Special Allowance",
                "Medical Allowance, Bonus, Incentives",
              ],
            },
            {
              n: "5",
              title: "Deductions",
              items: [
                "Provident Fund (PF)",
                "Professional Tax",
                "ESI",
                "Tax Deducted at Source (TDS)",
                "Other Deductions",
              ],
            },
            {
              n: "6",
              title: "Net Salary",
              items: ["Final amount payable after all deductions, in figures and words"],
            },
          ].map((block) => (
            <div key={block.n} className="flex gap-4 p-5 rounded-xl border border-zinc-100 bg-white shadow-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A2E7E]/10 text-[#1A2E7E] text-sm font-bold">
                {block.n}
              </span>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">{block.title}</h3>
                <ul className="list-disc pl-5 text-zinc-600 space-y-1">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <SectionHeading id="sample">Salary Slip Sample Format</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Below is a simplified <strong>salary slip sample</strong> showing typical earnings and
          deductions. Actual structures vary by company policy and applicable regulations.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-[#1A2E7E] text-white px-5 py-3 font-semibold">Earnings</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-5 py-3 font-medium text-zinc-700">Component</th>
                  <th className="text-right px-5 py-3 font-medium text-zinc-700">Amount</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600">
                {[
                  ["Basic Salary", "₹25,000"],
                  ["HRA", "₹10,000"],
                  ["Special Allowance", "₹5,000"],
                  ["Conveyance", "₹2,000"],
                  ["Gross Salary", "₹42,000"],
                ].map(([label, amt]) => (
                  <tr key={label} className="border-b border-zinc-50 last:border-0 last:font-semibold last:text-zinc-900">
                    <td className="px-5 py-2.5">{label}</td>
                    <td className="px-5 py-2.5 text-right">{amt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-800 text-white px-5 py-3 font-semibold">Deductions</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-5 py-3 font-medium text-zinc-700">Component</th>
                  <th className="text-right px-5 py-3 font-medium text-zinc-700">Amount</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600">
                {[
                  ["PF", "₹1,800"],
                  ["Professional Tax", "₹200"],
                  ["Total Deductions", "₹2,000"],
                ].map(([label, amt]) => (
                  <tr key={label} className="border-b border-zinc-50 last:border-0 last:font-semibold last:text-zinc-900">
                    <td className="px-5 py-2.5">{label}</td>
                    <td className="px-5 py-2.5 text-right">{amt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-emerald-800 uppercase tracking-wide">Net Salary</p>
            <p className="text-3xl font-bold text-emerald-900">₹40,000</p>
          </div>
          <GeneratorCta label="Create Your Payslip Like This" />
        </div>

        <SectionHeading id="word-format">Salary Slip Format in Word</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Many small businesses search for <strong>salary slip format word</strong> templates because
          they are easy to edit and customise on Microsoft Word or Google Docs.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          <li>Easy customization and quick printing</li>
          <li>Simple formatting for startups and small businesses</li>
          <li>Add company letterhead and logo</li>
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          However, manually creating salary slips in Word every month is time-consuming and prone to
          errors. Our generator produces a consistent layout you can export as PDF — no copy-paste
          each pay cycle.
        </p>

        <SectionHeading id="excel-format">Salary Slip Format in Excel</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          <strong>Salary slip format excel</strong> files are popular for payroll teams who need
          formula-based calculations across many employees.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          <li>Automatic calculations and formula-based deductions</li>
          <li>Bulk payroll management</li>
          <li>Easy record keeping in spreadsheets</li>
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          As headcount grows, maintaining Excel templates becomes difficult — broken formulas,
          version conflicts, and audit gaps. An online{" "}
          <strong>salary slip generator free</strong> tool removes that maintenance burden.
        </p>

        <SectionHeading id="pdf-format">Salary Slip Format PDF</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          <strong>Salary slip PDF</strong> is the format banks and HR departments prefer:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-8">
          <li>Cannot be easily modified after issuance</li>
          <li>Professional appearance for employees and lenders</li>
          <li>Accepted by banks for loan and visa documentation</li>
          <li>Convenient for email distribution</li>
        </ul>
        <GeneratorCta label="Download Salary Slip PDF" />

        <SectionHeading id="how-to-create">How to Create a Salary Slip?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Creating a salary slip manually usually involves these steps:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-lg text-zinc-600 mb-8">
          <li>Enter employee information</li>
          <li>Add salary components and allowances</li>
          <li>Calculate earnings and statutory deductions</li>
          <li>Compute net salary</li>
          <li>Verify payroll data against attendance</li>
          <li>Generate and distribute PDF to employees</li>
        </ol>
        <p className="text-lg text-zinc-600 leading-relaxed">
          This process becomes repetitive for businesses managing multiple employees every month.
        </p>

        <SectionHeading id="generator">Generate Salary Slips Online for Free</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Instead of rebuilding templates each month, use an online payslip generator:
        </p>
        <ul className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            "Faster payroll processing",
            "Reduced manual errors",
            "Professional formatting",
            "Instant PDF generation",
            "Easy employee record management",
            "No spreadsheet maintenance",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          ComplianceDraft provides a <strong>free payslip generator</strong> that helps employers
          create professional <strong>employee salary slip format</strong> documents within minutes.
        </p>
        <GeneratorCta large />

        <SectionHeading id="who-can-use">Who Can Use This Salary Slip Generator?</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: Building2,
              title: "Small Businesses",
              text: "Generate salary slips quickly without dedicated payroll software.",
            },
            {
              icon: Sparkles,
              title: "Startups",
              text: "Maintain professional employee records from day one.",
            },
            {
              icon: Users,
              title: "HR Professionals",
              text: "Reduce repetitive payroll documentation tasks.",
            },
            {
              icon: Briefcase,
              title: "Accountants",
              text: "Generate salary slips for multiple clients efficiently.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="p-6 rounded-2xl border border-zinc-200 hover:border-[#1A2E7E]/30 transition-colors">
              <Icon className="w-8 h-8 text-[#1A2E7E] mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed m-0">{text}</p>
            </div>
          ))}
        </div>

        <SectionHeading id="components">Common Salary Components</SectionHeading>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#1A2E7E]" />
              <h3 className="font-semibold text-zinc-900 m-0">Earnings</h3>
            </div>
            <ul className="list-disc pl-5 text-zinc-600 space-y-1.5">
              {[
                "Basic Pay",
                "House Rent Allowance",
                "Conveyance Allowance",
                "Medical Allowance",
                "Bonus & Incentives",
                "Special Allowance",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-zinc-700" />
              <h3 className="font-semibold text-zinc-900 m-0">Deductions</h3>
            </div>
            <ul className="list-disc pl-5 text-zinc-600 space-y-1.5">
              {["PF", "ESI", "Professional Tax", "Income Tax (TDS)", "Loan Recovery", "Advance Recovery"].map(
                (x) => (
                  <li key={x}>{x}</li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Related keyword links */}
        <div className="mt-16 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            Related formats
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Salary slip format Word", href: "/salary-slip-format-word" },
              { label: "GST invoice format", href: "/gst-invoice-format" },
              { label: "DIR-2 format", href: "/dir-2-format" },
              { label: "Board resolution format", href: "/board-resolution-format" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-[#1A2E7E] hover:border-[#1A2E7E] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </article>

      <FaqSection faqs={FAQS} />

      {/* Final CTA */}
      <section className="py-20 bg-mesh-gradient-2 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-6">
            Create Salary Slips Instantly
          </h2>
          <p className="text-lg text-zinc-700 mb-4 max-w-2xl mx-auto">
            Stop managing complex payroll spreadsheets and outdated templates.
          </p>
          <p className="text-lg text-zinc-700 mb-10 max-w-2xl mx-auto">
            Use ComplianceDraft&apos;s free Salary Slip Generator to create professional payslips,
            download PDFs, and simplify employee salary documentation.
          </p>
          <Link
            href={GENERATOR_URL}
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#1A2E7E] rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1"
          >
            Generate Salary Slip Free
            <ArrowRight className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
