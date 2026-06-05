import { Suspense } from "react";
import ResignationLetterPage from "@/components/pvt-ltd/director-resignation/ResignationLetterPage";

export const metadata = {
  title: "Director Resignation Letter Format Word | Companies Act",
  description: "Generate and download a formal resignation notice letter template for a director resigning from a private limited company.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ResignationLetterPage />
    </Suspense>
  );
}
