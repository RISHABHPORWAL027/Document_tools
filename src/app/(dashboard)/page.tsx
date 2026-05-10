import type { Metadata } from "next";
import dynamic from "next/dynamic";

const WorkspaceHomeClient = dynamic(() => import("@/components/site/WorkspaceHomeClient"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "Compliance workspace — workflows, document generators, and shared company profiles.",
};

export default function DashboardHomePage() {
  return <WorkspaceHomeClient />;
}
