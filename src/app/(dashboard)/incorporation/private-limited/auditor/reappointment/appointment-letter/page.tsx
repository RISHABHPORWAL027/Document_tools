import type { Metadata } from "next";
import { Suspense } from "react";
import ReappointmentDocumentPage from "@/components/pvt-ltd/auditor-reappointment/ReappointmentDocumentPage";

export const metadata: Metadata = {
  title: "Auditor Reappointment Letter Format Word | 5-Year Term",
  description: "Generate and download the statutory auditor reappointment letter template under the Companies Act for a five-year term.",
};

export default function AppointmentLetterReappointmentRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReappointmentDocumentPage documentType="appointment-letter" />
    </Suspense>
  );
}
