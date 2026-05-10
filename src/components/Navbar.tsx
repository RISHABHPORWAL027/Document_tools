"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TOOLS = [
  { href: "/", label: "DIR-2 Consent" },
  { href: "/specimen-signature", label: "Specimen Signature" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-zinc-900"
          >
            Compliance Drafting Tools
          </Link>
          <span className="hidden text-xs text-zinc-400 md:inline">
            India · Phase 1
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {TOOLS.map((tool) => {
            const active = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {tool.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
