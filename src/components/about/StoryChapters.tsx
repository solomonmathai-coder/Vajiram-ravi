"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { AboutPhoto } from "@/data/about-page";

/** How long each part stays open before the next opens (ms): the time its orange rule takes to fill. */
const HOLD = 6000;

type Chapter = { label: string; text: string; photo: AboutPhoto };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "How it started", quietly (21 Nov 2026): the photograph on the left, smaller, and on the right the story's parts as a
 * numbered list between fine rules, every part's title showing. One part is open: its number in the brand orange, its
 * sentence shown, and a fine orange rule at its left filling downward over HOLD ms; when it is full the next part opens
 * (after the last, the first), its photograph fading in over the last. Clicking a part, or tabbing to it, opens it and
 * starts its time again. It waits while the section is off the screen or the tab is hidden, and with reduced motion it
 * does not move on by itself. Each part is one entry in data/about-page (aboutStory.chapters): its title, sentence and
 * photograph.
 */
export default function StoryChapters({ chapters }: { chapters: Chapter[] }) {
  const n = chapters.length;
  const [on, setOn] = useState(0);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Only while the section is on the screen (and the tab showing, which pauses CSS animations by itself).
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="ab-ch" data-paused={seen ? undefined : ""} style={{ "--hold": `${HOLD}ms` } as CSSProperties}>
      <div className="ab-ch__ph">
        {chapters.map((c, i) => (
          <figure key={c.label} className="ab-ch__img" data-on={i === on ? "" : undefined} aria-hidden={i !== on}>
            <img src={c.photo.src} alt={c.photo.alt} width={c.photo.width} height={c.photo.height} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
          </figure>
        ))}
      </div>
      <ol className="ab-ch__list">
        {chapters.map((c, i) => (
          <li key={c.label} className="ab-ch__item" data-on={i === on ? "" : undefined}>
            {/* the open part's rule: restarted for each part (its key); when it has filled, the next part opens */}
            {i === on && <i key={`b${on}`} className="ab-ch__bar" aria-hidden="true" onAnimationEnd={() => setOn((on + 1) % n)} />}
            <button type="button" className="ab-ch__btn" aria-expanded={i === on} aria-controls={`abCh${i}`} onClick={() => setOn(i)} onFocus={() => setOn(i)}>
              <span className="ab-ch__n" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="ab-ch__t">{c.label}</span>
            </button>
            <div className="ab-ch__body" id={`abCh${i}`}>
              <div>
                <p className="ab-ch__p">{c.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
