import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Home,
  Scale,
  Sparkles,
  Users,
  AlertTriangle,
  FileText,
} from "lucide-react";
import FaqSection from "./FaqSection";

const GENERATOR_URL = "/noc-format";

const FAQS = [
  {
    question: "What is an NOC for Registered Office?",
    answer:
      "It is a declaration from the property owner confirming they have no objection to a company or LLP using the property as its registered office.",
  },
  {
    question: "Is NOC mandatory for company incorporation?",
    answer:
      "An NOC is commonly required when the registered office premises are owned or controlled by another person — rented, family-owned, or shared spaces.",
  },
  {
    question: "Who signs the NOC?",
    answer:
      "The property owner or an authorized representative with legal authority over the premises signs the NOC.",
  },
  {
    question: "Can residential property be used as a registered office?",
    answer:
      "Yes, subject to applicable requirements, local rules, and proper owner authorization via NOC and supporting address proof.",
  },
  {
    question: "Can I generate an NOC online?",
    answer:
      "Yes. ComplianceDraft's NOC Generator creates a professional No Objection Certificate for registered office instantly.",
  },
  {
    question: "What documents should accompany an NOC?",
    answer:
      "Utility bill in owner's name, rent agreement if applicable, and owner identity proof are commonly submitted with SPICe+ or address change filings.",
  },
  {
    question: "Is stamp paper required for NOC?",
    answer:
      "Typically plain paper is accepted by ROC for company registered office NOC. Requirements may vary by filing type.",
  },
  {
    question: "Is NOC required for LLP registration?",
    answer:
      "Yes, when the LLP uses premises owned by another person — similar owner consent is filed with FiLLiP.",
  },
];

function GeneratorCta({
  label = "Generate NOC Online",
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

export default function NocRegisteredOfficeLandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1A2E7E] selection:text-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-mesh-gradient-1">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-6">
            <Home className="w-4 h-4 text-[#1A2E7E]" />
            <span className="text-sm font-medium text-zinc-800">SPICe+ · ROC Ready</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.1rem] font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
            NOC for Registered Office:{" "}
            <span className="text-[#1A2E7E]">Format, Sample &amp; Free Generator</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-700 leading-relaxed mb-4 max-w-3xl mx-auto">
            Download <strong>NOC for registered office</strong> format, view an owner consent
            sample, and generate a SPICe+-ready <strong>NOC format</strong> for company incorporation
            and LLP registration.
          </p>
          <p className="text-base text-zinc-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            For startup founders, CAs, CSs, and consultants when the registered office is on rented,
            residential, or shared premises.
          </p>
          <GeneratorCta label="Generate NOC Online" large />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Plain paper format
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
          NOC for Registered Office – Download Format, Sample &amp; Generate Online
        </SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A No Objection Certificate (NOC) for Registered Office is one of the most commonly required
          documents during company incorporation and registered office changes. When a company uses
          a property owned by another person as its registered office, the property owner is generally
          required to provide an NOC confirming they have no objection to the company using the
          premises as its registered office.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Whether you are incorporating a Private Limited Company, LLP, OPC, or changing the
          registered office of an existing company, having a properly drafted{" "}
          <strong>registered office NOC</strong> is essential.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          With ComplianceDraft&apos;s NOC Generator, you can create a professional NOC for
          Registered Office in minutes.
        </p>
        <GeneratorCta label="Open NOC Generator" />

        <SectionHeading id="what-is">What Is an NOC for Registered Office?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          An NOC for Registered Office is a declaration issued by the property owner confirming
          that they have no objection to a company or LLP using their property as the registered
          office address.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed">
          The document serves as supporting evidence that the business has permission to operate
          from the specified address. It is commonly submitted along with incorporation and MCA
          compliance documents — a <strong>property owner NOC</strong> searched by CAs on every
          rented-office incorporation.
        </p>

        <SectionHeading id="why-required">Why Is an NOC Required?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Government authorities and ROC require proof that the company has authorization to use the
          registered office address. The NOC helps establish:
        </p>
        <ul className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            "Permission from the property owner",
            "Validity of the registered office address",
            "Supporting documentation for incorporation",
            "Compliance with registration requirements",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed font-medium text-zinc-800">
          Without an NOC, incorporation or address-related filings may face delays or objections.
        </p>

        <SectionHeading id="when-required">When Is an NOC for Registered Office Required?</SectionHeading>
        <div className="space-y-5">
          {[
            {
              title: "Company Incorporation",
              text: "When a company uses rented or borrowed premises as its registered office during SPICe+ filing.",
            },
            {
              title: "LLP Registration",
              text: "When an LLP uses property owned by another individual, partner, or family member.",
            },
            {
              title: "Change of Registered Office",
              text: "When the registered office address is shifted — INC-22 and supporting NOC may be needed.",
            },
            {
              title: "MCA Filings",
              text: "When supporting address documents are required during compliance filings.",
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

        <SectionHeading id="who-issues">Who Can Issue the NOC?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          The NOC should generally be issued by:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          <li>Property owner or landlord</li>
          <li>Co-owner of the property</li>
          <li>Authorized representative of the property owner</li>
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed">
          The person issuing the NOC should have legal authority over the property.
        </p>

        <SectionHeading id="information">Information Included in an NOC for Registered Office</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A standard <strong>NOC format</strong> for company registration typically includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-8">
          {[
            "Name of property owner",
            "Complete property address",
            "Name of company or LLP",
            "Declaration of no objection",
            "Permission to use address for official purposes",
            "Date and place of execution",
            "Signature of owner",
          ].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>

        <SectionHeading id="sample">NOC for Registered Office Sample</SectionHeading>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 mb-8 space-y-5">
          <p className="text-sm font-bold text-[#1A2E7E] uppercase tracking-wide m-0">
            No Objection Certificate
          </p>
          <p className="text-zinc-700 leading-relaxed m-0">
            I, the undersigned owner of the property situated at the address mentioned below, hereby
            confirm that I have no objection to the use of the said premises as the Registered
            Office of the Company/LLP.
          </p>
          <div className="space-y-4 text-sm">
            {[
              ["Property Address", "________________________________________"],
              ["Company/LLP Name", "________________________________________"],
            ].map(([label, line]) => (
              <div key={label}>
                <p className="font-medium text-zinc-800 mb-1">{label}:</p>
                <p className="text-zinc-500 m-0 font-mono">{line}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-700 leading-relaxed m-0">
            I further confirm that the company is permitted to use the above address for all
            official and statutory purposes.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-600 pt-2 border-t border-zinc-200">
            {[
              ["Owner Name", "________________"],
              ["Signature", "________________"],
              ["Date", "________________"],
              ["Place", "________________"],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <span className="font-medium text-zinc-800 shrink-0">{label}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <GeneratorCta label="Generate NOC From This Sample" />

        {/* Format variants */}
        <SectionHeading id="formats">NOC Download Formats</SectionHeading>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              title: "NOC Format Word",
              text: "Editable owner NOC format for typing details before printing.",
              href: "/noc-word-format",
            },
            {
              title: "NOC Format PDF",
              text: "Print-ready PDF for owner signature and SPICe+ upload.",
              href: "/noc-pdf",
            },
            {
              title: "NOC Sample",
              text: "Filled example for reference before generating your own.",
              href: "/noc-sample",
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

        <SectionHeading id="documents">Documents Commonly Submitted Along with NOC</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          In most cases, the following are also provided:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          {[
            "Electricity bill (not older than 2 months, in owner's name)",
            "Property tax receipt or water bill",
            "Sale deed (if self-owned by owner filing NOC for tenant)",
            "Rent agreement / lease deed",
            "Owner's identity and address proof",
          ].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed italic">
          Requirements may vary depending on the filing and business structure.
        </p>

        <SectionHeading id="pvt-ltd">NOC for Private Limited Company</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          During Private Limited Company incorporation, promoters often use:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          <li>Residential property (with owner NOC)</li>
          <li>Commercial or rented premises</li>
          <li>Shared office or co-working space</li>
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed">
          An <strong>NOC for company registration</strong> from the property owner helps establish
          authorization to use the address on the COI and MCA master data.
        </p>

        <SectionHeading id="llp">NOC for LLP Registration</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          LLPs also provide address-related documents during FiLLiP. An NOC from the owner is
          commonly used when:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-8">
          <li>The office is rented or leased</li>
          <li>The office belongs to a partner or family member</li>
          <li>The property is shared among multiple businesses</li>
        </ul>

        <SectionHeading id="mistakes">Common Mistakes While Preparing an NOC</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              title: "Incorrect Property Address",
              text: "Address must exactly match utility bill and rent agreement.",
            },
            {
              title: "Missing Owner Signature",
              text: "Unsigned NOCs are rejected by ROC.",
            },
            {
              title: "Incomplete Property Details",
              text: "Clearly identify the premises being authorized.",
            },
            {
              title: "Wrong Company Name",
              text: "Business name must match SPICe+ / FiLLiP application.",
            },
            {
              title: "Missing Date",
              text: "Always include execution date and place.",
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

        <SectionHeading id="benefits">Benefits of Using an Online NOC Generator</SectionHeading>
        <ul className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            "Save time on every incorporation",
            "Reduce drafting and formatting errors",
            "Generate professional owner consent letters",
            "Ensure consistent formatting across clients",
            "Simplify SPICe+ and FiLLiP workflows",
            "Improve documentation quality for ROC",
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
            { icon: Sparkles, title: "Startup Founders", text: "Prepare incorporation documents quickly." },
            { icon: Building2, title: "Chartered Accountants", text: "Generate NOCs for clients." },
            { icon: Users, title: "Company Secretaries", text: "Handle incorporation documentation efficiently." },
            { icon: Scale, title: "Legal Professionals", text: "Create standardized NOC formats." },
            { icon: FileText, title: "Consultants", text: "Support company registration projects." },
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
            Related incorporation documents
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "DIR-2 format", href: "/dir-2-format" },
              { label: "Board resolution format", href: "/board-resolution-format" },
              { label: "LLP Form 9", href: "/llp-form-9-format" },
              { label: "Specimen signature card", href: "/specimen-signature-card" },
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
            Generate NOC for Registered Office Online
          </h2>
          <p className="text-lg text-zinc-700 mb-4 max-w-2xl mx-auto">
            Avoid manually drafting NOCs every time you incorporate a company or LLP.
          </p>
          <p className="text-lg text-zinc-700 mb-10 max-w-2xl mx-auto">
            Use ComplianceDraft&apos;s NOC Generator to create professional No Objection Certificates
            within minutes. Generate, review, and download instantly.
          </p>
          <Link
            href={GENERATOR_URL}
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#1A2E7E] rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1"
          >
            Generate NOC Online
            <ArrowRight className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
