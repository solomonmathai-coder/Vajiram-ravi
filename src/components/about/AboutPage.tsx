import type { CSSProperties } from "react";
import { aboutLeaders, aboutNotice } from "@/data/about-page";
import NavigationBar from "@/team/components/layout/NavigationBar";
import HeroIntro, { Stats } from "@/team/components/sections/Hero/HeroIntro";
import WhyChoose from "@/team/components/sections/WhyChoose";
import { PHOTOS, VALUES } from "@/team/lib/data/why-choose";
import SectionWrapper from "@/team/components/ui/section_wrapper";
import Faculties from "@/team/components/sections/Faculties";
import ContactUs from "@/team/components/sections/ContactUs";
import SectionLabel from "@/team/components/ui/SectionLabel";
import AboutBehaviour from "./AboutBehaviour";
import AboutReveal from "./AboutReveal";
import AboutTilt from "./AboutTilt";
import { LeadersFounderFirst, LeadersPortraits } from "./LeadersOptions";
import ValuesPath from "./ValuesPath";
import "./about.css";

/**
 * The About page's body (/about), built from the team site's own components (abhishekps-web/vajiram-ravi, copied as they
 * are into src/team; 26 Nov 2026, the user: "use the exact components from Abhishek's repository, just change the content
 * and images"), with the About page's words and pictures in their data:
 *   - its nav (NavigationBar)
 *   - the head: its course page head's beige band (the crumb, the India Gate drawing at both sides), with the tag and title
 *   - the institute's photograph; then, in the Figma file's IA (About Us – 1445) and the homepage's rhythm: who we are as its
 *     homepage intro (HeroIntro: label, heading, paragraph and the four figures under them, as the homepage has them under
 *     its banner), how it started as its "Why Vajiram & Ravi" block (WhyChoose; its photograph a slideshow of the institute, with the homepage banner's dots), our values as a centred head (its section,
 *     label and heading) over the values as stops on one path (ValuesPath)
 *   - the people who lead Vajiram & Ravi: three layouts to compare (A, B, C), each headed by its SectionLabel and heading
 *   - the educators (Faculties) and where we teach (ContactUs), then the note that there are no other branches
 * Its footer (also its own) and the WhatsApp button follow (app/about).
 */
export default function AboutPage() {
  return (
    <>
      <NavigationBar />
      <main id="top" className="ab ab-page">
        {/* the head: its course page head's band, its homepage intro inside */}
        <div className="ab-head">
          <span className="ab-head__bg ab-head__bg--l" aria-hidden="true" />
          <span className="ab-head__bg" aria-hidden="true" />
          <nav className="ab-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">About us</span>
          </nav>
          <div className="ab-head__tag">
            <SectionLabel align="center" tone="dark">
              Est. 1976 · New Delhi
            </SectionLabel>
          </div>
          <h1 className="h2 h2--sec rv ab-head__h" style={{ "--d": ".1s" } as CSSProperties}>
            Preparing India’s civil servants since 1976.
          </h1>
        </div>

        {/* the institute's photograph, under the head (Figma About Us – 1445: "photo – institute") */}
        <figure className="ab-hero-photo">
          <div className="ab-hero-photo__in">
            <img src="/images/about-page/institute.webp" alt="The Vajiram & Ravi institute in New Delhi, students walking out past the plants at its entrance" width={1584} height={672} fetchPriority="high" />
            {/* the four figures over the photograph's foot, on a dark fade (its homepage intro's figures row) */}
            <div className="ab-hero-photo__stats">
              <Stats />
            </div>
          </div>
        </figure>

        {/* who we are (its homepage intro, the figures under it), how it started (its "Why" block, the photograph beside the
            story) and our values (a centred head over the values as stops on one path) */}
        <HeroIntro stats={false} />
        <WhyChoose id="started" photos={PHOTOS} reasons={[]} />
        <SectionWrapper id="values" labelledBy="valuesH" className="ab-values">
          <header className="ab-centred">
            <SectionLabel align="center">{VALUES.label}</SectionLabel>
            <h2 id="valuesH" className="h2 h2--sec rv" style={{ "--d": ".12s" } as CSSProperties}>
              {VALUES.title}
            </h2>
            <p className="intro rv" style={{ "--d": ".2s" } as CSSProperties}>
              {VALUES.body[0]}
            </p>
          </header>
          <ValuesPath />
        </SectionWrapper>

        {/* the people who lead Vajiram & Ravi: A, three cards (their cards tilt toward the pointer, AboutTilt) */}
        <section className="ab-sec" aria-labelledby="abLeaders">
          <div className="ab-head--c">
            <p className="ab-opt-tag">Option A · three cards</p>
            <SectionLabel>{aboutLeaders.label}</SectionLabel>
            <h2 id="abLeaders" className="h2 h2--sec rv" style={{ "--d": ".12s" } as CSSProperties}>
              {aboutLeaders.heading}
            </h2>
          </div>
          <ul className="ab-leaders">
            {aboutLeaders.leaders.map((l, i) => (
              <li key={l.name} className="ab-leader ab-rv" style={{ "--d": `${0.08 + i * 0.08}s` } as CSSProperties}>
                <div className="ab-leader__card ab-tilt">
                  <div className="ab-leader__ph">
                    <img src={l.photo.src} alt={l.photo.alt} width={l.photo.width} height={l.photo.height} loading="lazy" />
                  </div>
                  <div className="ab-leader__b">
                    <span className="ab-leader__role">{l.role}</span>
                    <h3 className="ab-leader__n">{l.name}</h3>
                    <p className="ab-leader__d">{l.bio}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {/* B and C, to compare with A */}
        <LeadersFounderFirst />
        <LeadersPortraits />

        {/* the educators and where we teach: its own sections */}
        <Faculties />
        <ContactUs />
        <section className="ab-sec ab-sec--note" aria-label="Branches">
          <p className="ab-notice ab-rv">
            <img src="/images/ornaments/butta.svg" alt="" aria-hidden="true" width={16} height={16} />
            {aboutNotice}
          </p>
        </section>
      </main>
      <AboutBehaviour />
      <AboutReveal />
      <AboutTilt />
    </>
  );
}
