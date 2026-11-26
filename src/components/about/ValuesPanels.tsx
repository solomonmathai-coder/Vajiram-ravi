"use client";

import { useRef, useState, type CSSProperties } from "react";
import { aboutValues } from "@/data/about-page";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Our values as photograph panels that open under the pointer (first made 21 Nov 2026; brought back 26 Nov 2026, Abhishek:
 * "can we keep the hover expand option you did first", in place of the path): the five values side by side, one standing
 * open (its number, title and sentence over the photograph), the others narrow, their number at the top and their title
 * running up the side. Pointing at a panel, clicking it or tabbing to it opens it, the others closing up. Only the panels:
 * the section's head is the team site's (AboutPage). Same words and photographs (data/about-page aboutValues). Styles:
 * about.css (.ab-val).
 */
export default function ValuesPanels() {
  const { items } = aboutValues;
  const [on, setOn] = useState(0);
  const wait = useRef(0);

  // A short pause before a panel opens under the pointer, so sweeping across the row doesn't open each in turn.
  const hover = (i: number) => {
    clearTimeout(wait.current);
    wait.current = window.setTimeout(() => setOn(i), 110);
  };

  return (
    <ol className="ab-vals__row ab-rv" style={{ "--d": ".1s" } as CSSProperties} onPointerLeave={() => clearTimeout(wait.current)}>
      {items.map((item, i) => (
        <li key={item.title} className="ab-val" data-on={i === on ? "" : undefined} onPointerEnter={() => hover(i)}>
          <img src={item.photo.src} alt="" width={item.photo.width} height={item.photo.height} loading="lazy" decoding="async" />
          <button type="button" className="ab-val__btn" aria-expanded={i === on} aria-controls={`abVal${i}`} onClick={() => setOn(i)} onFocus={() => setOn(i)}>
            <span className="ab-val__no" aria-hidden="true">
              {pad(i + 1)}
            </span>
            <span className="ab-val__side">{item.title}</span>
          </button>
          <div className="ab-val__body" id={`abVal${i}`} aria-hidden={i !== on}>
            <p className="ab-val__big" aria-hidden="true">
              {pad(i + 1)}
            </p>
            <h3 className="ab-val__t">{item.title}</h3>
            <p className="ab-val__d">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
