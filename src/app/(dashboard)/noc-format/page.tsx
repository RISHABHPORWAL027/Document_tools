import type { Metadata } from "next";
import { Suspense } from "react";
import NocPage from "@/components/NocPage";

export const metadata: Metadata = {
  title: "NOC for Registered Office Address Format",
  description: "Download and generate a free, legally compliant No Objection Certificate (NOC) template from property owner to register a company or LLP address.",
};

export default function NocRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "NOC from Property Owner for Registered Office Address",
            "description": "Download and generate a free, legally compliant No Objection Certificate (NOC) template from property owner to register a company or LLP address.",
          }),
        }}
      />
      <NocPage />
    </Suspense>
  );
}
