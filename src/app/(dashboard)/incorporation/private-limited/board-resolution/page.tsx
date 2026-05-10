import { Suspense } from "react";
import BoardResolutionPage from "@/components/pvt-ltd/BoardResolutionPage";

export const metadata = {
  title: "Board Resolution | Incorporation",
  description: "Generate board resolutions for company incorporation.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BoardResolutionPage />
    </Suspense>
  );
}
