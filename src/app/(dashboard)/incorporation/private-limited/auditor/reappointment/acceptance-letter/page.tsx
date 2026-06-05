import type { Metadata } from "next";
import { Suspense } from "react";
import ReappointmentDocumentPage from "@/components/pvt-ltd/auditor-reappointment/ReappointmentDocumentPage";

export const metadata: Metadata = {
  title: "Auditor Acceptance Letter for Reappointment Word Format",
  description: "Download and draft the auditor's formal letter of acceptance for their reappointment as the statutory auditor of a company.",
};

export default function AcceptanceLetterReappointmentRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReappointmentDocumentPage documentType="acceptance-letter" />
    </Suspense>
  );
}
