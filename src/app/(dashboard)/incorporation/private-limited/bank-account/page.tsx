import { Suspense } from "react";
import { Metadata } from "next";
import BankAccountPage from "@/components/pvt-ltd/BankAccountPage";

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
