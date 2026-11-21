"use client";

import { useLayoutEffect, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { STATS } from "./model";

/*
 * The head's figures (the homepage hero's style): counted from the course data, each counting up once on load,
 * one after another, easing out. Each figure also sits, hidden, at its final width, so the line does not move
 * while it counts.
 */
export default function HeroStats() {
  const [shown, setShown] = useState<number[]>(() => STATS.map(([n]) => n));

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    setShown(STATS.map(() => 0));
    const frames: number[] = [];
    const now = performance.now();
    STATS.forEach(([to], i) => {
      const t0 = now + 250 + i * 120;
      const dur = 1100;
      const step = (t: number) => {
        const k = Math.min(1, Math.max(0, (t - t0) / dur));
        const v = Math.round(to * (1 - Math.pow(1 - k, 3)));
        setShown((s) => (s[i] === v ? s : s.map((x, j) => (j === i ? v : x))));
        if (k < 1) frames[i] = requestAnimationFrame(step);
      };
      frames[i] = requestAnimationFrame(step);
    });
    return () => frames.forEach((f) => cancelAnimationFrame(f));
  }, []);

  return (
    <ul className="cf-stats" id="cfTally" aria-label="The courses at a glance">
      {STATS.map(([a, b], i) => (
        <li key={b} className="cf-stat" style={{ "--i": i } as CSSProperties}>
          <span className="cf-stat__num">
            <b className="cf-stat__fig" data-n={a}>
              {shown[i]}
            </b>
            <span className="cf-stat__fig cf-stat__room" aria-hidden="true">
              {a}
            </span>
          </span>
          <span className="cf-stat__t">{b}</span>
        </li>
      ))}
    </ul>
  );
}
