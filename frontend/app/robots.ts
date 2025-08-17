// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/beta"], // block beta page
      },
    ],
    sitemap: "https://domana.app/sitemap.xml",
  };
}
