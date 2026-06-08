import { Metadata } from "next";
import { notFound } from "next/navigation";
import { inAppHref, seoDocuments, uniqueGeneratorLinks } from "@/data/seoDocuments";
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

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.compliancedraft.co.in",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": doc.category,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": doc.documentName,
        "item": `https://www.compliancedraft.co.in/${doc.slug}`,
      },
    ],
  };

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
