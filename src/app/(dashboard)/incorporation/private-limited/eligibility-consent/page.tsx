import { Suspense } from "react";
import EligibilityConsentPage from "@/components/pvt-ltd/EligibilityConsentPage";

export const metadata = {
  title: "Auditor Eligibility & Consent Letter Format",
  description: "Generate and download the statutory auditor eligibility certificate and consent letter required under Sections 139 & 141 of the Companies Act.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EligibilityConsentPage />
    </Suspense>
  );
}
