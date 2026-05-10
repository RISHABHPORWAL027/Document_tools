import { Suspense } from "react";
import dynamic from "next/dynamic";

const LlpMrlPage = dynamic(() => import("@/components/llp/LlpMrlPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "Management Representation Letter (MRL) for LLP Incorporation",
  description: "Generate a professional Management Representation Letter (MRL) for LLP incorporation as per CA/CS standards.",
  keywords: ["MRL for LLP", "Management Representation Letter", "LLP incorporation documents", "CA drafting tools"],
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LlpMrlPage />
    </Suspense>
  );
}
