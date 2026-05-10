import { Suspense } from "react";
import dynamic from "next/dynamic";

const AppointmentLetterPage = dynamic(() => import("@/components/pvt-ltd/AppointmentLetterPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

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
