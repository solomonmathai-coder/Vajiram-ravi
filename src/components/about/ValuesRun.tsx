"use client";

import { useEffect, useRef } from "react";
import { aboutValues } from "@/data/about-page";
import { prefersReducedMotion } from "@/lib/motion";

/** Scroll, canvas px, that moves the row on by one value (the final site's: 1620px for five steps). */
const STEP = 324;
/** A panel swings in from this angle about its bottom-left corner. */
const SWING = 30;

/**
 * "Our values" in the layout of the final site's "Why Vajiram & Ravi?" (vajiram-ravi.abhishek-ps.workers.dev, #story):
 * on the burnt band, pinned for a screen while the page scrolls on. At the top the dark cartouche label and the
 * heading on the left, the introduction on the right; under them a row of panels, one for each value, a screen wide:
 * the photograph on the left, and on the right the number large with "/05" beside it, the title in Newsreader over a
 * fine rule, and its sentence. Scrolling slides the row on a panel at a time (STEP px each), and each panel swings
 * in from 30° about its bottom-left corner as it arrives. With reduced motion (or no script) the panels simply stack.
 */
export default function ValuesRun() {
  const { label, heading, intro, items } = aboutValues;
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track || prefersReducedMotion()) return;
    pin.dataset.run = "";
    const panels = [...track.children] as HTMLElement[];
    const last = panels.length - 1;
    let frame = 0;
    const update = () => {
      frame = 0;
      const zoom = parseFloat(document.documentElement.style.zoom) || 1;
      // How far into the pin the page has scrolled, in canvas px, as panels (0 to last).
      const into = -pin.getBoundingClientRect().top / zoom;
      const p = Math.min(last, Math.max(0, into / STEP));
      track.style.transform = `translate3d(${(-p * 100).toFixed(3)}%, 0, 0)`;
      panels.forEach((panel, i) => {
        const k = Math.min(1, Math.max(0, i - p));
        panel.style.transform = k ? `rotate(${(k * SWING).toFixed(2)}deg)` : "";
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      delete pin.dataset.run;
    };
  }, []);

  const total = String(items.length).padStart(2, "0");
  return (
    <div ref={pinRef} className="ab-run" style={{ ["--n" as string]: items.length, ["--step" as string]: `${STEP}px` }}>
      <section className="ab-run__stage" aria-labelledby="abValues">
        <header className="ab-run__hd">
          <div>
            <span className="ab-lbl ab-lbl--dark">{label}</span>
            <h2 id="abValues" className="ab-run__h2">
              {heading}
            </h2>
          </div>
          <p className="ab-run__intro">{intro}</p>
        </header>
        <ol ref={trackRef} className="ab-run__track">
          {items.map((item, i) => (
            <li key={item.title} className="ab-run__p" aria-labelledby={`abValue${i}`}>
              <figure className="ab-run__ph">
                <img src={item.photo.src} alt={item.photo.alt} width={item.photo.width} height={item.photo.height} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              </figure>
              <div className="ab-run__tx">
                <p className="ab-run__no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                  <small>/{total}</small>
                </p>
                <h3 className="ab-run__t" id={`abValue${i}`}>
                  <span>{item.title}</span>
                  <i aria-hidden="true" />
                </h3>
                <p className="ab-run__d">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
