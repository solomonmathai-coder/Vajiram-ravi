"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { jumpToElement, scrollToY } from "@/lib/smoothScroll";
import { setCategoryHandler } from "./catJump";
import CategoryRail, { type RailItem } from "./CategoryRail";
import CategorySection from "./CategorySection";
import CategoryDrop from "./CategoryDrop";
import FilterBar from "./FilterBar";
import HeroStats from "./HeroStats";
import { IHeadset } from "./icons";
import { buildSections, DROPS, fold, passes, type FilterKey, type Filters } from "./model";
import Pill from "./Pill";

/*
 * The course finder (/courses): Kevin's course finder v2 (`kevin` branch, commit 10eea1b: course-finder.html and
 * js/course-finder.js) in React. The paper head (breadcrumb, title, the figures counting up); the bar of search
 * and dropdowns, sticky under the nav, which filters every category at once (a category with nothing left is
 * hidden, and after a change a stuck bar brings the list back to its start); the category rail; Our Top Picks
 * and one section per category (CategorySection); the counsellor banner after the last; and, when nothing
 * matches, a way back. On load the cards in view turn in one after another; under the pointer a card rises (since
 * his 10eea1b without the tilt and glare, though the pointer still sets their variables, as his script does).
 * #cat=… in the address opens at that category.
 *
 * The cards depend on today's date ("Starts" or "Started"), so the server renders them for the build's date
 * (buildDay, YYYY-MM-DD) and the client redraws them for the visitor's before the list is shown.
 */

const dayOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const NO_DROPS: Record<FilterKey, string> = { mode: "", lang: "", yr: "" };

export default function CourseFinder({ buildDay }: { buildDay: string }) {
  const [day, setDay] = useState(buildDay);
  const sections = useMemo(() => buildSections(parseDay(day)), [day]);
  const [query, setQuery] = useState("");
  const [drops, setDrops] = useState(NO_DROPS);
  const filters = useMemo<Filters>(() => ({ q: fold(query).split(/\s+/).filter(Boolean), ...drops }), [query, drops]);
  const [ready, setReady] = useState(false);
  const [flips, setFlips] = useState<Map<string, number>>(() => new Map());

  const mainRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // the bar's search and dropdowns filter every category; Our Top Picks does not count towards the total
  const oks = useMemo(() => sections.map((s) => s.cards.filter((k) => passes(k, filters))), [sections, filters]);
  const total = sections.reduce((n, s, i) => n + (s.top ? 0 : oks[i].length), 0);
  const firstShown = oks.findIndex((o) => o.length > 0);
  const railItems: RailItem[] = sections.map((s, i) => ({ k: s.k, name: s.top ? "Our Top Picks" : s.label, n: s.cards.length, hidden: !oks[i].length }));

  // each dropdown option's count, across the categories (each course once: Our Top Picks left out)
  const counts = useMemo(() => {
    const cards = sections.filter((s) => !s.top).flatMap((s) => s.cards);
    return Object.fromEntries(DROPS.map((f) => [f.key, Object.fromEntries(f.opts.map(([v]) => [v, cards.filter((k) => f.test(k, v)).length]))])) as Record<
      FilterKey,
      Record<string, number>
    >;
  }, [sections]);

  /* ---------- the bar: sticks under the nav, or at the top while the nav is slid away or open over the head ---------- */
  const navOff = useCallback(() => {
    const nav = document.getElementById("nav");
    return !nav || nav.classList.contains("is-away") || nav.classList.contains("is-open") ? 0 : (parseFloat(getComputedStyle(nav).top) || 0) + nav.offsetHeight + 12;
  }, []);
  useEffect(() => {
    const bar = barRef.current;
    const mark = markRef.current;
    const main = mainRef.current;
    if (!bar || !mark || !main) return;
    const pin = () => {
      const off = navOff();
      main.style.setProperty("--cf-navoff", `${off}px`);
      bar.classList.toggle("is-stuck", mark.getBoundingClientRect().top < off * getCanvasZoom() + 1);
    };
    addEventListener("scroll", pin, { passive: true });
    addEventListener("resize", pin);
    pin();
    const nav = document.getElementById("nav");
    const mo = nav ? new MutationObserver(pin) : null;
    if (nav) mo!.observe(nav, { attributes: true, attributeFilter: ["class"] });
    return () => {
      removeEventListener("scroll", pin);
      removeEventListener("resize", pin);
      mo?.disconnect();
    };
  }, [navOff]);

  // after a change, a stuck bar brings the list back to its start, so the first results are in view
  const firstFilters = useRef(true);
  useLayoutEffect(() => {
    if (firstFilters.current) {
      firstFilters.current = false;
      return;
    }
    if (barRef.current?.classList.contains("is-stuck") && markRef.current) jumpToElement(markRef.current, navOff());
  }, [filters, navOff]);

  /* ---------- going to a category (the rail, the nav's menu, #cat=… links), clear of the bar ---------- */
  const go = useCallback((k: string, smooth = true) => {
    const id = k === "all" ? null : k === "gs-11" || k === "gs-2yr" ? "gs" : k;
    const el = id ? document.getElementById(`cat-${id}`) : listRef.current;
    if (!el || el.hidden) return;
    const z = getCanvasZoom();
    const y = el.getBoundingClientRect().top + scrollY;
    const down = y > scrollY;
    // on phones and tablets (the Category dropdown in the bar): clear of the nav and the stuck bar under it
    const fluid = document.querySelector<HTMLElement>(".cf-sel--cat")?.offsetParent;
    const top = fluid
      ? y - (navOff() + (barRef.current?.offsetHeight ?? 0) + 16)
      : y - ((barRef.current?.offsetHeight ?? 0) + (down ? 0 : 70) + 24) * z; // going up, the nav comes back above the bar
    if (smooth && !prefersReducedMotion()) scrollToY(top);
    else window.scrollTo({ top, behavior: "instant" });
  }, [navOff]);
  const setCat = useCallback(
    (k: string) => {
      history.replaceState(null, "", `#cat=${k}`);
      go(k);
    },
    [go],
  );
  useEffect(() => setCategoryHandler(setCat), [setCat]);

  /* ---------- first layout: today's cards, then the list is shown ---------- */
  useLayoutEffect(() => {
    const today = dayOf(new Date());
    if (today !== day) setDay(today);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const m = location.hash.match(/^#cat=([\w-]+)/);
    if (!m) return;
    const t = window.setTimeout(() => go(m[1], false), 0);
    return () => window.clearTimeout(t);
  }, [ready, go]);

  // the cards' entrance: each card in view on load turns in on its upright axis, one after another, top row first and
  // left to right; it is set before the list is first shown, so none shows early, and comes off when its turn ends
  // (a timer too, in case the animation never reports)
  const endFlip = useCallback((key: string) => {
    setFlips((m) => {
      if (!m.has(key)) return m;
      const n = new Map(m);
      n.delete(key);
      return n;
    });
  }, []);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!ready || !list || prefersReducedMotion()) return;
    const vh = innerHeight;
    const keyOf = (k: HTMLElement) => `${k.closest(".cf-sec")!.id.slice(4)}:${k.dataset.key}`;
    const seen = [...list.querySelectorAll<HTMLElement>(".cf-k")]
      .filter((k) => {
        if (k.hidden || k.closest<HTMLElement>(".cf-sec")!.hidden) return false;
        const r = k.getBoundingClientRect();
        const g = k.closest(".cf-grid")!.getBoundingClientRect();
        return r.width && r.top < vh && r.bottom > 0 && r.left < g.right - 8 && r.right > g.left + 8;
      })
      .sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        return ra.top - rb.top || ra.left - rb.left;
      });
    if (!seen.length) return;
    const m = new Map<string, number>();
    const timers = seen.map((k, i) => {
      const ms = 120 + i * 80;
      const key = keyOf(k);
      m.set(key, ms);
      return window.setTimeout(() => endFlip(key), ms + 1400);
    });
    setFlips(m);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [ready, endFlip]);

  // the cards tilt toward the pointer like the homepage's batch tickets: where the pointer is sets the tilt and the glare
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const k = (e.target as Element).closest<HTMLElement>(".cf-k");
      if (!k) return;
      const r = k.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      k.style.setProperty("--tx", (px - 0.5).toFixed(3));
      k.style.setProperty("--ty", (py - 0.5).toFixed(3));
      k.style.setProperty("--gx", `${(px * 100).toFixed(0)}%`);
      k.style.setProperty("--gy", `${(py * 100).toFixed(0)}%`);
    };
    const out = (e: PointerEvent) => {
      const k = (e.target as Element).closest<HTMLElement>(".cf-k");
      if (k && !k.contains(e.relatedTarget as Node | null)) {
        k.style.setProperty("--tx", "0");
        k.style.setProperty("--ty", "0");
      }
    };
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerout", out);
    return () => {
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerout", out);
    };
  }, []);

  const reset = () => {
    setDrops(NO_DROPS);
    setQuery("");
  };

  return (
    <main id="main" className="cf" ref={mainRef} data-ready={ready ? "" : undefined}>
      {/* the page head, on the orange ground */}
      <section className="cf-hero" aria-labelledby="cfH">
        <span className="cf-hero__bg" aria-hidden="true" />
        <div className="cf-hero__in">
          <nav className="cf-crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Courses</span>
          </nav>
          <h1 className="cf-h" id="cfH">
            Find your UPSC course
          </h1>
          <p className="cf-lede">
            Prelims to Interview. Classroom and LIVE-Online programmes, in English and <span lang="hi">हिंदी</span>.
          </p>
          <HeroStats />
        </div>
      </section>

      {/* the search and the dropdowns (mode, medium, target year), sticky under the nav */}
      <div className="cf-bar-mark" aria-hidden="true" ref={markRef} />
      <FilterBar
        barRef={barRef}
        query={query}
        onQuery={setQuery}
        drops={drops}
        onDrop={(key, value) => setDrops((d) => ({ ...d, [key]: value }))}
        onClearDrops={() => setDrops(NO_DROPS)}
        counts={counts}
        lead={<CategoryDrop items={railItems} onGo={setCat} />}
      />
      <p className="vh" id="cfCount" aria-live="polite">
        {total ? `${total} course${total === 1 ? "" : "s"} shown` : "No courses match."}
      </p>

      {/* the categories: the rail, Our Top Picks, one section each, then the counsellor banner */}
      <div className="cf-list" id="cfList" aria-label="Courses by category" ref={listRef}>
        <CategoryRail items={railItems} onGo={setCat} />
        <div className="cf-list__main">
          {sections.map((s, i) => (
            <CategorySection key={s.k} sec={s} ok={oks[i]} filters={filters} first={i === firstShown} flips={flips} onFlipEnd={endFlip} />
          ))}
          <aside className="cf-help" id="cfHelp" aria-labelledby="cfHelpH" hidden={!total}>
            <span className="cf-help__ic" aria-hidden="true">
              <IHeadset />
            </span>
            <div className="cf-help__tx">
              <h2 className="cf-help__h" id="cfHelpH">
                Not sure which programme is right for you?
              </h2>
              <p className="cf-help__p">
                Speak with our academic counsellors. <a href="tel:+918062206330">080-6220-6330</a>
                <span className="cf-help__hrs">
                  <i aria-hidden="true"> · </i>Mon – Sat, 9 AM – 7 PM
                </span>
              </p>
            </div>
            <Pill href="/#counselling" className="cf-help__cta">
              Get expert guidance
            </Pill>
          </aside>
        </div>
      </div>

      <div className="cf-empty" id="cfEmpty" hidden={total > 0}>
        <p className="cf-empty__h">No courses match that.</p>
        <p className="cf-empty__p">Try another word, or show every mode and medium.</p>
        <button type="button" className="cf-more" id="cfReset" onClick={reset}>
          Clear search and tabs
        </button>
      </div>
    </main>
  );
}
