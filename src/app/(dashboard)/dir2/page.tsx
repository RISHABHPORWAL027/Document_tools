import type { Metadata } from "next";
import { Suspense } from "react";
import Dir2Page from "@/components/Dir2Page";

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
