import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { Icon } from "./Icon";

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow${light ? " eyebrow-light" : ""}`}><span />{children}</p>;
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <section className="page-hero dark"><div className="container"><Eyebrow light>{eyebrow}</Eyebrow><h1>{title}</h1>{children && <div className="hero-intro prose">{children}</div>}</div><span className="hero-corner" aria-hidden="true">+</span></section>;
}

export function CTASection({ contactDetails = false }: { contactDetails?: boolean }) {
  return <section className={`cta-section dark${contactDetails ? " homepage-contact" : ""}`} id={contactDetails ? "contact" : undefined} aria-labelledby="contact-title">
    <div className="container cta-layout">
      <div>
        <Eyebrow light>CONTACT</Eyebrow>
        <h2 id="contact-title">Let’s Chat</h2>
        <p>Have an idea, a question, or something you would like to make easier? I would love to hear it.</p>
      </div>
      {contactDetails ? <dl className="home-contact-details">
        <div className="home-contact-email">
          <dt>Email me</dt>
          <dd><a href={`mailto:${site.email}`}>{site.email} <Icon /></a></dd>
        </div>
        {site.phones.map(phone => <div key={phone.label}>
          <dt>{phone.label}</dt>
          <dd><a href={`tel:${phone.number.replace(/\s/g, "")}`}>{phone.number}</a></dd>
        </div>)}
      </dl> : <div><Link className="button" href="/#contact">Get in touch <Icon /></Link></div>}
    </div>
  </section>;
}

export function FounderPortrait({ large = false }: { large?: boolean }) {
  return <figure className={`founder-portrait${large ? " portrait-large" : ""}`}>
    <Image src={site.founderImage} alt="Sayoneee, founder of DigiGeeks" fill sizes="(max-width: 760px) 100vw, 45vw" />
  </figure>;
}

export const processSteps = [
  { title: "Understand", text: "We begin by discussing your business, requirements, and what you are trying to achieve." },
  { title: "Plan", text: "We explore the options, define priorities, and agree on a practical development approach." },
  { title: "Build", text: "We develop and test the solution, share progress, and incorporate feedback." },
  { title: "Deliver", text: "We support deployment, documentation, handover, and future planning where required." },
];

export function ProcessSection() {
  return <section className="section process-section"><div className="container"><div className="section-heading"><Eyebrow>HOW WE WORK</Eyebrow><h2>A straightforward way<br />to build something useful.</h2></div><ol className="process-list">{processSteps.map((step, i) => <li key={step.title}><span className="process-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></div></section>;
}

export function ArchitectureVisual({ compact = false }: { compact?: boolean }) {
  return <div className={`architecture-visual${compact ? " compact" : ""}`} role="img" aria-label="Illustrative software architecture: a business need connects to AI, applications, and systems, leading to a useful solution."><div className="diagram-topline"><span>FROM PROBLEM TO POSSIBILITY</span><span>01 / DG</span></div><div className="architecture-grid" aria-hidden="true"><span className="diagram-cross cross-one">+</span><span className="diagram-cross cross-two">+</span><div className="diagram-node node-input"><span className="node-dot" /><span>Your business need</span></div><div className="diagram-trunk" /><div className="diagram-branches" /><div className="diagram-modules"><div><Icon name="spark" /><span>Intelligence</span><small>AI & data</small></div><div><Icon name="code" /><span>Applications</span><small>Web & mobile</small></div><div><Icon name="network" /><span>Connections</span><small>Cloud & systems</small></div></div><div className="diagram-merge" /><div className="diagram-node node-output"><Icon name="check" /><span>A useful solution</span></div></div><div className="diagram-caption"><span className="small-dot" />Engineered around what matters.</div></div>;
}
