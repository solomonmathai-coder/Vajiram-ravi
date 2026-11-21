"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { topperYears, toppersByYear, toppersIntro, type Topper, type TopperYear } from "@/data/topperArchive";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/** The masonry: five columns of cards, 16px apart, in the content's width less the year rail. */
const GRID_W = 1140;
const COLS = 5;
const GAP = 16;
const COL_W = (GRID_W - GAP * (COLS - 1)) / COLS;
/** The cards' heights, in turn, so the columns stagger (the Figma card is 300 tall). */
const HEIGHTS = [300, 256, 324, 280, 244, 312, 268];

/** Each card's place: the next card goes into the shortest column (React Bits' Masonry). */
function layout(n: number) {
  const tops = new Array<number>(COLS).fill(0);
  const places = Array.from({ length: n }, (_, i) => {
    const col = tops.indexOf(Math.min(...tops));
    const h = HEIGHTS[i % HEIGHTS.length];
    const place = { x: col * (COL_W + GAP), y: tops[col], h };
    tops[col] += h + GAP;
    return place;
  });
  return { places, height: Math.max(0, ...tops) - GAP };
}

/**
 * The toppers (homepage v2, IA 3; Figma 2392:5005, "08 · Our Results & Student Stories"): the eyebrow
 * between its ornaments, the heading, then the year's toppers as the Figma's portrait cards in a masonry
 * (after React Bits' "Masonry": each card goes into the shortest column, and they rise into place from
 * below out of a blur, one after another, when the grid comes into view and whenever the year changes;
 * a card under the pointer draws back a little), with the Figma's year rail on the right (2025 back to
 * 2016). A year shows its first 10 (two rows); "Show all" brings in the rest, and the last link goes to every
 * selection on vajiramandravi.com.
 *
 * The card (Figma "AIR n"): 20px corners on a dark ground, the photograph filling it, a dark fade up from
 * its foot, the rank in a chip at the top left and the name and the programmes at the foot. Every rank
 * is in the orange chip (the client: all like AIR 1's); AIR 1 also has a 2px orange border. The photographs and the archive are design S's (data/toppers).
 *
 * Reduced motion: the cards are simply there. The rail is a list of toggle buttons; the grid is a list.
 */
export default function Toppers() {
  const [year, setYear] = useState<TopperYear>(topperYears[0]);
  const [all, setAll] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);
  const [seen, setSeen] = useState(false);
  // Which cards to bring in: the whole year on a change of year, only the new ones on "Show all".
  const fromRef = useRef(0);

  const list = toppersByYear[year];
  const shown = all ? list : list.slice(0, toppersIntro.first);
  const { places, height } = useMemo(() => layout(shown.length), [shown.length]);

  // The first entrance waits until the grid is well in view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (prefersReducedMotion()) {
      setSeen(true);
      return;
    }
    return whenVisible(grid, 0.25, () => setSeen(true));
  }, []);

  // Each entrance: the cards from `fromRef` on rise from 80px below, out of a 10px blur, 50ms apart.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || !seen || prefersReducedMotion()) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-card]")).slice(fromRef.current);
    const animations = cards.map((card, i) =>
      card.animate(
        [
          { opacity: 0, transform: "translateY(80px)", filter: "blur(10px)" },
          { opacity: 1, transform: "none", filter: "blur(0)" },
        ],
        { duration: 800, delay: Math.min(i, 14) * 50, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
      ),
    );
    return () => animations.forEach((animation) => animation.cancel());
  }, [seen, year, all]);

  const chooseYear = (y: TopperYear) => {
    if (y === year) return;
    fromRef.current = 0;
    setAll(false);
    setYear(y);
  };
  const toggleAll = () => {
    fromRef.current = all ? 0 : toppersIntro.first;
    setAll((a) => !a);
  };

  return (
    <section id="toppers" aria-labelledby="toppers-h" className="relative bg-white">
      <div className="mx-auto flex w-canvas flex-col items-center px-20 pt-20 pb-16">
        {/* The eyebrow between its block-print ornaments (Figma "Ornament / Eyebrow"). */}
        <p className="flex items-center gap-2.5 text-[13px]/[16px] font-semibold tracking-[0.06em] text-orange uppercase">
          <img src="/images/ornaments/eyebrow-line-lead.svg" alt="" aria-hidden="true" width={84} height={8} className="h-2 w-[84px] -scale-x-100" />
          <img src="/images/ornaments/butta.svg" alt="" aria-hidden="true" width={14} height={14} className="size-3.5" />
          {toppersIntro.eyebrow} {year}
          <img src="/images/ornaments/butta.svg" alt="" aria-hidden="true" width={14} height={14} className="size-3.5" />
          <img src="/images/ornaments/eyebrow-line-lead.svg" alt="" aria-hidden="true" width={84} height={8} className="h-2 w-[84px]" />
        </p>
        <h2 id="toppers-h" className="mt-4 w-[760px] text-center font-heading text-[56px]/[1.06] font-semibold tracking-[-0.02em] text-ink">
          {toppersIntro.heading.before}
          <em className="text-orange not-italic">{toppersIntro.heading.em}</em>
        </h2>

        <div className="mt-12 flex w-full items-start justify-between">
          <div className="flex flex-col items-center" style={{ width: GRID_W }}>
            <ul ref={gridRef} aria-label={`UPSC CSE ${year} toppers`} className="relative w-full" style={{ height }}>
              {shown.map((topper, i) => (
                <li
                  key={`${year}-${topper.rank}-${topper.name}`}
                  data-card
                  className="absolute"
                  style={{ left: places[i].x, top: places[i].y, width: COL_W, height: places[i].h, opacity: seen ? undefined : 0 }}
                >
                  <TopperCard topper={topper} year={year} />
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-6">
              {list.length > toppersIntro.first && (
                <button
                  type="button"
                  onClick={toggleAll}
                  aria-expanded={all}
                  className="cursor-pointer rounded-full border border-orange/40 bg-white px-5 py-2.5 text-[15px]/[20px] font-semibold text-burnt [transition:background-color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out)] hover:border-orange hover:bg-orange/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burnt"
                >
                  {all ? toppersIntro.showLess : toppersIntro.showAll(list.length, year)}
                </button>
              )}
              <a
                href={toppersIntro.allSelections.href}
                className="text-[15px]/[20px] font-semibold text-burnt underline decoration-burnt/30 underline-offset-4 [transition:text-decoration-color_var(--dur-fast)_var(--ease-out)] hover:decoration-burnt"
              >
                {toppersIntro.allSelections.label}
              </a>
            </div>
          </div>

          <YearRail year={year} onChoose={chooseYear} />
        </div>
      </div>
    </section>
  );
}

/** One topper, as the Figma card. */
function TopperCard({ topper, year }: { topper: Topper; year: number }) {
  const first = topper.rank === 1;
  return (
    <figure
      className={cx(
        "group/card relative size-full overflow-clip rounded-[20px] bg-[#2a2622] [transition:scale_400ms_var(--ease-out)] hover:scale-[0.97]",
        first && "ring-2 ring-[#e57512] ring-inset",
      )}
    >
      <img
        src={topper.photo}
        alt=""
        width={topper.width}
        height={topper.height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-top [transition:scale_700ms_var(--ease-out)] group-hover/card:scale-[1.04]"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-b from-[rgb(18_17_16/0)] to-[rgb(18_17_16/0.92)]" />
      <span
        className={cx(
          "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[12px]/[14px] font-semibold tracking-[0.02em] text-white",
          "bg-[#e57512]",
        )}
      >
        AIR {topper.rank}
      </span>
      <figcaption className="absolute inset-x-4 bottom-4 text-white">
        <span className="block text-[17px]/[1.2] font-semibold">{topper.name}</span>
        <span className="mt-1 block text-[12px]/[1.35] text-white/70">{topper.programmes || `UPSC CSE ${year}`}</span>
      </figcaption>
    </figure>
  );
}

/**
 * The year rail (Figma): the years down the right, newest first, on a column of fine ticks; the chosen
 * year in orange and larger, with its long tick in orange.
 */
function YearRail({ year, onChoose }: { year: TopperYear; onChoose: (y: TopperYear) => void }) {
  return (
    <div role="group" aria-label="Choose a year" className="relative mt-2 flex w-[110px] shrink-0 flex-col">
      {/* The ticks behind the years. */}
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[62px] w-[30px]"
        style={{ background: "repeating-linear-gradient(180deg, #e5e6ea 0 1px, transparent 1px 5px)" }}
      />
      {topperYears.map((y) => {
        const on = y === year;
        return (
          <button
            key={y}
            type="button"
            aria-pressed={on}
            onClick={() => onChoose(y)}
            className="group/y relative flex h-[34px] cursor-pointer items-center bg-white/0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burnt"
          >
            <span
              className={cx(
                "w-[40px] [transition:color_var(--dur-fast)_var(--ease-out),font-size_var(--dur-fast)_var(--ease-out)]",
                on ? "text-[15px]/[22px] font-semibold text-[#e57512]" : "text-[12px]/[14px] font-medium text-[#8f9095] group-hover/y:text-ink",
              )}
            >
              {y}
            </span>
            <span
              aria-hidden="true"
              className={cx(
                "absolute left-[43px] h-px w-[68px] bg-linear-to-r to-white/40",
                on ? "from-[#e57512]" : "from-[#a1a2a7] group-hover/y:from-ink",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
