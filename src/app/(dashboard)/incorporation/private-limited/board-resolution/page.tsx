import { Suspense } from "react";
import dynamic from "next/dynamic";

const BoardResolutionPage = dynamic(() => import("@/components/pvt-ltd/BoardResolutionPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "Board Resolution | Incorporation",
  description: "Generate board resolutions for company incorporation.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BoardResolutionPage />
    </Suspense>
  );
}
