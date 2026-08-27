import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildBreadcrumbSchema,
  inAppHref,
  seoDocuments,
  uniqueGeneratorLinks,
} from "@/data/seoDocuments";
import Link from "next/link";
import SeoLandingTemplate from "@/components/seo/SeoLandingTemplate";
import SalarySlipLandingPage from "@/components/seo/SalarySlipLandingPage";
import BoardResolutionBankLandingPage from "@/components/seo/BoardResolutionBankLandingPage";
import Dir2LandingPage from "@/components/seo/Dir2LandingPage";
import NocRegisteredOfficeLandingPage from "@/components/seo/NocRegisteredOfficeLandingPage";
import MrlLandingPage from "@/components/seo/MrlLandingPage";
import AppointmentLetterLandingPage from "@/components/seo/AppointmentLetterLandingPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = seoDocuments.find((d) => d.slug === slug);

  if (!doc) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: doc.metaTitle,
    description: doc.metaDescription,
    alternates: {
      canonical: `https://www.compliancedraft.co.in/${doc.slug}`,
    },
    openGraph: {
      title: doc.metaTitle,
      description: doc.metaDescription,
      url: `https://www.compliancedraft.co.in/${doc.slug}`,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  return seoDocuments.map((doc) => ({
    slug: doc.slug,
  }));
}

export default async function SeoPage({ params }: Props) {
  const { slug } = await params;
  const doc = seoDocuments.find((d) => d.slug === slug);

  if (!doc) {
    notFound();
  }

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": doc.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const breadcrumbSchema = buildBreadcrumbSchema(doc);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.metaTitle,
    description: doc.metaDescription,
    author: { "@type": "Organization", name: "ComplianceDraft" },
    publisher: {
      "@type": "Organization",
      name: "ComplianceDraft",
      url: "https://www.compliancedraft.co.in",
    },
    mainEntityOfPage: `https://www.compliancedraft.co.in/${doc.slug}`,
  };

  const isSalarySlip = slug === "salary-slip-format";
  const isBankResolution = slug === "board-resolution-for-bank-account-opening";
  const isDir2 = slug === "dir-2-format";
  const isNocRegisteredOffice = slug === "noc-for-registered-office";
  const isMrl = slug === "management-representation-letter-format";
  const isAppointmentLetter = slug === "appointment-letter-format";

  const PageContent = isSalarySlip ? (
    <SalarySlipLandingPage />
  ) : isBankResolution ? (
    <BoardResolutionBankLandingPage />
  ) : isDir2 ? (
    <Dir2LandingPage />
  ) : isNocRegisteredOffice ? (
    <NocRegisteredOfficeLandingPage />
  ) : isMrl ? (
    <MrlLandingPage />
  ) : isAppointmentLetter ? (
    <AppointmentLetterLandingPage />
  ) : (
    <SeoLandingTemplate doc={doc} />
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {PageContent}
      <section className="py-10 border-t border-slate-100 max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1A1C1E]">Free Financial & Salary Calculators</h2>
          <Link href="/calculators" className="text-xs font-semibold text-[#1A2E7E] hover:underline">
            View All 15 Calculators →
          </Link>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/calculators/in-hand-salary-calculator" className="p-4 border border-slate-200 rounded-xl bg-white hover:border-[#1A2E7E] hover:shadow-sm transition-all group">
            <span className="text-2xl block mb-1">💵</span>
            <div className="text-xs font-bold text-[#1A1C1E] group-hover:text-[#1A2E7E]">In-Hand Salary Calculator</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Calculate take-home pay from CTC</div>
          </Link>
          <Link href="/calculators/ctc-calculator" className="p-4 border border-slate-200 rounded-xl bg-white hover:border-[#1A2E7E] hover:shadow-sm transition-all group">
            <span className="text-2xl block mb-1">💼</span>
            <div className="text-xs font-bold text-[#1A1C1E] group-hover:text-[#1A2E7E]">CTC Breakdown Calculator</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Structure monthly gross & allowances</div>
          </Link>
          <Link href="/calculators/gst-calculator" className="p-4 border border-slate-200 rounded-xl bg-white hover:border-[#1A2E7E] hover:shadow-sm transition-all group">
            <span className="text-2xl block mb-1">🧾</span>
            <div className="text-xs font-bold text-[#1A1C1E] group-hover:text-[#1A2E7E]">GST Tax Calculator</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Inclusive & exclusive CGST / SGST</div>
          </Link>
          <Link href="/calculators/pf-calculator" className="p-4 border border-slate-200 rounded-xl bg-white hover:border-[#1A2E7E] hover:shadow-sm transition-all group">
            <span className="text-2xl block mb-1">🏦</span>
            <div className="text-xs font-bold text-[#1A1C1E] group-hover:text-[#1A2E7E]">EPF Interest Calculator</div>
            <div className="text-[11px] text-slate-500 mt-0.5">EPF 8.25% retirement corpus</div>
          </Link>
        </div>
      </section>
      <section className="py-12 border-t border-slate-100 max-w-6xl mx-auto px-6">
        <h2 className="text-xl font-bold mb-6">Live Document Generators</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {uniqueGeneratorLinks().map((d) => (
            <li key={d.documentName}>
              <Link
                href={inAppHref(d.generatorUrl)}
                className="block p-4 border border-slate-200 rounded-lg font-semibold text-blue-900 transition-colors hover:border-blue-500 hover:bg-blue-50/50"
              >
                {d.documentName}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
