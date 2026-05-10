import { Suspense } from "react";
import dynamic from "next/dynamic";

const EgmResolutionCasualVacancyPage = dynamic(() => import("@/components/pvt-ltd/auditor-casual-vacancy/EgmResolutionPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "EGM Resolution — Casual Vacancy of Auditor",
  description: "Generate EGM resolution for appointing statutory auditor to fill casual vacancy.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EgmResolutionCasualVacancyPage />
    </Suspense>
  );
}
