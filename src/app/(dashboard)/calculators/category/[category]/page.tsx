import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators/registry";
import { ArrowRight, ChevronRight, Home, Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ category: string }>;
}

const CATEGORY_NAMES: Record<string, { title: string; desc: string; keywords: string[] }> = {
  salary: {
    title: "Free Salary & Compensation Calculators India",
    desc: "Calculate in-hand salary, CTC breakdown, PF contributions, HRA tax exemption, and gratuity payouts accurately online.",
    keywords: ["Salary calculators India", "In-hand salary calculator", "CTC calculator", "EPF calculator", "HRA exemption calculator"],
  },
  finance: {
    title: "Free Finance & Investment Calculators India",
    desc: "Calculate GST taxes, loan EMIs, SIP mutual fund growth, bank FD maturity, and compound interest returns.",
    keywords: ["Finance calculators India", "GST calculator", "EMI calculator", "SIP calculator", "FD calculator"],
  },
  business: {
    title: "Free Small Business & Commercial Calculators",
    desc: "Calculate business break-even sales volume, profit margins, cost markups, customer discounts, and invoice payment due dates.",
    keywords: ["Business calculators", "Break-even calculator", "Profit margin calculator", "Discount calculator", "Invoice due date calculator"],
  },
};

export async function generateStaticParams() {
  return [
    { category: "salary" },
    { category: "finance" },
    { category: "business" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_NAMES[category];

  if (!meta) {
    return { title: "Category Not Found" };
  }

  const url = `https://www.compliancedraft.co.in/calculators/category/${category}`;

  return {
    title: `${meta.title} – ComplianceDraft`,
    description: meta.desc,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${meta.title} – ComplianceDraft`,
      description: meta.desc,
      url,
      siteName: "ComplianceDraft",
      type: "website",
    },
  };
}

export default async function CalculatorCategoryPage({ params }: Props) {
  const { category } = await params;
  const catMeta = CATEGORY_NAMES[category];

  if (!catMeta) {
    notFound();
  }

  const categoryCalculators = CALCULATORS.filter((c) => c.category === category);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/" className="flex items-center gap-1 hover:text-[#1A2E7E]">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/calculators" className="hover:text-[#1A2E7E]">
          Calculators
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-[#1A1C1E] font-semibold capitalize">{category} Calculators</span>
      </nav>

      {/* Category Header */}
      <div className="rounded-2xl border border-[#CBDBF5] bg-linear-to-br from-[#1A2E7E] to-[#12205B] p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span className="capitalize">{category} Tools Cluster</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{catMeta.title}</h1>
        <p className="text-xs sm:text-sm text-blue-100/90 mt-2 max-w-3xl">{catMeta.desc}</p>
      </div>

      {/* Grid of Category Calculators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {categoryCalculators.map((calc) => (
          <Link
            key={calc.id}
            href={`/calculators/${calc.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#1A2E7E] hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-3xl">{calc.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A2E7E] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {calc.categoryName}
                </span>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1A1C1E] group-hover:text-[#1A2E7E] transition-colors">
                  {calc.title}
                </h2>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {calc.shortDescription}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1A2E7E]">
              <span>Calculate Now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
