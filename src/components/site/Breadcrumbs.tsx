import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-xs font-medium">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? (
              <span className="text-[#d9d9d9]" aria-hidden>
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="text-[#888888] hover:text-black transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-black">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
