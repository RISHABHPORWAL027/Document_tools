import { Suspense } from "react";
import dynamic from "next/dynamic";

const BoardResolutionResignationPage = dynamic(() => import("@/components/pvt-ltd/director-resignation/BoardResolutionResignationPage"), {
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-zinc-500 animate-pulse">Loading Document Editor...</div>
    </div>
  ),
});

export const metadata = {
  title: "Board Resolution for Resignation of Director Word Format",
  description: "Download the certified true copy board resolution format for accepting a director's resignation under Companies Act requirements.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <BoardResolutionResignationPage />
    </Suspense>
  );
}
