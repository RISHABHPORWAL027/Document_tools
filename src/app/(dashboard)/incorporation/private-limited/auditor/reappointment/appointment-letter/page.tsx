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
  title: "Appointment Letter - Auditor Reappointment",
  description: "Generate appointment letter for reappointment of statutory auditor.",
};

export default function AppointmentLetterReappointmentRoute() {
  return <ReappointmentDocumentPage documentType="appointment-letter" />;
}
