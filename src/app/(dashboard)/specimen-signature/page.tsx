import type { Metadata } from "next";
import { Suspense } from "react";
import SpecimenSignaturePage from "@/components/SpecimenSignaturePage";

export const metadata: Metadata = {
  title: "Specimen Signature Card Template",
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
