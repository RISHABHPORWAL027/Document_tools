import { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const BankAccountPage = dynamic(() => import("@/components/pvt-ltd/BankAccountPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "Board Resolution for Bank Account Opening Word Format",
  description: "Download and generate the certified true copy board resolution format required by banks to open a corporate current account.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BankAccountPage />
    </Suspense>
  );
}
