import Link from "next/link";
import { CTASection, PageHero, ProcessSection } from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { detailedServices } from "@/lib/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("AI Development & Business Automation Services in India", "Custom AI development, AI assistants, intelligent document processing and automation for Indian SMEs, supported by software development and system integration.", "/services");

export default function Services() {
  return <><PageHero eyebrow="AI SOLUTIONS FOR INDIAN BUSINESSES" title="AI Development & Business Automation"><p>We help Indian SMEs, startups, and growing businesses explore, build, and integrate practical AI solutions, from intelligent document processing to AI assistants and knowledge search.</p><p>Our software development and integration services connect those capabilities to the applications and processes your team uses every day. We start by understanding the task, the available data, and what a useful result would look like.</p></PageHero>
    <nav className="services-nav" aria-label="Explore services"><div className="container">{detailedServices.map((service, i) => <a key={service.id} href={`#${service.id}`}><span>0{i + 1}</span>{service.shortName}</a>)}</div></nav>
    <div>{detailedServices.map((service, i) => <section key={service.id} id={service.id} className="detailed-service"><div className="container service-detail-grid"><div className="service-detail-heading"><span className="service-number">0{i + 1} / OUR SERVICES</span><h2>{service.title}</h2><p>{service.intro}</p><ul className="service-tags" aria-label="Capabilities">{service.capabilities.map(item => <li key={item}>{item}</li>)}</ul>{i === 0 && <aside className="responsible-ai"><h3>Responsible by design.</h3><p>We discuss data permissions, sensitive information, and provider policies before choosing tools. We plan human oversight, test for incorrect or unsuitable outputs, and make limitations clear. AI results should be reviewed wherever the task calls for human judgement.</p></aside>}</div><div className="service-detail-copy"><div><h3>Where it can help</h3><p>{service.problem}</p></div><div><h3>What that could look like</h3><p>{service.example}</p></div><div><h3>Working with DigiGeeks</h3><p>{service.approach}</p></div><Link href="/#contact" className="text-link">{service.cta}<Icon /></Link></div></div></section>)}</div><ProcessSection /><CTASection /></>;
}
