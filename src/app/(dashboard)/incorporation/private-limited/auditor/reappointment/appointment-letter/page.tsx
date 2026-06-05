import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ReappointmentDocumentPage = dynamic(
  () => import("@/components/pvt-ltd/auditor-reappointment/ReappointmentDocumentPage"),
  {
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading Appointment Letter...</div>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Auditor Reappointment Letter Format Word | 5-Year Term",
  description: "Generate and download the statutory auditor reappointment letter template under the Companies Act for a five-year term.",
};

export default function AppointmentLetterReappointmentRoute() {
  return <ReappointmentDocumentPage documentType="appointment-letter" />;
}
