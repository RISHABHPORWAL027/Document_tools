import { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const BankAccountPage = dynamic(() => import("@/components/pvt-ltd/BankAccountPage"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});;

export const metadata: Metadata = {
  title: "Bank Account Opening | Incorporation",
  description: "Generate board resolution for opening a bank account.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BankAccountPage />
    </Suspense>
  );
}
