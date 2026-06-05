import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const LlpNocRoPage = dynamic(() => import("@/components/llp/LlpNocRoPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "LLP NOC for Registered Office Word Format & PDF Generator",
  description: "Download property owner NOC template for LLP registered office address proof required during MCA registration/filing.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "LLP NOC for Registered Office",
            "description": "Download property owner NOC template for LLP registered office address proof required during MCA registration/filing.",
          }),
        }}
      />
      <LlpNocRoPage />
    </Suspense>
  );
}
