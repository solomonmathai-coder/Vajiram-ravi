"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { lockScroll } from "@/lib/smoothScroll";
import { INTRO_OUT, INTRO_OUT_STILL, INTRO_SLIDE } from "./introTiming";

/**
 * The intro's panel and the little the script does for it (see ./Preloader; the look is ./intro.css).
 * While <html> has `intro` the page cannot scroll (Lenis stopped, via lockScroll). At INTRO_OUT after the
 * first paint, read from the panel's own progress bar so a late hydration still leaves on time, or at once
 * on Skip intro, Esc, the wheel or a touch drag, the panel slides away (`vrv--out`); when it has gone,
 * `intro` is removed (the panel goes back to display: none) and the page scrolls again.
 *
 * Ended early, it moves the hero's waiting entrance (Hero/enter: CSS transitions delayed by `--intro`)
 * forward by the time skipped, so the hero is not left blank under a panel that has already gone.
 *
 * A modal dialog while it shows (design S's), its one control the Skip button; it does not trap focus,
 * being gone in a moment.
 */
export default function PreloaderCurtain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!el || !root.classList.contains("intro")) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const outAt = still ? INTRO_OUT_STILL : INTRO_OUT;

    // How long since the panel was first drawn: the bar's animation started then.
    const bar = el.querySelector(".vrv__bar")?.getAnimations?.()[0];
    const elapsed = () => (bar && typeof bar.currentTime === "number" ? bar.currentTime : performance.now());

    let live = true;
    let leaving = false;
    const timers: number[] = [];
    const cleanUp = () => {
      removeEventListener("keydown", onKey);
      removeEventListener("wheel", leave);
      removeEventListener("touchmove", leave);
      timers.forEach((t) => clearTimeout(t));
    };
    const gone = () => {
      if (!live) return;
      live = false;
      cleanUp();
      root.classList.remove("intro");
      el.classList.remove("vrv--out");
      lockScroll(false);
      document.dispatchEvent(new CustomEvent("vr:intro-done"));
    };
    function leave() {
      if (leaving || !live || !el) return;
      leaving = true;
      const early = Math.max(0, outAt - elapsed());
      if (early > 0) {
        // Bring the hero's entrance forward by the time skipped.
        document
          .getElementById("hero")
          ?.getAnimations({ subtree: true })
          .forEach((animation) => {
            if (typeof CSSTransition !== "undefined" && animation instanceof CSSTransition && typeof animation.currentTime === "number") {
              animation.currentTime += early;
            }
          });
      }
      el.classList.add("vrv--out");
      timers.push(window.setTimeout(gone, still ? 420 : INTRO_SLIDE));
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") leave();
    }

    // On the next frame, so SmoothScroll has started Lenis whatever the order of the effects.
    const frame = requestAnimationFrame(() => {
      if (live) lockScroll(true);
    });
    addEventListener("keydown", onKey);
    addEventListener("wheel", leave, { passive: true });
    addEventListener("touchmove", leave, { passive: true });
    const skip = skipRef.current;
    skip?.addEventListener("click", leave);
    timers.push(window.setTimeout(leave, Math.max(0, outAt - elapsed())));

    // An unmount (or Strict Mode's rehearsal) lets the page scroll; a remount picks the intro up again.
    return () => {
      cancelAnimationFrame(frame);
      skip?.removeEventListener("click", leave);
      if (live) {
        cleanUp();
        lockScroll(false);
      }
    };
  }, []);

  return (
    <div ref={ref} className="vrv" role="dialog" aria-modal="true" aria-label="Vajiram & Ravi">
      {children}
      <button ref={skipRef} type="button" className="vrv__skip">
        Skip intro
      </button>
    </div>
  );
}
