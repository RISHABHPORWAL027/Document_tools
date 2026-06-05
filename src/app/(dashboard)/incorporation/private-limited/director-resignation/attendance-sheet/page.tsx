import { Suspense } from "react";
import AttendanceSheetPage from "@/components/pvt-ltd/director-resignation/AttendanceSheetPage";

export const metadata = {
  title: "BM Attendance Sheet (Director Resignation)",
  description: "Generate and download the Board Meeting (BM) attendance sheet format of directors for accepting director resignation compliance.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AttendanceSheetPage subflowTitle="Resignation of Director" />
    </Suspense>
  );
}
