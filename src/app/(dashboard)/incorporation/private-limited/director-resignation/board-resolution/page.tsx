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
  title: "Board Resolution — Resignation of Director",
  description: "Generate certified true copy of board resolution accepting director resignation.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <BoardResolutionResignationPage />
    </Suspense>
  );
}
