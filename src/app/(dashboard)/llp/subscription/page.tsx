import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const LlpSubscriptionPage = dynamic(() => import("@/components/llp/LlpSubscriptionPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "LLP Subscription Sheet Generator | MCA Compliance",
  description: "Generate professional LLP Subscription Sheets with automated partner details and signature sections.",
  keywords: ["LLP subscription sheet", "subscriber sheet", "LLP incorporation", "MCA form generator"],
};

function Fallback() {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-8 text-sm text-zinc-500">
      Loading subscription sheet…
    </div>
  );
}

export default function LlpSubscriptionRoute() {
  return (
    <Suspense fallback={<Fallback />}>
      <LlpSubscriptionPage />
    </Suspense>
  );
}
