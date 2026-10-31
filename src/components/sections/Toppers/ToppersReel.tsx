"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getCanvasZoom } from "@/lib/canvas";
import { clamp01, followScroll } from "@/lib/scroll";

const CARD_WIDTH = 260;
const CARD_HEIGHT = 360;
/** Distance between the centres of neighbouring cards. */
const STEP = 284;
/** Page scroll, in canvas pixels, that moves the reel on by one card. */
const SCROLL_PER_CARD = 150;
/** How long each card lingers in the centre: 0 moves at an even pace, 1 stops briefly on every card. */
const DWELL = 0.7;
const SMOOTHING_MS = 140;
/** Height of the stage before the browser measures the window (a 1440 × 900 screen). */
const DEFAULT_STAGE = 900;

/** Slows the reel near whole numbers, so each card settles in the centre for a moment. */
function dwell(position: number): number {
  return position - (DWELL * Math.sin(2 * Math.PI * position)) / (2 * Math.PI);
}

type ToppersReelProps = {
  /** Number of cards. */
  count: number;
  /** The heading block, shown above the cards while they move. */
  children: ReactNode;
};

/**
 * A reel of cards that moves sideways as the page scrolls, after exp.fiddle.digital.
 * - The section stays pinned for the length of the reel while each card in turn slides into the centre.
 * - The centre card is the largest; cards shrink a little with distance, and those near the edges
 *   turn in towards the viewer, as if set around the inside of a curved wall.
 * - The movement is eased, and it lingers briefly on each card.
 */
export default function ToppersReel({ count, children }: ToppersReelProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const travel = (count - 1) * SCROLL_PER_CARD;

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));

    // The stage fills the window; the wrapper adds the scroll distance the reel moves over.
    const size = () => {
      const height = window.innerHeight / getCanvasZoom();
      stage.style.height = `${height}px`;
      wrap.style.height = `${height + travel}px`;
    };
    size();
    window.addEventListener("resize", size);

    const stop = followScroll(
      () => {
        const box = wrap.getBoundingClientRect();
        const scale = box.height / wrap.offsetHeight || 1;
        return clamp01(-box.top / scale / travel);
      },
      (progress) => {
        const position = dwell(progress * (count - 1));
        cards.forEach((card, i) => {
          const distance = i - position;
          const away = Math.abs(distance);
          const turn = -Math.sign(distance) * Math.min(Math.max(0, away - 1.2) * 30, 62);
          const scale = 1 - 0.07 * Math.min(away, 2.5);
          card.style.transform = `translateX(${distance * STEP}px) rotateY(${turn}deg) scale(${scale})`;
          card.style.opacity = String(clamp01(3.6 - away));
          card.dataset.current = String(away < 0.5);
        });
      },
      SMOOTHING_MS,
    );

    return () => {
      stop();
      window.removeEventListener("resize", size);
    };
  }, [count, travel]);

  return (
    <div ref={wrapRef} className="relative" style={{ height: DEFAULT_STAGE + travel }}>
      <div ref={stageRef} className="sticky top-0 flex flex-col overflow-x-clip" style={{ height: DEFAULT_STAGE }}>
        {/* The top padding keeps the heading clear of the 80px header while the stage is pinned. */}
        <div className="mx-auto w-canvas px-10 pt-28">{children}</div>
        {/* Blank placeholder cards for now, so they are hidden from screen readers. */}
        <div className="relative flex-1" aria-hidden="true">
          <ol className="absolute top-1/2 left-1/2 [perspective:1600px]">
            {Array.from({ length: count }, (_, i) => (
              <li
                key={i}
                data-card
                className="group/card absolute flex flex-col gap-2.5 will-change-transform [transform-origin:50%_0]"
                style={{ width: CARD_WIDTH, left: -CARD_WIDTH / 2, top: -(CARD_HEIGHT + 30) / 2 }}
              >
                <span className="font-mono text-[11px]/[20px] tracking-[.04em] text-neutral-400 uppercase transition-colors duration-300 group-data-[current=true]/card:text-neutral-900">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="block rounded-2xl border border-line bg-media"
                  style={{ height: CARD_HEIGHT }}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
