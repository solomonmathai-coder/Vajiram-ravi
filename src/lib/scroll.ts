import { prefersReducedMotion } from "./motion";

/**
 * Keeps a value in step with the scroll position. `measure` reads the value for the current scroll
 * position; `apply` receives it, eased over a few frames so that it settles softly instead of jumping
 * with each wheel step. With reduced motion it follows without easing. Returns a cleanup function.
 */
export function followScroll(measure: () => number, apply: (value: number) => void, smoothingMs: number): () => void {
  const smooth = !prefersReducedMotion();
  let target = measure();
  let value = target;
  let last = 0;
  let frame = 0;
  apply(value);

  const step = (now: number) => {
    // A frame's timestamp can be slightly earlier than `last`, which was read in the scroll handler.
    const elapsed = Math.min(Math.max(now - last, 0), 100);
    value += (target - value) * (1 - Math.exp(-elapsed / smoothingMs));
    last = now;
    if (Math.abs(target - value) < 0.001) value = target;
    apply(value);
    frame = value === target ? 0 : requestAnimationFrame(step);
  };

  const onScroll = () => {
    target = measure();
    if (!smooth) {
      value = target;
      apply(value);
    } else if (!frame) {
      last = performance.now();
      frame = requestAnimationFrame(step);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
