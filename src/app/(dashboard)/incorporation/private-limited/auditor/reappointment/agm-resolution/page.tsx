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
  title: "AGM Resolution for Auditor Reappointment Word Format",
  description: "Download and generate the AGM ordinary resolution template for the reappointment of statutory auditors under Section 139 of the Companies Act.",
};

export default function AgmResolutionReappointmentRoute() {
  return <ReappointmentDocumentPage documentType="agm-resolution" />;
}
