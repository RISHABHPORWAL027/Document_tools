import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getTool } from "@/lib/tools/registry";
import ToolRunner from "@/components/ToolRunner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ toolId: string }>;
}): Promise<Metadata> {
  const { toolId } = await params;
  const tool = getTool(toolId);
  if (!tool) return {};
  return {
    title: `${tool.title} Generator (Word & PDF)`,
    description: `${tool.summary} Instantly customize and download legally compliant, auto-formatted template files.`,
    keywords: tool.keywords || [],
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = await params;
  const tool = getTool(toolId);
  if (!tool) notFound();

  const category = CATEGORIES.find((c) => c.id === tool.categoryId);

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-semibold tracking-tight">
              Compliance Drafting Tools
            </Link>
            <div className="text-sm text-zinc-500">/</div>
            <Link
              href={`/category/${tool.categoryId}`}
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              {category?.name ?? tool.categoryId}
            </Link>
          </div>
          <nav className="hidden items-center gap-2 text-sm text-zinc-600 md:flex">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={`rounded-md px-2 py-1 hover:bg-zinc-100 hover:text-zinc-900 ${
                  c.id === tool.categoryId ? "bg-zinc-100 text-zinc-900" : ""
                }`}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DigitalDocument",
              "name": `${tool.title} Generator`,
              "description": tool.summary,
            }),
          }}
        />
        <h1 className="text-2xl font-semibold tracking-tight">{tool.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600">{tool.summary}</p>

        <div className="mt-6">
          <ToolRunner toolId={tool.id} />
        </div>
      </main>
    </div>
  );
}

