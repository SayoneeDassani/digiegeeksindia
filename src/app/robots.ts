import type { MetadataRoute } from "next";
import { indexable, site } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return indexable ? { rules: { userAgent: "*", allow: "/", disallow: ["/api/", ...(site.legal.isDraft ? ["/privacy-policy", "/terms"] : [])] }, sitemap: `${site.url}/sitemap.xml` } : { rules: { userAgent: "*", disallow: "/" } };
}
