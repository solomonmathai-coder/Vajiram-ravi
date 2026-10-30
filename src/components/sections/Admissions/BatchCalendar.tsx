"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Batch } from "@/data/admissions";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { MONTHS, daysInMonth, isoOf, parseIso } from "./dates";

const EASE = "cubic-bezier(.2,.8,.2,1)";

type BatchCalendarProps = {
  /** Batches to mark, in date order (those in the current filter that have not started yet). */
  batches: Batch[];
  /** The earliest upcoming batch's date: its day is orange. */
  nextDay: string | null;
  /** Today, once known on the client; earlier days dim. */
  today: string | null;
  /** The day the cards are filtered to. */
  selectedDay: string | null;
  /** A day to light up because its card (or the day itself) is hovered. */
  litDay: string | null;
  onHoverDay: (day: string | null) => void;
  onSelectDay: (day: string | null) => void;
};

/** The month arrows: as tall as the day cells, at either end of the strip. */
const PAGER =
  "flex h-15 w-9 shrink-0 items-center justify-center rounded-xl border border-paper/10 bg-paper/3 text-[14px]/none text-cream/70 transition-colors duration-300 enabled:hover:border-paper/25 enabled:hover:bg-paper/8 enabled:hover:text-cream disabled:cursor-default disabled:opacity-30";

/**
 * A one-month strip of days above the batch cards, with the month arrows at either end of it. Days
 * with a batch light up and the next batch is orange; a badge counts days with more than one batch.
 * Hovering a day lights its cards and clicking it filters the cards to that day. The strip opens on
 * the month of the next batch and can page on to the following month.
 */
export default function BatchCalendar({
  batches,
  nextDay,
  today,
  selectedDay,
  litDay,
  onHoverDay,
  onSelectDay,
}: BatchCalendarProps) {
  const [page, setPage] = useState(0);
  const daysRef = useRef<HTMLDivElement>(null);
  const turn = useRef(0);

  const first = parseIso(nextDay ?? batches[0]?.starts ?? todayFallback());
  const year = first.year + Math.floor((first.month + page) / 12);
  const month = (first.month + page) % 12;
  const dayCount = daysInMonth(year, month);
  const monthName = MONTHS[month];

  const perDay = new Map<string, number>();
  for (const batch of batches) perDay.set(batch.starts, (perDay.get(batch.starts) ?? 0) + 1);

  // Slide the new month in from the side it was paged towards.
  useLayoutEffect(() => {
    const direction = turn.current;
    if (!direction || prefersReducedMotion()) return;
    turn.current = 0;
    daysRef.current?.animate(
      [
        { opacity: 0, transform: `translateX(${direction * 24}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 450, easing: EASE },
    );
  }, [page]);

  const goTo = (next: number) => {
    turn.current = next > page ? 1 : -1;
    setPage(next);
    onSelectDay(null);
  };

  return (
    <div data-reveal className="flex w-full flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <p className="text-[15px]/[1.5] font-medium whitespace-nowrap text-cream/85" aria-live="polite">
          {monthName}
        </p>
        {selectedDay && (
          <button
            type="button"
            onClick={() => onSelectDay(null)}
            className="text-[12px]/[1.5] whitespace-nowrap text-cream/60 underline-offset-4 transition-colors duration-300 hover:text-cream hover:underline"
          >
            Show all dates
          </button>
        )}
      </div>

      <div className="flex w-full items-start gap-1">
        <button type="button" className={PAGER} disabled={page === 0} onClick={() => goTo(0)} aria-label="Previous month">
          <span aria-hidden="true">←</span>
        </button>
        <div ref={daysRef} className="flex min-w-0 flex-1 items-start gap-1">
        {Array.from({ length: dayCount }, (_, i) => {
          const day = i + 1;
          const iso = isoOf(year, month, day);
          const count = perDay.get(iso) ?? 0;
          const past = today !== null && iso < today;
          const cell = "relative flex h-15 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl border";

          if (!count) {
            return (
              <div key={iso} className={cx(cell, "border-paper/6 bg-paper/3", past && "opacity-40")}>
                <span className="text-[13px]/none whitespace-nowrap text-cream/35">{day}</span>
              </div>
            );
          }

          const isNext = iso === nextDay;
          const selected = iso === selectedDay;
          const lit = selected || iso === litDay;
          return (
            <button
              key={iso}
              type="button"
              aria-pressed={selected}
              aria-label={`${day} ${monthName}: ${count} ${count > 1 ? "batches start" : "batch starts"}${isNext ? ", the next to start" : ""}`}
              onClick={() => onSelectDay(selected ? null : iso)}
              onMouseEnter={() => onHoverDay(iso)}
              onMouseLeave={() => onHoverDay(null)}
              onFocus={() => onHoverDay(iso)}
              onBlur={() => onHoverDay(null)}
              className={cx(
                cell,
                "[transition:background-color_.3s,border-color_.3s,box-shadow_.3s,translate_.4s_cubic-bezier(.2,.8,.2,1)]",
                isNext ? "border-paper/6 bg-orange" : "border-cream/30 bg-cream/14",
                lit && "-translate-y-0.5",
                selected
                  ? "shadow-[0_0_0_2px_var(--color-cream)]"
                  : lit && "shadow-[0_0_0_2px_rgb(245_240_234/0.45)]",
                past && "opacity-40",
              )}
            >
              <span className={cx("text-[16px]/none font-semibold whitespace-nowrap", isNext ? "text-paper" : "text-cream")}>
                {day}
              </span>
              <span className={cx("size-1 rounded-full", isNext ? "bg-paper" : "bg-tangerine")} aria-hidden="true" />
              {count > 1 && (
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute -top-[7px] -right-[3.6px] flex size-[18px] items-center justify-center rounded-full text-[10px]/none font-semibold",
                    isNext ? "bg-paper text-orange" : "bg-orange text-paper",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
        </div>
        <button type="button" className={PAGER} disabled={page === 1} onClick={() => goTo(1)} aria-label="Next month">
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function todayFallback(): string {
  const now = new Date();
  return isoOf(now.getFullYear(), now.getMonth(), 1);
}
