import type { CSSProperties } from "react";
import CourseFinderNav from "@/components/course-finder/CourseFinderNav";
import EducatorFlow from "@/components/sections/Faculty/EducatorFlow";
import { aboutEducators, aboutHero, aboutLeaders, aboutNotice, aboutPlaces, aboutStory } from "@/data/about-page";
import { campuses } from "@/data/contact";
import { educators } from "@/data/faculty";
import { contact } from "@/data/site";
import AboutFigures from "./AboutFigures";
import AboutReveal from "./AboutReveal";
import StorySlides from "./StorySlides";
import ValuesRun from "./ValuesRun";
import "@/components/course-finder/base.css";
import "@/components/course-finder/shared.css";
import "@/components/course-finder/course-finder.css";
import "@/components/course-finder/ref-nav.css";
import "./about.css";

/** A part that rises in as it comes into view, after `d` seconds. */
const rv = (d = 0) => ({ className: "ab-rv", style: { "--d": `${d}s` } as CSSProperties });

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const CLOCK = "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z";
const PHONE = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z";
const MAIL = "M4 6h16v12H4zM4 7l8 6 8-6";

/**
 * The About page's body (/about, Figma "About Us – 1441", 1008:38294), in the language of Kevin's homepage
 * (the `kevin` branch, 3e288bc) and course finder: his nav over the orange head (the course finder's), the
 * cream jaali ground, a cartouche label and a Newsreader heading for each section, Mukta for text, his burnt
 * band, white cards with his warm hairline.
 *   1. the head: breadcrumb, label, title, introduction and four figures; the institute's photograph rising
 *      over its foot
 *   2. how it started, beside the institute's photographs
 *   3. our values, pinned on the burnt band, sliding a value at a time (the final site's "Why Vajiram & Ravi?")
 *   4. the people who lead Vajiram & Ravi
 *   5. the educators (the homepage's carousel)
 *   6. where we teach (his "Contact us" card), and the note that there are no other branches
 * The site's footer and WhatsApp button follow outside it (app/about).
 */
export default function AboutPage() {
  const centre = campuses[0];
  return (
    <div className="cf-page ab-page">
      <CourseFinderNav variant="hiding" />
      <main id="main" className="ab">
        {/* 1. the head */}
        <section className="cf-hero ab-hero" aria-labelledby="abH">
          <span className="cf-hero__bg" aria-hidden="true" />
          <div className="cf-hero__in">
            <nav className="cf-crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">About us</span>
            </nav>
            <span className="ab-lbl ab-lbl--dark">{aboutHero.tag}</span>
            <h1 className="cf-h" id="abH">
              {aboutHero.title}
            </h1>
            <p className="cf-lede">{aboutHero.intro}</p>
            <AboutFigures stats={aboutHero.stats} />
          </div>
        </section>
        <figure className="ab-photo">
          <img src={aboutHero.photo.src} alt={aboutHero.photo.alt} width={aboutHero.photo.width} height={aboutHero.photo.height} fetchPriority="high" />
        </figure>

        {/* 2. how it started */}
        <section className="ab-sec" aria-labelledby="abStory">
          <div className="ab-story">
            <div>
              <span {...rv()}>
                <span className="ab-lbl">{aboutStory.label}</span>
              </span>
              <h2 id="abStory" {...rv(0.06)} className="ab-h2 ab-rv">
                {aboutStory.heading}
              </h2>
              <div {...rv(0.12)}>
                {aboutStory.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)} className="ab-story__p">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div {...rv(0.1)}>
              <StorySlides slides={aboutStory.slides} />
            </div>
          </div>
        </section>

        {/* 3. our values: pinned on the burnt band, the row sliding a value at a time (the final site's "Why Vajiram & Ravi?") */}
        <ValuesRun />

        {/* 4. the people who lead Vajiram & Ravi */}
        <section className="ab-sec" aria-labelledby="abLeaders">
          <div className="ab-head--c">
            <span {...rv()}>
              <span className="ab-lbl">{aboutLeaders.label}</span>
            </span>
            <h2 id="abLeaders" {...rv(0.06)} className="ab-h2 ab-rv">
              {aboutLeaders.heading}
            </h2>
          </div>
          <ul className="ab-leaders">
            {aboutLeaders.leaders.map((l, i) => (
              <li key={l.name} {...rv(0.08 + i * 0.08)} className="ab-leader ab-rv">
                <div className="ab-leader__ph">
                  <img src={l.photo.src} alt={l.photo.alt} width={l.photo.width} height={l.photo.height} loading="lazy" />
                </div>
                <div className="ab-leader__b">
                  <span className="ab-leader__role">{l.role}</span>
                  <h3 className="ab-leader__n">{l.name}</h3>
                  <p className="ab-leader__d">{l.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. the educators */}
        <section className="ab-sec ab-edu" aria-labelledby="abEdu">
          <div className="ab-head--c">
            <span {...rv()}>
              <span className="ab-lbl">{aboutEducators.label}</span>
            </span>
            <h2 id="abEdu" {...rv(0.06)} className="ab-h2 ab-rv">
              {aboutEducators.heading}
            </h2>
            <p {...rv(0.12)} className="ab-intro ab-rv">
              {aboutEducators.intro}
            </p>
          </div>
        </section>
        <div {...rv(0.1)} className="ab-edu__flow ab-rv">
          <EducatorFlow educators={educators} plate="reference" />
        </div>

        {/* 6. where we teach */}
        <section className="ab-sec" aria-labelledby="abVisit">
          <div className="ab-head--c">
            <span {...rv()}>
              <span className="ab-lbl">{aboutPlaces.label}</span>
            </span>
            <h2 id="abVisit" {...rv(0.06)} className="ab-h2 ab-rv">
              {aboutPlaces.heading}
            </h2>
            <p {...rv(0.12)} className="ab-intro ab-rv">
              {aboutPlaces.intro}
            </p>
          </div>
          <div {...rv(0.1)} className="ab-visit ab-rv">
            <div>
              <a className="ab-visit__map" href={centre.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${aboutPlaces.mapsCta}: ${centre.mapLabel} (opens Google Maps)`}>
                <img src="/images/locations/map/map.webp" alt="" loading="lazy" />
                <span className="ab-visit__go">{aboutPlaces.mapsCta} ↗</span>
              </a>
              <span className="ab-visit__tag">{aboutPlaces.centreLabel}</span>
              <p className="ab-visit__addr">{centre.address}</p>
              {centre.landmark && <p className="ab-visit__note">{centre.landmark}</p>}
              <div className="ab-visit__rows">
                <span className="ab-visit__row">
                  <Icon d={CLOCK} />
                  {centre.hours}
                </span>
                <a className="ab-visit__row" href={centre.phoneHref}>
                  <Icon d={PHONE} />
                  {centre.phone}
                </a>
                <a className="ab-visit__row" href={`mailto:${contact.email}`}>
                  <Icon d={MAIL} />
                  {contact.email}
                </a>
              </div>
            </div>
            <figure className="ab-visit__ph">
              <img src={aboutPlaces.photo.src} alt={aboutPlaces.photo.alt} width={aboutPlaces.photo.width} height={aboutPlaces.photo.height} loading="lazy" />
            </figure>
          </div>
          <p {...rv(0.1)} className="ab-notice ab-rv">
            <img src="/images/ornaments/butta.svg" alt="" aria-hidden="true" width={16} height={16} />
            {aboutNotice}
          </p>
        </section>
        <div className="ab-end" />
      </main>
      <AboutReveal />
    </div>
  );
}
