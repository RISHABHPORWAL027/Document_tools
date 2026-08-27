import type { MetadataRoute } from "next";
import { TOOLS as SITE_TOOLS } from "@/lib/site/registry";
import { seoDocuments } from "@/data/seoDocuments";
import { SEO_CALCULATORS } from "@/data/seoCalculators";
import { SEO_CALENDARS } from "@/data/seoCalendars";
import { CALCULATORS } from "@/lib/calculators/registry";

const BASE_URL = "https://www.compliancedraft.co.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // 1. Core Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/calculators`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculators/category/salary`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculators/category/finance`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculators/category/business`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calendar`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/calendar/2026`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calendar/today`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calendar/month/january-2026`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/calendar/month/august-2026`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/holiday-calendar`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/holiday-calendar/2026`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/holiday-calendar/2027`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/long-weekends/2026`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/leave-planner`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compliance-calendar`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compliance-calendar/today`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compliance-calendar/this-week`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compliance-calendar/gst`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compliance-calendar/income-tax`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compliance-calendar/tds`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compliance-calendar/roc`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // 2. Calculator Pages
  const calculatorPages = CALCULATORS.map((calc) => ({
    url: `${BASE_URL}/calculators/${calc.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 3. Dashboard Document Workflows from site registry (e.g. NOC, GST, etc.)
  const siteToolPages = SITE_TOOLS
    .filter((tool) => tool.status === "live" && tool.href && tool.href !== "#")
    .map((tool) => {
      // Ensure absolute url path
      const path = tool.href.startsWith("/") ? tool.href : `/${tool.href}`;
      return {
        url: `${BASE_URL}${path}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

  // 4. Programmatic SEO Pages (Documents, Calculators, Calendars)
  const seoDocPages = seoDocuments.map((doc) => ({
    url: `${BASE_URL}/${doc.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const seoCalcPages = SEO_CALCULATORS.map((doc) => ({
    url: `${BASE_URL}/${doc.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const seoCalPages = SEO_CALENDARS.map((doc) => ({
    url: `${BASE_URL}/${doc.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Deduplicate URLs in case of duplicates
  const allUrls = [...staticPages, ...calculatorPages, ...siteToolPages, ...seoDocPages, ...seoCalcPages, ...seoCalPages];
  const seen = new Set<string>();
  const uniqueUrls: MetadataRoute.Sitemap = [];

  for (const page of allUrls) {
    if (!seen.has(page.url)) {
      seen.add(page.url);
      uniqueUrls.push(page);
    }
  }

  return uniqueUrls;
}
