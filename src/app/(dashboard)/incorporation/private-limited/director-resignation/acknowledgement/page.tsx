import { Suspense } from "react";
import dynamic from "next/dynamic";

const AcknowledgementPage = dynamic(() => import("@/components/pvt-ltd/director-resignation/AcknowledgementPage"), {
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-zinc-500 animate-pulse">Loading Document Editor...</div>
    </div>
  ),
});

export const metadata = {
  title: "Resignation Acknowledgement Letter Format for Director (Word)",
  description: "Generate the formal company acknowledgement letter format confirming the receipt and acceptance of a director's resignation.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AcknowledgementPage />
    </Suspense>
  );
}
