"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";

type ScrubbedStatementProps = {
  text: string;
  className?: string;
};

/** Opacity of a word that has not been reached yet. */
const DIM = 0.2;
/** How many words are mid-fade at once, so the light moves along the line softly rather than word by word. */
const SOFT = 3;
/** The reveal starts when the statement's top is at 80% of the viewport height and ends at 25%. */
const START = 0.8;
const END = 0.25;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * A statement that lights up word by word as it scrolls through the viewport: each word goes from 20% to
 * full opacity, scrubbed by the scroll position. It only listens to scrolling while it is near the screen,
 * and stays fully lit for reduced-motion users (and without JavaScript).
 */
export default function ScrubbedStatement({ text, className }: ScrubbedStatementProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-word]"));
    const shown = spans.map(() => -1);

    let frame = 0;
    const paint = () => {
      frame = 0;
      const viewport = window.innerHeight / getCanvasZoom();
      const progress = clamp01((viewport * START - canvasTop(el)) / (viewport * (START - END)));
      const lit = progress * (spans.length + SOFT);
      spans.forEach((span, i) => {
        // Rounded, so small scrolls do not rewrite every word's style.
        const opacity = Math.round((DIM + (1 - DIM) * clamp01((lit - i) / SOFT)) * 100) / 100;
        if (opacity !== shown[i]) {
          shown[i] = opacity;
          span.style.opacity = String(opacity);
        }
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();

    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      const method = on ? "addEventListener" : "removeEventListener";
      window[method]("scroll", schedule, { passive: true });
      window[method]("resize", schedule);
      if (on) schedule();
    };
    if (!("IntersectionObserver" in window)) {
      listen(true);
      return () => listen(false);
    }
    const observer = new IntersectionObserver(([entry]) => listen(entry.isIntersecting), { rootMargin: "200px 0px" });
    observer.observe(el);
    return () => {
      observer.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span data-word>{word}</span>
        </Fragment>
      ))}
    </p>
  );
}
