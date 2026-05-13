import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ReappointmentDocumentPage = dynamic(
  () => import("@/components/pvt-ltd/auditor-reappointment/ReappointmentDocumentPage"),
  {
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading AGM Resolution...</div>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "AGM Resolution - Auditor Reappointment",
  description: "Generate AGM resolution for reappointment of statutory auditor.",
};

export default function AgmResolutionReappointmentRoute() {
  return <ReappointmentDocumentPage documentType="agm-resolution" />;
}
