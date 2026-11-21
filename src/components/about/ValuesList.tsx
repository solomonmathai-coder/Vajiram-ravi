"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { aboutValues } from "@/data/about-page";
import { prefersReducedMotion } from "@/lib/motion";

/** How long each value stays the large one (ms). */
const HOLD = 5000;

/** The grid's five places: the large one (two by two) first, then the four small ones in reading order. */
const SLOTS: CSSProperties[] = [
  { gridColumn: "1 / 3", gridRow: "1 / 3" },
  { gridColumn: "3", gridRow: "1" },
  { gridColumn: "4", gridRow: "1" },
  { gridColumn: "3", gridRow: "2" },
  { gridColumn: "4", gridRow: "2" },
];

type DocWithVT = Document & { startViewTransition?: (cb: () => void) => unknown };

/**
 * "Our values", the alternative layout (21 Nov 2026, shown under ValuesPanels for the client to compare and choose):
 * everything up front in a bento grid of one kind of tile. On the page's cream ground, the label and heading on the
 * left and the introduction on the right; then the five values, four columns by two rows: one large (two by two) and
 * the other four beside it. Every tile is the same: its photograph above and below it a white panel with the title and
 * sentence in dark type; the large one differs only in size, and the small ones' panels are one height so their
 * photographs match.
 *
 * The values take turns being the large one: every HOLD ms the next moves into the large place and the others follow
 * it round the small places, the tiles morphing to their new size and place (a view transition, each tile its own
 * view-transition-name; where the browser has none they simply change places). It waits under the pointer and while
 * the section is off the screen; clicking a small tile makes it the large one. With reduced motion it stays as it is.
 * Same words and photographs (data/about-page, aboutValues).
 */
export default function ValuesList() {
  const { label, heading, intro, items } = aboutValues;
  const n = items.length;
  const [lead, setLead] = useState(0);
  const leadRef = useRef(0);
  leadRef.current = lead;
  const paused = useRef(false);
  const seen = useRef(false);
  /** When the large tile last changed, or the section last came into view: each turn waits HOLD from then. */
  const since = useRef(0);
  const ref = useRef<HTMLElement>(null);

  const show = (i: number) => {
    since.current = performance.now();
    const doc = document as DocWithVT;
    if (doc.startViewTransition && !prefersReducedMotion()) doc.startViewTransition(() => flushSync(() => setLead(i)));
    else setLead(i);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen.current) since.current = performance.now();
        seen.current = e.isIntersecting;
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    const t = window.setInterval(() => {
      if (!seen.current || paused.current || document.hidden || performance.now() - since.current < HOLD) return;
      show((leadRef.current + 1) % n);
    }, 250);
    return () => {
      io.disconnect();
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  // Each value's place: the large one is `lead`, the others follow it round in order.
  const slotOf = (i: number) => (i - lead + n) % n;

  return (
    <section ref={ref} className="ab-sec ab-vb" aria-labelledby="abValues2">
      <header className="ab-vb__hd">
        <div>
          <span className="ab-rv">
            <span className="ab-lbl">{label}</span>
          </span>
          <h2 id="abValues2" className="ab-h2 ab-rv" style={{ "--d": ".06s" } as CSSProperties}>
            {heading}
          </h2>
        </div>
        <p className="ab-vb__intro ab-rv" style={{ "--d": ".12s" } as CSSProperties}>
          {intro}
        </p>
      </header>
      <ol
        className="ab-vb__grid ab-rv"
        style={{ "--d": ".1s" } as CSSProperties}
        onPointerEnter={() => (paused.current = true)}
        onPointerLeave={() => {
          paused.current = false;
          since.current = performance.now();
        }}
      >
        {items.map((item, i) => {
          const slot = slotOf(i);
          return (
            <li
              key={item.title}
              className="ab-vb__tile"
              data-lead={slot === 0 ? "" : undefined}
              style={{ ...SLOTS[slot], viewTransitionName: `ab-vb-${i}` } as CSSProperties}
              onClick={slot === 0 ? undefined : () => show(i)}
            >
              <figure className="ab-vb__ph">
                <img className="ab-vb__img" src={item.photo.src} alt="" width={item.photo.width} height={item.photo.height} loading="lazy" decoding="async" />
              </figure>
              <div className="ab-vb__tx">
                <h3 className="ab-vb__t">{item.title}</h3>
                <p className="ab-vb__d">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
