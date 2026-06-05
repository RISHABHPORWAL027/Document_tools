import { Suspense } from "react";
import dynamic from "next/dynamic";

const AppointmentLetterPage = dynamic(() => import("@/components/pvt-ltd/AppointmentLetterPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

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
