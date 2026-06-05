import { Suspense } from "react";
import EligibilityLetterCasualVacancyPage from "@/components/pvt-ltd/auditor-casual-vacancy/EligibilityLetterPage";

export const metadata = {
  title: "Auditor Eligibility Certificate (Casual Vacancy)",
  description: "Download statutory auditor eligibility certificate format under Sections 139 and 141 to fill an auditor casual vacancy in a company.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EligibilityLetterCasualVacancyPage />
    </Suspense>
  );
}
