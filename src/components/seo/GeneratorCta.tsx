import { ArrowRight, ChevronRight } from "lucide-react";
import { inAppHref } from "@/data/seoDocuments";

interface GeneratorCtaProps {
  href: string;
  label: string;
  large?: boolean;
  arrow?: "chevron" | "arrow";
}

/** Full-page navigation to live generators (avoids client-router issues across route groups). */
export default function GeneratorCta({
  href,
  label,
  large = false,
  arrow = "chevron",
}: GeneratorCtaProps) {
  const dest = inAppHref(href);

  return (
    <a
      href={dest}
      className={
        large
          ? "inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-[#1A2E7E] rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-0.5"
          : "inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#1A2E7E] rounded-xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5"
      }
    >
      {label}
      {arrow === "arrow" ? (
        <ArrowRight className="w-6 h-6 ml-2" />
      ) : (
        <ChevronRight className="w-5 h-5 ml-2" />
      )}
    </a>
  );
}
