import type { Metadata } from "next";
import SpecimenSignaturePage from "@/components/SpecimenSignaturePage";

export const metadata: Metadata = {
  title: "Specimen Signature Card",
};

export default function SpecimenSignatureRoute() {
  return <SpecimenSignaturePage />;
}
