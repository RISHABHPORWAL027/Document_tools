"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  Settings,
  Plus,
  FileText,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Workspace",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/companies",
    label: "Companies",
    icon: Building2,
    exact: false,
  },
  {
    href: "/incorporation",
    label: "Workflows",
    icon: GitBranch,
    exact: false,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    // Special: Workflows covers incorporation, gst, llp, noc, etc.
    if (href === "/incorporation") {
      return (
        pathname.startsWith("/incorporation") ||
        pathname.startsWith("/gst") ||
        pathname.startsWith("/llp") ||
        pathname.startsWith("/noc") ||
        pathname.startsWith("/specimen") ||
        pathname.startsWith("/dir2") ||
        pathname.startsWith("/tools")
      );
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="flex h-screen w-[220px] shrink-0 flex-col sticky top-0 z-30"
      style={{ backgroundColor: "#1A2E7E" }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 border-b px-5 py-[18px]" style={{ borderColor: "#44474E" }}>
        <img
          src="/Assets/logo.webp"
          alt="ComplianceDraft Logo"
          className="h-8 w-8 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold leading-tight" style={{ color: "#F8F9FF" }}>
            ComplianceDraft
          </div>
          <div className="text-[10px] leading-tight mt-0.5" style={{ color: "#CBDBF5" }}>
            Professional Suite
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Sidebar navigation">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
              style={
                active
                  ? { color: "#F8F9FF", borderLeft: "2px solid #CBDBF5", paddingLeft: "10px" }
                  : { color: "#CBDBF5", borderLeft: "2px solid transparent", paddingLeft: "10px" }
              }
            >
              <item.icon
                className="h-4 w-4 shrink-0 transition-colors"
                style={{ color: active ? "#F8F9FF" : "inherit" }}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Create button ── */}
      <div className="border-t p-4" style={{ borderColor: "#44474E" }}>
        <Link
          href="/companies/new"
          id="sidebar-create-document"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#F8F9FF", color: "#1A2E7E" }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Create New Document
        </Link>
      </div>
    </aside>
  );
}
