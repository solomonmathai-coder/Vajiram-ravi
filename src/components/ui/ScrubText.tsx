"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { clamp01, followScroll } from "@/lib/scroll";

/** The fill starts when the paragraph's top reaches 88% of the way down the screen and ends at 40%. */
const START = 0.88;
const END = 0.4;
/** Each line starts this much later (as a share of the whole fill) than the line above it. */
const LINE_DELAY = 0.06;
/** How many letters the soft edge of the fill spans. */
const WAVE = 16;
const DIM = 0.2;
const SMOOTHING_MS = 120;

/**
 * A paragraph that fills in letter by letter as it scrolls up the screen, after cominvi.com.mx.
 * Letters start at 20% strength. Every line fills from left to right at the same time, each a little
 * behind the one above, with a soft edge that runs across the letters. Screen readers get the
 * sentence in one piece, and with reduced motion it simply shows in full.
 */
export default function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    if (prefersReducedMotion()) {
      el.querySelectorAll<HTMLElement>("[data-char]").forEach((char) => (char.style.opacity = "1"));
      return;
    }

    // Letters grouped by the line they sit on, found from where each word wraps.
    let lines: HTMLElement[][] = [];
    let progress = 0;
    const group = () => {
      lines = [];
      let top = Number.NaN;
      for (const word of words) {
        if (word.offsetTop !== top) {
          top = word.offsetTop;
          lines.push([]);
        }
        lines[lines.length - 1].push(...Array.from(word.querySelectorAll<HTMLElement>("[data-char]")));
      }
    };

    const paint = (value: number) => {
      progress = value;
      const span = 1 - (lines.length - 1) * LINE_DELAY;
      lines.forEach((chars, i) => {
        const head = clamp01((value - i * LINE_DELAY) / span) * (chars.length + WAVE);
        chars.forEach((char, j) => {
          char.style.opacity = String(DIM + (1 - DIM) * clamp01((head - j) / WAVE));
        });
      });
    };

    group();
    // Line breaks change when the paragraph resizes or its web font arrives.
    const resize = new ResizeObserver(() => {
      group();
      paint(progress);
    });
    resize.observe(el);
    document.fonts?.ready.then(() => {
      group();
      paint(progress);
    });

    const stop = followScroll(
      () => {
        const top = el.getBoundingClientRect().top / window.innerHeight;
        return clamp01((START - top) / (START - END));
      },
      paint,
      SMOOTHING_MS,
    );
    return () => {
      stop();
      resize.disconnect();
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {/* Words are inline blocks so they never break apart; indent-0 stops a first-line indent on
                the paragraph from being repeated inside every word. */}
            <span data-word className="inline-block indent-0 whitespace-nowrap">
              {Array.from(word).map((char, c) => (
                <span key={c} data-char className="opacity-20">
                  {char}
                </span>
              ))}
            </span>{" "}
          </span>
        ))}
      </span>
    </p>
  );
}
