import type { Metadata } from "next";
import CalculatorsHubClient from "./CalculatorsHubClient";

export const metadata: Metadata = {
  title: "Free Finance, Salary & Business Calculators India – ComplianceDraft",
  description:
    "Free online calculators for Salary, In-Hand Take Home, CTC, GST, EPF, HRA Exemption, EMI, SIP, Gratuity, Break-even & Profit Margin. Fast, accurate & easy to use.",
  keywords: [
    "Salary calculator India",
    "In hand salary calculator",
    "GST calculator online",
    "CTC breakdown calculator",
    "EPF calculator",
    "HRA exemption calculator",
    "EMI calculator",
    "SIP wealth calculator",
    "Business break even calculator",
    "Profit margin calculator",
  ],
  openGraph: {
    title: "Free Finance, Salary & Business Calculators – ComplianceDraft",
    description:
      "Access ready-to-use Indian Finance, Salary, Tax, and Business calculators. Calculate in-hand salary, GST, EPF, EMI, SIP, HRA exemption & profit margin online.",
    url: "https://www.compliancedraft.co.in/calculators",
    siteName: "ComplianceDraft",
    locale: "en_IN",
    type: "website",
  },
};

export default function CalculatorsHubPage() {
  return <CalculatorsHubClient />;
}
