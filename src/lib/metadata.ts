import type { Metadata } from "next";
import { indexable, site } from "@/config/site";

export function pageMetadata(title: string, description: string, path: string, draft = false): Metadata {
  return {
    title,
    description,
    alternates: indexable && !draft ? { canonical: `${site.url}${path}` } : undefined,
    robots: { index: indexable && !draft, follow: indexable && !draft },
    openGraph: { title: `${title} | DigiGeeks India`, description, siteName: "DigiGeeks India", type: "website", locale: "en_IN", images: [{ url: `${site.url}/images/social-card.png`, width: 1200, height: 630, alt: "DigiGeeks India. Good technology starts with understanding the problem." }], ...(indexable ? { url: `${site.url}${path}` } : {}) },
    twitter: { card: "summary_large_image", title, description, images: [`${site.url}/images/social-card.png`] },
  };
}
