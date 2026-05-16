// src/app/robots.ts
// Tells search engines which pages to crawl

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://smartnutrix.com/sitemap.xml",
  };
}