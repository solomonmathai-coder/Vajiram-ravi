"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import type { AboutPhoto } from "@/data/about-page";

/** How long each slide stays before the next comes in (ms): the length of its dot's fill. */
const HOLD = 7000;

type Chapter = { label: string; text: string; photo: AboutPhoto };

function Arrow({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dir < 0 ? { rotate: "180deg" } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * "How it started" as a carousel (21 Nov 2026), in a fixed frame the width of the content: each slide its words on the
 * left (its title in Newsreader over a fine rule, then its sentence) and its photograph on the right. Each slide is one
 * entry in data/about-page (aboutStory.chapters), so its words and picture are changed, added or reordered together.
 *
 * Nothing slides past a clipped edge: the slides lie one over another. On a change the words of the last one fade
 * out and the new ones come in from the side it is going (`--dir`), and the new photograph wipes in over the last one
 * inside its own rounded frame (clip-path), from the right going on, from the left going back. It loops both ways
 * (after the last comes the first). The arrows answer every click, even mid-change.
 *
 * Under the words: the round arrows either side of the dots, the current dot long and filling over HOLD ms (a CSS
 * animation; when it ends the next slide comes in). Pointing at the carousel or focusing in it pauses the fill; the
 * arrow keys work too. With reduced motion nothing moves on by itself and the changes are instant.
 */
export default function StoryCarousel({ chapters }: { chapters: Chapter[] }) {
  const n = chapters.length;
  const [current, setCurrent] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const show = (to: number, d: 1 | -1) => {
    const next = (to + n) % n;
    if (next === current) return;
    setDir(d);
    setLast(current);
    setCurrent(next);
  };
  const go = (by: 1 | -1) => show(current + by, by);
  const keys = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  };

  return (
    <div
      className="ab-tale"
      data-paused={paused ? "" : undefined}
      data-dir={last === null ? undefined : dir}
      style={{ "--dir": dir, "--hold": `${HOLD}ms` } as CSSProperties}
      role="region"
      aria-roledescription="carousel"
      aria-label="How it started"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={keys}
    >
      <ol className="ab-tale__stage">
        {chapters.map((c, i) => (
          <li
            key={c.label}
            className="ab-tale__slide"
            data-on={i === current ? "" : undefined}
            data-last={i === last ? "" : undefined}
            aria-hidden={i !== current}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}: ${c.label}`}
          >
            <div className="ab-tale__tx">
              <h3 className="ab-tale__t">{c.label}</h3>
              <p className="ab-tale__p">{c.text}</p>
            </div>
            <figure className="ab-tale__ph">
              <img src={c.photo.src} alt={c.photo.alt} width={c.photo.width} height={c.photo.height} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
            </figure>
          </li>
        ))}
      </ol>

      <div className="ab-tale__ctrl">
        <button type="button" className="ab-arrow" aria-label="Previous slide" onClick={() => go(-1)}>
          <Arrow dir={-1} />
        </button>
        <div className="ab-dots" role="group" aria-label="Choose a slide">
          {chapters.map((c, i) => (
            <button key={c.label} type="button" className="ab-dot" aria-label={`${c.label}, slide ${i + 1} of ${n}`} aria-current={i === current} onClick={() => show(i, i > current ? 1 : -1)}>
              {/* the current dot's fill: restarted for each slide (its key), and moving the carousel on when it ends */}
              {i === current ? <i key={`f${current}`} className="ab-dot__fill" onAnimationEnd={() => go(1)} /> : <i />}
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
