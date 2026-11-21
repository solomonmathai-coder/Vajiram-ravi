"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The hero → programmes hand-over, after design S (its page-motion.js): q is how far the programmes sheet
 * has risen into the screen (0 with its top at the bottom of the screen, 1 at the top). The hero, pinned
 * behind it, takes q as `--cover` (it darkens and draws back with it); the sheet takes `--cov`, which
 * runs from 0 to 1 while q goes from 0.12 to 0.7, and its content fades and lifts in with it. Read on the
 * scroll, once a frame. Off with reduced motion (both stay at rest).
 */
export default function CoverSheet({ under = "hero", over = "programmes" }: { under?: string; over?: string }) {
  useEffect(() => {
    const hero = document.getElementById(under);
    const sheet = document.getElementById(over);
    if (!hero || !sheet || prefersReducedMotion()) return;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    let frame = 0;
    const update = () => {
      frame = 0;
      const q = clamp(1 - sheet.getBoundingClientRect().top / window.innerHeight);
      hero.style.setProperty("--cover", q.toFixed(3));
      sheet.style.setProperty("--cov", clamp((q - 0.12) / 0.58).toFixed(3));
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    update();
    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
      cancelAnimationFrame(frame);
      hero.style.removeProperty("--cover");
      sheet.style.removeProperty("--cov");
    };
  }, [under, over]);
  return null;
}
