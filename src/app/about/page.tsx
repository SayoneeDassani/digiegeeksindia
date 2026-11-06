import Link from "next/link";
import Image from "next/image";
import conferenceSpeech from "../../../public/images/conference_speech.jpeg";
import { FounderPortrait, PageHero } from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "My Story | Sayoneee, Founder of DigiGeeks",
  "Meet Sayoneee, founder of DigiGeeks. Six years in software, AI research, and experience with large tech companies and SMEs shape AI solutions for Indian businesses.",
  "/about",
);

export default function About() {
  return <>
    <PageHero eyebrow="ABOUT DIGIGEEKS" title="My story" />
    <section className="section" id="founder-story">
      <div className="container about-intro">
        <div>
          <h2>Hi, I am Sayoneee.</h2>
          <div className="prose story-copy">
            <p>I have always been fascinated by technology. What I love most is <strong>bringing people and technology together</strong>: understanding a problem and building something that makes someone’s working day easier.</p>
            <p>I completed my <strong>master’s in Computing Science at the University of Glasgow</strong>, United Kingdom (Via, Veritas, Vita <span role="img" aria-label="graduation cap">🎓</span>). For the past few years, I have been based in the United Kingdom, working with a variety of small and medium-sized businesses across Europe to <strong>build AI solutions around their business needs</strong>.</p>
            <p>I began researching artificial intelligence during my undergraduate studies, exploring how computers learn from data and make sense of information. Since then, I have enjoyed taking those ideas beyond research and turning them into tools people can use.</p>
            <p>I have been in the software industry for <strong>about six years</strong>, working with large technology companies and smaller businesses. My experience includes building business software, using AI to read and check documents, and helping teams turn an early idea into a working application.</p>
            <p>That work taught me to keep things practical. Every business has its own ways of working, budget, and priorities. <strong>The right AI solution needs to fit your business.</strong></p>
          </div>
        </div>
        <FounderPortrait large />
      </div>
    </section>
    <section className="section story-section" aria-labelledby="why-digigeeks">
      <div className="container founder-reason">
        <figure className="story-conference">
          <Image src={conferenceSpeech} alt="Sayoneee speaking on a software engineering panel at the University of Glasgow" sizes="(max-width: 760px) 100vw, 40vw" />
        </figure>
        <div>
          <h2 id="why-digigeeks">Why I started DigiGeeks</h2>
          <div className="prose story-copy">
            <p>I started DigiGeeks because <strong>I love technology and what it can help people do</strong>. Working with smaller businesses in Europe made me want to bring that experience to businesses in India, especially those without their own AI or software team.</p>
            <p>AI is everywhere. But hearing about it is different from knowing <strong>what your business actually needs</strong>. Could it save your team time? Help you find information? Make paperwork easier? And what would it cost?</p>
            <p>I want DigiGeeks to <strong>bridge that gap</strong>. We build AI solutions for Indian SMEs, startups, and growing businesses. That could be a tool that finds answers in company documents, reads information from invoices, or helps your team handle repetitive tasks.</p>
            <p>We start by understanding your day-to-day work and choosing one problem to solve. Where useful, we build a small working version first, so you can see how it helps before deciding what comes next. <strong>You get clear explanations of the costs, what AI can do, and where a person still needs to check its work.</strong></p>
            <p>If a simpler tool is a better fit, I will say so. What matters is <strong>building something useful for your business</strong>.</p>
          </div>
          <Link className="story-chat" href="/#contact">Let us chat <Icon /></Link>
        </div>
      </div>
    </section>
  </>;
}
