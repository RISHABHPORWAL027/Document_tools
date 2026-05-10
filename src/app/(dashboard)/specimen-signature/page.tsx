import type { Metadata } from "next";
import { Suspense } from "react";
import SpecimenSignaturePage from "@/components/SpecimenSignaturePage";

export const metadata: Metadata = {
  title: "Specimen Signature Card",
};

export default function SpecimenSignatureRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpecimenSignaturePage />
    </Suspense>
  );
}
