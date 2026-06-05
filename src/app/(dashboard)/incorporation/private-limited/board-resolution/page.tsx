import { Suspense } from "react";
import BoardResolutionPage from "@/components/pvt-ltd/BoardResolutionPage";

export const metadata = {
  title: "Board Resolution for Company Incorporation Word Format",
  description: "Download and generate the certified true copy board resolution format for private limited company incorporation, bank accounts, and MCA filings.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BoardResolutionPage />
    </Suspense>
  );
}
