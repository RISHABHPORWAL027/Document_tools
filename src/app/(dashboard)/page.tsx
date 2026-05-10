import type { Metadata } from "next";
import WorkspaceHomeClient from "@/components/site/WorkspaceHomeClient";

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "Compliance workspace — workflows, document generators, and shared company profiles.",
};

export default function DashboardHomePage() {
  return <WorkspaceHomeClient />;
}
