import Link from "next/link";
import TopNav from "@/components/dashboard/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f6f6]">
      <TopNav />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-5 px-4 py-6 sm:px-6">
        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Footer — Uber-style */}
      <footer className="border-t border-[#eeeeee] bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-sm text-white text-xs font-black"
              style={{ background: "#000000" }}
            >
              CD
            </span>
            <span className="text-sm font-bold tracking-tight text-black">
              ComplianceDraft
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-xs font-medium text-[#666666]">
            <Link href="/" className="hover:text-black transition-colors">
              Workspace
            </Link>
            <button type="button" className="hover:text-black transition-colors">
              Terms of Service
            </button>
            <button type="button" className="hover:text-black transition-colors">
              Privacy Policy
            </button>
            <button type="button" className="hover:text-black transition-colors">
              Help
            </button>
          </div>
          <div className="text-xs text-[#888888]">
            © {new Date().getFullYear()} ComplianceDraft
          </div>
        </div>
      </footer>
    </div>
  );
}
