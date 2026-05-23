import { Suspense } from "react";
import dynamic from "next/dynamic";

const AttendanceSheetPage = dynamic(() => import("@/components/pvt-ltd/director-resignation/AttendanceSheetPage"), {
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-zinc-500 animate-pulse">Loading Document Editor...</div>
    </div>
  ),
});

export const metadata = {
  title: "Board Meeting Attendance Sheet — Resignation of Director",
  description: "Generate attendance sheet of the board meeting for director resignation.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AttendanceSheetPage subflowTitle="Resignation of Director" />
    </Suspense>
  );
}
