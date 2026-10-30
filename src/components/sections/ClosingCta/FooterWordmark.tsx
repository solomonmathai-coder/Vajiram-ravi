"use client";

import { useEffect, useRef } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion, whenFontsReady } from "@/lib/motion";
import { glow } from "./glow";

/** Skiper UI's Skiper 31: how far each letter starts from its place per step from the centre, in px and degrees. */
const SPREAD_PX = 46;
const TILT_DEG = 34;
/** The share of the screen the wordmark travels up while it assembles. */
const ASSEMBLE_SPAN = 0.6;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** One breath in or out; a full breath takes twice as long (8s). */
const BREATH_MS = 4000;

/**
 * Splits the wordmark into one letter per character, laid exactly over the real text. The letters are
 * placed where the browser set them in the full word, so kerning and the tight tracking survive (separate
 * inline-block letters would lose both). Each letter also gets its distance from the centre, in letters.
 */
function splitLetters(word: HTMLElement, source: HTMLElement): { overlay: HTMLElement; letters: { el: HTMLElement; d: number }[] } {
  const text = source.firstChild;
  const box = word.getBoundingClientRect();
  // Rects are scaled by the canvas zoom; offsets and the styles set here are not.
  const scale = word.offsetWidth ? box.width / word.offsetWidth : 1;
  const overlay = document.createElement("span");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = "position:absolute;inset:0;pointer-events:none;perspective:500px";
  const letters: { el: HTMLElement; d: number }[] = [];
  if (!(text instanceof Text)) return { overlay, letters };

  const range = document.createRange();
  const chars = text.data;
  const centre = (chars.length - 1) / 2;
  for (let i = 0; i < chars.length; i++) {
    if (!chars[i].trim()) continue;
    range.setStart(text, i);
    range.setEnd(text, i + 1);
    const left = (range.getBoundingClientRect().left - box.left) / scale;
    const letter = document.createElement("span");
    letter.textContent = chars[i];
    letter.style.cssText = `position:absolute;top:0;left:${left}px;display:block;will-change:transform`;
    overlay.append(letter);
    letters.push({ el: letter, d: i - centre });
  }
  word.append(overlay);
  return { overlay, letters };
}

/**
 * The giant "VAJIRAM & RAVI" at the foot of the page, with the orange glow behind it. The letters assemble
 * as you scroll, after Skiper UI's Skiper 31: each starts pushed out from the centre and tipped back in
 * 3D, the more the further it is from the middle, and they come together as the footer rises into view
 * (and part again if you scroll back). The glow breathes very slowly (8s) while it is on screen. Both
 * stay still for reduced motion.
 */
export default function FooterWordmark({ text }: { text: string }) {
  const glowRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const sourceRef = useRef<HTMLSpanElement>(null);

  // The glow's breath: a slow fade and swell, paused off screen.
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || prefersReducedMotion()) return;
    const breath = glow.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0.7, transform: "scale(1.06)" }], {
      duration: BREATH_MS,
      direction: "alternate",
      iterations: Infinity,
      easing: "ease-in-out",
    });
    if (!("IntersectionObserver" in window)) return () => breath.cancel();
    breath.pause();
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? breath.play() : breath.pause()));
    observer.observe(glow);
    return () => {
      observer.disconnect();
      breath.cancel();
    };
  }, []);

  // The letters, assembled by the scroll position. The real text stays in place (hidden) to hold the layout.
  useEffect(() => {
    const word = wordRef.current;
    const source = sourceRef.current;
    if (!word || !source || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    let cancelled = false;
    let split: ReturnType<typeof splitLetters> | undefined;
    let frame = 0;
    let listening = false;

    const paint = () => {
      frame = 0;
      if (!split) return;
      const zoom = getCanvasZoom();
      const viewport = window.innerHeight / zoom;
      const top = canvasTop(word);
      // The wordmark sits at the foot of the page, so it may never rise far: it assembles over the scroll
      // that is left, and is whole a little before the page ends.
      const left = (document.documentElement.scrollHeight - window.innerHeight - window.scrollY) / zoom;
      const span = Math.min(viewport * ASSEMBLE_SPAN, Math.max(160, (viewport - (top - left)) * 0.9));
      const progress = Math.min(1, Math.max(0, (viewport - top) / span));
      const apart = 1 - easeOut(progress);
      for (const { el, d } of split.letters) {
        el.style.transform = apart
          ? `translate3d(${(d * SPREAD_PX * apart).toFixed(1)}px, 0, 0) rotateX(${(d * TILT_DEG * apart).toFixed(1)}deg)`
          : "";
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const build = () => {
      split?.overlay.remove();
      split = splitLetters(word, source);
      source.style.visibility = "hidden";
      paint();
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      const method = on ? "addEventListener" : "removeEventListener";
      window[method]("scroll", schedule, { passive: true });
      if (on) schedule();
    };

    // Measure with the final font, or the letters would sit where the fallback font put them.
    const observer = new IntersectionObserver(([entry]) => listen(entry.isIntersecting), { rootMargin: "200px 0px" });
    whenFontsReady().then(() => {
      if (cancelled) return;
      build();
      observer.observe(word);
      window.addEventListener("resize", build);
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      listen(false);
      window.removeEventListener("resize", build);
      cancelAnimationFrame(frame);
      split?.overlay.remove();
      source.style.visibility = "";
    };
  }, []);

  return (
    <>
      {/*
        Orange glow behind the link columns and the wordmark, placed from the footer's top edge (the footer
        is its own stacking context, so -z-1 keeps it under the links).
      */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-[-24px] left-[-70px] -z-1 h-[840px] w-[1580px]"
        style={glow("238 106 18", 0.63)}
      />
      <p
        ref={wordRef}
        aria-hidden="true"
        className="relative text-[185px]/[0.8] font-medium tracking-[-11.1px] whitespace-nowrap text-cream"
      >
        <span ref={sourceRef}>{text}</span>
      </p>
    </>
  );
}
