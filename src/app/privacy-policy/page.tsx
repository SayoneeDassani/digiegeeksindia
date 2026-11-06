import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/config/site";

export const metadata = pageMetadata("Privacy Policy — Draft", "Draft DigiGeeks privacy policy covering enquiry information, development-mode handling, service providers and details to review before publication.", "/privacy-policy", site.legal.isDraft);
export default function PrivacyPolicy() { return <LegalPage type="privacy" />; }
