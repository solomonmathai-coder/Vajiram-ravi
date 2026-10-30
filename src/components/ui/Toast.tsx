"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { PLACEHOLDER_LINK_MESSAGE, showToast, subscribeToToasts } from "@/lib/toast";

const VISIBLE_MS = 2200;

/** Page-wide status toast. Also explains links (href="#") that lead outside this prototype. */
export default function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeToToasts((next) => {
      setMessage(next);
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), VISIBLE_MS);
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.('a[href="#"]')) {
        event.preventDefault();
        showToast(PLACEHOLDER_LINK_MESSAGE);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      unsubscribe();
      clearTimeout(timer);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      className={cx(
        "pointer-events-none fixed bottom-[calc(28px+env(safe-area-inset-bottom,0px))] left-1/2 z-60 -translate-x-1/2 rounded-full bg-char px-4.5 py-3 font-sans text-[14px]/[21px] font-medium whitespace-nowrap text-cream shadow-[0_18px_40px_-12px_rgba(0,0,0,.6),inset_0_0_0_1px_rgb(255_253_251/0.12)] [transition:opacity_.3s,translate_.3s_var(--ease-smooth)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      {message}
    </div>
  );
}
