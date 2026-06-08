import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Landmark,
  Scale,
  Sparkles,
  Users,
  AlertTriangle,
} from "lucide-react";
import FaqSection from "./FaqSection";

const GENERATOR_URL = "/incorporation/private-limited/bank-account";

const FAQS = [
  {
    question: "Is a board resolution mandatory for opening a company bank account?",
    answer:
      "Most banks require a board resolution authorizing account opening and specifying signatory powers before opening a corporate current account.",
  },
  {
    question: "Can one resolution be used for all banks?",
    answer:
      "The format is generally similar across banks, though some branches may request bank-specific wording or their own resolution template.",
  },
  {
    question: "Who signs the board resolution?",
    answer:
      "The resolution is typically certified as a true copy by an authorized director, chairperson of the meeting, or the company secretary.",
  },
  {
    question: "Is a board meeting required?",
    answer:
      "The resolution should be passed in accordance with the company's Articles of Association and the Companies Act, 2013 — usually at a validly convened board meeting.",
  },
  {
    question: "Can I generate the resolution online?",
    answer:
      "Yes. ComplianceDraft's Board Resolution Generator creates bank-ready resolutions instantly with your company and signatory details.",
  },
  {
    question: "What is a certified true copy of board resolution?",
    answer:
      "It is a copy of the resolution signed by an authorized director or company secretary confirming it matches the minutes of the board meeting.",
  },
  {
    question: "How recent must the resolution be for the bank?",
    answer:
      "Most banks accept resolutions within 3–6 months of account opening. Some branches prefer a resolution dated within the current month.",
  },
  {
    question: "Does the resolution need to name the bank branch?",
    answer:
      "Yes. Naming the specific bank and branch reduces KYC delays and matches the account opening form.",
  },
];

function GeneratorCta({
  label = "Generate Board Resolution",
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

export default function BoardResolutionBankLandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1A2E7E] selection:text-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-mesh-gradient-1">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-6">
            <Landmark className="w-4 h-4 text-[#1A2E7E]" />
            <span className="text-sm font-medium text-zinc-800">Bank Account Opening Pack</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.1rem] font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
            Board Resolution for Bank Account Opening:{" "}
            <span className="text-[#1A2E7E]">Format, Sample &amp; Free Generator</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-700 leading-relaxed mb-4 max-w-3xl mx-auto">
            Download <strong>board resolution for bank account opening</strong> format, view a
            certified true copy sample, and generate a bank-ready resolution for SBI, HDFC, ICICI,
            and other banks — in minutes.
          </p>
          <p className="text-base text-zinc-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            For startup founders, CAs, CSs, and accountants opening a company current account after
            incorporation.
          </p>
          <GeneratorCta label="Generate Board Resolution" large />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Certified true copy wording
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Authorised signatories
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
          Board Resolution for Bank Account Opening – Download Format &amp; Generate Instantly
        </SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A Board Resolution for Bank Account Opening is one of the most commonly required corporate
          documents when a company opens a current account with a bank. Most banks require a
          certified copy of the board resolution authorizing the company to open and operate a bank
          account.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Whether you are opening an account with SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak
          Mahindra Bank, PNB, or any other bank, a properly drafted{" "}
          <strong>company bank account opening resolution</strong> is generally required as part of
          the KYC pack.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          With ComplianceDraft&apos;s Board Resolution Generator, you can create a professional
          board resolution for bank account opening in minutes.
        </p>
        <GeneratorCta label="Open Board Resolution Generator" />

        <SectionHeading id="what-is">
          What Is a Board Resolution for Bank Account Opening?
        </SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A Board Resolution for Bank Account Opening is a formal decision passed by the Board of
          Directors authorizing the company to open a bank account and specifying the individuals
          who are authorized to operate the account on behalf of the company.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed">
          The resolution serves as evidence that the company&apos;s board has approved the banking
          relationship and delegated authority to designated signatories — a{" "}
          <strong>current account opening resolution</strong> accepted by virtually every scheduled
          commercial bank in India.
        </p>

        <SectionHeading id="why-required">Why Is This Resolution Required?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Banks require board resolutions to verify:
        </p>
        <ul className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            "The company's approval for opening the account",
            "Authorized signatories and their identities",
            "Operating instructions (jointly / severally)",
            "Banking powers granted by the company",
            "Compliance with internal governance",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed font-medium text-zinc-800">
          Without a board resolution, most banks will not proceed with corporate account opening.
        </p>

        <SectionHeading id="when-required">When Is a Board Resolution Required?</SectionHeading>
        <div className="space-y-5">
          {[
            {
              title: "Opening a New Current Account",
              text: "When a private limited company opens its first bank account after incorporation.",
            },
            {
              title: "Opening an Additional Bank Account",
              text: "When an existing company opens another account with a different bank or branch.",
            },
            {
              title: "Changing Authorized Signatories",
              text: "When directors or authorized signatories change and the bank needs updated instructions.",
            },
            {
              title: "Modifying Banking Powers",
              text: "When transaction limits or account operation instructions need to be updated.",
            },
          ].map((item, i) => (
            <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-zinc-100 bg-white shadow-sm">
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

        <SectionHeading id="information-included">
          Information Included in a Board Resolution for Bank Account Opening
        </SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A standard <strong>board resolution sample</strong> for banking typically includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-8">
          {[
            "Company name and CIN (if applicable)",
            "Date of board meeting",
            "Name of the bank and branch",
            "Type of account to be opened (current account)",
            "Authorized signatories and designations",
            "Account operation instructions",
            "Powers granted to signatories",
            "Certification by authorized officer",
          ].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>

        <SectionHeading id="sample">Sample Board Resolution for Bank Account Opening</SectionHeading>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 space-y-6 mb-8">
          <div>
            <p className="text-sm font-bold text-[#1A2E7E] uppercase tracking-wide mb-2">
              RESOLVED THAT
            </p>
            <p className="text-zinc-700 leading-relaxed m-0">
              The Company do open a Current Account with the chosen bank and that the said account
              be operated by the authorized signatories as approved by the Board.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A2E7E] uppercase tracking-wide mb-2">
              FURTHER RESOLVED THAT
            </p>
            <p className="text-zinc-700 leading-relaxed m-0">
              The authorized signatories are empowered to sign, execute, endorse, and deliver all
              forms, documents, declarations, and instructions required by the bank in relation to
              the account.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A2E7E] uppercase tracking-wide mb-2">
              FURTHER RESOLVED THAT
            </p>
            <p className="text-zinc-700 leading-relaxed m-0">
              Certified copies of this resolution be provided to the bank whenever required.
            </p>
          </div>
        </div>
        <GeneratorCta label="Generate Your Resolution From This Sample" />

        <SectionHeading id="documents-required">Documents Required Along with the Resolution</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">Banks may also request:</p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          {[
            "Certificate of Incorporation",
            "PAN Card of Company",
            "Memorandum of Association (MOA) & Articles of Association (AOA)",
            "Director KYC Documents (PAN, Aadhaar, photo)",
            "Proof of registered office address",
            "GST Registration Certificate (if applicable)",
            "Specimen signature card of authorized signatories",
          ].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed italic">
          Requirements may vary depending on the bank and branch.
        </p>

        <SectionHeading id="bank-specific">Bank-Specific Resolution Formats</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          The core resolution wording is similar across banks. Below are the most searched
          bank-specific variations — each links to the same generator where you enter the bank name.
        </p>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <SubHeading>Board Resolution for SBI Bank Account Opening</SubHeading>
            <p className="text-zinc-600 leading-relaxed mb-3">
              Many companies search for a <strong>board resolution for SBI account opening</strong>.
              SBI typically requires the board resolution, incorporation documents, company PAN,
              director KYC, and authorized signatory details. Name the exact SBI branch in your
              resolution.
            </p>
            <Link
              href="/board-resolution-for-sbi-account-opening"
              className="text-sm font-medium text-[#1A2E7E] hover:underline"
            >
              SBI-specific guide →
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <SubHeading>Board Resolution for HDFC Bank Account Opening</SubHeading>
            <p className="text-zinc-600 leading-relaxed m-0">
              HDFC Bank generally requires a <strong>certified true copy board resolution</strong>{" "}
              authorizing account opening and specifying who can operate the account. Clearly
              define joint or several signing authority to avoid branch-level rejections.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <SubHeading>Board Resolution for ICICI Bank Account Opening</SubHeading>
            <p className="text-zinc-600 leading-relaxed m-0">
              ICICI Bank generally requests a certified board resolution, company documents,
              signatory details, and KYC documentation. A professionally drafted resolution reduces
              delays during account opening.
            </p>
          </div>
        </div>

        <SectionHeading id="mistakes">Common Mistakes to Avoid</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Incorrect Company Name",
              text: "Ensure the company name matches Certificate of Incorporation exactly.",
            },
            {
              title: "Missing Signatory Details",
              text: "Clearly identify all authorized signatories with designations.",
            },
            {
              title: "Outdated Resolution Format",
              text: "Use current certified true copy wording aligned with bank KYC.",
            },
            {
              title: "Missing Board Approval",
              text: "The resolution must clearly record board authorization for the account.",
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

        <SectionHeading id="benefits">Benefits of Using an Online Board Resolution Generator</SectionHeading>
        <ul className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            "Faster document preparation",
            "Professional formatting on letterhead",
            "Reduced drafting errors",
            "Consistent documentation across clients",
            "Ready-to-use resolution format",
            "Time savings for founders and professionals",
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
            { icon: Sparkles, title: "Startup Founders", text: "Generate resolutions quickly during incorporation." },
            { icon: Users, title: "Company Directors", text: "Prepare compliant banking documents." },
            { icon: Building2, title: "Chartered Accountants", text: "Create resolutions for clients efficiently." },
            { icon: Scale, title: "Company Secretaries", text: "Reduce repetitive drafting work." },
            { icon: Landmark, title: "Legal Professionals", text: "Generate standardized corporate documents." },
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
            Related documents
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Board resolution format", href: "/board-resolution-format" },
              { label: "SBI account opening", href: "/board-resolution-for-sbi-account-opening" },
              { label: "Specimen signature card", href: "/specimen-signature-card" },
              { label: "DIR-2 format", href: "/dir-2-format" },
              { label: "NOC registered office", href: "/noc-for-registered-office" },
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
            Generate Board Resolution for Bank Account Opening
          </h2>
          <p className="text-lg text-zinc-700 mb-4 max-w-2xl mx-auto">
            Avoid drafting resolutions manually every time a company opens a bank account.
          </p>
          <p className="text-lg text-zinc-700 mb-10 max-w-2xl mx-auto">
            Use ComplianceDraft&apos;s Board Resolution Generator to create professional, bank-ready
            resolutions within minutes. Generate, review, and download instantly.
          </p>
          <Link
            href={GENERATOR_URL}
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#1A2E7E] rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1"
          >
            Generate Board Resolution
            <ArrowRight className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
