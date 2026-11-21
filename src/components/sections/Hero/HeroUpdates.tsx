"use client";

import { useEffect, useId, useState } from "react";
import { batches, todayIso, upcomingBatches } from "@/data/admissions";
import { heroNewCourses, heroUpdates } from "@/data/hero";
import { cx } from "@/lib/cx";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Tab = "batches" | "courses";

/**
 * "What's new", in the hero panel's bottom right corner (homepage v2: the client wanted the upcoming
 * batches and new courses in the hero itself): a frosted card of the rooms' warm brown, as the rank panel
 * above it, with two tabs. "Upcoming batches" lists the next three to start (data/admissions, those not
 * yet started, earliest first), each with its date in a small saffron block, its name and its modes;
 * "New courses" lists the new programmes with a "New" tag. A link at its foot goes to the full list.
 *
 * Tabs after the WAI-ARIA pattern (← → between them, the panel follows). The rows are links. The list is
 * worked out after hydration (today's date is the visitor's), the first paint showing every batch in order.
 */
export default function HeroUpdates({ className }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("batches");
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayIso()), []);
  const id = useId();
  const next = (today ? upcomingBatches(today) : [...batches].sort((a, b) => a.startDate.localeCompare(b.startDate))).slice(0, 3);
  const tabs: Tab[] = ["batches", "courses"];
  const more = heroUpdates.viewAll[tab];

  return (
    <div
      className={cx(
        "w-[392px] rounded-[20px] bg-[rgb(46_17_6/0.66)] p-4 text-white shadow-[0_18px_40px_-18px_rgb(20_6_2/0.6)] ring-1 ring-[#ffe9c2]/15 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-[17px]/[22px] font-semibold">{heroUpdates.title}</p>
        <div role="tablist" aria-label={heroUpdates.title} className="flex rounded-full bg-black/25 p-0.5">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`${id}-${t}`}
              aria-selected={tab === t}
              aria-controls={`${id}-${t}-panel`}
              tabIndex={tab === t ? 0 : -1}
              onClick={() => setTab(t)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                const other = t === "batches" ? "courses" : "batches";
                setTab(other);
                document.getElementById(`${id}-${other}`)?.focus();
              }}
              className={cx(
                "cursor-pointer rounded-full px-3 py-1 text-[13px]/[18px] font-semibold whitespace-nowrap [transition:background-color_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-saffron",
                tab === t ? "bg-saffron text-mahogany" : "text-white/80 hover:text-white",
              )}
            >
              {heroUpdates.tabs[t]}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" id={`${id}-${tab}-panel`} aria-labelledby={`${id}-${tab}`} className="mt-3">
        <ul className="flex flex-col gap-1">
          {tab === "batches"
            ? next.map((batch) => {
                const [, month, day] = batch.startDate.split("-");
                return (
                  <li key={batch.id}>
                    <a
                      href="#batches"
                      className="group/row flex items-center gap-3 rounded-[12px] px-2 py-1.5 [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-saffron"
                    >
                      <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-[10px] bg-saffron text-mahogany">
                        <span className="font-heading text-[18px]/[18px] font-bold">{Number(day)}</span>
                        <span className="text-[12px]/[14px] font-semibold">{MONTHS[Number(month) - 1]}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px]/[20px] font-semibold">{batch.programme}</span>
                        <span className="block text-[13px]/[18px] text-[#ffe9c2]/85">{batch.modes.join(" · ")}</span>
                      </span>
                      <Arrow />
                    </a>
                  </li>
                );
              })
            : heroNewCourses.map((course) => (
                <li key={course.name}>
                  <a
                    href={course.href}
                    className="group/row flex items-center gap-3 rounded-[12px] px-2 py-1.5 [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-saffron"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#ffe9c2]/15 text-[12px]/[14px] font-bold text-saffron ring-1 ring-saffron/40">
                      {heroUpdates.newTag}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px]/[20px] font-semibold">{course.name}</span>
                      <span className="block truncate text-[13px]/[18px] text-[#ffe9c2]/85">{course.note}</span>
                    </span>
                    <Arrow />
                  </a>
                </li>
              ))}
        </ul>
        <a
          href={more.href}
          className="mt-2 ml-2 inline-flex items-center gap-1.5 text-[14px]/[20px] font-semibold text-saffron [transition:color_var(--dur-fast)_var(--ease-out)] hover:text-white"
        >
          {more.label}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      className="shrink-0 text-white/60 [transition:translate_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)] group-hover/row:translate-x-0.5 group-hover/row:text-white"
    >
      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
