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
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Workspace",
    icon: LayoutDashboard,
    exact: true,
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

interface SidebarProps {
  /** Mobile drawer mode: whether the drawer is open */
  isOpen?: boolean;
  /** Mobile drawer mode: called to close the drawer */
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-close mobile drawer on navigation
  useEffect(() => {
    onClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
        pathname.startsWith("/dir-2-format") ||
        pathname.startsWith("/dir2") ||
        pathname.startsWith("/tools")
      );
    }
    return pathname.startsWith(href);
  }

  const sidebarContent = (isMobileDrawer: boolean) => (
    <aside
      className={
        isMobileDrawer
          ? "mobile-drawer-panel flex h-full flex-col"
          : `hidden md:flex h-screen shrink-0 flex-col sticky top-0 z-30 transition-all duration-300 relative ${isCollapsed ? "w-[76px]" : "w-[220px]"}`
      }
      style={{ backgroundColor: "#1A2E7E" }}
    >
      {/* Desktop collapse toggle */}
      {!isMobileDrawer && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-110 z-50"
          style={{ backgroundColor: "#F8F9FF", borderColor: "#C4C6D0", color: "#1A2E7E" }}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      )}

      {/* ── Logo ── */}
      <div
        className={`flex items-center border-b py-[18px] transition-all overflow-hidden ${
          isMobileDrawer
            ? "px-5 gap-3 justify-between"
            : isCollapsed
              ? "px-5 justify-center"
              : "px-5 gap-3"
        }`}
        style={{ borderColor: "#44474E" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/Assets/logo.webp"
            alt="ComplianceDraft Logo"
            className="h-8 w-8 shrink-0 object-contain"
          />
          <div
            className={`min-w-0 transition-all duration-300 ${
              !isMobileDrawer && isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            <h1 className="text-[10px] font-bold truncate max-w-full" style={{ color: "#F8F9FF" }}>ComplianceDraft</h1>
            <div className="text-[10px] leading-tight mt-0.5 whitespace-nowrap" style={{ color: "#CBDBF5" }}>Professional Suite</div>
          </div>
        </div>

        {/* Mobile close button */}
        {isMobileDrawer && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav
        className={`flex-1 overflow-y-auto py-4 space-y-0.5 ${
          isMobileDrawer ? "px-3" : isCollapsed ? "px-2" : "px-3"
        }`}
        aria-label="Sidebar navigation"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const collapsed = !isMobileDrawer && isCollapsed;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center rounded-lg py-3 md:py-2.5 text-sm font-medium transition-all duration-150 overflow-hidden ${
                active ? "bg-white/10" : "hover:bg-white/5"
              } ${collapsed ? "justify-center px-0" : "gap-3 px-3"}`}
              style={
                active
                  ? { color: "#F8F9FF", borderLeft: collapsed ? "none" : "2px solid #CBDBF5", paddingLeft: collapsed ? "0" : "10px" }
                  : { color: "#CBDBF5", borderLeft: collapsed ? "none" : "2px solid transparent", paddingLeft: collapsed ? "0" : "10px" }
              }
            >
              <item.icon
                className="h-4 w-4 shrink-0 transition-colors"
                style={{ color: active ? "#F8F9FF" : "inherit" }}
                aria-hidden
              />
              <span className={`truncate transition-all duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Create button ── */}
      <div
        className={`border-t transition-all ${
          isMobileDrawer ? "p-4" : isCollapsed ? "p-3" : "p-4"
        }`}
        style={{ borderColor: "#44474E" }}
      >
        <Link
          href="/companies/new"
          id="sidebar-create-document"
          title={!isMobileDrawer && isCollapsed ? "Create New Document" : undefined}
          className={`flex items-center justify-center rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 overflow-hidden ${
            !isMobileDrawer && isCollapsed ? "w-10 h-10 mx-auto" : "w-full gap-2 py-2.5 text-sm"
          }`}
          style={{ backgroundColor: "#F8F9FF", color: "#1A2E7E" }}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden />
          <span
            className={`truncate transition-all duration-300 ${
              !isMobileDrawer && isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            Create New Document
          </span>
        </Link>
      </div>

    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always rendered, hidden on mobile via CSS */}
      {sidebarContent(false)}

      {/* Mobile drawer — rendered only when isOpen is true */}
      {isOpen && (
        <>
          <div className="mobile-drawer-backdrop md:hidden" onClick={onClose} aria-hidden />
          <div className="md:hidden">{sidebarContent(true)}</div>
        </>
      )}
    </>
  );
}
