import { assetPath } from "@/lib/paths";

function configuredUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) URL.");
  return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
}

export const site = {
  name: "DigiGeeks",
  market: "India",
  founder: "Sayoneee",
  url: configuredUrl(),
  email: "sam@digigeeks.co.uk",
  emailIsPlaceholder: false,
  phones: [
    { label: "India", number: "+91 9883069111" },
    { label: "United Kingdom", number: "+44 7552550062" },
  ],
  location: "Serving businesses across India.",
  socialLinks: [] as { label: string; href: string }[],
  founderImage: assetPath("/images/founder.jpeg"),
  legal: { isDraft: true, registeredName: "", registeredAddress: "", registrationNumber: "", privacyContact: "", retentionPeriod: "" },
  contact: { provider: process.env.CONTACT_EMAIL_PROVIDER || "disabled", recipient: process.env.CONTACT_TO_EMAIL || "", sender: process.env.CONTACT_FROM_EMAIL || "" },
};

export const indexable = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true" && new URL(site.url).protocol === "https:" && !["localhost", "127.0.0.1", "your-domain.com"].includes(new URL(site.url).hostname);

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];
