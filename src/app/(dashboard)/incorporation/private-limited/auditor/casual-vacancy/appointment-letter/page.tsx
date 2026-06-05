import { Suspense } from "react";
import dynamic from "next/dynamic";

const AppointmentLetterCasualVacancyPage = dynamic(() => import("@/components/pvt-ltd/auditor-casual-vacancy/AppointmentLetterPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "Auditor Appointment Letter Format for Casual Vacancy (Word)",
  description: "Generate and download the statutory auditor appointment letter template used to fill a casual vacancy under Section 139(8) of the Companies Act.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentLetterCasualVacancyPage />
    </Suspense>
  );
}
