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
  title: "Board Meeting Attendance Sheet for Director Resignation (Word)",
  description: "Generate and download the Board Meeting (BM) attendance sheet format of directors for accepting director resignation compliance.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AttendanceSheetPage subflowTitle="Resignation of Director" />
    </Suspense>
  );
}
