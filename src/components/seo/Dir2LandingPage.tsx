import type { ReactNode } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  FileText,
  Scale,
  Sparkles,
  Users,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import FaqSection from "./FaqSection";
import GeneratorCta from "./GeneratorCta";

const GENERATOR_URL = "/dir2";

const FAQS = [
  {
    question: "What is DIR-2?",
    answer:
      "DIR-2 is a consent form through which an individual agrees to act as a director of a company under the Companies Act, 2013.",
  },
  {
    question: "Is DIR-2 mandatory?",
    answer:
      "Yes. DIR-2 is required under Section 152(5) read with Rule 8 whenever a person is appointed as a director.",
  },
  {
    question: "Who signs DIR-2?",
    answer: "The proposed director personally signs the consent form before appointment.",
  },
  {
    question: "Can DIR-2 be generated online?",
    answer:
      "Yes. ComplianceDraft's DIR-2 Generator creates a professionally formatted consent form you can download as PDF or Word.",
  },
  {
    question: "Is DIR-2 required during company incorporation?",
    answer:
      "Yes. It is part of the SPICe+ incorporation document set for every first director of a private or public company.",
  },
  {
    question: "What information is required for DIR-2?",
    answer:
      "Name, father's name, address, date of birth, DIN (if allotted), PAN, occupation, other directorships, declaration of non-disqualification, and signature.",
  },
  {
    question: "What is the difference between DIR-2 and DIN?",
    answer:
      "DIR-2 is consent to act as director. DIN is the unique Director Identification Number allotted by MCA — both are needed but serve different purposes.",
  },
  {
    question: "Is notarisation required on DIR-2?",
    answer:
      "Generally not for Indian nationals. Physical signature scanned and attached to MCA forms is standard practice.",
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

export default function Dir2LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1A2E7E] selection:text-white">
      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-mesh-gradient-1">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-6">
            <FileText className="w-4 h-4 text-[#1A2E7E]" />
            <span className="text-sm font-medium text-zinc-800">MCA · SPICe+ Ready</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.1rem] font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
            DIR-2 Format:{" "}
            <span className="text-[#1A2E7E]">Director Consent Form, Sample &amp; Free Generator</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-700 leading-relaxed mb-4 max-w-3xl mx-auto">
            Download <strong>DIR-2 format</strong>, view a director consent form sample, and
            generate a SPICe+-ready <strong>DIR-2 for company incorporation</strong> — PDF, Word,
            and print in minutes.
          </p>
          <p className="text-base text-zinc-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            For startup founders, CAs, CSs, and consultants filing Private Limited Company
            incorporation and director appointments.
          </p>
          <div className="relative z-10">
            <GeneratorCta href={GENERATOR_URL} label="Generate DIR-2 Online" large />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Section 152(5) aligned
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              DIN &amp; PAN fields
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
          DIR-2 Format – Download Director Consent Form &amp; Generate Online
        </SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          DIR-2 is one of the most important documents required during the incorporation of a company
          in India. Before an individual can be appointed as a director, they must provide consent
          to act as a director — generally through Form DIR-2 under the Companies (Appointment and
          Qualification of Directors) Rules, 2014.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Whether you are incorporating a Private Limited Company, appointing an additional
          director, or preparing MCA filing documents, having the correct{" "}
          <strong>DIR-2 consent form</strong> format is essential.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-8">
          With ComplianceDraft&apos;s DIR-2 Generator, you can instantly create a professionally
          drafted director consent form without manually preparing the document from scratch.
        </p>
        <GeneratorCta href={GENERATOR_URL} label="Open DIR-2 Generator" />

        <SectionHeading id="what-is">What Is DIR-2?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          DIR-2 is a consent letter provided by an individual agreeing to act as a director of a
          company. The form serves as evidence that the proposed director has voluntarily accepted
          the appointment and agrees to undertake the duties and responsibilities of the position.
        </p>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          <strong>DIR-2</strong> is commonly used during:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-6">
          <li>Private Limited Company incorporation (SPICe+)</li>
          <li>Director appointment and additional director appointment</li>
          <li>Company registration documentation</li>
          <li>MCA filing processes (DIR-12 for post-incorporation appointments)</li>
        </ul>

        <SectionHeading id="why-required">Why Is DIR-2 Required?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          The Companies Act, 2013 requires consent from individuals before they can be appointed as
          directors. The purpose of the <strong>director consent form</strong> is to:
        </p>
        <ul className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            "Confirm acceptance of directorship",
            "Verify willingness to act as director",
            "Maintain corporate governance records",
            "Support incorporation documentation",
            "Assist in regulatory compliance",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <SectionHeading id="when-required">When Is DIR-2 Required?</SectionHeading>
        <div className="space-y-5">
          {[
            {
              title: "Company Incorporation",
              text: "Every proposed director provides consent during SPICe+ incorporation of a new company.",
            },
            {
              title: "Appointment of Additional Director",
              text: "When a company appoints a new director after incorporation — filed with DIR-12 within 30 days.",
            },
            {
              title: "Change in Board Composition",
              text: "When new directors join the board and their consent must be documented.",
            },
            {
              title: "MCA Filing Requirements",
              text: "DIR-2 forms part of the incorporation and ongoing compliance documentation package.",
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

        <SectionHeading id="who-signs">Who Needs to Sign DIR-2?</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          Any individual proposed to be appointed as a director must personally sign the consent
          form. This includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          <li>Promoter directors and first directors at incorporation</li>
          <li>Additional directors appointed by the board</li>
          <li>Non-executive and independent directors</li>
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed font-medium">
          The individual must personally sign — a company representative cannot sign on their behalf.
        </p>

        <SectionHeading id="information">Information Included in DIR-2</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">
          A standard <strong>DIR-2 template</strong> typically contains:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-8">
          {[
            "Name of director and father's name",
            "Residential address",
            "Date of birth and nationality",
            "DIN (Director Identification Number), if allotted",
            "PAN number",
            "Occupation and contact details",
            "Other directorships and professional memberships",
            "Consent declaration and non-disqualification certificate",
            "Signature, date, and place",
          ].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>

        <SectionHeading id="sample">DIR-2 Format Sample</SectionHeading>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 mb-8">
          <p className="text-sm font-bold text-[#1A2E7E] uppercase tracking-wide mb-4">
            Consent to Act as Director
          </p>
          <p className="text-zinc-700 leading-relaxed mb-6">
            I hereby give my consent to act as a Director of the Company pursuant to the provisions
            of the Companies Act, 2013 and certify that I am not disqualified from being appointed
            as a Director under the applicable provisions of law.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-600">
            {[
              ["Name of Director", "________________"],
              ["DIN", "________________"],
              ["PAN", "________________"],
              ["Address", "________________"],
              ["Date", "________________"],
              ["Place", "________________"],
              ["Signature", "________________"],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2 border-b border-zinc-200 pb-2">
                <span className="font-medium text-zinc-800 shrink-0">{label}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <GeneratorCta href={GENERATOR_URL} label="Generate DIR-2 From This Sample" />

        {/* Format variants */}
        <SectionHeading id="formats">DIR-2 Download Formats</SectionHeading>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            {
              title: "DIR-2 Format Word",
              text: "Editable .docx for typing details before printing. Ideal for CAs who customise per client.",
              href: "/dir-2-word-format",
            },
            {
              title: "DIR-2 PDF Download",
              text: "Print-ready PDF for signing and scanning. Most common format for SPICe+ uploads.",
              href: "/dir-2-pdf-download",
            },
            {
              title: "DIR-2 Sample",
              text: "Filled example showing correct field usage before you generate your own.",
              href: "/dir-2-sample",
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

        <SectionHeading id="documents">Documents Commonly Required Along with DIR-2</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-4">DIR-2 is often submitted with:</p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-600 mb-4">
          {[
            "PAN card copy",
            "Aadhaar card copy",
            "Passport (for foreign nationals)",
            "Address proof",
            "Director Identification Number (DIN) allotment proof",
            "Declaration documents and incorporation forms",
          ].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="text-lg text-zinc-600 leading-relaxed italic">
          Requirements may vary depending on the nature of the company and filing process.
        </p>

        <SectionHeading id="mistakes">Common Mistakes While Preparing DIR-2</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              title: "Incorrect Director Information",
              text: "Name and personal details must match PAN and official records.",
            },
            {
              title: "Missing Signature",
              text: "Unsigned consent forms are rejected by ROC.",
            },
            {
              title: "Wrong DIN Details",
              text: "Verify DIN allotment status before filing.",
            },
            {
              title: "Outdated Templates",
              text: "Use current DIR-2 format aligned with Rule 8 requirements.",
            },
            {
              title: "Incomplete Information",
              text: "Double-check address, directorships, and declaration fields.",
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

        <SectionHeading id="benefits">Benefits of Using a DIR-2 Generator</SectionHeading>
        <ul className="grid sm:grid-cols-2 gap-3 mb-8">
          {[
            "Save time on repetitive drafting",
            "Reduce errors in director particulars",
            "Ensure format consistency across directors",
            "Generate professional SPICe+-ready documents",
            "Maintain compliance records",
            "Simplify incorporation workflows for CAs and CSs",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-zinc-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <GeneratorCta href={GENERATOR_URL} label="Generate DIR-2 Online" large />

        <SectionHeading id="who-can-use">Who Can Use This Tool?</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Sparkles, title: "Startup Founders", text: "Prepare incorporation documents quickly." },
            { icon: Building2, title: "Chartered Accountants", text: "Generate DIR-2 forms for clients." },
            { icon: Users, title: "Company Secretaries", text: "Streamline incorporation and compliance." },
            { icon: Scale, title: "Legal Professionals", text: "Create standardized consent forms." },
            { icon: FileText, title: "Business Consultants", text: "Support company registration projects." },
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

        <SectionHeading id="dir2-vs-din">Difference Between DIR-2 and DIN</SectionHeading>
        <p className="text-lg text-zinc-600 leading-relaxed mb-6">
          Many people confuse DIR-2 with DIN. They serve different purposes:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#1A2E7E]/20 bg-[#1A2E7E]/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#1A2E7E]" />
              <h3 className="font-bold text-zinc-900 m-0">DIR-2</h3>
            </div>
            <ul className="list-disc pl-5 text-zinc-600 space-y-2 m-0">
              <li>Consent to act as director</li>
              <li>Signed by proposed director</li>
              <li>Used during appointment process</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-6 h-6 text-zinc-500" />
              <h3 className="font-bold text-zinc-900 m-0">DIN</h3>
            </div>
            <ul className="list-disc pl-5 text-zinc-600 space-y-2 m-0">
              <li>Director Identification Number</li>
              <li>Unique ID allotted by MCA</li>
              <li>Applied via DIR-3 / SPICe+ — not the same as consent</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            Related incorporation documents
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "NOC registered office", href: "/noc-for-registered-office" },
              { label: "Board resolution format", href: "/board-resolution-format" },
              { label: "Specimen signature card", href: "/specimen-signature-card" },
              { label: "What is DIR-2?", href: "/what-is-dir-2" },
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
            Generate DIR-2 Online
          </h2>
          <p className="text-lg text-zinc-700 mb-4 max-w-2xl mx-auto">
            Preparing incorporation documents should not be complicated.
          </p>
          <p className="text-lg text-zinc-700 mb-10 max-w-2xl mx-auto">
            Use ComplianceDraft&apos;s DIR-2 Generator to create professional director consent forms
            within minutes. Generate, review, and download instantly.
          </p>
          <GeneratorCta href={GENERATOR_URL} label="Generate DIR-2 Online" large arrow="arrow" />
        </div>
      </section>
    </div>
  );
}
