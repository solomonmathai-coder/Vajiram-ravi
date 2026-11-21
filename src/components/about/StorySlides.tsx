"use client";

import { useEffect, useRef, useState } from "react";
import type { AboutPhoto } from "@/data/about-page";
import { prefersReducedMotion } from "@/lib/motion";

/** How long each photograph stays before the next fades in (ms). */
const HOLD = 4500;

function Arrow({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dir < 0 ? { rotate: "180deg" } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * "How it started"'s photographs, in his white frame: each fades in over the last with a slow push-in while it
 * rests; under them his dots (the active one long, filling with its time) and round arrows. It pauses under
 * the pointer or the keyboard focus, and stays on the first with reduced motion.
 */
export default function StorySlides({ slides }: { slides: AboutPhoto[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const fill = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paused || prefersReducedMotion()) {
      fill.current?.style.setProperty("--p", "0");
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / HOLD);
      fill.current?.style.setProperty("--p", String(t));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setCurrent((c) => (c + 1) % slides.length);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [current, paused, slides.length]);

  const go = (by: number) => setCurrent((c) => (c + by + slides.length) % slides.length);

  return (
    <div
      className="ab-frame"
      role="group"
      aria-roledescription="carousel"
      aria-label="Photographs of the institute"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="ab-slides">
        {slides.map((s, i) => (
          <figure key={s.src} className="ab-slide" data-on={i === current ? "" : undefined} aria-hidden={i !== current}>
            <img src={s.src} alt={s.alt} width={s.width} height={s.height} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
          </figure>
        ))}
      </div>
      <div className="ab-ctrl">
        <div className="ab-dots" role="group" aria-label="Choose a photograph">
          {slides.map((s, i) => (
            <button key={s.src} type="button" className="ab-dot" aria-label={`Photograph ${i + 1} of ${slides.length}`} aria-current={i === current} onClick={() => setCurrent(i)}>
              <i ref={i === current ? fill : undefined} />
            </button>
          ))}
        </div>
        <div className="ab-ctrl__arrows">
          <button type="button" className="ab-arrow" aria-label="Previous photograph" onClick={() => go(-1)}>
            <Arrow dir={-1} />
          </button>
          <button type="button" className="ab-arrow" aria-label="Next photograph" onClick={() => go(1)}>
            <Arrow dir={1} />
          </button>
        </div>
      </div>
      <p className="vh" aria-live="polite">
        {slides[current].alt}, photograph {current + 1} of {slides.length}
      </p>
    </div>
  );
}
