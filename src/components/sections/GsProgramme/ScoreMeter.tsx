"use client";

import { useEffect, useState } from "react";
import CountUp from "@/components/ui/CountUp";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { useInView } from "@/lib/useInView";

/** Segments in each meter. */
const BARS = 36;
/** Delay between one segment lighting and the next. */
const STAGGER_MS = 12;
/** How long one segment takes to light. */
const LIGHT_MS = 300;
/** Share of the figure that must be on screen; the same as the CountUp threshold, so both start together. */
const THRESHOLD = 0.4;

type ScoreMeterProps = {
  stage: string;
  /** Marks from General Studies, as shown, e.g. "1,000". */
  marks: string;
  /** The stage's total, as shown after the figure, e.g. "/1,750". */
  total: string;
  /** Share of the stage's marks that General Studies carries, 0 to 1. */
  share: number;
  caption: string;
};

/**
 * A score meter: a segmented bar where the General Studies share is lit orange. On first view the
 * segments light up left to right while the figure counts up, so both land together.
 * The server renders the finished meter, so it reads correctly without JavaScript.
 */
export default function ScoreMeter({ stage, marks, total, share, caption }: ScoreMeterProps) {
  const lit = Math.round(share * BARS);
  const [figureRef, inView] = useInView<HTMLParagraphElement>({ threshold: THRESHOLD });
  // Unlit and waiting for the first view; skipped when motion is reduced.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!prefersReducedMotion() && "IntersectionObserver" in window) setArmed(true);
  }, []);

  const filling = armed && inView;
  const showLit = !armed || inView;

  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-4 rounded-3xl border border-paper/8 bg-soot p-6 backdrop-blur-[8px]">
      <p className="text-[13px]/[1.5] font-medium whitespace-nowrap text-cream/60">{stage}</p>
      <p ref={figureRef} className="text-[44px]/none font-medium tracking-[-1.76px] whitespace-nowrap text-cream">
        <CountUp value={marks} duration={lit * STAGGER_MS + LIGHT_MS} threshold={THRESHOLD} />
        <span className="text-[22px]/none text-cream/40">{total}</span>
      </p>
      {/* Fixed 5px segments, as in the design; the row runs slightly into the card's right padding. */}
      <div className="flex h-11 w-full items-end gap-[3px]" aria-hidden="true">
        {Array.from({ length: BARS }, (_, i) => (
          <span
            key={i}
            className={cx(
              "h-11 w-[5px] shrink-0 rounded-[2px]",
              filling && "transition-colors ease-[cubic-bezier(.2,.8,.2,1)]",
              i < lit && showLit ? "bg-orange" : "bg-paper/14",
            )}
            style={filling ? { transitionDuration: `${LIGHT_MS}ms`, transitionDelay: `${i * STAGGER_MS}ms` } : undefined}
          />
        ))}
      </div>
      <p className="text-[13px]/[1.5] whitespace-nowrap text-cream/60">{caption}</p>
    </div>
  );
}
