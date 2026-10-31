"use client";

import { useEffect, useRef, type CSSProperties, type FocusEvent, type ReactNode } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { ARROW_TILE, NUDGE } from "@/components/ui/Buttons";
import Photo from "@/components/ui/Photo";
import type { Course } from "@/data/home";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { clamp01, followScroll } from "@/lib/scroll";

/** Card width and the space between cards, from the design. */
const CARD_WIDTH = 447.5;
const GAP = 16;
/** The canvas's content width (1440 less 40px either side). The rail starts and ends inside it. */
const VIEW_WIDTH = 1360;
/** How far below their place the cards wait before they rise in. */
const RISE = 28;
/**
 * The cards rise over ENTRY of a screen's height of scroll, from the moment they come up into view,
 * each STAGGER of that later than the one before it. Only the first few are on screen, so the delay
 * stops growing after MAX_DELAYED cards.
 */
const ENTRY = 0.6;
const STAGGER = 0.1;
const MAX_DELAYED = 3;
const SMOOTHING_MS = 120;
/** Stage height before the browser measures it (1440 × 900 screen). */
const DEFAULT_STAGE = 900;
/**
 * The stage is a full window tall, so below the progress line it is empty. The wrapper pulls the next
 * section up over that empty part so it starts right under the line, sliding in as the rail finishes.
 * DEFAULT_LINE_END is where the line ends on a 1440 × 900 screen.
 */
const DEFAULT_LINE_END = 757;
const overlap = (stageHeight: number, lineEnd: number) => Math.max(0, stageHeight - lineEnd);

/**
 * The warm glow behind the pinned stage, after the Patrol section on antimetal.com: a band that runs
 * from cream through peach and burnt orange to dusty pink, with a fine grain over it. It fades in
 * from the top, so the heading sits on white, and fades out just above the bottom edge.
 */
const GLOW: CSSProperties = {
  backgroundColor: "#f6ecdf",
  backgroundImage:
    "url(/images/textures/grain.svg), linear-gradient(174deg, #faf6ef 0%, #f6ebde 29%, #ebbd90 46%, #d98a52 60%, #d5a792 74%, #e5c4b5 85%, #f1e2cf 96%, #f6ecdf 100%)",
  backgroundSize: "160px 160px, 100% calc(100% + 96px)",
  backgroundPosition: "0 0, 50% 0",
  backgroundRepeat: "repeat, no-repeat",
  filter: "saturate(0.84)",
  maskImage:
    "linear-gradient(transparent 0%, rgb(0 0 0 / .03) 5%, rgb(0 0 0 / .15) 11%, rgb(0 0 0 / .44) 20%, rgb(0 0 0 / .78) 30%, #000 42%, #000 calc(100% - 96px), rgb(0 0 0 / .65) calc(100% - 48px), rgb(0 0 0 / .35) calc(100% - 30px), rgb(0 0 0 / .08) calc(100% - 12px), transparent 100%)",
};

/** How far the rail slides, which is also how much page scroll it takes. */
function railTravel(count: number): number {
  return count * CARD_WIDTH + (count - 1) * GAP - VIEW_WIDTH;
}

function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

type CourseRailProps = {
  courses: Course[];
  /** The section heading row. It stays at the top of the pinned stage. */
  children: ReactNode;
};

/**
 * The courses on a horizontal rail, after the Sunnyside section on godaylight.com, set on a warm glow
 * after antimetal.com (GLOW):
 * - As the section comes up, the cards rise into place one after another.
 * - The section then pins, and scrolling down slides the rail sideways, card by card, with a thin
 *   line under it that fills as you go.
 * Tabbing to a card that is off to the side scrolls the page until the card is in view.
 */
export default function CourseRail({ courses, children }: CourseRailProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const travel = railTravel(courses.length);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!wrap || !stage || !track || !fill) return;
    const cards = Array.from(track.children) as HTMLElement[];
    let stageHeight = DEFAULT_STAGE;
    // Where the cards sit in the stage, below the heading.
    let cardsTop = 0;

    // The stage fills the window; the wrapper adds the scroll distance the rail takes.
    const size = () => {
      stageHeight = window.innerHeight / getCanvasZoom();
      stage.style.height = `${stageHeight}px`;
      wrap.style.height = `${stageHeight + travel}px`;
      cardsTop = track.offsetTop;
      const box = stage.getBoundingClientRect();
      const scale = box.height / stage.offsetHeight || 1;
      const lineEnd = ((fill.parentElement ?? fill).getBoundingClientRect().bottom - box.top) / scale;
      wrap.style.marginBottom = `${-overlap(stageHeight, lineEnd)}px`;
    };
    size();
    window.addEventListener("resize", size);

    const stop = followScroll(
      // The wrapper's top, in canvas pixels from the top of the window.
      () => {
        const box = wrap.getBoundingClientRect();
        return box.top / (box.height / wrap.offsetHeight || 1);
      },
      (top) => {
        const entry = clamp01((stageHeight - cardsTop - top) / (stageHeight * ENTRY));
        cards.forEach((card, i) => {
          const delay = Math.min(i, MAX_DELAYED) * STAGGER;
          const rise = easeOut(clamp01((entry - delay) / (1 - MAX_DELAYED * STAGGER)));
          card.style.transform = `translate3d(0, ${(RISE * (1 - rise)).toFixed(2)}px, 0)`;
        });
        const progress = clamp01(-top / travel);
        track.style.transform = `translate3d(${(-progress * travel).toFixed(2)}px, 0, 0)`;
        fill.style.transform = `scaleX(${progress.toFixed(4)})`;
      },
      SMOOTHING_MS,
    );
    return () => {
      stop();
      window.removeEventListener("resize", size);
    };
  }, [travel]);

  // The rail is clipped, so the browser cannot scroll a focused card into view by itself.
  const onCardFocus = (index: number) => (event: FocusEvent<HTMLAnchorElement>) => {
    const wrap = wrapRef.current;
    if (!wrap || !event.currentTarget.matches(":focus-visible")) return;
    const centre = index * (CARD_WIDTH + GAP) + CARD_WIDTH / 2;
    const progress = clamp01((centre - VIEW_WIDTH / 2) / travel);
    const box = wrap.getBoundingClientRect();
    const scale = box.height / wrap.offsetHeight || 1;
    window.scrollTo({ top: window.scrollY + box.top + progress * travel * scale });
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: DEFAULT_STAGE + travel, marginBottom: -overlap(DEFAULT_STAGE, DEFAULT_LINE_END) }}
    >
      <div ref={stageRef} className="sticky top-0 overflow-clip" style={{ height: DEFAULT_STAGE }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={GLOW} />
        {/* The top padding keeps the heading clear of the 80px header while the stage is pinned. */}
        <div className="relative mx-auto flex w-canvas flex-col gap-12 px-10 pt-28">
          {children}

          <div>
            <ul ref={trackRef} className="flex w-max gap-4 will-change-transform">
              {courses.map((course, i) => (
                <li key={course.title} style={{ transform: `translate3d(0, ${RISE}px, 0)` }}>
                  <article className="group relative flex h-[482px] w-[447.5px] flex-col gap-5 overflow-clip rounded-xl border border-sand-200 bg-white p-2 shadow-[0_1px_3px_rgba(66,18,5,.08)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-brand-700">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded-[4px] bg-sand-200 px-2.5 py-1.5 font-mono text-[12px]/[16px] font-medium tracking-[0.72px] whitespace-nowrap text-neutral-700">
                          {course.count} COURSES
                        </span>
                        <span className={cx(ARROW_TILE, "group-hover:bg-brand-600")}>
                          <ArrowUpRightIcon className={cx(NUDGE, "group-hover:translate-x-px group-hover:-translate-y-px")} />
                        </span>
                      </div>
                      <Photo
                        className="relative h-[224px] w-full overflow-hidden rounded-lg bg-sand-200 transition-opacity duration-300 group-hover:opacity-90"
                        src={course.image}
                        alt=""
                        sizes="432px"
                      />
                    </div>
                    <div className="flex flex-col gap-2.5 px-2 font-medium">
                      <h3 className="font-display text-[24px]/[30px] tracking-[-0.24px] text-neutral-900">
                        {/* The link covers the whole card. */}
                        <a
                          href={course.href}
                          onFocus={onCardFocus(i)}
                          className="after:absolute after:inset-0 focus-visible:outline-none"
                        >
                          {course.title}
                        </a>
                      </h3>
                      <p className="font-sans text-[15px]/[22px] text-neutral-600">{course.description}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {/* How far along the rail you are. */}
            <div aria-hidden="true" className="relative mt-9 h-px bg-neutral-900/15">
              <div ref={fillRef} className="absolute inset-0 origin-left bg-white" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
