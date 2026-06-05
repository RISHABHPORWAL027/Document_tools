import { Suspense } from "react";
import BoardResolutionResignationPage from "@/components/pvt-ltd/director-resignation/BoardResolutionResignationPage";

export const metadata = {
  title: "Board Resolution for Resignation of Director Word Format",
  description: "Download the certified true copy board resolution format for accepting a director's resignation under Companies Act requirements.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <BoardResolutionResignationPage />
    </Suspense>
  );
}
