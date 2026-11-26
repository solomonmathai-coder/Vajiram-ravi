import type { CSSProperties, ReactNode } from "react";
import AboutReveal from "@/components/about/AboutReveal";
import AboutTilt from "@/components/about/AboutTilt";
import StoryChapters from "@/components/about/StoryChapters";
import FolderFloat from "./FolderFloat";
import WhyChoose from "@/team/components/sections/WhyChoose";
import SectionLabel from "@/team/components/ui/SectionLabel";
import "@/team/team-globals.css";
import TeamHeader from "@/components/team-nav/TeamHeader";
import { frBenefits, frFaq, frHero, frMaterials, frRole, frSources } from "@/data/free-resources";
import "@/components/course-finder/base.css";
import "@/components/course-finder/shared.css";
import "@/components/course-finder/course-finder.css";
import "@/components/course-finder/ref-nav.css";
import "@/components/about/about.css";
import "./kevin-parts.css";
import "./free-resources.css";

/** A part that rises in as it comes into view, after `d` seconds (AboutReveal adds `in`). */
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** The reference build's arrow, twice: one slides out of the disc as the other slides in. */
function Teer() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M2.5 8h11" />
      <path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4" />
    </svg>
  );
}

/**
 * Kevin's homepage button (his .btn, kevin-parts.css): a pill with the label rolling up to its copy under the
 * pointer, and the arrow in a disc at its end.
 */
function Btn({ href, children, kind = "primary", size = "md", onDark, external, className = "" }: {
  href: string;
  children: ReactNode;
  kind?: "primary" | "secondary" | "outline";
  size?: "sm" | "md";
  onDark?: boolean;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      className={`btn btn--${kind} btn--${size} btn--disc${onDark ? " btn--on-dark" : ""} ${className}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="btn__label">
        <span className="btn__t">{children}</span>
        <span className="btn__t" aria-hidden="true">
          {children}
        </span>
      </span>
      <span className="btn__disc" aria-hidden="true">
        <Teer />
        <Teer />
      </span>
      {external && <span className="vh"> (opens in a new tab)</span>}
    </a>
  );
}

/** Kevin's section label (his .lbl): the small cartouche with its dotted line and ornament. */
function Lbl({ children, delay = 0.05, light }: { children: ReactNode; delay?: number; light?: boolean }) {
  return (
    <div className={`lbl rv${light ? " lbl--w" : ""}`} style={d(delay)}>
      <span className="lbl__t">{children}</span>
      <i />
      <span className="lbl__orn" aria-hidden="true" />
    </div>
  );
}

/**
 * The Free Resources page (/free-resources, Figma 1361:38711, 21 Nov 2026): its words and order from the design, its
 * look Kevin's homepage's (the parts reused from his stylesheet, kevin-parts.css, under .kv):
 *   1. the head: the About page's orange-to-cream head (breadcrumb, label, title, introduction)
 *   2. all study materials: his Free resources section, the manila folders with the material standing in each
 *      (his photographs where he has one, else the design's icon on a sheet of paper), its tag, title, sentence
 *      and his white pill button
 *   3. the sources: on the About page's orange band with its faint jaali, the introduction white, four white cards with
 *      their photographs and the orange button
 *   4. why it matters: the team homepage's own "Why Vajiram & Ravi" cards (its WhyChoose, src/team), under a centred head
 *   5. the role of study material: the About page's story list (StoryChapters): a photograph beside the three
 *      numbered points, one open at a time and moving on by itself
 *   6. FAQs: his FAQ (his accordion rows, one open at a time, "Talk to a counsellor")
 * The final site's footer and the WhatsApp button follow outside it (app/free-resources).
 */
export default function FreeResourcesPage() {
  return (
    <div className="cf-page ab-page fr-page">
      <TeamHeader />
      <main id="main" className="ab fr">
        {/* 1. the head */}
        <section className="cf-hero fr-hero" aria-labelledby="frH">
          <span className="cf-hero__bg" aria-hidden="true" />
          <div className="cf-hero__in">
            <nav className="cf-crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              <span>Study materials</span>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Free resources</span>
            </nav>
            <span className="ab-lbl ab-lbl--dark">{frHero.label}</span>
            <h1 className="cf-h" id="frH">
              {frHero.title}
            </h1>
            <p className="cf-lede">{frHero.intro}</p>
          </div>
        </section>

        <div className="kv">
          {/* 2. all study materials: Kevin's Free resources section */}
          <section className="sm kv-res fr-mats" id="materials" aria-labelledby="frMat">
            <div className="sm__in">
              <div className="sm__head">
                <div className="sm__titles">
                  <Lbl>{frMaterials.label}</Lbl>
                  <h2 id="frMat" className="h2 h2--sec rv" style={d(0.12)}>
                    {frMaterials.heading}
                  </h2>
                  <p className="intro rv" style={d(0.2)}>
                    {frMaterials.intro}
                  </p>
                </div>
              </div>
              <ul className="sm__grid sm__grid--res rise">
                {frMaterials.items.map((m, i) => (
                  <li key={m.title} className="sm__card sm__card--res rf" style={{ "--i": i } as CSSProperties}>
                    <span className="rf__back" aria-hidden="true" />
                    <div className="rmk rmk--photo" aria-hidden="true">
                      <div className="rmk__obj">
                        {m.photo ? (
                          <img src={m.photo} alt="" width={640} height={410} loading="lazy" decoding="async" />
                        ) : (
                          <span className="fr-doc">
                            <span className="fr-doc__ic" style={{ backgroundImage: `url(${m.icon})` }} />
                            <i />
                            <i />
                            <i />
                            <i />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="rf__front">
                      <span className="rf__tag">{m.tag}</span>
                      <h3 className="sm__t">{m.title}</h3>
                      <p className="sm__d">{m.text}</p>
                      <div className="rf__stub">
                        <Btn href={m.href} onDark external className="sm__act">
                          {m.cta}
                        </Btn>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3. the sources: on the About page's orange band with its faint jaali, white cards with their photographs */}
          <section className="fr-orange" aria-labelledby="frSrc">
            {/* the words in a reading column on the left: the label, the heading, the first paragraph as a lead and the rest under it */}
            <div className="fr-orange__copy">
              <Lbl delay={0.05} light>
                {frSources.label}
              </Lbl>
              <h2 id="frSrc" className="h2 h2--sec rv" style={d(0.12)}>
                {frSources.heading}
              </h2>
              <p className="fr-orange__lede rv" style={d(0.2)}>
                {frSources.paragraphs[0]}
              </p>
              <div className="fr-orange__more rv" style={d(0.26)}>
                {frSources.paragraphs.slice(1).map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
            {/* the four sources beside it, two by two: each photograph above its words and button */}
            <ul className="fr-srcs sg">
              {frSources.items.map((s, i) => (
                <li key={s.title} className="fr-src" style={{ "--i": i } as CSSProperties}>
                  <span className="fr-src__ph">
                    <img src={s.photo.src} alt={s.photo.alt} width={s.photo.width} height={s.photo.height} loading="lazy" />
                  </span>
                  <span className="fr-src__b">
                    <h3 className="fr-src__t">{s.title}</h3>
                    <p className="fr-src__d">{s.text}</p>
                    <Btn href={s.href} size="sm" external>
                      {s.cta}
                    </Btn>
                  </span>
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* 4. why it matters: the homepage's own "Why Vajiram & Ravi" cards (its WhyChoose, src/team; 26 Nov 2026, Abhishek: "use
            this card style from homepage for study material benefit section"), under a centred head, each with its icon */}
        <div className="team-scope fr-team">
          <WhyChoose
            id="benefits"
            reasons={frBenefits.items.map((b) => ({ t: b.title, d: b.text, img: b.icon })) as any}
            head={
              <header className="ab-centred">
                <SectionLabel align="center">{frBenefits.label}</SectionLabel>
                <h2 id="benefits-legacyH" className="h2 h2--sec rv" style={d(0.12)}>
                  {frBenefits.heading}
                </h2>
                <p className="intro rv" style={d(0.2)}>
                  {frBenefits.intro}
                </p>
              </header>
            }
          />
        </div>

        <div className="kv">
          {/* 5. the role of study material: the About page's story list (a photograph beside the numbered points, moving on by itself) */}
          <section className="fr-sec fr-role2" aria-labelledby="frRole">
            <div className="fr-role2__hd">
              <div>
                <Lbl>{frRole.label}</Lbl>
                <h2 id="frRole" className="h2 h2--sec rv" style={d(0.12)}>
                  {frRole.heading}
                </h2>
              </div>
              <div className="rv" style={d(0.2)}>
                <Btn href="#materials">{frRole.cta}</Btn>
              </div>
            </div>
            <div className="rv" style={d(0.16)}>
              <StoryChapters chapters={frRole.points.map((p) => ({ label: p.title, text: p.text, photo: p.photo }))} />
            </div>
          </section>

          {/* 6. FAQs: Kevin's FAQ */}
          <section className="sheet sheet--pad sheet--gap faq kv-faq" aria-labelledby="frFaq">
            <div className="faq__l">
              <h2 id="frFaq" className="h2 h2--sec rv" style={d(0.12)}>
                {frFaq.heading}
              </h2>
              <p className="intro rv" style={d(0.2)}>
                {frFaq.intro}
              </p>
              <div className="rv-btn rv" style={d(0.28)}>
                <Btn href="/#contact">Talk to a counsellor</Btn>
              </div>
            </div>
            <div className="qas sg">
              {frFaq.items.map((q, i) => (
                <details key={q.q} className="qa" name="fr-faq" open={i === 0} style={{ "--i": i } as CSSProperties}>
                  <summary>
                    {q.q}
                    <svg className="qa__ic" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p>{q.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <AboutReveal />
      <AboutTilt />
      <FolderFloat />
    </div>
  );
}
