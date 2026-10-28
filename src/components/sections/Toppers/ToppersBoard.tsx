"use client";

import { useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";

type ToppersBoardProps = {
  years: number[];
  /** Topper cards, rendered on the server. */
  children: ReactNode;
  /** Shown under the grid. */
  footer: ReactNode;
};

/**
 * Year tabs above the toppers grid. Picking a year replays the grid's swap animation.
 * The prototype shows the same 2025 cards for every year.
 */
export default function ToppersBoard({ years, children, footer }: ToppersBoardProps) {
  const [year, setYear] = useState(years[0]);
  const gridRef = useRef<HTMLDivElement>(null);

  const select = (next: number) => {
    if (next === year) return;
    setYear(next);
    const grid = gridRef.current;
    if (!grid) return;
    // Restart the CSS animation: remove the class, force a reflow, add it back.
    grid.classList.remove("swap");
    void grid.offsetWidth;
    grid.classList.add("swap");
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div data-reveal className="flex items-center gap-2 rounded-full" role="tablist" aria-label="Result year" id="years">
        {years.map((y) => (
          <button
            key={y}
            role="tab"
            aria-selected={y === year}
            onClick={() => select(y)}
            className={cx(
              "rounded-full border px-5 py-2.25 font-display text-[16px]/[23px] font-medium whitespace-nowrap transition-colors duration-250",
              y === year
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-900",
            )}
          >
            {y}
          </button>
        ))}
      </div>
      <div className="flex w-full flex-col gap-10">
        <div
          ref={gridRef}
          data-reveal-group
          className="grid auto-rows-[366px] grid-cols-5 gap-4 [&.swap]:animate-swap"
          id="resGrid"
          role="tabpanel"
          aria-label={`UPSC CSE ${year} toppers`}
        >
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}
