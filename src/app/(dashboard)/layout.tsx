"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import TopNav from "@/components/dashboard/TopNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { LayoutDashboard, Building2, GitBranch } from "lucide-react";

const BOTTOM_NAV_ITEMS = [
  { href: "/", label: "Workspace", icon: LayoutDashboard, exact: true },
  { href: "/companies", label: "Companies", icon: Building2, exact: false },
  { href: "/incorporation", label: "Workflows", icon: GitBranch, exact: false },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
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
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F9FF" }}>
      {/* Persistent left sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Slim top bar */}
        <TopNav onMenuToggle={() => setSidebarOpen((o) => !o)} />

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto px-[6px] py-4 sm:px-6 sm:py-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-[#F8F9FF] hidden md:block" style={{ borderColor: "#C4C6D0" }}>
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: "#1A1C1E" }}>ComplianceDraft</span>
              <span className="text-xs" style={{ color: "#44474E" }}>· Built for speed and precision.</span>
            </div>
            <div className="flex flex-wrap gap-5 text-xs font-medium" style={{ color: "#44474E" }}>
              <Link href="/terms" className="transition-colors hover:opacity-70">Terms of Service</Link>
              <Link href="/privacy" className="transition-colors hover:opacity-70">Privacy Policy</Link>
              <Link href="/contact" className="transition-colors hover:opacity-70">Contact Us</Link>
            </div>
            <div className="text-xs" style={{ color: "#44474E" }}>
              © {new Date().getFullYear()} ComplianceDraft
            </div>
          </div>
        </footer>
        {/* ── Mobile bottom navigation ── */}
        <nav className="mobile-bottom-nav flex items-center justify-around md:hidden" aria-label="Mobile navigation">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-[10px] font-semibold transition-colors ${
                  active ? "text-[#1A2E7E]" : "text-slate-400"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "text-[#1A2E7E]" : "text-slate-400"}`} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
