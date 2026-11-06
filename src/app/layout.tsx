import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { indexable, site } from "@/config/site";
import "./globals.css";

const inter = localFont({ src: "../fonts/Inter.ttf", variable: "--font-site", display: "swap", weight: "100 900" });

export const metadata: Metadata = {
  metadataBase: new URL(`${site.url}/`),
  title: { default: "DigiGeeks India | AI & Software Development", template: "%s | DigiGeeks India" },
  description: "Custom AI solutions, AI assistants, intelligent document processing and business automation for SMEs and growing businesses across India.",
  robots: { index: indexable, follow: indexable },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = { "@context": "https://schema.org", "@type": "Organization", name: site.name, description: "AI application development, custom software engineering and technology consulting for businesses across India.", areaServed: { "@type": "Country", name: "India" }, founder: { "@type": "Person", name: site.founder }, ...(indexable ? { url: site.url } : {}), ...(site.socialLinks.length ? { sameAs: site.socialLinks.map(link => link.href) } : {}) };
  return <html lang="en-IN" className={inter.variable}><body id="top"><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content">{children}</main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></body></html>;
}
