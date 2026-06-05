"use client";

import Link from "next/link";

export default function WhatsNewBanner() {
  return (
    <div className="mx-auto max-w-4xl my-4 p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
      <span className="font-semibold text-lg">
        What’s New 🚀 – Free Invoice Generator & Payslip Creator are now live!
      </span>
      <div className="flex gap-3">
        <Link href="/invoice" className="underline hover:text-gray-200 transition-colors" aria-label="Invoice Generator">
          Invoice
        </Link>
        <Link href="/payslips" className="underline hover:text-gray-200 transition-colors" aria-label="Payslip Generator">
          Payslip
        </Link>
      </div>
    </div>
  );
}
