"use client";

import { useEffect, useRef, useState } from "react";
import Photo from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/** How long each slide stays, in milliseconds. */
const SLIDE_MS = 3200;

type Slide = { src: string; alt: string; caption: string };

/**
 * The looping demo in the GS programme card's window, after the product video in amplemarket.com's
 * MCP section. Photos cross-fade one after another, each settling from a slight zoom, with a
 * caption that rises in.
 * - It plays only while on screen and the tab is visible, and pauses while hovered (the paused
 *   slide then gets its full time again).
 * - With reduced motion it shows the first slide and stays still.
 */
export default function ProgrammeReel({ slides, className }: { slides: Slide[]; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [still, setStill] = useState(true);
  const state = useRef({ visible: false, hovering: false });

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    setStill(false);
    const update = () => setRunning(state.current.visible && !state.current.hovering && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.current.visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    const hover = (hovering: boolean) => () => {
      state.current.hovering = hovering;
      update();
    };
    const enter = hover(true);
    const leave = hover(false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // Moves the reel on after each slide's time, while it is playing.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [running, index, slides.length]);

  const playState = running ? "running" : "paused";

  return (
    <div ref={ref} className={cx("overflow-hidden bg-neutral-900", className)} aria-label="Programme highlights">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-700 ease-smooth"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Photo
            className={cx("absolute inset-0", i === index && !still && "[animation:reel-settle_3.4s_var(--ease-smooth)]")}
            style={{ animationPlayState: playState }}
            src={slide.src}
            alt={slide.alt}
            sizes="432px"
          />
        </div>
      ))}
      {/* Darkens the bottom so the caption reads on any photo. */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-neutral-950/45 to-transparent" />

      <p
        key={index}
        className={cx(
          "absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white py-1.5 pr-3.5 pl-2.5 font-display text-[14px]/[20px] font-semibold text-neutral-900 shadow-[0_6px_16px_-6px_rgba(28,25,23,.35)]",
          !still && "[animation:reel-caption_.5s_var(--ease-smooth)_both]",
        )}
      >
        <span className="size-2 rounded-full bg-brand-500" aria-hidden="true" />
        {slides[index].caption}
      </p>
    </div>
  );
}
