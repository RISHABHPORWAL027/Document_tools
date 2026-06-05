import type { Metadata } from "next";
import { Suspense } from "react";
import ReappointmentDocumentPage from "@/components/pvt-ltd/auditor-reappointment/ReappointmentDocumentPage";

export const metadata: Metadata = {
  title: "Auditor Reappointment Consent & Eligibility Letter",
  description: "Download and generate the statutory auditor's eligibility certificate and consent letter format for reappointment under Sections 139 and 141.",
};

export default function ConsentCertificateReappointmentRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReappointmentDocumentPage documentType="consent-certificate" />
    </Suspense>
  );
}
