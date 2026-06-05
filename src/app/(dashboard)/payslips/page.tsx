import type { Metadata } from "next";
import { Suspense } from "react";
import PayslipGeneratorPage from "@/components/payslips/PayslipGeneratorPage";

export const metadata: Metadata = {
  title: "Salary Payslip Generator Word & PDF Template",
  description: "Generate, customize, and download professional monthly employee salary slips in Word & PDF formats. Auto-calculate earnings, deductions, and net pay.",
};

export default function PayslipsRoute() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-zinc-500">Loading Payslip Generator…</div>}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "Salary Payslip Generator",
            "description": "Generate, customize, and download professional monthly employee salary slips in Word & PDF formats. Auto-calculate earnings, deductions, and net pay.",
          }),
        }}
      />
      <PayslipGeneratorPage />
    </Suspense>
  );
}
