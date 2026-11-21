"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * Each category's book (Kevin's bookFor() in js/course-finder.js): the homepage's cloth-bound programme book
 * (css/programme-shelf.css), its cloth colours, pressed motif, gold frame, name, emblem and course count, built
 * as a solid (back cover, spine, page block and top edge behind its front) so it shows its depth when it turns.
 * It does a full horizontal flip as its section comes into view and whenever it is hovered. A small book (the
 * Top Picks banner's) is the full-size book drawn whole and scaled down as one (.cf-bk-mini).
 */

const FOIL = "#f6c77a";

/** The cloth of each category's book: its three shades, emblem and pressed motif. */
export const COVER: Record<string, { light: string; base: string; deep: string; emblem: string; art: string }> = {
  top: { light: "#4a3b31", base: "#33281f", deep: "#1c1510", emblem: "layers", art: "arcs" },
  gs: { light: "#d9581c", base: "#c2410c", deep: "#8f3010", emblem: "books", art: "bars" },
  optional: { light: "#c0362c", base: "#a3231c", deep: "#701510", emblem: "quill", art: "circles" },
  csat: { light: "#2e6a80", base: "#1f4a5f", deep: "#14323f", emblem: "abacus", art: "grid" },
  interview: { light: "#5e5f63", base: "#4a4b4e", deep: "#303133", emblem: "mic", art: "arches" },
  mentorship: { light: "#b88a2e", base: "#9a7020", deep: "#6b4c12", emblem: "compass", art: "orbit" },
  "mains-ts": { light: "#a3545c", base: "#873f48", deep: "#5e2a31", emblem: "pen", art: "lines" },
  "prelims-ts": { light: "#7a3556", base: "#5e2742", deep: "#3f192c", emblem: "target", art: "target" },
  "optional-ts": { light: "#4f7d5a", base: "#3b6345", deep: "#26422d", emblem: "sprout", art: "steps" },
  module: { light: "#4b5d8a", base: "#3a4a72", deep: "#26314f", emblem: "blocks", art: "quarters" },
  crash: { light: "#336650", base: "#264f3e", deep: "#18352a", emblem: "hourglass", art: "diamonds" },
  enrichment: { light: "#5b4486", base: "#45336b", deep: "#2b1f48", emblem: "bolt", art: "chevrons" },
  ifos: { light: "#5d6b34", base: "#485428", deep: "#2f3819", emblem: "tree", art: "triangles" },
  postal: { light: "#9b6a43", base: "#7d5233", deep: "#553621", emblem: "books", art: "circles" },
};

/** The emblems, line drawings on 48 x 48 (from js/programme-shelf.js). */
const DRAW: Record<string, string> = {
  layers: '<path d="m24 15 9 4.5-9 4.5-9-4.5 9-4.5Z"/><path d="m15 24 9 4.5 9-4.5M15 28.5 24 33l9-4.5"/>',
  books: '<path d="M24 17c-2.6-1.8-6-2.4-10-2.2v16c4-.2 7.4.4 10 2.2 2.6-1.8 6-2.4 10-2.2v-16c-4-.2-7.4.4-10 2.2Z"/><path d="M24 17v16M17 20.5h3.5M17 24h3.5M27.5 20.5H31M27.5 24H31"/>',
  abacus: '<rect x="15" y="15" width="18" height="18" rx="2"/><path d="M15 21h18M15 27h18"/><circle cx="20" cy="21" r="1.6"/><circle cx="26" cy="21" r="1.6"/><circle cx="23" cy="27" r="1.6"/><circle cx="29" cy="27" r="1.6"/>',
  quill: '<path d="M33 15c-7 1-12 6-14 14l-1.5 4.5"/><path d="M33 15c-1 6-4.5 10.5-11 12.5"/><path d="M21 30.5h8"/>',
  target: '<circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="5"/><circle cx="24" cy="24" r="1.4"/><path d="m24 24 8-8M29 16h3v3"/>',
  pen: '<path d="M15 31h9M15 27h6M15 23h5"/><path d="m27 29.5 6.5-6.5a1.8 1.8 0 0 0-2.5-2.5L24.5 27 24 30Z"/>',
  compass: '<circle cx="24" cy="24" r="9"/><path d="m27.8 20.2-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3Z"/>',
  mic: '<rect x="20.5" y="14" width="7" height="12" rx="3.5"/><path d="M17 23.5a7 7 0 0 0 14 0M24 30.5V34M20.5 34h7"/>',
  sprout: '<path d="M24 33V22"/><path d="M24 24c0-5-3.5-8-9-8 0 5 3.5 8 9 8Z"/><path d="M24 27c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5Z"/><path d="M17 33h14"/>',
  bolt: '<path d="M26 14 18 26h6l-2 9 8-12h-6l2-9Z"/>',
  blocks: '<rect x="15" y="25" width="8" height="8" rx="1.2"/><rect x="25" y="25" width="8" height="8" rx="1.2"/><rect x="20" y="15" width="8" height="8" rx="1.2"/>',
  hourglass: '<path d="M17 14h14M17 34h14"/><path d="M18.5 14c0 5 5.5 6.5 5.5 10s-5.5 5-5.5 10h11c0-5-5.5-6.5-5.5-10s5.5-5 5.5-10"/>',
  tree: '<path d="M24 34v-6"/><path d="M24 14l-7 10h4l-5 6h16l-5-6h4Z"/>',
};

/** The pressed motifs, on 100 x 100 (from js/programme-shelf.js), as SVG markup. */
function geo(kind: string, accent: string, soft: string) {
  type A = Record<string, string | number> & { tag?: string };
  const m = (cls: string, a: A) =>
    `<${a.tag || "rect"} data-m="${cls}" ${Object.entries(a)
      .filter(([k]) => k !== "tag")
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ")}/>`;
  const P: Record<string, () => string[]> = {
    arcs: () => [m("s110", { tag: "circle", cx: 22, cy: 104, r: 48, fill: soft, opacity: 0.35 }), m("s118", { tag: "circle", cx: 22, cy: 104, r: 32, fill: soft, opacity: 0.5 }), m("ur", { tag: "circle", cx: 66, cy: 62, r: 9, fill: accent })],
    bars: () => [m("l14", { x: 52, y: 45, width: 60, height: 13, rx: 6.5, fill: accent }), m("r8", { x: 22, y: 62, width: 90, height: 16, rx: 8, fill: soft, opacity: 0.75 }), m("l10", { x: 30, y: 82, width: 80, height: 14, rx: 7, fill: soft, opacity: 0.45 })],
    circles: () => [m("s112", { tag: "circle", cx: 98, cy: 84, r: 44, fill: soft, opacity: 0.55 }), m("u6", { tag: "circle", cx: 20, cy: 104, r: 36, fill: soft, opacity: 0.45 }), m("ul", { tag: "circle", cx: 62, cy: 68, r: 16, fill: accent })],
    grid: () => [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => m(r === 1 && c === 1 ? "rot-c" : "rot", { x: 48 + c * 20, y: 46 + r * 20, width: 15, height: 15, rx: 2.5, fill: r === 1 && c === 1 ? accent : soft, opacity: r === 1 && c === 1 ? 1 : 0.6 }))),
    arches: () => [m("r8", { tag: "path", d: "M8 104 V82 A22 22 0 0 1 30 60 H30 V104 Z", fill: soft, opacity: 0.6 }), m("l8", { tag: "path", d: "M108 104 V82 A22 22 0 0 0 86 60 H86 V104 Z", fill: soft, opacity: 0.8 }), m("s16", { tag: "circle", cx: 58, cy: 76, r: 4, fill: accent })],
    lines: () => [m("sx", { x: 30, y: 44, width: 34, height: 8, rx: 2.5, fill: accent }), ...[[57, 22], [70, 44], [83, 20]].map(([y, w]) => m("sx", { x: 30, y, width: w, height: 8, rx: 2.5, fill: soft, opacity: 0.75 }))],
    target: () => [m("s108", { tag: "circle", cx: 58, cy: 76, r: 34, fill: soft, opacity: 0.35 }), m("s112", { tag: "circle", cx: 58, cy: 76, r: 23, fill: soft, opacity: 0.5 }), m("s116", { tag: "circle", cx: 58, cy: 76, r: 13, fill: soft, opacity: 0.7 }), m("s13", { tag: "circle", cx: 58, cy: 76, r: 6, fill: accent })],
    quarters: () => [m("u6", { tag: "path", d: "M30 104 V92 A26 26 0 0 1 56 66 V104 Z", fill: soft, opacity: 0.6 }), m("u10", { tag: "path", d: "M80 104 V90 A24 24 0 0 1 104 66 V104 Z", fill: soft, opacity: 0.75 }), m("dl", { tag: "circle", cx: 76, cy: 46, r: 3.5, fill: accent })],
    steps: () => [m("u6", { x: 38, y: 82, width: 20, height: 26, rx: 3, fill: soft, opacity: 0.45 }), m("u10", { x: 61, y: 66, width: 20, height: 42, rx: 3, fill: soft, opacity: 0.65 }), m("u14", { x: 84, y: 50, width: 20, height: 58, rx: 3, fill: accent })],
    chevrons: () => [0, 1, 2].map((k) => m("r14", { tag: "path", d: `M${36 + k * 20} 62 l16 16 -16 16 h9 l16 -16 -16 -16 Z`, fill: k === 2 ? accent : soft, opacity: k === 2 ? 1 : 0.45 + k * 0.2 })),
    orbit: () => [m("s110", { tag: "circle", cx: 70, cy: 80, r: 26, fill: "none", stroke: soft, "stroke-width": 5, opacity: 0.6 }), m("s116", { tag: "circle", cx: 70, cy: 80, r: 12, fill: soft, opacity: 0.55 }), m("or", { tag: "circle", cx: 46, cy: 62, r: 6, fill: accent })],
    diamonds: () => [m("rot", { tag: "path", d: "M58 54 76 72 58 90 40 72 Z", fill: soft, opacity: 0.55 }), m("rot", { tag: "path", d: "M84 70 98 84 84 98 70 84 Z", fill: soft, opacity: 0.75 }), m("rot-c", { tag: "path", d: "M86 44 94 52 86 60 78 52 Z", fill: accent })],
    triangles: () => [m("u6", { tag: "path", d: "M36 108 56 64 76 108 Z", fill: soft, opacity: 0.5 }), m("u10", { tag: "path", d: "M64 108 84 70 104 108 Z", fill: soft, opacity: 0.72 }), m("s16", { tag: "path", d: "M56 52 61 42 66 52 Z", fill: accent })],
  };
  return (P[kind] || P.bars)().join("");
}

/** The emblem: a foil line drawing in a ring whose dotted rule turns slowly. */
const Emblem = ({ kind, size }: { kind: string; size: number }) => (
  <svg className="ps-emblem" viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
    <g className="ps-emblem__ring">
      <circle cx="24" cy="24" r="21.5" strokeWidth=".9" strokeDasharray="1.2 2.4" />
    </g>
    <circle cx="24" cy="24" r="18.5" strokeWidth=".9" />
    <g className="ps-emblem__draw" dangerouslySetInnerHTML={{ __html: DRAW[kind] || DRAW.books }} />
  </svg>
);

/** The spine's width on these small covers. */
const SW = 11;

export default function Book({ k, label, n, small = false }: { k: string; label: string; n: number; small?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [flip, setFlip] = useState(false);
  const flipping = useRef(false);
  const timer = useRef(0);

  // the horizontal flip: once as its section comes into view, and again whenever it is hovered; it comes off
  // when the turn ends (a timer too, in case the animation never reports, as in a hidden tab)
  const done = () => {
    flipping.current = false;
    window.clearTimeout(timer.current);
    setFlip(false);
  };
  const start = () => {
    if (prefersReducedMotion() || flipping.current) return;
    flipping.current = true;
    setFlip(true);
    timer.current = window.setTimeout(done, 1200);
  };
  const startRef = useRef(start);
  startRef.current = start;

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let t = 0;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            io.unobserve(e.target);
            t = window.setTimeout(() => startRef.current(), 250);
          }
        }),
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
      window.clearTimeout(timer.current);
    };
  }, []);

  const c = COVER[k];
  if (!c) return null;
  const frame: CSSProperties = { top: 7, right: 7, bottom: 7, left: SW + 6 };
  const book = (
    <span
      ref={ref}
      className={`cf-bk ps-book${small ? " cf-bk--full" : ""}${flip ? " is-flip" : ""}`}
      aria-hidden="true"
      onMouseEnter={start}
      onAnimationEnd={(e) => {
        if (e.animationName === "cf-bk-flip") done();
      }}
    >
      <span className="cf-bk__body">
        <span className="ps-extras">
          <span className="ps-foot" />
          <span className="ps-back" style={{ backgroundColor: c.deep }} />
          <span className="ps-pages" />
        </span>
        <span className="cf-3d cf-3d--back" style={{ background: `linear-gradient(220deg, ${c.light}, ${c.base} 50%, ${c.deep})` }} />
        <span className="cf-3d cf-3d--spine" style={{ background: `linear-gradient(90deg, ${c.deep}, ${c.base} 45%, ${c.deep})` }}>
          <i />
          <i />
        </span>
        <span className="cf-3d cf-3d--pages" />
        <span className="cf-3d cf-3d--top" />
        <span className="ps-front" style={{ backgroundColor: c.base, backgroundImage: `linear-gradient(140deg, ${c.light} 0%, ${c.base} 48%, ${c.deep} 100%)` }}>
          <span className="ps-front__geo">
            <svg className="ps-geo" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: geo(c.art, FOIL, "#fff3dc") }} />
          </span>
          <span className="ps-cloth" />
          <span className="ps-grain" />
          <span className="ps-spine" style={{ width: SW, background: `linear-gradient(90deg, rgb(0 0 0 / .38), ${c.deep} 38%, ${c.base} 80%, rgb(0 0 0 / .2))` }} />
          <span className="ps-hinge" style={{ left: SW }} />
          <span className="ps-light" />
          <span className="ps-frame" style={frame}>
            <span />
          </span>
          <span className="ps-face" style={frame}>
            <span className="ps-face__name">{label}</span>
            <span className="ps-face__rule">
              <i />
              <b />
              <i />
            </span>
            <span className="ps-face__em">
              <Emblem kind={c.emblem} size={34} />
            </span>
            <span className="ps-face__foot">
              <span className="ps-face__cat">
                {n} {n === 1 ? "course" : "courses"}
              </span>
            </span>
          </span>
          <span className="ps-shine" />
        </span>
      </span>
    </span>
  );
  return small ? <span className="cf-bk-mini">{book}</span> : book;
}
