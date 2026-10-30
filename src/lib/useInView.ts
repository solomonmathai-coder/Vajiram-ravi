"use client";

import { useEffect, useRef, useState } from "react";

type InViewOptions = {
  /** Share of the element that must be visible, 0 to 1. */
  threshold?: number;
  /** Stay true after the first time the element is seen. */
  once?: boolean;
  rootMargin?: string;
};

/** Whether the element is on screen. Without IntersectionObserver it reports true. */
export function useInView<T extends Element>({ threshold = 0, once = true, rootMargin }: InViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, inView] as const;
}
