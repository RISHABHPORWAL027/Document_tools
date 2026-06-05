import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.compliancedraft.co.in"),
  title: {
    default: "ComplianceDraft - MCA, ROC, Legal & Business Document Templates",
    template: "%s · ComplianceDraft",
  },
  description:
    "Access ready-to-use MCA, ROC, Company Law, LLP, GST, HR and Legal document templates. Download professional drafts, resolutions and compliance formats.",
  keywords: [
    "DIR-2 format",
    "DIR-2 word format",
    "board resolution format",
    "startup legal templates",
    "LLP agreement draft",
    "appointment letter format",
    "legal document templates India",
    "CA CS document templates",
    "GST declaration format",
    "company incorporation documents",
    "ROC filing templates",
    "compliance document library",
    "corporate document templates",
    "MGT-14 draft",
    "INC-9 format",
  ],
  openGraph: {
    title: "ComplianceDraft — Legal, MCA & Business Document Templates",
    description:
      "Download 10,000+ ready-to-use legal, MCA, ROC, GST, HR and corporate document templates in Word & PDF. Updated as per latest MCA & GST rules.",
    url: "https://compliancedraft.com",
    siteName: "ComplianceDraft",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ComplianceDraft — Legal, MCA & Business Document Templates",
    description:
      "Download 10,000+ ready-to-use legal, MCA, ROC, GST, HR and corporate document templates in Word & PDF.",
  },
  icons: {
    icon: "/Assets/logo.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1A2E7E",
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
        <Analytics />
      </body>
    </html>
  );
}
