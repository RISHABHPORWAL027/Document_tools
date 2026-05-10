import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const LlpNocRoPage = dynamic(() => import("@/components/llp/LlpNocRoPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "LLP NOC for Registered Office | No Objection Certificate Generator",
  description: "Create a No Objection Certificate (NOC) from the property owner for LLP incorporation. Verbatim legal format.",
  keywords: ["LLP NOC", "No Objection Certificate", "registered office address proof", "LLP address proof"],
};

function Fallback() {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-8 text-sm text-zinc-500">
      Loading LLP NOC…
    </div>
  );
}

export default function LlpNocRoRoute() {
  return (
    <Suspense fallback={<Fallback />}>
      <LlpNocRoPage />
    </Suspense>
  );
}
