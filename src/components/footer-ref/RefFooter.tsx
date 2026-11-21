"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./ref-footer.css";

const SITE = "https://vajiramandravi.com";

const SOCIALS = [
  ["YouTube", "youtube"],
  ["Facebook", "facebook"],
  ["Instagram", "instagram"],
  ["Telegram", "telegram"],
  ["Quora", "quora"],
  ["WhatsApp channel", "whatsapp"],
] as const;

/** The columns, as the final site has them (its links to the live site, About Us to this site's page). */
const COLUMNS: { h: string; links: [string, string][] }[] = [
  {
    h: "Vajiram & Ravi",
    links: [
      ["About Us", "/about"],
      ["Careers", `${SITE}/careers/`],
      ["Contact Us", "/#locations"],
      ["FAQs", "/#faq"],
    ],
  },
  {
    h: "Free Resources",
    links: [
      ["Current Affairs", `${SITE}/current-affairs/`],
      ["Previous Year Papers", `${SITE}/upsc-previous-year-papers/`],
      ["Books & Study Material", `${SITE}/upsc-exam/upsc-book-list/`],
      ["Model Answers for Mains 2026", `${SITE}/upsc-exam/model-answers-for-upsc-mains/`],
    ],
  },
  {
    h: "UPSC Exam",
    links: [
      ["Syllabus & Exam Pattern", `${SITE}/upsc-syllabus/`],
      ["Optional Subjects List", `${SITE}/upsc-exam/optional-subjects-for-upsc/`],
      ["Eligibility & Age Limit", `${SITE}/upsc-exam/upsc-age-limit/`],
      ["Exam Calendar 2027", `${SITE}/upsc-exam/upsc-calendar/`],
      ["Admit Card & Answer Key", `${SITE}/upsc-exam/upsc-admit-card/`],
      ["Cut Off & Results", `${SITE}/upsc-exam/upsc-cut-off/`],
      ["IAS Salary", `${SITE}/upsc-exam/ias-salary/`],
    ],
  },
  {
    h: "Courses & Test Series",
    links: [
      ["GS Course 2027", `${SITE}/courses/upsc-gs-course/`],
      ["2 Year Course", `${SITE}/courses/2-year-upsc-course/`],
      ["Online Coaching", `${SITE}/upsc-online-coaching/`],
      ["CSAT Course", `${SITE}/courses/upsc-csat-course/`],
      ["Current Affairs Course", `${SITE}/courses/upsc-module-courses/current-affairs-course/`],
      ["Prelims Test Series 2027", `${SITE}/courses/prelims-test-series/`],
      ["Mains Test Series 2027", `${SITE}/courses/upsc-mains-test-series/`],
      ["Optional Test Series", `${SITE}/courses/upsc-mains-optional-subject-test-series/`],
      ["Mentorship Program 2027", `${SITE}/courses/upsc-mentorship-program/`],
      ["Interview Guidance Program", `${SITE}/courses/interview-guidance-program/`],
    ],
  },
];

const NEWS: [string, string, string][] = [
  ["Mains", "Supreme Court redefines the meaning of ‘industry’", `${SITE}/current-affairs/upsc-mains-current-affairs/`],
  ["Mains", "NITI Aayog flags gap between education and employment", `${SITE}/current-affairs/upsc-mains-current-affairs/`],
  ["Prelims", "Thiksey Monastery", `${SITE}/current-affairs/upsc-prelims-current-affairs/`],
];

const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {});

/**
 * The final site's footer (https://vajiram-ravi.abhishek-ps.workers.dev/, footer.vf), as Kevin ported it
 * (css/footer-ref.css and js/footer-ref.js, `kevin` branch 39e7bc9): the gold double frame, the logo and the social
 * links, four columns of links, the latest current affairs, the debossed "Vajiram & Ravi" and the legal line.
 * His course finder (commit 58f580a, 2026-11-20, "remove these from the footer") drops the current affairs card
 * (`news={false}`: the link columns take the full width) and the debossed name (`word={false}`: more room around
 * the legal line, as his css/course-finder.css gives it there).
 *
 * Its curtain: the footer stays pinned to the bottom of the window behind the page (the page's <main> sits over
 * it) and is uncovered as the page scrolls up off it; --foot-p runs 0 to 1 as it is, the footer settling from 92%
 * to full size as a dark veil over it lifts. A footer taller than the window is pinned by its bottom edge
 * (--foot-off) so all of it can be reached. The gold frame fades in once the footer is in view. The window and the
 * page are measured in screen px and the offset is set in canvas px (the site's zoom, lib/canvas).
 */
export default function RefFooter({ news = true, word = true }: { news?: boolean; word?: boolean } = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const foot = ref.current;
    const main = document.querySelector("main");
    if (!foot || !main) return;
    const root = document.documentElement;
    root.classList.add("foot-curtain");
    let zoomT = 0;
    const update = () => {
      const zoom = parseFloat(root.style.zoom) || 1;
      const vh = innerHeight;
      const fh = foot.getBoundingClientRect().height;
      root.style.setProperty("--foot-off", `${Math.min(0, vh - fh) / zoom}px`);
      const shown = vh - main.getBoundingClientRect().bottom;
      const p = Math.max(0, Math.min(1, shown / Math.min(fh, vh)));
      foot.style.setProperty("--foot-p", p.toFixed(4));
      if (p > 0 && p < 1) {
        foot.classList.add("vf--zooming");
        clearTimeout(zoomT);
        zoomT = window.setTimeout(() => foot.classList.remove("vf--zooming"), 400);
      }
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    document.fonts?.ready.then(update);
    update();

    const frame = foot.querySelector(".foot__frame");
    let io: IntersectionObserver | null = null;
    if (frame) {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) frame.classList.add("is-in");
      else {
        io = new IntersectionObserver((es) => {
          if (es.some((e) => e.isIntersecting)) {
            frame.classList.add("is-in");
            io?.disconnect();
          }
        }, { threshold: 0.05 });
        io.observe(foot);
      }
    }
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      clearTimeout(zoomT);
      io?.disconnect();
      root.classList.remove("foot-curtain");
      root.style.removeProperty("--foot-off");
    };
  }, []);

  return (
    <footer ref={ref} className={`vf${news ? "" : " vf--no-news"}${word ? "" : " vf--no-word"}`} style={{ "--foot-p": 0 } as CSSProperties}>
      <span className="foot__frame fb-anim" aria-hidden="true" />
      <div className="vf__in">
        <div className="vf__bar">
          <div className="vf__brand">
            <a className="vf__logo" href="/" aria-label="Vajiram & Ravi, home">
              <img className="vf__mark" src="/images/footer-ref/logo-v6-mark.webp" alt="" width={198} height={203} loading="lazy" decoding="async" />
              <img className="vf__wordmark" src="/images/footer-ref/logo-v6-wordmark.webp" alt="" width={395} height={81} loading="lazy" decoding="async" />
            </a>
          </div>
          <ul className="vf__socials" aria-label="Vajiram & Ravi on social media">
            {SOCIALS.map(([label, file]) => (
              <li key={file}>
                <a href={`${SITE}/`} target="_blank" rel="noopener" aria-label={label}>
                  <span className="vf__soc" style={{ "--m": `url(/images/footer-ref/social-${file}.svg)` } as CSSProperties} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="vf__top">
          <nav className="vf__cols" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.h} className="vf__col">
                <h2 className="vf__h">{col.h}</h2>
                <ul>
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} {...ext(href)}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {news && (
            <section className="vf__news" aria-labelledby="vfNewsH">
              <h2 className="vf__h vf__news-h" id="vfNewsH">
                Latest current affairs{" "}
                <span className="vf__live">
                  <i aria-hidden="true" />
                  Updated daily
                </span>
              </h2>
              <ul className="vf__news-list">
                {NEWS.map(([tag, title, href]) => (
                  <li key={title}>
                    <a href={href} target="_blank" rel="noopener">
                      <span className="vf__tag">{tag}</span>
                      <span className="vf__nt">{title}</span>
                      <svg className="vf__arw" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M2.5 8h11" />
                        <path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        {word && (
          <div className="vf__word">
            <span className="vh">Vajiram &amp; Ravi</span>
            <svg aria-hidden="true" viewBox="0 0 1280 210" fill="none">
              <defs>
                <filter id="vf-deboss" x="-2%" y="-10%" width="104%" height="125%" colorInterpolationFilters="sRGB">
                  <feOffset in="SourceAlpha" dy="4" result="down" />
                  <feGaussianBlur in="down" stdDeviation="2.6" result="downSoft" />
                  <feComposite in="SourceAlpha" in2="downSoft" operator="out" result="topBand" />
                  <feFlood floodColor="#5a2a10" floodOpacity=".2" result="shadeInk" />
                  <feComposite in="shadeInk" in2="topBand" operator="in" result="innerShade" />
                  <feOffset in="SourceAlpha" dy="-2.2" result="up" />
                  <feGaussianBlur in="up" stdDeviation="1.1" result="upSoft" />
                  <feComposite in="SourceAlpha" in2="upSoft" operator="out" result="bottomBand" />
                  <feFlood floodColor="#ffffff" floodOpacity=".55" result="lightInk" />
                  <feComposite in="lightInk" in2="bottomBand" operator="in" result="innerLight" />
                  <feOffset in="SourceAlpha" dy="2" result="lipDown" />
                  <feComposite in="lipDown" in2="SourceAlpha" operator="out" result="lipBand" />
                  <feFlood floodColor="#ffffff" floodOpacity=".55" result="lipInk" />
                  <feComposite in="lipInk" in2="lipBand" operator="in" result="lip" />
                  <feMerge>
                    <feMergeNode in="lip" />
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="innerShade" />
                    <feMergeNode in="innerLight" />
                  </feMerge>
                </filter>
              </defs>
              <text x="640" y="172" textAnchor="middle" textLength="1272" lengthAdjust="spacingAndGlyphs" filter="url(#vf-deboss)">
                Vajiram &amp; Ravi
              </text>
            </svg>
          </div>
        )}
        <div className="vf__legal">
          <p>© 2026 Vajiram &amp; Ravi. All rights reserved.</p>
          <nav aria-label="Legal">
            <a href={`${SITE}/terms-and-conditions/`} target="_blank" rel="noopener">
              Terms and Conditions
            </a>
            <a href={`${SITE}/privacy-policy/`} target="_blank" rel="noopener">
              Privacy Policy
            </a>
            <span>Grievance Redressal</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
