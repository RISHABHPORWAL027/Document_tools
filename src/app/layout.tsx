import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://compliancedraft.com"), // Placeholder domain
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-zinc-50 text-foreground"
      >
        {children}
      </body>
    </html>
  );
}
