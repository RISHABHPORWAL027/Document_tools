import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { resolveGeneratorUrl } from "@/data/seoDocuments";

interface RelatedDocsProps {
  relatedDocs: string[];
  currentDocumentName: string;
}

export default function RelatedDocuments({ relatedDocs, currentDocumentName }: RelatedDocsProps) {
  if (!relatedDocs || relatedDocs.length === 0) return null;

  const relatedLinks = relatedDocs
    .filter((name) => name !== currentDocumentName)
    .map((name) => {
      const generatorUrl = resolveGeneratorUrl(name);
      if (!generatorUrl || generatorUrl === "#") return null;
      return { name, generatorUrl };
    })
    .filter((link): link is { name: string; generatorUrl: string } => link !== null);

  if (relatedLinks.length === 0) return null;

  return (
    <section className="py-16 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-zinc-900">
            Related Documents
          </h2>
          <p className="mt-2 text-zinc-600">
            Explore other formats and templates to complete your compliance requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedLinks.map((doc) => (
            <Link
              key={doc.name}
              href={doc.generatorUrl}
              className="group block p-6 bg-white border border-zinc-200 rounded-2xl transition-all hover:border-[#1A2E7E] hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-[#1A2E7E]/10 text-[#1A2E7E] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-[#1A2E7E] transition-colors">
                {doc.name}
              </h3>
              <div className="flex items-center text-[#1A2E7E] text-sm font-medium">
                Open generator
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
