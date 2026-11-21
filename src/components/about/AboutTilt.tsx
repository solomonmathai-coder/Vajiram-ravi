"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The leadership cards' hover, as Kevin's homepage batch tickets (his js/content.js, and his course cards after
 * them): where the pointer is over a `.ab-tilt` card sets --tx and --ty (how far from the middle, -0.5 to 0.5)
 * and --gx and --gy (the glare's place); the CSS tilts the card toward the pointer, lifts it, moves the glare and
 * swings the shadow. Leaving the card eases it back. Only with a mouse, and not with reduced motion.
 */
export default function AboutTilt() {
  useEffect(() => {
    if (prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cards = [...document.querySelectorAll<HTMLElement>(".ab-page .ab-tilt")];
    const offs = cards.map((c) => {
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        c.style.setProperty("--tx", (px - 0.5).toFixed(3));
        c.style.setProperty("--ty", (py - 0.5).toFixed(3));
        c.style.setProperty("--gx", `${(px * 100).toFixed(0)}%`);
        c.style.setProperty("--gy", `${(py * 100).toFixed(0)}%`);
      };
      const leave = () => {
        c.style.setProperty("--tx", "0");
        c.style.setProperty("--ty", "0");
      };
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerleave", leave);
      return () => {
        c.removeEventListener("pointermove", move);
        c.removeEventListener("pointerleave", leave);
      };
    });
    return () => offs.forEach((off) => off());
  }, []);
  return null;
}
