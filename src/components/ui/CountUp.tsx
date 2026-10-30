"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type CountUpProps = {
  /** The figure as shown, e.g. "50+", "10/10", "1,000". Its first number counts up; the rest stays. */
  value: string;
  /** Count time in milliseconds. */
  duration?: number;
  /** Share of the figure that must be on screen before it counts. */
  threshold?: number;
  className?: string;
};

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * A figure that counts up from 0 the first time it scrolls into view, as the design's "number flow".
 * The server renders the final value, so it reads correctly without JavaScript. The final text also
 * holds the width, so the line does not shift while the digits change.
 */
export default function CountUp({ value, duration = 900, threshold = 0.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const live = liveRef.current;
    const match = value.match(/\d[\d,]*/);
    if (!el || !live || !match || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const target = Number(match[0].replace(/,/g, ""));
    const grouped = match[0].includes(",");
    const before = value.slice(0, match.index);
    const after = value.slice((match.index ?? 0) + match[0].length);
    const format = (n: number) => before + (grouped ? n.toLocaleString("en-IN") : String(n)) + after;

    let frame = 0;
    live.textContent = format(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          live.textContent = format(Math.round(target * easeOut(t)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      live.textContent = value;
    };
  }, [value, duration, threshold]);

  return (
    <span ref={ref} className={`inline-grid ${className ?? ""}`}>
      {/* The final value keeps the width; the counting copy sits on top of it. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {value}
      </span>
      <span ref={liveRef} className="col-start-1 row-start-1">
        {value}
      </span>
    </span>
  );
}
