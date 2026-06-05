import { Suspense } from "react";
import dynamic from "next/dynamic";

const BoardResolutionPage = dynamic(() => import("@/components/pvt-ltd/BoardResolutionPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "Board Resolution for Company Incorporation Word Format",
  description: "Download and generate the certified true copy board resolution format for private limited company incorporation, bank accounts, and MCA filings.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BoardResolutionPage />
    </Suspense>
  );
}
