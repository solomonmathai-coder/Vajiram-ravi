"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Photo from "@/components/ui/Photo";
import type { Review } from "@/data/home";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { clamp01, followScroll } from "@/lib/scroll";

/** Distance between neighbouring cards' centres along the ribbon (cards are 760px wide). */
const SPACING = 940;
/** Where the first card sits when the section pins (in the centre), and the last when it lets go. */
const FIRST_AT = 0;
const LAST_AT = 300;
/** Page scroll, in canvas pixels, over which the cards travel along the ribbon. */
const TRAVEL = 3000;
const SMOOTHING_MS = 160;
/**
 * The ribbon's shape, after wisprflow.ai. It runs through the middle of the space below the heading
 * and climbs from the lower left to the upper right by RISE × 2 of that space, bending over CURVE
 * pixels either side of the centre. Cards tilt back up to MAX_TILT° as they move away from the
 * centre, and sink up to DEPTH pixels into the screen.
 */
const RISE = 0.39;
const CURVE = 755;
const TILT_CURVE = 850;
const MAX_TILT = 50;
const DEPTH = 172;
/** Cards further than this from the centre are off screen, so they are not drawn. */
const OFF_SCREEN = 2400;
/** Stage height, and where the heading ends in it, before the browser measures them (1440 × 900 screen). */
const DEFAULT_STAGE = 900;
const DEFAULT_HEADING_END = 233;

/**
 * Where a card sits on the ribbon, given how far its centre is from the stage's centre. Values are
 * rounded so the server-rendered style matches what the browser keeps (it trims long decimals).
 */
function place(offset: number, stageHeight: number, headingEnd: number): string {
  const bend = Math.tanh(offset / CURVE);
  const room = stageHeight - headingEnd;
  // The middle of the space below the heading, measured from the stage's centre.
  const y = headingEnd / 2 - RISE * room * bend;
  const z = -DEPTH * bend * bend;
  const tilt = MAX_TILT * Math.tanh(offset / TILT_CURVE);
  return `translate3d(${offset.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${tilt.toFixed(2)}deg)`;
}

function offsetOf(index: number, count: number, progress: number): number {
  const distance = (count - 1) * SPACING + (LAST_AT - FIRST_AT);
  return FIRST_AT + progress * distance - index * SPACING;
}

type ReviewRibbonProps = {
  reviews: Review[];
  /** The section heading. It stays at the top of the pinned stage while the cards travel. */
  children: ReactNode;
};

/**
 * Testimonial cards on a curved ribbon, after wisprflow.ai. The section pins while you scroll, with
 * its heading held at the top, and the cards travel along an S-shaped path below it: they come in low
 * on the left, tilted back like cards on a floor, rise to face you in the centre, then carry on up to
 * the right, tilting away, and slide out under a white fade behind the heading.
 * The stage's perspective gives the tilted cards their slanted look.
 */
export default function ReviewRibbon({ reviews, children }: ReviewRibbonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const heading = headingRef.current;
    if (!wrap || !stage || !heading) return;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-review]"));
    let stageHeight = DEFAULT_STAGE;
    let headingEnd = DEFAULT_HEADING_END;

    // The stage fills the window; the wrapper adds the scroll distance the cards travel over.
    const size = () => {
      stageHeight = window.innerHeight / getCanvasZoom();
      headingEnd = heading.offsetTop + heading.offsetHeight;
      stage.style.height = `${stageHeight}px`;
      wrap.style.height = `${stageHeight + TRAVEL}px`;
    };
    size();
    window.addEventListener("resize", size);

    const stop = followScroll(
      () => {
        const box = wrap.getBoundingClientRect();
        const scale = box.height / wrap.offsetHeight || 1;
        return clamp01(-box.top / scale / TRAVEL);
      },
      (progress) => {
        cards.forEach((card, i) => {
          const offset = offsetOf(i, cards.length, progress);
          card.style.transform = place(offset, stageHeight, headingEnd);
          card.style.visibility = Math.abs(offset) > OFF_SCREEN ? "hidden" : "visible";
        });
      },
      SMOOTHING_MS,
    );
    return () => {
      stop();
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative" style={{ height: DEFAULT_STAGE + TRAVEL }}>
      <div
        ref={stageRef}
        className="sticky top-0 overflow-clip [perspective:1924px]"
        style={{ height: DEFAULT_STAGE }}
      >
        {reviews.map((review, i) => {
          const offset = offsetOf(i, reviews.length, 0);
          return (
            <figure
              key={review.name}
              data-review
              // 760 × 440, centred on the stage's centre before its ribbon transform.
              className={cx(
                "absolute top-1/2 left-1/2 -mt-[220px] -ml-[380px] flex h-[440px] w-[760px] gap-10 rounded-[40px] py-3.5 pr-9 pl-3.5 will-change-transform",
                review.tint,
              )}
              style={{
                transform: place(offset, DEFAULT_STAGE, DEFAULT_HEADING_END),
                visibility: Math.abs(offset) > OFF_SCREEN ? "hidden" : "visible",
              }}
            >
              <Photo
                className="relative w-[340px] shrink-0 overflow-hidden rounded-[28px]"
                src={review.photo}
                alt={`Portrait of ${review.name}`}
                sizes="340px"
              />
              <div className="flex min-w-px flex-1 flex-col justify-between pt-[22px] pb-2.5">
                <blockquote className="font-display text-[28px]/[34px] font-medium tracking-[-0.015em] text-neutral-900">
                  {review.quote}
                </blockquote>
                <figcaption className="flex flex-col gap-0.5">
                  <span className="font-display text-[16px]/[22px] font-semibold text-neutral-900">{review.name}</span>
                  <span className="font-sans text-[14px]/[20px] font-medium text-neutral-800">{review.line}</span>
                </figcaption>
              </div>
            </figure>
          );
        })}

        {/* The heading, above the cards; the fade behind it lets them slide out under it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[318px] bg-linear-to-b from-white from-60% to-white/0"
        />
        {/* The top padding keeps the heading clear of the 80px header while the stage is pinned. */}
        <div ref={headingRef} className="relative z-10 pt-28">
          {children}
        </div>
      </div>
    </div>
  );
}
