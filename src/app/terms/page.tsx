import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/config/site";

export const metadata = pageMetadata("Terms — Draft", "Draft terms for the DigiGeeks website, including project enquiries, illustrative content and items requiring review before publication.", "/terms", site.legal.isDraft);
export default function Terms() { return <LegalPage type="terms" />; }
