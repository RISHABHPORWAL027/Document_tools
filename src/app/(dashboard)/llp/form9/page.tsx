import type { Metadata } from "next";
import { Suspense } from "react";
import LlpForm9Page from "@/components/llp/LlpForm9Page";

export const metadata: Metadata = {
  title: "LLP Form 9 — Designated Partner Consent",
};

function Fallback() {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-8 text-sm text-zinc-500">
      Loading Form 9…
    </div>
  );
}

export default function LlpForm9Route() {
  return (
    <Suspense fallback={<Fallback />}>
      <LlpForm9Page />
    </Suspense>
  );
}
