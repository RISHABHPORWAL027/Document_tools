import { Suspense } from "react";
import dynamic from "next/dynamic";

const EgmResolutionCasualVacancyPage = dynamic(() => import("@/components/pvt-ltd/auditor-casual-vacancy/EgmResolutionPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "EGM Resolution for Auditor Casual Vacancy (Word Template)",
  description: "Download and generate the EGM shareholder ordinary resolution format for appointing a statutory auditor to fill a casual vacancy under Section 139(8).",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EgmResolutionCasualVacancyPage />
    </Suspense>
  );
}
