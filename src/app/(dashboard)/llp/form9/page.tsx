import type { Metadata } from "next";
import { Suspense } from "react";
import LlpForm9Page from "@/components/llp/LlpForm9Page";

export const metadata: Metadata = {
  title: "LLP Form 9 (Designated Partner Consent)",
  description: "Download and generate LLP Form 9 consent template to act as Designated Partner of an LLP. Required for MCA FiLLiP registration.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "LLP Form 9 Designated Partner Consent",
            "description": "Download and generate LLP Form 9 consent template to act as Designated Partner of an LLP. Required for MCA FiLLiP registration.",
          }),
        }}
      />
      <LlpForm9Page />
    </Suspense>
  );
}
