import { Suspense } from "react";
import dynamic from "next/dynamic";

const ResignationLetterPage = dynamic(() => import("@/components/pvt-ltd/director-resignation/ResignationLetterPage"), {
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-zinc-500 animate-pulse">Loading Document Editor...</div>
    </div>
  ),
});

export const metadata = {
  title: "Resignation Letter — Resignation of Director",
  description: "Generate resignation letter for a director resigning from the company.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ResignationLetterPage />
    </Suspense>
  );
}
