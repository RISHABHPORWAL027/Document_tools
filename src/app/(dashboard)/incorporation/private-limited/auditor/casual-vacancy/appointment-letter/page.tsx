import { Suspense } from "react";
import dynamic from "next/dynamic";

const AppointmentLetterCasualVacancyPage = dynamic(() => import("@/components/pvt-ltd/auditor-casual-vacancy/AppointmentLetterPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata = {
  title: "Appointment Letter — Casual Vacancy of Auditor",
  description: "Generate appointment letter for statutory auditor filling casual vacancy.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentLetterCasualVacancyPage />
    </Suspense>
  );
}
