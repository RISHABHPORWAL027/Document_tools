import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Scale,
  Sparkles,
  Users,
  AlertTriangle,
} from "lucide-react";
import FaqSection from "./FaqSection";

const GENERATOR_URL = "/incorporation/llp/mrl";

const FAQS = [
  {
    question: "What is a Management Representation Letter (MRL)?",
    answer:
      "An MRL is a letter signed by management confirming the accuracy and completeness of financial information and records provided to auditors, as required under auditing standards.",
  },
  {
    question: "Is MRL mandatory for statutory audit?",
    answer:
      "Yes. Under SA 580 (Auditing Standard), auditors must obtain written representations from management before signing the audit report.",
  },
  {
    question: "Who signs the Management Representation Letter?",
    answer:
      "Typically the CEO, CFO, managing director, or designated partners — as specified by the auditor. Those with overall responsibility for financial statements sign.",
  },
  {
    question: "When is MRL required?",
    answer:
      "At the completion of the statutory audit, before the auditor signs the audit report for the financial year.",
  },
  {
    question: "Can I generate MRL online?",
    answer:
      "Yes. ComplianceDraft's MRL Generator creates a professionally formatted Management Representation Letter you can customise and download.",
  },
  {
    question: "Is MRL required for LLP audit?",
    answer:
      "Yes. LLP designated partners provide MRL to the statutory auditor or certifying professional for LLP financial statement audits.",
  },
  {
    question: "What is the difference between MRL and audit report?",
    answer:
      "The audit report is issued by the auditor. The MRL is signed by management confirming representations to the auditor — it is audit evidence, not the auditor's opinion.",
  },
  {
    question: "Can management refuse to sign MRL?",
    answer:
      "If management refuses or limits representations, the auditor may qualify the audit opinion or disclaim the report.",
  },
];

function GeneratorCta({
  label = "Generate MRL Online",
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

export default function MrlLandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1A2E7E] selection:text-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-mesh-gradient-1">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-6">
            <ClipboardCheck className="w-4 h-4 text-[#1A2E7E]" />
            <span className="text-sm font-medium text-zinc-800">SA 580 · Audit Ready</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3rem] font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
            Management Representation Letter:{" "}
            <span className="text-[#1A2E7E]">Format, Sample &amp; Free Generator</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-700 leading-relaxed mb-4 max-w-3xl mx-auto">
            Download <strong>management representation letter format</strong>, view an MRL sample,
            and generate a professionally drafted letter for statutory audit — company and LLP.
          </p>
          <p className="text-base text-zinc-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Built for CAs, auditors, company secretaries, and finance teams completing year-end
            audits under SA 580.
          </p>
          <GeneratorCta label="Generate MRL Online" large />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              SA 580 aligned
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Company &amp; LLP
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              PDF &amp; Word export
            </span>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading id="overview">
          Management Representation Letter Format – Download, Sample &amp; Generate Online
        </SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A Management Representation Letter (MRL) is a critical audit document in which management
          confirms to the statutory auditor that financial statements are fairly presented, records
          are complete, and all material information has been disclosed. Auditors cannot issue a
          clean audit report without obtaining this letter under SA 580.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Whether you are closing a private limited company audit, LLP financial statements, or
          supporting a tax audit engagement, having the correct{" "}
          <strong>MRL format</strong> saves time and reduces back-and-forth with the audit team.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          With ComplianceDraft&apos;s MRL Generator, you can create a professional Management
          Representation Letter on company letterhead within minutes.
        </p>
        <GeneratorCta label="Open MRL Generator" />

        <SectionHeading id="what-is">What Is a Management Representation Letter?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A Management Representation Letter is formal written confirmation from those charged with
          governance — directors, designated partners, or senior management — that:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-6">
          <li>Financial statements have been prepared in accordance with the applicable framework</li>
          <li>All books of account and supporting records have been made available to auditors</li>
          <li>Management has disclosed all known fraud, errors, and non-compliance</li>
          <li>Related party transactions and subsequent events are properly reflected</li>
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed">
          The MRL is not the audit report itself — it is management&apos;s signed representation
          that forms part of the auditor&apos;s working papers.
        </p>

        <SectionHeading id="why-required">Why Is MRL Required?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Under SA 580, written representations are necessary audit evidence. The MRL helps:
        </p>
        <ul className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            "Confirm management's responsibility for financial statements",
            "Document disclosures provided to the auditor",
            "Support the auditor's opinion on true and fair view",
            "Create an audit trail for regulatory inspection",
            "Protect both management and auditor on scope of review",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed font-medium text-zinc-800">
          Without a signed MRL, auditors typically cannot sign the statutory audit report.
        </p>

        <SectionHeading id="when-required">When Is MRL Required?</SectionHeading>
        <div className="space-y-5">
          {[
            {
              title: "Statutory Audit (Companies Act)",
              text: "Before the auditor signs the report on annual financial statements of a company.",
            },
            {
              title: "LLP Audit",
              text: "When designated partners represent to the auditor on LLP books and compliance.",
            },
            {
              title: "Tax Audit (Section 44AB)",
              text: "Often requested alongside tax audit reports — confirm with your auditor's checklist.",
            },
            {
              title: "Special Purpose Audits",
              text: "When auditors require management representations for limited scope engagements.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="flex gap-4 p-5 rounded-xl border border-zinc-100 bg-white shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A2E7E]/10 text-[#1A2E7E] text-sm font-bold">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">{item.title}</h3>
                <p className="text-zinc-600 m-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <SectionHeading id="who-signs">Who Signs the MRL?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          The auditor&apos;s instruction letter usually specifies signatories. Commonly:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          <li>Managing Director / CEO and CFO (companies)</li>
          <li>Designated Partners (LLPs)</li>
          <li>Director responsible for finance and compliance</li>
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed">
          Signatories must have authority to bind the entity and knowledge of the representations
          being made.
        </p>

        <SectionHeading id="information">Information Included in an MRL</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A standard <strong>management representation letter format</strong> typically contains:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-8">
          {[
            "Entity name and financial year end date",
            "Addressee (auditor firm name)",
            "Acknowledgement of management responsibility under Companies Act / LLP Act",
            "Confirmation of fair presentation of financial statements",
            "Representations on fraud, litigation, related parties, and tax compliance",
            "Confirmation of unrestricted access to records and personnel",
            "Date, place, and authorised signatures on letterhead",
          ].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>

        <SectionHeading id="sample">Management Representation Letter Sample</SectionHeading>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 mb-8 space-y-5">
          <p className="text-sm font-bold text-[#1A2E7E] uppercase tracking-wide m-0">
            Extract — Standard Representations
          </p>
          <p className="text-zinc-700 leading-relaxed m-0 italic">
            &ldquo;We acknowledge our responsibility for the preparation of the financial statements
            in accordance with the applicable financial reporting framework and confirm that to the
            best of our knowledge and belief, the financial statements give a true and fair view…&rdquo;
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">
            We confirm that we have provided the Auditors with all relevant information and
            unrestricted access to persons and records necessary for the audit. To the best of our
            knowledge, there has been no fraud involving management or employees that should have
            been disclosed to the Auditors.
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">
            We confirm that all related party relationships and transactions have been disclosed and
            accounted for in accordance with applicable standards.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-600 pt-4 border-t border-zinc-200">
            {[
              ["For and on behalf of", "[Company / LLP Name]"],
              ["Authorised Signatory", "________________"],
              ["Designation", "Director / Designated Partner"],
              ["Date", "________________"],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <span className="font-medium text-zinc-800 shrink-0">{label}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <GeneratorCta label="Generate MRL From This Sample" />

        <SectionHeading id="formats">MRL Download Formats</SectionHeading>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              title: "MRL Format Word",
              text: "Editable .docx for auditor-specific representation clauses.",
              href: "/management-representation-letter-word",
            },
            {
              title: "MRL Format PDF",
              text: "Print on letterhead, sign, and file in audit working papers.",
              href: "/management-representation-letter-pdf",
            },
            {
              title: "MRL Sample",
              text: "Filled example for training and client reference.",
              href: "/management-representation-letter-sample",
            },
          ].map((fmt) => (
            <Link
              key={fmt.href}
              href={fmt.href}
              className="block p-5 rounded-2xl border border-zinc-200 hover:border-[#1A2E7E] hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-[#1A2E7E] mb-2">{fmt.title}</h3>
              <p className="text-sm text-zinc-600 m-0">{fmt.text}</p>
            </Link>
          ))}
        </div>

        <SectionHeading id="company-vs-llp">MRL for Company vs LLP</SectionHeading>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <SubHeading>Private / Public Company</SubHeading>
            <p className="text-zinc-600 leading-relaxed m-0">
              References director responsibility under Section 134, Companies Act 2013. Signed by
              directors with overall responsibility for financial reporting — often MD and CFO
              together.
            </p>
          </div>
          <div className="rounded-2xl border border-[#1A2E7E]/20 bg-[#1A2E7E]/5 p-6">
            <SubHeading>Limited Liability Partnership</SubHeading>
            <p className="text-zinc-600 leading-relaxed m-0">
              Addressed by designated partners under the LLP Act. Our generator is tailored for
              LLP MRL with partner blocks and LLP-specific declarations.
            </p>
          </div>
        </div>

        <SectionHeading id="mistakes">Common Mistakes While Preparing MRL</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              title: "Signing Without Review",
              text: "Management must read each representation — auditors customise clauses by client risk.",
            },
            {
              title: "Wrong Financial Year",
              text: "MRL must reference the correct period end date matching the audit report.",
            },
            {
              title: "Missing Letterhead",
              text: "MRL should be on official company or LLP letterhead.",
            },
            {
              title: "Incomplete Signatures",
              text: "All signatories named in the auditor's request must sign.",
            },
            {
              title: "Dated After Audit Report",
              text: "MRL is typically dated on or before the audit report date.",
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

        <SectionHeading id="benefits">Benefits of Using an Online MRL Generator</SectionHeading>
        <ul className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            "Faster year-end audit closings",
            "Consistent format across client portfolio",
            "Reduced drafting errors in representation clauses",
            "Professional layout on letterhead",
            "Easy PDF and Word export for signing",
            "Reusable template each financial year",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <GeneratorCta large />

        <SectionHeading id="who-can-use">Who Can Use This Tool?</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Building2, title: "Chartered Accountants", text: "Draft MRLs for audit clients efficiently." },
            { icon: Scale, title: "Company Secretaries", text: "Coordinate year-end compliance documentation." },
            { icon: Users, title: "Finance Teams", text: "Prepare management sign-off before auditor fieldwork ends." },
            { icon: Sparkles, title: "Audit Firms", text: "Provide clients a standard template aligned with SA 580." },
            { icon: FileText, title: "LLP Partners", text: "Generate designated partner representation letters." },
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
            Related audit &amp; incorporation documents
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Auditor consent letter", href: "/auditor-consent-letter" },
              { label: "Board resolution format", href: "/board-resolution-format" },
              { label: "DIR-2 format", href: "/dir-2-format" },
              { label: "NOC registered office", href: "/noc-for-registered-office" },
              { label: "Bank account resolution", href: "/board-resolution-for-bank-account-opening" },
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
            Generate Management Representation Letter Online
          </h2>
          <p className="text-lg text-zinc-700 mb-4 max-w-2xl mx-auto">
            Stop rebuilding MRL templates from scratch every audit season.
          </p>
          <p className="text-lg text-zinc-700 mb-10 max-w-2xl mx-auto">
            Use ComplianceDraft&apos;s MRL Generator to create professional representation letters
            within minutes. Generate, review, and download instantly.
          </p>
          <Link
            href={GENERATOR_URL}
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#1A2E7E] rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1"
          >
            Generate MRL Online
            <ArrowRight className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
