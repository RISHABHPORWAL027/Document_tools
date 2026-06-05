import type { Metadata } from "next";
import { Suspense } from "react";
import LlpSubscriptionPage from "@/components/llp/LlpSubscriptionPage";

export const metadata: Metadata = {
  title: "LLP Subscription Sheet Word Format & PDF Generator",
  description: "Create and download legally compliant Limited Liability Partnership (LLP) subscriber sheet templates for MCA incorporation filing.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "LLP Subscription Sheet",
            "description": "Create and download legally compliant Limited Liability Partnership (LLP) subscriber sheet templates for MCA incorporation filing.",
          }),
        }}
      />
      <LlpSubscriptionPage />
    </Suspense>
  );
}
