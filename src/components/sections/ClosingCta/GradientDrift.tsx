"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** How far the gradient drifts up and down from where the design has it, in canvas px. */
const DRIFT_PX = 75;
const LOOP_MS = 12000;
// Sine easings, so the drift slows only at its turning points.
const SINE_OUT = "cubic-bezier(.61,1,.88,1)";
const SINE_IN = "cubic-bezier(.12,0,.39,0)";

/**
 * The banner's warm gradient (orange → tangerine at 55% → peach), drifting very slowly up and down on a
 * 12s loop. The layer is 150px taller than the 500px banner and continues the gradient past both ends,
 * so at rest the banner shows exactly the design's gradient. It moves the layer rather than repainting
 * the background each frame, which looks the same as a background-position drift. Off screen it pauses;
 * with reduced motion it stays still.
 */
export default function GradientDrift() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const drift = el.animate(
      [
        { transform: "translateY(0)", easing: SINE_OUT },
        { transform: `translateY(${DRIFT_PX}px)`, easing: SINE_IN },
        { transform: "translateY(0)", easing: SINE_OUT },
        { transform: `translateY(${-DRIFT_PX}px)`, easing: SINE_IN },
        { transform: "translateY(0)" },
      ],
      { duration: LOOP_MS, iterations: Infinity },
    );
    if (!("IntersectionObserver" in window)) return () => drift.cancel();
    drift.pause();
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? drift.play() : drift.pause()));
    observer.observe(el);
    return () => {
      observer.disconnect();
      drift.cancel();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[-75px] h-[650px] bg-[linear-gradient(180deg,#e96106_0%,#ee6a12_11.54%,#ff8a3d_53.85%,#ffd6a3_88.46%,#ffefc5_100%)] will-change-transform"
    />
  );
}
