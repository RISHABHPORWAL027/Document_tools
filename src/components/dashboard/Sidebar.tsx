"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Banknote,
  Receipt,
  Calculator,
  Calendar,
  CalendarDays,
  Sparkles,
} from "lucide-react";

const MAIN_NAV_ITEMS = [
  {
    href: "/",
    label: "Workspace",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/calculators",
    label: "Calculators",
    icon: Calculator,
    exact: false,
  },
  {
    href: "/master-data",
    label: "Entity Management",
    icon: Building2,
    exact: false,
  },
  {
    href: "/incorporation",
    label: "Workflows",
    icon: GitBranch,
    exact: false,
  },
  {
    href: "/payslips",
    label: "Payslips",
    icon: Banknote,
    exact: false,
  },
  {
    href: "/invoice",
    label: "Invoices",
    icon: Receipt,
    exact: false,
  },
];

const CALENDAR_NAV_ITEMS = [
  {
    href: "/calendar",
    label: "Master Calendar 2026",
    icon: CalendarDays,
    exact: true,
  },
  {
    href: "/holiday-calendar",
    label: "Holiday Calendar",
    icon: Calendar,
    exact: false,
  },
  {
    href: "/compliance-calendar",
    label: "Compliance Calendar",
    icon: CalendarDays,
    exact: false,
  },
  {
    href: "/leave-planner",
    label: "Leave Planner",
    icon: Sparkles,
    exact: false,
  },
];

interface SidebarProps {
  /** Mobile drawer mode: whether the drawer is open */
  isOpen?: boolean;
  /** Mobile drawer mode: called to close the drawer */
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-close mobile drawer on navigation
  useEffect(() => {
    onClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    if (href === "/incorporation") {
      return (
        pathname.startsWith("/incorporation") ||
        pathname.startsWith("/gst") ||
        pathname.startsWith("/llp") ||
        pathname.startsWith("/noc-format") ||
        pathname.startsWith("/dir2") ||
        pathname.startsWith("/specimen-signature")
      );
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`sidebar-root flex flex-col transition-transform duration-300 ease-in-out shrink-0 bg-[#1A2E7E]
        fixed inset-y-0 left-0 z-50 md:static md:translate-x-0 md:z-30
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "md:w-[68px]" : "md:w-[240px]"}
        w-[280px] h-full min-h-screen
      `}
    >
      {/* Desktop collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3 top-7 h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-110 z-50 bg-[#F8F9FF] border-[#C4C6D0] text-[#1A2E7E]"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* ── Logo & Mobile Close Header ── */}
      <div className="flex items-center justify-between border-b border-[#44474E] py-[18px] px-5 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/Assets/logo.webp"
            alt="ComplianceDraft Logo"
            className="h-8 w-8 shrink-0 object-contain"
          />
          <div className={`min-w-0 transition-all duration-300 ${isCollapsed ? "md:opacity-0 md:w-0" : "opacity-100 w-auto"}`}>
            <h1 className="text-[10px] font-bold truncate max-w-full text-[#F8F9FF]">ComplianceDraft</h1>
            <div className="text-[10px] leading-tight mt-0.5 whitespace-nowrap text-[#CBDBF5]">Professional Suite</div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4" aria-label="Sidebar navigation">
        {/* Main Nav Section */}
        <div className="space-y-0.5">
          {MAIN_NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
                className={`group flex items-center rounded-lg py-3 md:py-2.5 text-sm font-medium transition-all duration-150 overflow-hidden ${
                  active ? "bg-white/10 text-[#F8F9FF]" : "hover:bg-white/5 text-[#CBDBF5]"
                } ${isCollapsed ? "md:justify-center md:px-0 gap-3 px-3" : "gap-3 px-3"}`}
                style={
                  active && !isCollapsed
                    ? { borderLeft: "2px solid #CBDBF5", paddingLeft: "10px" }
                    : { borderLeft: "2px solid transparent", paddingLeft: "10px" }
                }
              >
                <item.icon
                  className="h-4 w-4 shrink-0 transition-colors"
                  style={{ color: active ? "#F8F9FF" : "inherit" }}
                  aria-hidden
                />
                <span className={`truncate transition-all duration-300 ${isCollapsed ? "md:hidden" : "inline"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* All Calendars Section Grouped Together */}
        <div className="pt-2 border-t border-white/10 space-y-0.5">
          <div className={`px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-200/60 ${isCollapsed ? "md:hidden" : "block"}`}>
            Calendars & Schedules
          </div>

          {CALENDAR_NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
                className={`group flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-150 overflow-hidden ${
                  active ? "bg-white/10 text-[#F8F9FF]" : "hover:bg-white/5 text-[#CBDBF5]"
                } ${isCollapsed ? "md:justify-center md:px-0 gap-3 px-3" : "gap-3 px-3"}`}
                style={
                  active && !isCollapsed
                    ? { borderLeft: "2px solid #CBDBF5", paddingLeft: "10px" }
                    : { borderLeft: "2px solid transparent", paddingLeft: "10px" }
                }
              >
                <item.icon
                  className="h-4 w-4 shrink-0 transition-colors"
                  style={{ color: active ? "#F8F9FF" : "inherit" }}
                  aria-hidden
                />
                <span className={`truncate transition-all duration-300 ${isCollapsed ? "md:hidden" : "inline"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Create Button ── */}
      <div className="border-t border-[#44474E] p-4">
        <Link
          href="/companies/new"
          id="sidebar-create-document"
          onClick={onClose}
          className="w-full flex items-center justify-center font-bold text-sm transition-all rounded-xl shadow-md gap-2 py-3 px-4 bg-[#F8F9FF] text-[#1A2E7E]"
          title={isCollapsed ? "New Entity" : undefined}
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className={`truncate transition-all duration-300 ${isCollapsed ? "md:hidden" : "inline"}`}>
            New Entity
          </span>
        </Link>
      </div>
    </aside>
  );
}
