import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPLIANCE_CATEGORIES, COMPLIANCE_ITEMS, getCategoryInfo, getComplianceItems } from "@/lib/calendars/compliance/complianceData";
import ComplianceHubClient from "@/components/compliance/ComplianceHubClient";
import ComplianceSchema from "@/components/compliance/ComplianceSchema";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return COMPLIANCE_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const catInfo = getCategoryInfo(category);

  if (!catInfo) {
    return { title: "Category Not Found" };
  }

  const url = `https://www.compliancedraft.co.in/compliance-calendar/${catInfo.slug}`;

  return {
    title: `${catInfo.name} Calendar 2026 – Due Dates & Filing Schedule`,
    description: catInfo.description,
    keywords: [`${catInfo.name} due dates 2026`, `${catInfo.name} filing schedule`],
    alternates: { canonical: url },
  };
}

export default async function ComplianceCategoryPage({ params }: Props) {
  const { category } = await params;
  const catInfo = getCategoryInfo(category);

  if (!catInfo) {
    notFound();
  }

  const items = getComplianceItems(catInfo.id);

  return (
    <>
      <ComplianceSchema items={items} title={`${catInfo.name} Calendar 2026`} />
      <ComplianceHubClient
        initialItems={items}
        activeCategory={catInfo.id}
        headingTitle={`${catInfo.name} Calendar 2026`}
        headingDescription={catInfo.description}
      />
    </>
  );
}
