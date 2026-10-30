"use client";

import { useEffect } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 8;
const SETTLE_MS = 1700;

/**
 * Fades in `[data-reveal]` blocks and the children of `[data-reveal-group]` elements as they
 * scroll into view, and lifts the words of `[data-reveal-words]` headings (see RevealWords) out of their
 * masks. Anything already on screen at load stays visible; only below-the-fold blocks are pre-hidden (the
 * `rv-pre`, `rv-in` and `rw-pre` classes live in globals.css).
 *
 * It adds those classes to the server-rendered DOM, so client components must keep the
 * className of any revealed element static (toggle runtime classes through refs instead).
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const viewportHeight = window.innerHeight / getCanvasZoom();
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement)) return;
        child.style.setProperty("--d", `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
        items.push(child);
      });
    });

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const reveal = (el: HTMLElement) => {
      observer.unobserve(el);
      el.classList.add("rv-in");
      requestAnimationFrame(() => el.classList.remove("rv-pre"));
      timers.push(
        setTimeout(() => {
          el.classList.remove("rv-in");
          el.style.removeProperty("--d");
        }, SETTLE_MS),
      );
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    // Blocks in the last screen of the page are never pre-hidden: at the foot of the page they may not
    // rise far enough to trigger, and the footer's last lines must always show.
    const docBottom = document.documentElement.getBoundingClientRect().bottom;
    const nearEnd = (el: HTMLElement) => docBottom - el.getBoundingClientRect().top < window.innerHeight;

    for (const el of items) {
      if (canvasTop(el) > viewportHeight * 0.92 && !nearEnd(el)) {
        el.classList.add("rv-pre");
        observer.observe(el);
      }
    }

    // Headings with data-reveal-words: their words wait under their masks until the heading is in view.
    const words = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          words.unobserve(entry.target);
          entry.target.classList.remove("rw-pre");
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal-words]").forEach((el) => {
      if (canvasTop(el) <= viewportHeight * 0.9 || nearEnd(el)) return;
      el.classList.add("rw-pre");
      words.observe(el);
    });

    // The last blocks of the page may never rise past the bottom margin above: show whatever is left once
    // the page has been scrolled to its end.
    const onScroll = () => {
      if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 8) return;
      document.querySelectorAll<HTMLElement>(".rv-pre").forEach(reveal);
      document.querySelectorAll<HTMLElement>(".rw-pre").forEach((el) => el.classList.remove("rw-pre"));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      words.disconnect();
      window.removeEventListener("scroll", onScroll);
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
