"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

const EASE = "cubic-bezier(.2,.8,.2,1)";

/**
 * Text that rolls when it changes: the old value rises out and fades while the new one rises in from
 * below, both in the same grid cell so nothing around them moves.
 */
export default function Roll({ text, className }: { text: string; className?: string }) {
  const [current, setCurrent] = useState(text);
  const [outgoing, setOutgoing] = useState<string | null>(null);
  const inRef = useRef<HTMLSpanElement>(null);
  const outRef = useRef<HTMLSpanElement>(null);

  // A new value: keep the old one on screen just long enough to roll it away.
  if (text !== current) {
    setOutgoing(current);
    setCurrent(text);
  }

  useLayoutEffect(() => {
    if (outgoing === null) return;
    if (prefersReducedMotion()) {
      setOutgoing(null);
      return;
    }
    const enter = inRef.current?.animate(
      [
        { transform: "translateY(55%)", opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 420, easing: EASE },
    );
    const exit = outRef.current?.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: "translateY(-55%)", opacity: 0 },
      ],
      { duration: 300, easing: EASE, fill: "forwards" },
    );
    if (exit) exit.onfinish = () => setOutgoing(null);
    return () => {
      enter?.cancel();
      exit?.cancel();
    };
  }, [outgoing, current]);

  return (
    <span className={cx("grid", className)}>
      <span ref={inRef} className="col-start-1 row-start-1">
        {current}
      </span>
      {outgoing !== null && (
        <span ref={outRef} aria-hidden="true" className="col-start-1 row-start-1">
          {outgoing}
        </span>
      )}
    </span>
  );
}
