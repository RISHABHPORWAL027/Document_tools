import { Suspense } from "react";
import dynamic from "next/dynamic";

const EligibilityLetterCasualVacancyPage = dynamic(() => import("@/components/pvt-ltd/auditor-casual-vacancy/EligibilityLetterPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "Eligibility Certificate — Casual Vacancy of Auditor",
  description: "Generate eligibility cum consent certificate for auditor filling casual vacancy.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EligibilityLetterCasualVacancyPage />
    </Suspense>
  );
}
