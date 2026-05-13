import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://compliancedraft.com"),
  title: {
    default: "ComplianceDraft — CA/CS Document Automation",
    template: "%s · ComplianceDraft",
  },
  description:
    "Generate professional compliance and legal documents instantly. Store company profiles once, auto-fill all documents. PDF and DOCX export for LLP, Pvt Ltd, and more.",
  keywords: [
    "legal document automation",
    "CA tools",
    "CS tools",
    "LLP incorporation documents",
    "private limited company incorporation",
    "board resolution generator",
    "MCA compliance tools",
    "legal drafting",
  ],
  openGraph: {
    title: "ComplianceDraft — CA/CS Document Automation",
    description: "Generate professional compliance and legal documents instantly.",
    url: "https://compliancedraft.com",
    siteName: "ComplianceDraft",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ComplianceDraft — CA/CS Document Automation",
    description: "Generate professional compliance and legal documents instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-[#f6f6f6] text-black antialiased"
        style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
