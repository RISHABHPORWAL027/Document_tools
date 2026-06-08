import type { MetadataRoute } from "next";
import { TOOLS as SITE_TOOLS } from "@/lib/site/registry";
import { seoDocuments } from "@/data/seoDocuments";

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

  // 2. Dashboard Document Workflows from site registry (e.g. NOC, GST, etc.)
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

  // 3. Programmatic SEO Pages
  const seoPages = seoDocuments.map((doc) => ({
    url: `${BASE_URL}/${doc.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Deduplicate URLs in case of duplicates
  const allUrls = [...staticPages, ...siteToolPages, ...seoPages];
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
