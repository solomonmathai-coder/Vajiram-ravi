"use client";

import { useLayoutEffect, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** A figure as written ("50+", "10/10"): its first number counts up, the rest stays as it is. */
function split(figure: string) {
  const m = figure.match(/^(\D*)(\d+)(.*)$/);
  return m ? { pre: m[1], n: Number(m[2]), post: m[3] } : { pre: figure, n: 0, post: "" };
}

/**
 * The head's figures, as the course finder's head draws them (course-finder/HeroStats, Kevin's homepage hero):
 * each figure in Newsreader with its line beside it, gold diamonds between, a gold rule over the row; the
 * figures count up once on load, one after another, each holding its final width so the line does not move.
 */
export default function AboutFigures({ stats }: { stats: { figure: string; text: string }[] }) {
  const parts = stats.map((s) => split(s.figure));
  const [shown, setShown] = useState<number[]>(() => parts.map((p) => p.n));

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    setShown(parts.map(() => 0));
    const frames: number[] = [];
    const now = performance.now();
    parts.forEach(({ n }, i) => {
      const t0 = now + 300 + i * 120;
      const step = (t: number) => {
        const k = Math.min(1, Math.max(0, (t - t0) / 1100));
        const v = Math.round(n * (1 - Math.pow(1 - k, 3)));
        setShown((s) => (s[i] === v ? s : s.map((x, j) => (j === i ? v : x))));
        if (k < 1) frames[i] = requestAnimationFrame(step);
      };
      frames[i] = requestAnimationFrame(step);
    });
    return () => frames.forEach((f) => cancelAnimationFrame(f));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className="cf-stats" aria-label="Vajiram & Ravi in figures">
      {stats.map((s, i) => (
        <li key={s.text} className="cf-stat" style={{ "--i": i } as CSSProperties}>
          <span className="cf-stat__num">
            <b className="cf-stat__fig" aria-label={s.figure}>
              {parts[i].pre}
              {shown[i]}
              {parts[i].post}
            </b>
            <span className="cf-stat__fig cf-stat__room" aria-hidden="true">
              {s.figure}
            </span>
          </span>
          <span className="cf-stat__t">{s.text}</span>
        </li>
      ))}
    </ul>
  );
}
