import { Suspense } from "react";
import AcknowledgementPage from "@/components/pvt-ltd/director-resignation/AcknowledgementPage";

export const metadata = {
  title: "Director Resignation Acknowledgement Letter",
  description: "Generate the formal company acknowledgement letter format confirming the receipt and acceptance of a director's resignation.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AcknowledgementPage />
    </Suspense>
  );
}
