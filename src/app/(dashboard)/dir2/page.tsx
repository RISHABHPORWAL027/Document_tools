import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Dir2Page = dynamic(() => import("@/components/Dir2Page"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "DIR-2 Word Format & Consent to Act as Director (PDF Template)",
  description: "Generate and download Form DIR-2 consent template for director appointment as per Companies Act rules. Ready for MCA SPICe+ company filing.",
};

function Dir2Fallback() {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-8 text-sm text-zinc-500">
      Loading DIR-2…
    </div>
  );
}

export default function Dir2Route() {
  return (
    <Suspense fallback={<Dir2Fallback />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "DIR-2 Consent to Act as Director",
            "description": "Generate and download Form DIR-2 consent template for director appointment as per Companies Act rules.",
          }),
        }}
      />
      <Dir2Page />
    </Suspense>
  );
}
