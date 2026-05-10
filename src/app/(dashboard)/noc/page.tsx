import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const NocPage = dynamic(() => import("@/components/NocPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

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
