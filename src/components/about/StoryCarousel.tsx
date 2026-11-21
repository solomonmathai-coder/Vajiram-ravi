"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { AboutPhoto } from "@/data/about-page";
import { prefersReducedMotion } from "@/lib/motion";

/** How long each slide stays before the next slides in (ms). */
const HOLD = 7000;
/** The slide's move (ms), as the CSS transition on .ab-tale__track. */
const MOVE = 900;

type Chapter = { label: string; text: string; photo: AboutPhoto };

function Arrow({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dir < 0 ? { rotate: "180deg" } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Slide({ c, i, n, on, copy }: { c: Chapter; i: number; n: number; on: boolean; copy?: boolean }) {
  return (
    <li
      className="ab-tale__slide"
      data-on={on ? "" : undefined}
      aria-hidden={copy || !on}
      aria-roledescription={copy ? undefined : "slide"}
      aria-label={copy ? undefined : `${i + 1} of ${n}: ${c.label}`}
    >
      <div className="ab-tale__tx">
        <h3 className="ab-tale__t">{c.label}</h3>
        <p className="ab-tale__p">{c.text}</p>
      </div>
      <figure className="ab-tale__ph">
        <img src={c.photo.src} alt={copy ? "" : c.photo.alt} width={c.photo.width} height={c.photo.height} loading={i === 0 && !copy ? "eager" : "lazy"} decoding="async" />
      </figure>
    </li>
  );
}

/**
 * "How it started" as a carousel (21 Nov 2026): one fixed white card, centred, and inside it the slides moving one
 * after another, each with its words on the left (its title in Newsreader over a fine rule, then its sentence) and
 * its photograph filling the right. Each slide is one entry in data/about-page (aboutStory.chapters), so its words
 * and picture are changed, added or reordered together.
 *
 * It loops: after the last slide the first comes in from the right, as the next one always does (and before the
 * first, the last comes in from the left). The row holds a copy of the last slide before the first and of the first
 * after the last; on reaching a copy it slides there, then jumps without moving to the real slide it shows.
 * `pos` is the place in that row (1 to n are the slides).
 *
 * Under the card, centred: the round arrows either side of the dots (the current one filling with its time); the
 * arrow keys work too. It moves on by itself, pauses under the pointer or the keyboard focus, and stays put with
 * reduced motion.
 */
export default function StoryCarousel({ chapters }: { chapters: Chapter[] }) {
  const n = chapters.length;
  const [pos, setPos] = useState(1);
  const [still, setStill] = useState(false);
  const [paused, setPaused] = useState(false);
  const moving = useRef(false);
  const fill = useRef<HTMLElement>(null);
  const current = (pos - 1 + n) % n;

  // After a move onto a copy, jump (without the transition) to the slide it copies.
  useEffect(() => {
    if (pos !== 0 && pos !== n + 1) return;
    const t = window.setTimeout(() => {
      setStill(true);
      setPos(pos === 0 ? n : 1);
    }, MOVE);
    return () => clearTimeout(t);
  }, [pos, n]);
  // ...and turn the transition back on once that jump has been drawn.
  useEffect(() => {
    if (!still) return;
    const f = requestAnimationFrame(() => requestAnimationFrame(() => setStill(false)));
    return () => cancelAnimationFrame(f);
  }, [still]);

  const move = (to: number) => {
    if (moving.current || to === pos) return;
    moving.current = true;
    window.setTimeout(() => (moving.current = false), MOVE);
    setPos(to);
  };
  const go = (by: number) => move(pos + by);

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
      else setPos((p) => (p >= 1 && p <= n ? p + 1 : p));
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [current, paused, n]);

  const keys = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  };

  return (
    <div
      className="ab-tale"
      role="region"
      aria-roledescription="carousel"
      aria-label="How it started"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={keys}
    >
      <div className="ab-tale__card">
        <ol className="ab-tale__track" data-still={still ? "" : undefined} style={{ ["--i" as string]: pos }}>
          <Slide c={chapters[n - 1]} i={n - 1} n={n} on={pos === 0} copy />
          {chapters.map((c, i) => (
            <Slide key={c.label} c={c} i={i} n={n} on={pos === i + 1} />
          ))}
          <Slide c={chapters[0]} i={0} n={n} on={pos === n + 1} copy />
        </ol>
      </div>

      <div className="ab-tale__ctrl">
        <button type="button" className="ab-arrow" aria-label="Previous slide" onClick={() => go(-1)}>
          <Arrow dir={-1} />
        </button>
        <div className="ab-dots" role="group" aria-label="Choose a slide">
          {chapters.map((c, i) => (
            <button key={c.label} type="button" className="ab-dot" aria-label={`${c.label}, slide ${i + 1} of ${n}`} aria-current={i === current} onClick={() => move(i + 1)}>
              <i ref={i === current ? fill : undefined} />
            </button>
          ))}
        </div>
        <button type="button" className="ab-arrow" aria-label="Next slide" onClick={() => go(1)}>
          <Arrow dir={1} />
        </button>
      </div>
      <p className="vh" aria-live="polite">
        {chapters[current].label}, slide {current + 1} of {n}
      </p>
    </div>
  );
}
