import { Suspense } from "react";
import AppointmentLetterCasualVacancyPage from "@/components/pvt-ltd/auditor-casual-vacancy/AppointmentLetterPage";

export const metadata = {
  title: "Auditor Appointment Letter (Casual Vacancy)",
  description: "Generate and download the statutory auditor appointment letter template used to fill a casual vacancy under Section 139(8) of the Companies Act.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentLetterCasualVacancyPage />
    </Suspense>
  );
}
