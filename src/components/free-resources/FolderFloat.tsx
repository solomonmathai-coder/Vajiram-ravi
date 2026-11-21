"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The folder cards' hover, as the final site's homepage Free resources section does it (its script, read from
 * vajiram-ravi.abhishek-ps.workers.dev, 21 Nov 2026): while the pointer is on a folder (or the keyboard is in it) the
 * material standing in it rises out (k eases to 1, slowly: up 5px and tilted 0.6deg back), then sways slightly there (a slow
 * sine, 1.2px and 0.15deg; a quarter of the reference's, which was too loud here), and settles back down when the pointer leaves. Each folder starts its bob at its own point. Only
 * with a mouse, and not with reduced motion. As there, a click anywhere on a folder follows its button's link.
 */
export default function FolderFloat() {
  useEffect(() => {
    const cards = [...document.querySelectorAll<HTMLElement>(".fr-page .kv-res .rf")];
    // a click anywhere on a folder follows its button
    const offClick = cards.map((el) => {
      const a = el.querySelector<HTMLAnchorElement>("a.sm__act");
      const click = (e: MouseEvent) => {
        if (a && !(e.target as Element).closest("a")) a.click();
      };
      el.addEventListener("click", click);
      return () => el.removeEventListener("click", click);
    });
    if (prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return () => offClick.forEach((f) => f());

    const items = cards
      .map((el) => ({ el, obj: el.querySelector<HTMLElement>(".rmk__obj"), k: 0, goal: 0, phase: 6 * Math.random() }))
      .filter((t): t is { el: HTMLElement; obj: HTMLElement; k: number; goal: number; phase: number } => !!t.obj);
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      let moving = false;
      for (const t of items) {
        t.k += (t.goal - t.k) * (1 - Math.exp(-dt * (t.goal ? 2.6 : 2.2)));
        if (Math.abs(t.goal - t.k) < 0.001) t.k = t.goal;
        if (t.goal) t.phase += 1.1 * dt;
        if (t.k === 0 && !t.goal) {
          t.obj.style.transform = "";
          continue;
        }
        moving = true;
        const s = Math.sin(t.phase);
        t.obj.style.transform = `translate3d(0, ${(-5 * t.k - 1.2 * s * t.k).toFixed(2)}px, 0) rotate(${(-0.6 * t.k + 0.15 * s * t.k).toFixed(2)}deg)`;
      }
      if (moving) raf = requestAnimationFrame(tick);
      else {
        raf = 0;
        last = 0;
      }
    };
    const run = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const offs = items.map((t) => {
      const on = () => {
        t.goal = 1;
        run();
      };
      const off = () => {
        t.goal = 0;
        run();
      };
      const out = (e: FocusEvent) => {
        if (!t.el.contains(e.relatedTarget as Node | null)) off();
      };
      t.el.addEventListener("pointerenter", on);
      t.el.addEventListener("pointerleave", off);
      t.el.addEventListener("focusin", on);
      t.el.addEventListener("focusout", out);
      return () => {
        t.el.removeEventListener("pointerenter", on);
        t.el.removeEventListener("pointerleave", off);
        t.el.removeEventListener("focusin", on);
        t.el.removeEventListener("focusout", out);
      };
    });
    return () => {
      cancelAnimationFrame(raf);
      offs.forEach((f) => f());
      offClick.forEach((f) => f());
    };
  }, []);
  return null;
}
