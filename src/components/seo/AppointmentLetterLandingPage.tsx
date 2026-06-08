import type { ReactNode } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  Sparkles,
  Users,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import FaqSection from "./FaqSection";
import GeneratorCta from "./GeneratorCta";

const GENERATOR_URL = "/incorporation/private-limited/appointment-letter";

const FAQS = [
  {
    question: "What is an appointment letter?",
    answer:
      "An appointment letter is a formal document confirming an individual's employment with an organization, including role, salary, and terms.",
  },
  {
    question: "Is an appointment letter mandatory?",
    answer:
      "Most organizations issue appointment letters to document employment terms and conditions for HR and compliance records.",
  },
  {
    question: "What should be included in an appointment letter?",
    answer:
      "Employee details, designation, salary, joining date, reporting manager, and key employment terms are typically included.",
  },
  {
    question: "Can I create an appointment letter online?",
    answer:
      "Yes. ComplianceDraft's Appointment Letter Generator creates professionally formatted letters you can customise and download.",
  },
  {
    question: "What is the difference between an offer letter and an appointment letter?",
    answer:
      "An offer letter proposes employment before joining. An appointment letter confirms employment after acceptance with fuller terms.",
  },
  {
    question: "Can appointment letters be generated in PDF format?",
    answer:
      "Yes. Appointment letters are commonly generated and shared as PDF documents after review.",
  },
];

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

export default function AppointmentLetterLandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1A2E7E] selection:text-white">
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-mesh-gradient-1">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-6">
            <UserCheck className="w-4 h-4 text-[#1A2E7E]" />
            <span className="text-sm font-medium text-zinc-800">HR · Onboarding Ready</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3rem] font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
            Appointment Letter Format:{" "}
            <span className="text-[#1A2E7E]">Sample, Word Format &amp; Free Generator</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-700 leading-relaxed mb-4 max-w-3xl mx-auto">
            Download <strong>appointment letter format</strong>, view an employee appointment
            letter sample, and generate a professional joining letter — Word, PDF, and print in
            minutes.
          </p>
          <p className="text-base text-zinc-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Built for HR teams, startup founders, recruiters, consultants, and small businesses
            onboarding new employees.
          </p>
          <div className="relative z-10">
            <GeneratorCta href={GENERATOR_URL} label="Generate Appointment Letter" large />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Employee onboarding
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Word &amp; PDF export
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Customisable clauses
            </span>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading id="overview">
          Appointment Letter Format – Download Sample, Word Template &amp; Generate Online
        </SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          An Appointment Letter is one of the most important documents issued by an employer to a
          new employee. It serves as official confirmation of employment and outlines terms and
          conditions — designation, salary, reporting structure, joining date, and employment
          policies.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Whether you are a startup founder, HR manager, business owner, recruiter, consultant, or
          accountant, issuing a professionally drafted <strong>appointment letter</strong> helps
          establish clear expectations and maintain proper employment records.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          With ComplianceDraft&apos;s Appointment Letter Generator, you can create professional
          appointment letters instantly without manually drafting them from scratch.
        </p>
        <GeneratorCta href={GENERATOR_URL} label="Open Appointment Letter Generator" />

        <SectionHeading id="what-is">What Is an Appointment Letter?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          An Appointment Letter is a formal document issued by an employer to a selected candidate
          confirming their employment with the organization. It acts as an official agreement
          regarding:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-6">
          {[
            "Job role and designation",
            "Salary structure and benefits",
            "Date of joining",
            "Working hours and place of work",
            "Reporting manager",
            "Employment terms and company policies",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed">
          The employee generally signs and accepts the appointment letter before joining.
        </p>

        <SectionHeading id="why-important">Why Is an Appointment Letter Important?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Appointment letters help both employers and employees by clearly documenting employment
          terms.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-[#1A2E7E]/20 bg-[#1A2E7E]/5 p-6">
            <SubHeading>For Employers</SubHeading>
            <ul className="list-disc pl-5 text-zinc-600 space-y-2 m-0">
              <li>Creates a formal employment record</li>
              <li>Reduces misunderstandings</li>
              <li>Establishes employment conditions</li>
              <li>Improves HR documentation</li>
              <li>Supports compliance and audits</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <SubHeading>For Employees</SubHeading>
            <ul className="list-disc pl-5 text-zinc-600 space-y-2 m-0">
              <li>Confirms employment</li>
              <li>Provides salary details</li>
              <li>Clarifies job responsibilities</li>
              <li>Serves as proof of employment</li>
              <li>Helps in future verification processes</li>
            </ul>
          </div>
        </div>

        <SectionHeading id="who-needs">Who Needs an Appointment Letter?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Appointment letters are commonly issued by any organization hiring employees:
        </p>
        <ul className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            "Startups and Private Limited Companies",
            "LLPs and small businesses",
            "Agencies and IT companies",
            "Manufacturing companies",
            "Educational institutions",
            "Consultants and service providers",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <SectionHeading id="information">Information Included in an Appointment Letter</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          A professional <strong>appointment letter format</strong> generally contains:
        </p>
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {[
            {
              title: "Employer Information",
              items: ["Company name", "Company address", "Contact information"],
            },
            {
              title: "Employee Information",
              items: ["Employee name", "Address", "Contact details"],
            },
            {
              title: "Employment Details",
              items: ["Designation", "Department", "Date of joining", "Reporting manager", "Place of work"],
            },
            {
              title: "Compensation & Terms",
              items: ["Salary package", "Allowances and benefits", "Working hours", "Leave policy", "Probation period"],
            },
          ].map((block) => (
            <div key={block.title} className="p-5 rounded-xl border border-zinc-200 bg-white">
              <h3 className="font-semibold text-zinc-900 mb-3">{block.title}</h3>
              <ul className="list-disc pl-5 text-zinc-600 space-y-1 m-0 text-sm">
                {block.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <SectionHeading id="sample">Appointment Letter Sample Format</SectionHeading>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 mb-8 space-y-4">
          <p className="text-sm font-bold text-[#1A2E7E] uppercase tracking-wide m-0">
            Subject: Appointment Letter
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">Dear [Employee Name],</p>
          <p className="text-zinc-700 leading-relaxed m-0">
            We are pleased to offer you the position of <strong>[Designation]</strong> at{" "}
            <strong>[Company Name]</strong>.
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">
            Your employment shall commence on <strong>[Joining Date]</strong>.
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">
            Your annual compensation will be ₹<strong>[Amount]</strong> per annum subject to
            applicable deductions and company policies.
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">
            You will report directly to <strong>[Reporting Manager]</strong>.
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">
            We look forward to your contribution and wish you success in your role.
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">
            Sincerely,
            <br />
            [Authorized Signatory]
            <br />
            [Company Name]
          </p>
        </div>
        <GeneratorCta href={GENERATOR_URL} label="Generate From This Sample" />

        <SectionHeading id="word-format">Appointment Letter Format in Word</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Many businesses prefer <strong>appointment letter Word format</strong> because it is easy
          to edit, quick to customise, and suitable for small teams without dedicated HR software.
          Word templates are especially popular among startups and small businesses.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          Our generator exports an editable document you can open in Microsoft Word or Google Docs,
          adjust branding, and save as PDF for distribution.
        </p>

        <SectionHeading id="pdf-format">Appointment Letter Format PDF</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          <strong>Appointment letter PDF</strong> formats are commonly used for professional
          presentation, email sharing, record keeping, and employee acceptance. Most organizations
          prepare the letter and export PDF before sending to the new hire.
        </p>

        <SectionHeading id="vs-offer">Appointment Letter vs Offer Letter</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Many people confuse an offer letter with an appointment letter. They serve different
          stages of hiring:
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h3 className="font-bold text-zinc-900 mb-3">Offer Letter</h3>
            <ul className="list-disc pl-5 text-zinc-600 space-y-2 m-0">
              <li>Issued before joining</li>
              <li>Communicates the employment offer</li>
              <li>Candidate may accept or reject</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[#1A2E7E]/20 bg-[#1A2E7E]/5 p-6">
            <h3 className="font-bold text-zinc-900 mb-3">Appointment Letter</h3>
            <ul className="list-disc pl-5 text-zinc-600 space-y-2 m-0">
              <li>Issued after acceptance</li>
              <li>Confirms employment</li>
              <li>Contains detailed employment terms</li>
            </ul>
          </div>
        </div>
        <p className="text-lg text-zinc-600 leading-relaxed font-medium text-zinc-800">
          An appointment letter is generally more comprehensive than an offer letter.
        </p>

        <SectionHeading id="clauses">Common Clauses Included in Appointment Letters</SectionHeading>
        <div className="space-y-4 mb-8">
          {[
            {
              title: "Probation Clause",
              text: "Defines the probation period and evaluation process.",
            },
            {
              title: "Confidentiality Clause",
              text: "Protects company information and intellectual property.",
            },
            {
              title: "Termination Clause",
              text: "Specifies notice periods and termination conditions.",
            },
            {
              title: "Working Hours Clause",
              text: "Outlines expected work schedules.",
            },
            {
              title: "Leave Policy Clause",
              text: "Explains leave entitlements and company policies.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-5 rounded-xl border border-zinc-100 bg-white shadow-sm"
            >
              <FileText className="w-5 h-5 text-[#1A2E7E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">{item.title}</h3>
                <p className="text-zinc-600 m-0 text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <SectionHeading id="mistakes">Common Mistakes to Avoid</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              title: "Incorrect Employee Details",
              text: "Verify employee information before issuing the document.",
            },
            {
              title: "Missing Salary Information",
              text: "Clearly specify compensation details.",
            },
            {
              title: "Ambiguous Job Responsibilities",
              text: "Define the role and responsibilities properly.",
            },
            {
              title: "Missing Terms and Conditions",
              text: "Include all key employment clauses.",
            },
            {
              title: "Unsigned Appointment Letter",
              text: "Ensure the letter is signed by the authorized representative.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-3 p-5 rounded-xl border border-amber-100 bg-amber-50/50"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm mb-1">{item.title}</h3>
                <p className="text-zinc-600 text-sm m-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <SectionHeading id="benefits">Benefits of Using an Online Appointment Letter Generator</SectionHeading>
        <ul className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            "Save time on repetitive drafting",
            "Ensure consistency across hires",
            "Reduce drafting errors",
            "Improve HR documentation",
            "Create professional formats",
            "Simplify employee onboarding",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <GeneratorCta href={GENERATOR_URL} label="Generate Appointment Letter" large />

        <SectionHeading id="who-can-use">Who Can Use This Tool?</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Users, title: "HR Professionals", text: "Generate appointment letters quickly for new hires." },
            { icon: Sparkles, title: "Startup Founders", text: "Create professional HR documents from day one." },
            { icon: Building2, title: "Small Business Owners", text: "Maintain proper employee documentation." },
            { icon: Briefcase, title: "Recruiters", text: "Speed up the onboarding process." },
            { icon: FileText, title: "Consultants", text: "Prepare employment documentation for clients." },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-zinc-200 hover:border-[#1A2E7E]/30 transition-colors"
            >
              <Icon className="w-8 h-8 text-[#1A2E7E] mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed m-0">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            Related HR &amp; compliance documents
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Salary slip format", href: "/salary-slip-format" },
              { label: "Board resolution format", href: "/board-resolution-format" },
              { label: "DIR-2 format", href: "/dir-2-format" },
              { label: "NOC registered office", href: "/noc-for-registered-office" },
              { label: "Director resignation", href: "/director-resignation-letter-format" },
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

      <section className="py-20 bg-mesh-gradient-2 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-6">
            Generate Appointment Letters Online
          </h2>
          <p className="text-lg text-zinc-700 mb-4 max-w-2xl mx-auto">
            Avoid manually drafting employment documents every time you hire a new employee.
          </p>
          <p className="text-lg text-zinc-700 mb-10 max-w-2xl mx-auto">
            Use ComplianceDraft&apos;s Appointment Letter Generator to create professional appointment
            letters within minutes. Generate, review, and download instantly.
          </p>
          <GeneratorCta
            href={GENERATOR_URL}
            label="Generate Appointment Letter"
            large
            arrow="arrow"
          />
        </div>
      </section>
    </div>
  );
}
