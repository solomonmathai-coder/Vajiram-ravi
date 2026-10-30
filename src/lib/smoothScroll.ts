import type Lenis from "lenis";

/*
 * The page's smooth scrolling (Lenis, started by SmoothScroll). Other parts use these helpers so they work
 * the same with or without it: without it (reduced motion), the browser scrolls natively.
 */

let instance: Lenis | null = null;

/**
 * Inline <head> script: the page always opens at the hero. The browser is told not to restore the last
 * scroll position on a reload, and a section hash left in the address by a nav link is dropped before it
 * can jump the page there (the ?year= of the toppers gallery is kept).
 */
export const startAtTopScript =
  'history.scrollRestoration="manual";if(location.hash)history.replaceState(null,"",location.pathname+location.search)';

export function setSmoothScroll(lenis: Lenis | null) {
  instance = lenis;
}

/** Stops the page from scrolling behind a dialog, and lets it scroll again. */
export function lockScroll(locked: boolean) {
  if (locked) instance?.stop();
  else instance?.start();
}

/** Scrolls an element into view under the docked nav, smoothly. */
export function scrollToElement(el: Element, offset = 88) {
  if (instance) {
    const zoom = parseFloat(document.documentElement.style.zoom) || 1;
    instance.scrollTo(el as HTMLElement, { offset: -offset * zoom });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
