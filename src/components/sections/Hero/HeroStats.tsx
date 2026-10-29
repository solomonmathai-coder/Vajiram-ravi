"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { HeroStat } from "@/data/home";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";

const COUNT_MS = 1100;

/**
 * The four headline numbers. If they start below the fold they count up from zero the first
 * time they scroll into view; otherwise they simply show their final values.
 */
export default function HeroStats({ stats }: { stats: HeroStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState(() => stats.map((stat) => stat.value));

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const viewportHeight = window.innerHeight / getCanvasZoom();
    if (canvasTop(el) <= viewportHeight * 0.85) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        let startedAt: number | null = null;
        const tick = (now: number) => {
          startedAt ??= now;
          const progress = Math.min(1, (now - startedAt) / COUNT_MS);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValues(stats.map((stat) => Math.round(stat.value * eased)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stats]);

  return (
    <div className="relative z-10 mx-auto flex w-canvas animate-fade-rise-delay-3 justify-center px-6 pb-10">
      {/* A frosted panel keeps the numbers readable over the bright foreground of the video. */}
      <div
        className="liquid-glass flex items-stretch rounded-[28px] bg-navy/45! px-2 py-6 backdrop-blur-xl!"
        id="stats"
        ref={ref}
      >
        {stats.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && <div className="w-px self-stretch bg-white/15" />}
            <div className="flex w-[232px] flex-col items-center gap-2 px-5 text-center">
              <b className="font-serif text-[52px]/none font-normal tracking-[-1px] whitespace-nowrap text-white tabular-nums">
                {stat.format.replace("{n}", String(values[i]))}
              </b>
              <span className="font-inter text-sm/snug text-white/75">{stat.label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
