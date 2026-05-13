import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ReappointmentDocumentPage = dynamic(
  () => import("@/components/pvt-ltd/auditor-reappointment/ReappointmentDocumentPage"),
  {
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading Consent Certificate...</div>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Consent Certificate - Auditor Reappointment",
  description: "Generate consent letter and eligibility certificate for auditor reappointment.",
};

export default function ConsentCertificateReappointmentRoute() {
  return <ReappointmentDocumentPage documentType="consent-certificate" />;
}
