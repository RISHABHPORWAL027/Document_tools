import { Suspense } from "react";
import { Metadata } from "next";
import BankAccountPage from "@/components/pvt-ltd/BankAccountPage";

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
