"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowPill } from "@/components/ui/Pill";
import { batchFilters, type Batch, type BatchFilter } from "@/data/admissions";
import { prefersReducedMotion } from "@/lib/motion";
import BatchCalendar from "./BatchCalendar";
import BatchRail from "./BatchRail";
import { todayIso } from "./dates";
import ModeFilter from "./ModeFilter";

type Hover = { day: string; from: "calendar" | "card" };

type AdmissionsBoardProps = {
  /** The heading block, rendered on the server. */
  heading: ReactNode;
  batches: Batch[];
};

/**
 * The batches part of the admissions section: the heading row with the mode filter, the calendar
 * strip, the batch cards and the link to every batch, which all share the filter, the chosen day and
 * the hovered day.
 * "Today" is read on the client, so the server render treats every batch as upcoming.
 */
export default function AdmissionsBoard({ heading, batches }: AdmissionsBoardProps) {
  const [filter, setFilter] = useState<BatchFilter>("All");
  const [today, setToday] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [hover, setHover] = useState<Hover | null>(null);
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => setToday(todayIso()), []);

  const sorted = useMemo(() => [...batches].sort((a, b) => a.starts.localeCompare(b.starts)), [batches]);
  const matches = (batch: Batch, value: BatchFilter) => value === "All" || batch.modes.includes(value);

  const inFilter = sorted.filter((batch) => matches(batch, filter));
  const upcoming = today ? inFilter.filter((batch) => batch.starts >= today) : inFilter;
  // Once every batch in the filter has started, list them all rather than leave the rail empty.
  const listed = upcoming.length ? upcoming : inFilter;
  const next = upcoming[0] ?? null;
  const shown = selectedDay ? listed.filter((batch) => batch.starts === selectedDay) : listed;

  const changeFilter = (value: BatchFilter) => {
    setFilter(value);
    setHover(null);
    // Let go of a chosen day that has nothing left under the new filter.
    if (selectedDay && !sorted.some((batch) => batch.starts === selectedDay && matches(batch, value))) setSelectedDay(null);
  };

  const selectDay = (day: string | null) => {
    setSelectedDay(day);
    if (day) railRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
  };

  return (
    <>
      <div className="flex w-full items-end justify-between">
        {heading}
        <div data-reveal className="shrink-0">
          <ModeFilter label="Batch mode" options={batchFilters} value={filter} onChange={changeFilter} />
        </div>
      </div>

      <BatchCalendar
        batches={listed}
        nextDay={next?.starts ?? null}
        today={today}
        selectedDay={selectedDay}
        litDay={hover?.day ?? null}
        onHoverDay={(day) => setHover(day ? { day, from: "calendar" } : null)}
        onSelectDay={selectDay}
      />

      <div data-reveal className="w-full">
        <BatchRail
          listRef={railRef}
          batches={sorted}
          shownIds={shown.map((batch) => batch.id)}
          featuredId={next?.id ?? null}
          spotlightDay={hover?.from === "calendar" ? hover.day : null}
          onHoverCard={(day) => setHover(day ? { day, from: "card" } : null)}
        />
        {/* Every batch, on its own page: after the cards, where the list ends. */}
        <div className="flex justify-end pt-6">
          <ArrowPill href="#" surface="outline-dark" knob="paper">
            View all batches
          </ArrowPill>
        </div>
      </div>
    </>
  );
}
