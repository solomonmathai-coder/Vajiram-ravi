"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cfAbout, cfNewCategories } from "@/data/course-finder";
import { prefersReducedMotion } from "@/lib/motion";
import Book from "./Book";
import { GoButton, IArw, ICal, IDur, ILive, IRoom, ITime } from "./icons";
import { BADGE, CHIPS, hasChip, type Card, type Filters, type Section } from "./model";

/*
 * One category (Kevin's secHTML / TOP_HTML and layout() in js/course-finder.js): its book, heading, course count,
 * what it is and who it is for, the chips (All, New, Trending, Bestseller, Upcoming) and one sideways row of
 * course cards with round arrow buttons at its ends. Our Top Picks is the same, as a banner (since his
 * 2026-11-20 rework: a sunset gradient with slowly drifting colour clouds, .cf-feat__flow, the cards four across
 * under a centred head, its count in the headline, "Our 6 Top Picks", following the search and dropdowns). The
 * bar's search and dropdowns arrive as `ok` (the cards that pass them); a chip with nothing behind it is greyed
 * out, and if it was the chosen one, All is chosen again. Upcoming lists its courses soonest first; every other
 * chip puts the row back in its own order.
 */

const COLLAGE = "/images/course-finder/photos/collage.png";

/** One course card: picture, title, badge, duration, time with how often, mode; then the batch date and "View course" below a divider. */
function CourseCard({ k, shown, flipDelay, onFlipEnd }: { k: Card; shown: boolean; flipDelay?: number; onFlipEnd: () => void }) {
  const fact = (icon: ReactNode, txt: string) => (
    <span className={`cf-k__f${txt ? "" : " is-none"}`}>
      {icon}
      <span>{txt}</span>
    </span>
  );
  return (
    <li
      className={`cf-k${flipDelay !== undefined ? " is-flipin" : ""}`}
      data-key={k.id}
      data-mode={k.mode}
      data-lang={k.lang}
      data-sub={k.sub}
      data-badge={k.badges.join(" ")}
      data-up={k.up}
      data-start={k.start}
      data-yr={k.yr.join(" ")}
      data-dummy={k.dummy.length ? k.dummy.join(" ") : undefined}
      data-q={k.q}
      data-i={k.i}
      hidden={!shown}
      style={flipDelay !== undefined ? ({ "--fd": `${flipDelay}ms` } as CSSProperties) : undefined}
    >
      <a className="cf-k__a" href={k.url} target="_blank" rel="noopener" onAnimationEnd={flipDelay !== undefined ? onFlipEnd : undefined}>
        <span className="cf-k__pic">
          <img src={k.img} alt="" loading="lazy" decoding="async" width={450} height={300} />
        </span>
        <span className="cf-k__b">
          <span className="cf-k__t">{k.title}</span>
          {k.badges.length ? (
            <span className="cf-k__tags">
              {k.badges.map((x) => (
                <span key={x} className={`cf-badge cf-badge--${x}`}>
                  {BADGE[x].label}
                </span>
              ))}
            </span>
          ) : null}
          <span className="cf-k__facts">
            {fact(<IDur />, k.dur)}
            {fact(<ITime />, k.time)}
            {fact(k.mode === "online" ? <ILive /> : <IRoom />, k.modeLabel)}
          </span>
        </span>
        <span className="cf-k__ft">
          <span className="cf-k__start">
            <ICal />
            <span>
              <small>{k.startLabel}</small>
              <b>{k.startValue}</b>
            </span>
          </span>
          <GoButton />
        </span>
      </a>
    </li>
  );
}

export default function CategorySection({
  sec,
  ok,
  filters,
  first,
  flips,
  onFlipEnd,
}: {
  sec: Section;
  /** The cards that pass the bar's search and dropdowns. */
  ok: Card[];
  filters: Filters;
  first: boolean;
  /** The cards turning in on load: card key to delay (ms). */
  flips: Map<string, number>;
  onFlipEnd: (key: string) => void;
}) {
  const [chip, setChip] = useState("");
  const gridRef = useRef<HTMLUListElement>(null);
  const [arw, setArw] = useState({ prev: true, next: true }); // hidden, as his markup starts

  // a chip with no such course left (after the search and dropdowns) is greyed out; if it was the chosen one, All again
  const disabled = useMemo(() => Object.fromEntries(CHIPS.map(([f]) => [f, !ok.some((k) => hasChip(k, f))])), [ok]);
  const f = chip && disabled[chip] ? "" : chip;
  useEffect(() => {
    if (chip && disabled[chip]) setChip("");
  }, [chip, disabled]);

  const match = useMemo(() => new Set(ok.filter((k) => !f || hasChip(k, f))), [ok, f]);
  const order = useMemo(
    () => (f === "up:1" ? [...sec.cards].sort((a, b) => a.start - b.start || a.i - b.i) : sec.cards),
    [sec.cards, f],
  );

  // the round arrows at the row's two ends, each shown only while there is more that way
  const arrows = useCallback(() => {
    const tr = gridRef.current;
    if (!tr) return;
    const max = tr.scrollWidth - tr.clientWidth;
    const prev = tr.scrollLeft <= 2;
    const next = tr.scrollLeft >= max - 2;
    setArw((a) => (a.prev === prev && a.next === next ? a : { prev, next }));
  }, []);
  // after any change to the row, it goes back to its start
  useLayoutEffect(() => {
    const tr = gridRef.current;
    if (tr) tr.scrollLeft = 0;
    arrows();
  }, [filters, f, sec, arrows]);
  useEffect(() => {
    addEventListener("resize", arrows);
    return () => removeEventListener("resize", arrows);
  }, [arrows]);

  const go = (dir: number) => {
    const tr = gridRef.current;
    if (tr) tr.scrollBy({ left: dir * tr.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" }); // one screenful at a time
  };

  const total = sec.cards.length;
  const n = ok.length;
  const countTxt = n === total ? `${total} ${total === 1 ? "course" : "courses"}` : `${n} of ${total} courses`;
  const label = sec.top ? "Our Top Picks" : sec.label;

  const chips = (
    <div className="cf-chips" role="group" aria-label={`Show ${label} courses`}>
      <button type="button" className="cf-chip" data-f="" aria-pressed={!f} onClick={() => setChip("")}>
        All
      </button>
      {CHIPS.map(([v, l]) => (
        <button key={v} type="button" className="cf-chip" data-f={v} aria-pressed={f === v} disabled={disabled[v]} onClick={() => setChip(v)}>
          {l}
        </button>
      ))}
    </div>
  );

  const car = (
    <div className="cf-car">
      <ul className="cf-grid" ref={gridRef} onScroll={arrows}>
        {order.map((k) => {
          const key = `${sec.k}:${k.id}`;
          return <CourseCard key={key} k={k} shown={match.has(k)} flipDelay={flips.get(key)} onFlipEnd={() => onFlipEnd(key)} />;
        })}
      </ul>
      <button type="button" className="cf-arw cf-arw--prev" data-dir="-1" aria-label={sec.top ? "Previous top picks" : `Previous ${sec.label} courses`} hidden={arw.prev} onClick={() => go(-1)}>
        <IArw dir={-1} />
      </button>
      <button type="button" className="cf-arw cf-arw--next" data-dir="1" aria-label={sec.top ? "More top picks" : `More ${sec.label} courses`} hidden={arw.next} onClick={() => go(1)}>
        <IArw dir={1} />
      </button>
    </div>
  );

  if (sec.top)
    return (
      <section className={`cf-sec cf-feat${first ? " is-first" : ""}`} id="cat-top" data-top="1" data-f={f} aria-labelledby="cath-top" hidden={!n}>
        <div className="cf-feat__flow" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="cf-feat__cuts" aria-hidden="true">
          <img className="cut--l" src={COLLAGE} alt="" decoding="async" />
          <img className="cut--r" src={COLLAGE} alt="" decoding="async" />
        </div>
        <div className="cf-feat__intro">
          <div className="lbl lbl--w cf-feat__lbl">
            <span className="lbl__t">Picked by Vajiram &amp; Ravi</span>
          </div>
          <div className="cf-feat__book">
            <Book k="top" label="Top Picks" n={total} small />
          </div>
          {/* the number in the headline, the picks the search and dropdowns leave (his 2026-11-20; the count pill and the line under it are gone) */}
          <h2 className="cf-sec__h cf-feat__h" id="cath-top" data-total={total}>
            <span className="cf-sec__name">
              Our <span className="cf-feat__num">{n}</span> Top <span className="cf-feat__pl">{n === 1 ? "Pick" : "Picks"}</span>
            </span>
          </h2>
          {chips}
        </div>
        {car}
      </section>
    );

  const about = cfAbout[sec.k];
  return (
    <section className={`cf-sec${first ? " is-first" : ""}`} id={`cat-${sec.k}`} data-f={f} aria-labelledby={`cath-${sec.k}`} hidden={!n}>
      <div className="cf-sec__top">
        <Book k={sec.k} label={sec.label} n={total} />
        <div className="cf-sec__txt">
          <h2 className="cf-sec__h" id={`cath-${sec.k}`}>
            <span className="cf-sec__name">{sec.label}</span>
            {cfNewCategories.has(sec.k) ? (
              <>
                {" "}
                <span className="cf-new">New</span>
              </>
            ) : null}
            <span className="cf-sec__n" data-total={total}>
              {countTxt}
            </span>
          </h2>
          {about ? (
            <div className="cf-sec__about">
              <p className="cf-sec__d">{about[0]}</p>
              <p className="cf-sec__who">
                <b>Who it’s for</b> {about[1]}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      {chips}
      {car}
    </section>
  );
}
