import type { MetadataRoute } from "next";
import { indexable, site } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  const paths = ["/", "/about", "/services", "/our-work", ...(!site.legal.isDraft ? ["/privacy-policy", "/terms"] : [])];
  return paths.map(path => ({ url: `${site.url}${path}`, changeFrequency: "monthly", priority: path === "/" ? 1 : 0.7 }));
}
