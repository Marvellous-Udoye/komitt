import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/login", "/signup", "/callback"],
      },
    ],
    sitemap: "https://komitt.vercel.app/sitemap.xml",
    host: "https://komitt.vercel.app",
  };
}
