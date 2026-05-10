import type { Metadata } from "next";
import { Suspense } from "react";
import NocPage from "@/components/NocPage";

export const metadata: Metadata = {
  title: "NOC — No Objection Certificate",
};

export default function NocRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NocPage />
    </Suspense>
  );
}
