import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const SpecimenSignaturePage = dynamic(() => import("@/components/SpecimenSignaturePage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "Specimen Signature Template for Bank Account & MCA (Word & PDF)",
  description: "Download and draft the specimen signature card/letter template of directors for bank account opening and MCA compliance filings.",
};

export default function SpecimenSignatureRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "Specimen Signature Card/Letter",
            "description": "Download and draft the specimen signature card/letter template of directors for bank account opening and MCA compliance filings.",
          }),
        }}
      />
      <SpecimenSignaturePage />
    </Suspense>
  );
}
