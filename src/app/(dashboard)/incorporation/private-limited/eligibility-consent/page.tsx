import { Suspense } from "react";
import dynamic from "next/dynamic";

const EligibilityConsentPage = dynamic(() => import("@/components/pvt-ltd/EligibilityConsentPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

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
