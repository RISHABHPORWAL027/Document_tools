import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const SpecimenSignaturePage = dynamic(() => import("@/components/SpecimenSignaturePage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

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
