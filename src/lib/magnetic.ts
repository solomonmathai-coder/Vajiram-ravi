import type { PointerEvent } from "react";

/**
 * The buttons' magnetic pull (homepage v2: "try a magnetic effect" on the CTAs). While a mouse is over a
 * button it leans towards the pointer, by a quarter of the pointer's distance from its centre (at most
 * 6px), and its arrow or icon a little further (its `[data-magnet]` child, at most 4px more), so the two
 * part slightly; on leaving, both spring back (the springy return is CSS, .cta in globals.css). Mouse only,
 * never with reduced motion. Uses the `translate` property, so it adds to the hover's `scale`.
 */
const PULL = 0.25;
const MAX = 6;
const INNER = 0.18;
const INNER_MAX = 4;

const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function magnetMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse" || still()) return;
  const el = event.currentTarget;
  const r = el.getBoundingClientRect();
  const dx = event.clientX - (r.left + r.width / 2);
  const dy = event.clientY - (r.top + r.height / 2);
  // The canvas is zoomed: getBoundingClientRect is in screen px, translate in the button's own px.
  const zoom = r.width / (el.offsetWidth || r.width) || 1;
  el.style.translate = `${clamp((dx * PULL) / zoom, MAX).toFixed(2)}px ${clamp((dy * PULL) / zoom, MAX).toFixed(2)}px`;
  const inner = el.querySelector<HTMLElement>("[data-magnet]");
  if (inner) inner.style.translate = `${clamp((dx * INNER) / zoom, INNER_MAX).toFixed(2)}px ${clamp((dy * INNER) / zoom, INNER_MAX).toFixed(2)}px`;
}

export function magnetLeave(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  el.style.translate = "";
  const inner = el.querySelector<HTMLElement>("[data-magnet]");
  if (inner) inner.style.translate = "";
}
