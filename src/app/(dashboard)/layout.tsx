import Link from "next/link";
import TopNav from "@/components/dashboard/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f8]">
      <TopNav />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-5 px-4 py-5">
        {/* Main content — grows so footer stays at viewport bottom */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Footer — flush to bottom of screen when content is short */}
      <footer className="border-t bg-white">


        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2 font-semibold text-zinc-700">
            <span>📋</span> ComplianceDraft
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="hover:text-zinc-700">
              Workspace
            </Link>
            <button type="button" className="hover:text-zinc-700">
              Terms of Service
            </button>
            <button type="button" className="hover:text-zinc-700">
              Privacy Policy
            </button>
            <button type="button" className="hover:text-zinc-700">
              Help
            </button>
          </div>
          <div>© 2024 ComplianceDraft. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
