import type { CSSProperties } from "react";
import CourseFinderNav from "@/components/course-finder/CourseFinderNav";
import EducatorFlow from "@/components/sections/Faculty/EducatorFlow";
import { aboutEducators, aboutHero, aboutLeaders, aboutNotice, aboutPlaces, aboutStory } from "@/data/about-page";
import { campuses } from "@/data/contact";
import { educators } from "@/data/faculty";
import { contact } from "@/data/site";
import AboutFigures from "./AboutFigures";
import AboutReveal from "./AboutReveal";
import AboutTilt from "./AboutTilt";
import StoryCarousel from "./StoryCarousel";
import ValuesPanels from "./ValuesPanels";
import "@/components/course-finder/base.css";
import "@/components/course-finder/shared.css";
import "@/components/course-finder/course-finder.css";
import "@/components/course-finder/ref-nav.css";
import "./about.css";

/** A part that rises in as it comes into view, after `d` seconds. */
const rv = (d = 0) => ({ className: "ab-rv", style: { "--d": `${d}s` } as CSSProperties });

/** Kevin's homepage contact card's icons (his #visit): the phone and the envelope. */
const PHONE =
  "M18.118 14.702 14 15.5c-2.782-1.396-4.5-3-5.5-5.5l.77-4.13L7.815 2H4.064c-1.128 0-2.016.932-1.848 2.047.421 2.783 1.66 7.83 5.284 11.453 3.805 3.805 9.286 5.456 12.302 6.113.965.21 1.998-.698 1.998-1.89v-3.584l-3.882-1.437z";
const MAIL = "M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z";
/** The live map his card embeds (Google Maps, the New Delhi centre). */
const MAP_EMBED =
  "https://www.google.com/maps?q=Vajiram+%26+Ravi,+1-B%2F7+Pusa+Road,+Old+Rajinder+Nagar,+New+Delhi+110060&z=16&output=embed";

/**
 * The About page's body (/about, Figma "About Us – 1441", 1008:38294), in the language of Kevin's homepage
 * (the `kevin` branch, 3e288bc) and course finder: his nav over the orange head (the course finder's), the
 * cream jaali ground, a cartouche label and a Newsreader heading for each section, Mukta for text, his burnt
 * band, white cards with his warm hairline.
 *   1. the head: breadcrumb, label, title, introduction and four figures; the institute's photograph rising
 *      over its foot
 *   2. how it started: one carousel, each part of the story with its photograph (StoryCarousel)
 *   3. our values: all five on one screen as photograph panels (ValuesPanels), on Kevin's toppers ground
 *   4. the people who lead Vajiram & Ravi, their cards tilting toward the pointer (AboutTilt)
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
          <span {...rv()}>
            <span className="ab-lbl">{aboutStory.label}</span>
          </span>
          <h2 id="abStory" {...rv(0.06)} className="ab-h2 ab-rv">
            {aboutStory.heading}
          </h2>
          <div {...rv(0.12)}>
            <StoryCarousel chapters={aboutStory.chapters} />
          </div>
        </section>

        {/* 3. our values: all five on one screen, as photograph panels that open under the pointer */}
        <ValuesPanels />

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
          {/* Kevin's homepage "Contact us" card (his #visit): the live map, the centre, its hours, phone and email, and the photograph */}
          <div {...rv(0.1)} className="ab-cu ab-rv">
            <div className="ab-cu__l">
              <div className="ab-cu__map">
                <iframe src={MAP_EMBED} title={`Map: ${centre.mapLabel}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
              <p className="ab-cu__tag">{aboutPlaces.centreLabel}</p>
              <h3 className="ab-cu__addr">{centre.address}</h3>
              {centre.landmark && <p className="ab-cu__note">{centre.landmark}</p>}
              <p className="ab-cu__hours">{centre.hours}</p>
              <ul className="ab-cu__rows">
                <li>
                  <a href={centre.phoneHref} aria-label={`Call us on ${centre.phone}`}>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d={PHONE} />
                    </svg>
                    <span>{centre.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`}>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="m7 9 5 3.5L17 9" />
                      <path d={MAIL} />
                    </svg>
                    <span>{contact.email}</span>
                  </a>
                </li>
              </ul>
            </div>
            <figure className="ab-cu__ph">
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
      <AboutTilt />
    </div>
  );
}
