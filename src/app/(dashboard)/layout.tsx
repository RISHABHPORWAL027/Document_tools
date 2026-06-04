import TopNav from "@/components/dashboard/TopNav";
import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F9FF" }}>
      {/* Persistent left sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Slim top bar */}
        <TopNav />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-[#F8F9FF]" style={{ borderColor: "#C4C6D0" }}>
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
      </div>
    </div>
  );
}
