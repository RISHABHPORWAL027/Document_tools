import type { Metadata } from "next";
import { Suspense } from "react";
import InvoiceGeneratorPage from "@/components/invoice/InvoiceGeneratorPage";

export const metadata: Metadata = {
  title: "Professional Invoice Generator Word & PDF Template",
  description: "Create, customize, and download professional client invoices in Word & PDF formats. Auto-calculate subtotal, tax, discount, shipping, and balance due.",
};

export default function InvoiceRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-sm text-zinc-500">
          Loading Invoice Generator…
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "Invoice Generator",
            "description": "Create, customize, and download professional client invoices in Word & PDF formats. Auto-calculate subtotal, tax, discount, shipping, and balance due.",
          }),
        }}
      />
      <InvoiceGeneratorPage />
    </Suspense>
  );
}
