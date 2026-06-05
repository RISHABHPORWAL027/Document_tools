import { Suspense } from "react";
import EgmResolutionCasualVacancyPage from "@/components/pvt-ltd/auditor-casual-vacancy/EgmResolutionPage";

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
