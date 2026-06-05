import type { Metadata } from "next";
import { Suspense } from "react";
import ReappointmentDocumentPage from "@/components/pvt-ltd/auditor-reappointment/ReappointmentDocumentPage";

export const metadata: Metadata = {
  title: "AGM Resolution for Auditor Reappointment Word Format",
  description: "Download and generate the AGM ordinary resolution template for the reappointment of statutory auditors under Section 139 of the Companies Act.",
};

export default function AgmResolutionReappointmentRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReappointmentDocumentPage documentType="agm-resolution" />
    </Suspense>
  );
}
