import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  // Keep minimal while staging/preview are noindex
  return [{ url: "https://staging.domana.app", lastModified: new Date() }];
}
