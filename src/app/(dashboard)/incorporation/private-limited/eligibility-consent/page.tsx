import { Suspense } from "react";
import dynamic from "next/dynamic";

const EligibilityConsentPage = dynamic(() => import("@/components/pvt-ltd/EligibilityConsentPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "Auditor Eligibility Certificate & Consent Letter Format (Word)",
  description: "Generate and download the statutory auditor eligibility certificate and consent letter required under Sections 139 & 141 of the Companies Act.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EligibilityConsentPage />
    </Suspense>
  );
}
