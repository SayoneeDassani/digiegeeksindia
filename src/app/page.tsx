import Link from "next/link";
import { ArchitectureVisual, CTASection, Eyebrow } from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("AI Solutions & Software Development Company in India", "Custom AI solutions for Indian SMEs and startups. DigiGeeks builds AI assistants, document processing tools, business automation and software integrations.", "/");

const services = [
  { number: "01", category: "ARTIFICIAL INTELLIGENCE", title: "Custom AI solutions for your business.", paragraphs: ["We help Indian SMEs and startups identify where AI could help, then build applications around a specific business need.", "From AI assistants and intelligent document processing to company knowledge search and workflow automation, we develop tools that fit the way your team works.", "We assess the task, available data, and costs before recommending an approach, with a focused prototype where useful."], capabilities: ["Custom AI applications", "Generative AI solutions", "Intelligent knowledge search", "AI assistants", "Document intelligence", "AI integration and automation"], link: "Explore AI Solutions", href: "/services#ai-solutions", icon: "spark" as const },
  { number: "02", category: "CUSTOM SOFTWARE DEVELOPMENT", title: "Software built around your requirements.", paragraphs: ["Not every business can find exactly what it needs in an off-the-shelf product.", "We design and develop custom platforms, business applications, internal tools, dashboards, and integrated systems around the way your organisation works.", "Whether you are replacing an outdated application or building something new, we help you plan and deliver a solution that meets your requirements."], link: "Explore Software Development", href: "/services#custom-software", icon: "layers" as const },
  { number: "03", category: "WEBSITES & MOBILE APPLICATIONS", title: "From an early idea to a working product.", paragraphs: ["We build modern websites, web applications, progressive web apps, and mobile applications.", "Whether you are launching a startup, building a customer portal, or improving an existing digital service, we focus on developing software that people can actually use."], link: "Explore Web & Mobile Development", href: "/services#web-development", icon: "code" as const },
  { number: "04", category: "CLOUD & TECHNOLOGY CONSULTING", title: "Good technical decisions make a difference.", paragraphs: ["We help organisations review existing systems, develop APIs, modernise software, plan cloud infrastructure, and make informed technical decisions.", "If you know something needs to change but are unsure where to begin, we can help you work through the options."], link: "Explore Consulting", href: "/services#consulting", icon: "network" as const },
];

export default function Home() {
  return <>
    <section className="home-hero dark" aria-labelledby="hero-title"><div className="container"><ul className="hero-topics" aria-label="Our services"><li>AI</li><li>SOFTWARE</li><li>AUTOMATION</li></ul><div className="home-hero-grid"><div className="home-hero-copy"><h1 id="hero-title">Practical AI solutions.<br /><span>Built around<br className="desktop-break" /> your business.</span></h1><p className="hero-lead">We help SMEs and growing businesses across India put AI to work through custom AI applications, intelligent document processing, and business automation.</p><div className="hero-actions"><Link className="button" href="/#contact">Let’s chat <Icon /></Link><a className="text-link light-link" href="#services">Explore our services <Icon /></a></div></div><ArchitectureVisual /></div><div className="hero-bottom"><p>Not sure where AI fits in your business? We help you identify a useful starting point, understand the costs, and build a solution that works with your existing processes.</p><a href="#about" className="scroll-link">Get to know DigiGeeks <span>↓</span></a></div></div></section>

    <section className="section approach-section" id="about" aria-labelledby="about-title">
      <div className="container company-about">
        <Eyebrow>ABOUT DIGIGEEKS</Eyebrow>
        <h2 id="about-title">Different businesses.<br /><span className="muted-heading">Different solutions.</span></h2>
        <p className="company-about-intro">We help Indian SMEs and growing businesses put AI to work, with software built around the way your team operates.</p>
        <ul className="company-about-points">
          <li><strong>Experience across businesses</strong><p>About six years in software, working with large technology companies and SMEs across Europe.</p></li>
          <li><strong>Built around your needs</strong><p>We start with your goals, budget, and the work you want to make easier.</p></li>
          <li><strong>AI when it helps</strong><p>We recommend AI when it offers a useful benefit. A simpler tool may be all you need.</p></li>
        </ul>
        <Link href="/about#founder-story" className="text-link">Read the founder story <Icon /></Link>
      </div>
    </section>

    <section className="section home-services" id="services" aria-labelledby="services-title"><div className="container"><div className="section-intro"><div><Eyebrow>SERVICES WE OFFER</Eyebrow><h2 id="services-title">AI solutions first.<br />Software that supports them.</h2></div><p>Our core focus is custom AI development and integration. We also build the applications, websites, and connected systems needed to make your solution useful in day-to-day work.</p></div><div className="service-features">{services.map(service => <article className={`service-feature service-${service.number}`} key={service.number}><div className="service-feature-top"><span className="service-number">{service.number}</span><Icon name={service.icon} /></div><p className="eyebrow">{service.category}</p><h3>{service.title}</h3><div className="prose">{service.paragraphs.map(p => <p key={p}>{p}</p>)}</div>{service.capabilities && <ul className="capability-list">{service.capabilities.map(c => <li key={c}><Icon name="check" />{c}</li>)}</ul>}<Link className="text-link" href={service.href}>{service.link}<Icon /></Link></article>)}</div></div></section>

    <CTASection contactDetails />
  </>;
}
