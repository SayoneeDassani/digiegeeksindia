import Link from "next/link";
import { navigation, site } from "@/config/site";
import { Brand } from "./Header";
import { Icon } from "./Icon";

export default function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top">
    <div><Link href="/" aria-label="DigiGeeks home"><Brand /></Link><p>AI solutions, software development<br />and automation.</p></div>
    <div className="footer-links"><span className="eyebrow">EXPLORE</span>{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/our-work">Our Work</Link></div>
    <div className="footer-note"><span className="eyebrow">CONTACT</span><p><a href={`mailto:${site.email}`}>{site.email}</a></p><Link className="text-link" href="/#contact">Contact details <Icon /></Link>{site.socialLinks.map(link => <a key={link.href} href={link.href} rel="noopener noreferrer">{link.label}</a>)}</div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} DigiGeeks. All rights reserved.</span><div><Link href="/privacy-policy">Privacy Policy <span className="draft-tag">Draft</span></Link><Link href="/terms">Terms <span className="draft-tag">Draft</span></Link><a href="#top">Back to top ↑</a></div></div></div></footer>;
}
