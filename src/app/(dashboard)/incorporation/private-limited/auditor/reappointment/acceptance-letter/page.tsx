import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ReappointmentDocumentPage = dynamic(
  () => import("@/components/pvt-ltd/auditor-reappointment/ReappointmentDocumentPage"),
  {
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading Acceptance Letter...</div>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Acceptance Letter - Auditor Reappointment",
  description: "Generate auditor acceptance letter for reappointment.",
};

export default function AcceptanceLetterReappointmentRoute() {
  return <ReappointmentDocumentPage documentType="acceptance-letter" />;
}
