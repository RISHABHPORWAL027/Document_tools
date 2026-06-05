import { Suspense } from "react";
import AttendanceSheetPage from "@/components/pvt-ltd/director-resignation/AttendanceSheetPage";

export const metadata = {
  title: "Board Meeting Attendance Sheet Template Word & PDF",
  description: "Download and draft the standard Board Meeting (BM) attendance sheet format of directors for first auditor appointments and corporate records.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AttendanceSheetPage subflowTitle="First Auditor Appointment" />
    </Suspense>
  );
}
