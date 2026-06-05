import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getToolsByCategory } from "@/lib/tools/registry";
import type { ToolCategoryId } from "@/lib/tools/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return {};
  return {
    title: `${category.name} Templates & Forms`,
    description: `${category.summary} Download, edit and generate legally compliant drafts in Word & PDF formats.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) notFound();

  const tools = getToolsByCategory(categoryId as ToolCategoryId);

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-semibold tracking-tight">
            Compliance Drafting Tools
          </Link>
          <nav className="flex items-center gap-2 text-sm text-zinc-600">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={`rounded-md px-2 py-1 hover:bg-zinc-100 hover:text-zinc-900 ${
                  c.id === category.id ? "bg-zinc-100 text-zinc-900" : ""
                }`}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {category.name}
          </h1>
          <p className="text-zinc-600">{category.summary}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.id}
              href={`/tools/${t.id}`}
              className="rounded-xl border bg-white p-5 hover:border-zinc-300"
            >
              <div className="text-sm font-medium text-zinc-900">{t.title}</div>
              <div className="mt-2 text-sm text-zinc-600">{t.summary}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

