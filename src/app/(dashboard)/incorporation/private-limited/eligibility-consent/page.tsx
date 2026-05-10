import { Suspense } from "react";
import EligibilityConsentPage from "@/components/pvt-ltd/EligibilityConsentPage";

export const metadata = {
  title: "Eligibility & Consent Letter | Incorporation",
  description: "Generate auditor eligibility and consent letters.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EligibilityConsentPage />
    </Suspense>
  );
}
