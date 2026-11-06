import "server-only";
import { site } from "@/config/site";
import { emailPattern } from "./contact";

export function deliveryConfigured() {
  const { provider, recipient, sender } = site.contact;
  return provider === "resend" && Boolean(process.env.RESEND_API_KEY) && [recipient, sender].every(address => emailPattern.test(address) && !/@(?:your-domain\.com|example\.(?:com|org|net))$/i.test(address));
}
