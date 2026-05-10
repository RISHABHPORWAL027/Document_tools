import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const LlpForm9Page = dynamic(() => import("@/components/llp/LlpForm9Page"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

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
