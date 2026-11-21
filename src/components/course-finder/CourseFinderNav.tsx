"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { links } from "@/data/links";
import { goToCategory } from "./catJump";
import { IArrow, IArrowThin, IMore } from "./icons";
import { countIn, TOTAL } from "./model";
import Pill from "./Pill";

/*
 * The course finder's nav (Kevin's, from the reference build: css/ref-nav.css and js/site-nav.js, commit 58f580a).
 * - States (his 2026-11-20, "use the same nav behaviour as the nav in this link"): fixed at the top and never hidden,
 *   its contents always dark (.is-scrolled: the dark logo, ink links, the orange "Let's talk"); within the first 48px
 *   of the page the white panel behind it is clear (.is-top), and past that it fades in with its shadow.
 * - variant="hiding" keeps his earlier behaviour (commit 39e7bc9), for the About page's orange head: .is-open at the
 *   top of the page (no bar, white on the orange head); scrolling down closes it away from both ends to the middle
 *   (.is-away); scrolling up brings it back as the white bar (.is-scrolled). A few pixels of jitter are ignored; an
 *   open menu keeps it in place; focus inside brings it back.
 * - "All courses" and "Study materials" open the homepage's mega menus (hover with a mouse, click or Enter,
 *   ArrowDown into the first link; one at a time; an outside click, focus leaving or Escape closes them; the
 *   page blurs behind). A programme in "All courses" goes to that category on this page (catJump).
 * - Links that do not fit the bar go into "More".
 * - EN / हिं swaps the nav's labels, sets <html lang> and is remembered.
 * Desktop only: his menu button and drawer (under 1024px) are not ported, as the page is laid out on the 1440px canvas.
 */

const SITE = "https://vajiramandravi.com/";
const KEY = "vr-lang";
const HI: Record<string, string> = {
  "All courses": "सभी कोर्स",
  Toppers: "टॉपर्स",
  "Study materials": "अध्ययन सामग्री",
  "UPSC exam": "UPSC परीक्षा",
  "Upcoming batches": "आगामी बैच",
  FAQs: "सामान्य प्रश्न",
  "Contact us": "संपर्क करें",
  "Let's talk": "बात करें",
  More: "और",
};

/** The plain links, in his order after "Study materials"; the ones that do not fit move into "More" from the end. */
const PLAIN = [
  { k: "toppers", label: "Toppers", href: "/#toppers" },
  { k: "gs", label: "UPSC exam", href: links.upscExam },
  { k: "batches", label: "Upcoming batches", href: "/#batches" },
  { k: "faq", label: "FAQs", href: "/#faq" },
];

/** "All courses": the programmes by stage, each with a line and its number of courses on this page. */
const P: Record<string, [string, string]> = {
  gs: ["UPSC GS Foundation Course", "The whole General Studies syllabus for Prelims and Mains together."],
  optional: ["Optional Subject Programme", "Two papers, 500 marks, taught by a specialist in your optional subject."],
  csat: ["CSAT Course", "Prelims Paper II. Qualifying at 33%, but it has to be cleared."],
  interview: ["Interview Guidance Programme", "Mock boards with detailed feedback, for the 275-mark personality test."],
  mentorship: ["Mentorship Programme", "A mentor keeps your plan on track, week by week, in English or Hindi."],
  "mains-ts": ["Mains Test Series", "Write to time, then read what an evaluator would change. English and Hindi."],
  "prelims-ts": ["Prelims Test Series", "Full-length tests with the reasoning behind every answer, plus current affairs."],
  "optional-ts": ["Optional Test Series", "Answer writing for your optional, evaluated paper by paper."],
};
const STAGES: [string, string[]][] = [
  ["Foundation", ["gs"]],
  ["Prelims", ["prelims-ts", "csat"]],
  ["Mains", ["mains-ts", "optional", "optional-ts"]],
  ["Interview", ["interview"]],
  ["Mentorship", ["mentorship"]],
];

/** "Study materials": four columns of resources (each to vajiramandravi.com), the first live. */
const SM: [string, [string, string, string?][]][] = [
  ["Current affairs", [["Daily current affairs", "Prelims, Mains and Quest articles", "Daily"], ["The Recitals", "The monthly current affairs magazine", "Monthly"], ["Editorial analysis", "The day’s editorials, explained", "Daily"], ["Daily quiz", "Ten quick questions on the news", "Daily"]]],
  ["Practice", [["Previous year papers", "Prelims and Mains, with answer keys"], ["Answer writing practice", "A Mains question to write each day"], ["Model answers for Mains", "Mains 2026, paper by paper"], ["Essay topics", "Past and probable essay themes"]]],
  ["Study material", [["GS postal books", "Printed General Studies material"], ["NCERT notes", "The basics every paper builds on"], ["Government schemes", "Schemes and missions, summed up"], ["Ethics case studies", "GS Paper IV cases, with approaches"]]],
  ["Exam guide", [["Syllabus & exam pattern", "Each stage, and how it is marked"], ["UPSC Calendar 2027", "Every date, the age limit, eligibility"], ["Optional subjects list", "All optionals, and how to choose"], ["Interview guidance tips", "Preparing for the Personality Test"]]],
];
/** Today's headlines (his menu read them from the footer's "Latest current affairs" card until 2026-11-20, when the card left that footer; they live in the menu now). */
const HEADS: [string, string, string][] = [
  ["Mains", "Supreme Court redefines the meaning of ‘industry’", links.currentAffairsMains],
  ["Mains", "NITI Aayog flags gap between education and employment", links.currentAffairsMains],
  ["Prelims", "Thiksey Monastery", links.currentAffairsPrelims],
];

const plural = (n: number) => `${n} ${n === 1 ? "course" : "courses"}`;
const pad = (i: number) => String(i + 1).padStart(2, "0");

type Mega = "all" | "study";

export default function CourseFinderNav({ variant = "fixed" }: { variant?: "fixed" | "hiding" }) {
  const hiding = variant === "hiding";
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const wraps = { all: useRef<HTMLDivElement>(null), study: useRef<HTMLDivElement>(null) };

  // as his markup starts: "rn is-scrolled is-top" (the hiding variant: "rn is-open")
  const [st, setSt] = useState(hiding ? { open: true, away: false, scrolled: false } : { open: false, away: false, scrolled: true });
  const [top, setTop] = useState(true);
  const [mega, setMega] = useState<Mega | null>(null);
  const [more, setMore] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const busy = useRef(false);
  busy.current = !!mega || more;

  const put = (next: typeof st) => setSt((s) => (s.open === next.open && s.away === next.away && s.scrolled === next.scrolled ? s : next));

  /* ---------- the states, from the scroll ---------- */
  useEffect(() => {
    if (hiding) return;
    let tick = false;
    const f = () => {
      tick = false;
      setTop(scrollY < 48);
    };
    const onScroll = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(f);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    f();
    return () => removeEventListener("scroll", onScroll);
  }, [hiding]);
  useEffect(() => {
    if (!hiding) return;
    let last = scrollY;
    let tick = false;
    const f = () => {
      tick = false;
      const y = scrollY;
      const d = y - last;
      if (y < 40) {
        put({ open: true, away: false, scrolled: false });
        last = y;
        return;
      }
      setSt((s) => {
        let { away, scrolled } = s;
        if (d > 6 && !busy.current) away = true;
        else if (d < -6) {
          away = false;
          scrolled = true;
        } else if (!away) scrolled = true;
        return !s.open && s.away === away && s.scrolled === scrolled ? s : { open: false, away, scrolled };
      });
      if (Math.abs(d) > 6) last = y;
    };
    const onScroll = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(f);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    put(scrollY < 40 ? { open: true, away: false, scrolled: false } : { open: false, away: false, scrolled: true });
    return () => removeEventListener("scroll", onScroll);
  }, [hiding]);

  /* ---------- the mega menus ---------- */
  const leave = useRef<Partial<Record<Mega, number>>>({});
  const setM = (which: Mega, open: boolean) => {
    if (open) {
      setMore(false);
      setMega(which);
    } else setMega((m) => (m === which ? null : m));
  };
  const closeAll = () => setMega(null);
  // <html>.mega-open: the scrim blurs the page, and the bar lets the open menu hang below it (css/ref-nav.css)
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("mega-open", !!mega);
  }, [mega]);
  useEffect(() => {
    if (!mega && !more) return;
    const onClick = (e: globalThis.MouseEvent) => {
      const t = e.target as Node;
      if (mega && !wraps[mega].current?.contains(t)) setMega(null);
      if (more && !moreRef.current?.contains(t)) setMore(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [mega, more]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(null);
        setMore(false);
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("mega-open");
      document.documentElement.lang = "en";
    };
  }, []);

  // a link in a menu closes it; a programme goes to its category on this page
  const onMenuClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest("a");
    if (!a) return;
    const cat = a.getAttribute("data-cf-cat");
    if (cat) {
      e.preventDefault();
      goToCategory(cat);
    }
    closeAll();
  };

  const megaProps = (which: Mega) => ({
    ref: wraps[which],
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(leave.current[which]);
      setM(which, true);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      leave.current[which] = window.setTimeout(() => setM(which, false), 160);
    },
    onBlur: (e: FocusEvent) => {
      if (!wraps[which].current?.contains(e.relatedTarget as Node | null)) setM(which, false);
    },
  });
  const btnProps = (which: Mega) => ({
    "aria-expanded": mega === which,
    onClick: () => setM(which, mega !== which),
    onKeyDown: (e: ReactKeyboardEvent) => {
      if (e.key !== "ArrowDown") return;
      e.preventDefault();
      flushSync(() => setM(which, true));
      wraps[which].current?.querySelector<HTMLElement>(".mega__a")?.focus();
    },
  });

  /* ---------- "More": the plain links that do not fit move into it, from the end ---------- */
  const fit = useCallback(() => {
    const nav = navRef.current;
    const linksEl = linksRef.current;
    const moreEl = moreRef.current;
    const logo = logoRef.current;
    const end = endRef.current;
    if (!nav || !linksEl || !moreEl || !logo || !end) return;
    const movable = [...linksEl.querySelectorAll<HTMLElement>(":scope > a.rn__a[data-more]")];
    movable.forEach((a) => a.classList.remove("is-over"));
    moreEl.querySelectorAll<HTMLElement>("li[data-more]").forEach((li) => (li.hidden = true));
    moreEl.hidden = true;
    if (getComputedStyle(linksEl).display === "none") return;
    const room = () => nav.offsetWidth - logo.offsetWidth - end.offsetWidth - 14 - 32;
    const over = () => linksEl.scrollWidth > room();
    if (!over()) return;
    moreEl.hidden = false;
    for (let i = movable.length - 1; i >= 0 && over(); i--) {
      movable[i].classList.add("is-over");
      const li = moreEl.querySelector<HTMLElement>(`li[data-more="${movable[i].dataset.more}"]`);
      if (li) li.hidden = false;
    }
  }, []);
  useEffect(() => {
    addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => removeEventListener("resize", fit);
  }, [fit]);

  /* ---------- EN / हिं ---------- */
  const animate = useRef(false);
  useEffect(() => {
    let saved: "en" | "hi" = "en";
    try {
      saved = localStorage.getItem(KEY) === "hi" ? "hi" : "en";
    } catch {}
    if (saved === "hi") setLang("hi");
  }, []);
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    fit();
    if (!animate.current) return;
    animate.current = false;
    navRef.current?.querySelectorAll<HTMLElement>("[data-en]").forEach((el) =>
      el.animate?.([{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: "ease-out" }),
    );
  }, [lang, fit]);
  const pick = (l: "en" | "hi") => {
    if (l === lang) return;
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    animate.current = true;
    setLang(l);
  };
  const t = (en: string) => (lang === "hi" ? HI[en] || en : en);

  const cls = ["rn", st.open && "is-open", st.away && "is-away", st.scrolled && "is-scrolled", !hiding && top && "is-top"].filter(Boolean).join(" ");

  return (
    <>
      <header
        ref={navRef}
        className={cls}
        id="nav"
        onFocus={() => {
          if (st.away) put({ open: false, away: false, scrolled: true });
        }}
      >
        <div className="rn__pill">
          <a ref={logoRef} className="rn__logo" href="/" aria-label="Vajiram & Ravi home">
            <img className="lg--l" src="/images/course-finder/brand/logo-white.png" alt="Vajiram & Ravi, Institute for IAS Examination" width={966} height={227} />
            <img className="lg--d" src="/images/course-finder/brand/logo.png" alt="" width={966} height={227} />
          </a>
          <nav ref={linksRef} className="rn__links" aria-label="Main">
            <div className={`explore${mega === "all" ? " open" : ""}`} id="explore" {...megaProps("all")}>
              <button className="rn__a" id="exploreBtn" type="button" aria-controls="mega" data-en="All courses" {...btnProps("all")}>
                {t("All courses")}
              </button>
              <div className="mega" id="mega" onClick={onMenuClick}>
                <div className="mega__stages">
                  {STAGES.map(([k, cats], i) => (
                    <section key={k} className="mega__col" style={{ "--i": i } as CSSProperties}>
                      <p className="mega__k">
                        <b>{pad(i)}</b>
                        {k}
                      </p>
                      <ul>
                        {cats.map((c) => (
                          <li key={c}>
                            <a className="mega__a" href={`#cat=${c}`} data-cf-cat={c}>
                              <span className="mega__t">{P[c][0]}</span>
                              <span className="mega__d">{P[c][1]}</span>
                              <span className="mega__n">{plural(countIn(c))}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <aside className="mega__aside">
                  <p className="mega__k">Not sure where to start?</p>
                  <p className="mega__p">A counsellor will match you to a programme for your stage, with no pressure to enrol.</p>
                  <Pill href="/#counselling" className="mega__cta" sq="sq sq--52 sq--white">
                    Talk to a counsellor
                  </Pill>
                  <a className="mega__all" href="#cat=all" data-cf-cat="all">
                    Browse all {TOTAL} courses
                    <IArrowThin />
                  </a>
                </aside>
              </div>
            </div>
            <a className="rn__a" href={PLAIN[0].href} data-more={PLAIN[0].k} data-en={PLAIN[0].label}>
              {t(PLAIN[0].label)}
            </a>
            <div className={`explore explore--sm${mega === "study" ? " open" : ""}`} id="studyNav" {...megaProps("study")}>
              <button className="rn__a" id="studyBtn" type="button" aria-controls="megaSm" data-en="Study materials" {...btnProps("study")}>
                {t("Study materials")}
              </button>
              <div className="mega mega--sm" id="megaSm" onClick={onMenuClick}>
                <div className="mega__stages">
                  {SM.map(([k, items], i) => (
                    <section key={k} className={`mega__col${i ? "" : " mega__col--feat"}`} style={{ "--i": i } as CSSProperties}>
                      <p className="mega__k">
                        <b>{pad(i)}</b>
                        {k}
                        {i ? null : (
                          <span className="mega__live">
                            <i aria-hidden="true" />
                            Live
                          </span>
                        )}
                      </p>
                      <ul>
                        {items.map(([title, d, n]) => (
                          <li key={title}>
                            <a className="mega__a" href={SITE} target="_blank" rel="noopener">
                              <span className="mega__t">{title}</span>
                              <span className="mega__d">
                                {n ? <b className="mega__f">{n}</b> : null}
                                {d}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <aside className="mega__aside" style={{ "--i": SM.length } as CSSProperties}>
                  <p className="mega__k">Today’s headlines</p>
                  <ul className="mega__heads">
                    {HEADS.map(([k, title, href]) => (
                      <li key={title}>
                        <a className="mega__h" href={href} target="_blank" rel="noopener">
                          <span className="mega__hk">{k}</span>
                          <span className="mega__ht">{title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Pill href="/#resources" className="mega__cta" sq="sq sq--52 sq--white">
                    Explore free resources
                  </Pill>
                  <a className="mega__all" href={SITE} target="_blank" rel="noopener">
                    View all study materials
                    <IArrowThin />
                  </a>
                </aside>
              </div>
            </div>
            {PLAIN.slice(1).map((l) => (
              <a key={l.k} className="rn__a" href={l.href} data-more={l.k} data-en={l.label}>
                {t(l.label)}
              </a>
            ))}
            {/* "More": shown, and its items, only while some links do not fit (fit(), above) */}
            <div ref={moreRef} className={`rn__more${more ? " is-open" : ""}`} id="navMore" hidden>
              <button
                className="rn__a"
                id="moreBtn"
                type="button"
                aria-expanded={more}
                aria-controls="moreMenu"
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  closeAll();
                  setMore((m) => !m);
                }}
              >
                <span className="rn__more-t" data-en="More">
                  {t("More")}
                </span>
                <IMore />
              </button>
              <ul className="rn-more" id="moreMenu">
                {PLAIN.map((l) => (
                  <li key={l.k} data-more={l.k} hidden>
                    <a href={l.href} data-en={l.label} onClick={() => setMore(false)}>
                      {t(l.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <div className="rn__end" ref={endRef}>
          <div className="rn-lang" id="langSw" role="group" aria-label="Language / भाषा" data-cur={lang}>
            <span className="rn-lang__thumb" aria-hidden="true" />
            <button className="rn-lang__b" type="button" data-lang="en" lang="en" aria-pressed={lang === "en"} title="English" onClick={() => pick("en")}>
              EN
            </button>
            <button className="rn-lang__b" type="button" data-lang="hi" lang="hi" aria-pressed={lang === "hi"} title="हिन्दी" onClick={() => pick("hi")}>
              हिं
            </button>
          </div>
          <a className="rn__talk" href="/#counselling">
            <span className="rn__talk-t" data-en="Let's talk">
              {t("Let's talk")}
            </span>
            <span className="rn__disc" aria-hidden="true">
              <IArrow />
              <IArrow />
            </span>
          </a>
        </div>
      </header>
      <div className="mega-scrim" aria-hidden="true" />
    </>
  );
}
