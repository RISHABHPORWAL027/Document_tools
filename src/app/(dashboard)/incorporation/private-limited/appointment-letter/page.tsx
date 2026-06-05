import { Suspense } from "react";
import AppointmentLetterPage from "@/components/pvt-ltd/AppointmentLetterPage";

export const metadata = {
  title: "Auditor Appointment Letter Format Word | Companies Act",
  description: "Generate and download the formal letter of appointment for statutory or first auditors under Section 139 of the Companies Act.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentLetterPage />
    </Suspense>
  );
}
