import { Suspense } from "react";
import dynamic from "next/dynamic";

const EligibilityLetterCasualVacancyPage = dynamic(() => import("@/components/pvt-ltd/auditor-casual-vacancy/EligibilityLetterPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "Auditor Eligibility Certificate for Casual Vacancy (Word Format)",
  description: "Download statutory auditor eligibility certificate format under Sections 139 and 141 to fill an auditor casual vacancy in a company.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EligibilityLetterCasualVacancyPage />
    </Suspense>
  );
}
