import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Required for output: export — forces the sitemap route to be statically
// generated at build time instead of rendered on demand.
export const dynamic = "force-static";

// Single-page scrollytelling site — one canonical entry URL. Generated as a
// static /sitemap.xml by the export build; robots.txt points crawlers at it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL + "/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
