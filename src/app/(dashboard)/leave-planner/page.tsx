import type { Metadata } from "next";
import LeavePlannerClient from "@/components/holidays/LeavePlannerClient";

export const metadata: Metadata = {
  title: "Interactive Leave Planner & Optimizer India – Plan My Leaves",
  description: "Calculate the smartest leave dates in India. Turn 15 annual leaves into 45+ days off using long weekend bridge strategies.",
  keywords: ["Leave planner India", "Plan my leaves", "Leave optimizer tool", "Long weekend leave planning"],
  alternates: {
    canonical: "https://www.compliancedraft.co.in/leave-planner",
  },
  openGraph: {
    title: "Interactive Leave Planner & Optimizer – ComplianceDraft",
    description: "Calculate how to maximize your annual paid leave quota across Indian holidays.",
    url: "https://www.compliancedraft.co.in/leave-planner",
    type: "website",
  },
};

export default function LeavePlannerPage() {
  return <LeavePlannerClient />;
}
