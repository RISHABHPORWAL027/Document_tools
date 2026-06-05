import { Suspense } from "react";
import LlpMrlPage from "@/components/llp/LlpMrlPage";

export const metadata = {
  title: "LLP Management Representation Letter (MRL) Word Format",
  description: "Generate and download a professional Management Representation Letter (MRL) template for LLP incorporation and audit verification.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "LLP Management Representation Letter (MRL)",
            "description": "Generate and download a professional Management Representation Letter (MRL) template for LLP incorporation and audit verification.",
          }),
        }}
      />
      <LlpMrlPage />
    </Suspense>
  );
}
