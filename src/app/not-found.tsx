import Link from "next/link";
import { Eyebrow } from "@/components/Sections";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return <section className="not-found"><div className="container"><Eyebrow>404 · PAGE NOT FOUND</Eyebrow><h1>Let us get you back on track.</h1><p>We could not find that page. You can explore our services or return to the homepage.</p><Link href="/" className="button">Back to Home <Icon /></Link></div></section>;
}
