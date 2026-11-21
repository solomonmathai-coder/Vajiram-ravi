"use client";

import { useEffect } from "react";

/**
 * The About page's reveal (his homepage's .rv): each `.ab-rv` rises in once as it comes into view, after its
 * own delay (--d). With reduced motion the CSS keeps everything in place.
 */
export default function AboutReveal() {
  useEffect(() => {
    // ...and Kevin's homepage parts where a page reuses them (.kv: his .rv, and his .rise and .sg rows, whose items rise in turn)
    const els = [...document.querySelectorAll<HTMLElement>(".ab-page .ab-rv, .ab-page .kv .rv, .ab-page .kv .rise, .ab-page .kv .sg")];
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
