import type { Metadata } from "next";
import { Suspense } from "react";
import LlpSubscriptionPage from "@/components/llp/LlpSubscriptionPage";

export const metadata: Metadata = {
  title: "LLP Subscription Sheet",
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
