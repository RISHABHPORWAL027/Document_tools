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
  title: "Auditor Reappointment Consent & Eligibility Certificate (Word)",
  description: "Download and generate the statutory auditor's eligibility certificate and consent letter format for reappointment under Sections 139 and 141.",
};

export default function ConsentCertificateReappointmentRoute() {
  return <ReappointmentDocumentPage documentType="consent-certificate" />;
}
