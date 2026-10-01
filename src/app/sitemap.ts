import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const dynamic = "force-static";

// No lastModified: a build timestamp would claim every page changed on every deploy, and Google ignores unreliable dates.
export default function sitemap(): MetadataRoute.Sitemap {
  return [`${site.url}/`, `${site.url}/projects/`, ...projects.map((p) => `${site.url}/projects/${p.slug}/`)].map((url) => ({ url }));
}
