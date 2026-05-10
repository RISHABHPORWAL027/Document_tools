import type { Metadata } from "next";
import { Suspense } from "react";
import LlpNocRoPage from "@/components/llp/LlpNocRoPage";

export const metadata: Metadata = {
  title: "LLP NOC — Registered Office",
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
