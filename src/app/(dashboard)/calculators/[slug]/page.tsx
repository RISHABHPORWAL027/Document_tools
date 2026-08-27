import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CALCULATORS, getCalculatorBySlug } from "@/lib/calculators/registry";
import CalculatorSlugClient from "./CalculatorSlugClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CALCULATORS.map((calc) => ({
    slug: calc.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getCalculatorBySlug(slug);

  if (!config) {
    return {
      title: "Calculator Not Found – ComplianceDraft",
    };
  }

  const url = `https://www.compliancedraft.co.in/calculators/${config.slug}`;

  return {
    title: config.seoMeta.title,
    description: config.seoMeta.description,
    keywords: config.seoMeta.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.seoMeta.title,
      description: config.seoMeta.description,
      url,
      siteName: "ComplianceDraft",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.seoMeta.title,
      description: config.seoMeta.description,
    },
  };
}

export default async function CalculatorSlugPage({ params }: Props) {
  const { slug } = await params;
  const config = getCalculatorBySlug(slug);

  if (!config) {
    notFound();
  }

  return <CalculatorSlugClient slug={slug} />;
}
