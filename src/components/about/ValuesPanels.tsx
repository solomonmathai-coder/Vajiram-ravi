"use client";

import { useRef, useState } from "react";
import { aboutValues } from "@/data/about-page";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Our values" all on one screen (21 Nov 2026, in place of the pinned run that took five screens of scrolling): on
 * Kevin's homepage toppers ground, the label and heading on the left and the introduction on the right, then the
 * five values as photograph panels side by side. One stands open (its number, title and sentence over the
 * photograph); the others are narrow, their number at the top and their title running up the side. Pointing at a
 * panel, clicking it or tabbing to it opens it, the others closing up.
 */
export default function ValuesPanels() {
  const { label, heading, intro, items } = aboutValues;
  const [on, setOn] = useState(0);
  const wait = useRef(0);
  const total = pad(items.length);

  // A short pause before a panel opens under the pointer, so sweeping across the row doesn't open each in turn.
  const hover = (i: number) => {
    clearTimeout(wait.current);
    wait.current = window.setTimeout(() => setOn(i), 110);
  };

  return (
    <section className="ab-vals" aria-labelledby="abValues">
      <header className="ab-vals__hd ab-rv">
        <div>
          <span className="ab-lbl ab-lbl--dark">{label}</span>
          <h2 id="abValues" className="ab-vals__h2">
            {heading}
          </h2>
        </div>
        <p className="ab-vals__intro">{intro}</p>
      </header>
      <ol className="ab-vals__row ab-rv" style={{ ["--d" as string]: ".1s" }} onPointerLeave={() => clearTimeout(wait.current)}>
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
                <small>/{total}</small>
              </p>
              <h3 className="ab-val__t">{item.title}</h3>
              <p className="ab-val__d">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
