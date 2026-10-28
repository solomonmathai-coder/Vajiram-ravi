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
    <div className="flex items-center justify-center gap-4 pt-10" id="stats" ref={ref}>
      {stats.map((stat, i) => (
        <Fragment key={stat.label}>
          {i > 0 && <div className="h-[105px] w-px bg-neutral-200" />}
          <div className="flex h-[115px] w-[172px] flex-col items-center gap-1 text-center font-display font-medium">
            <b className="text-[40px]/[47px] font-medium whitespace-nowrap text-brand-950 tabular-nums">
              {stat.format.replace("{n}", String(values[i]))}
            </b>
            <span className="w-full text-[18px]/[28px] text-neutral-600">{stat.label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
