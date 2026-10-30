"use client";

import { useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";
import { whenFontsReady } from "@/lib/motion";

type ModeFilterProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * Segmented control on the dark page. A cream thumb slides under the chosen option; it is measured
 * from the buttons, so it fits whatever the labels are.
 */
export default function ModeFilter<T extends string>({ label, options, value, onChange }: ModeFilterProps<T>) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const index = Math.max(0, options.indexOf(value));

  useLayoutEffect(() => {
    let live = true;
    const place = () => {
      const button = buttons.current[index];
      const thumb = thumbRef.current;
      if (!live || !button || !thumb) return;
      thumb.style.width = `${button.offsetWidth}px`;
      thumb.style.translate = `${button.offsetLeft}px 0`;
    };
    place();
    // Labels can change width once the web font arrives.
    whenFontsReady().then(place);
    return () => {
      live = false;
    };
  }, [index]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next]);
    buttons.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="relative flex shrink-0 gap-0.5 rounded-full border border-paper/10 bg-paper/5 p-1"
    >
      {/* Starts where the first option sits in the design, so the server render already shows it. */}
      <span
        ref={thumbRef}
        aria-hidden="true"
        className="absolute inset-y-1 left-0 w-12 translate-x-1 rounded-full bg-cream [transition:translate_.5s_cubic-bezier(.2,.8,.2,1),width_.5s_cubic-bezier(.2,.8,.2,1)]"
      />
      {options.map((option, i) => {
        const active = i === index;
        return (
          <button
            key={option}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option)}
            className={cx(
              "relative rounded-full px-4 py-2 text-[13px]/[1.2] font-medium whitespace-nowrap transition-colors duration-300",
              active ? "text-char" : "text-cream hover:text-paper",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
