import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Dir2Page = dynamic(() => import("@/components/Dir2Page"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "DIR-2 Consent to Act as Director",
};

function Dir2Fallback() {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-8 text-sm text-zinc-500">
      Loading DIR-2…
    </div>
  );
}

export default function Dir2Route() {
  return (
    <Suspense fallback={<Dir2Fallback />}>
      <Dir2Page />
    </Suspense>
  );
}
