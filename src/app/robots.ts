import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/companies/", "/companies"],
    },
    sitemap: "https://www.compliancedraft.co.in/sitemap.xml",
  };
}
