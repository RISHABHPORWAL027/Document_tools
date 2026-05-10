import { Suspense } from "react";
import AppointmentLetterPage from "@/components/pvt-ltd/AppointmentLetterPage";

export const metadata = {
  title: "Letter of Appointment | Incorporation",
  description: "Generate formal appointment letters for directors and auditors.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentLetterPage />
    </Suspense>
  );
}
