import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs font-medium text-zinc-500">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 ? (
              <span className="text-zinc-300" aria-hidden>
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="text-zinc-600 hover:text-blue-700 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
