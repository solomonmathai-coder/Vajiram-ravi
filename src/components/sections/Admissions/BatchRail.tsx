"use client";

import { useEffect, useLayoutEffect, useRef, useState, type Ref } from "react";
import { ArrowPill } from "@/components/ui/Pill";
import type { Batch } from "@/data/admissions";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { MONTHS, parseIso } from "./dates";
import { requestEnquiry } from "./enquiry";

const EASE = "cubic-bezier(.2,.8,.2,1)";

function Tag({ children, className, dot }: { children: string; className: string; dot?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-[5px] text-[12px]/[1.2] font-medium whitespace-nowrap",
        className,
      )}
    >
      {dot && <span className={cx("size-[7px] rounded-full", dot)} aria-hidden="true" />}
      {children}
    </span>
  );
}

type BatchCardProps = {
  batch: Batch;
  /** The next batch to start: the wide orange card. */
  featured: boolean;
  /** Lifted because its day is hovered in the calendar. */
  spotlit: boolean;
  /** Faded because another day is hovered in the calendar. */
  dimmed: boolean;
};

function BatchCard({ batch, featured, spotlit, dimmed }: BatchCardProps) {
  const { day, month } = parseIso(batch.starts);
  const monthShort = MONTHS[month].slice(0, 3).toUpperCase();
  return (
    <article
      className={cx(
        "relative flex h-[360px] flex-col justify-between overflow-clip rounded-3xl p-6 [transition:translate_.4s_cubic-bezier(.2,.8,.2,1),border-color_.4s_cubic-bezier(.2,.8,.2,1),opacity_.3s_ease]",
        featured
          ? "w-[412px] bg-[linear-gradient(138.85deg,#ff8a3d_14.286%,#ee6a12_46.429%,#420727_85.714%)]"
          : cx(
              "w-[273px] border bg-soot hover:-translate-y-1 hover:border-paper/20",
              spotlit ? "border-paper/20" : "border-paper/8",
            ),
        spotlit && "-translate-y-1",
        dimmed && "opacity-45",
      )}
    >
      <div className="flex flex-col gap-3.5">
        {(featured || batch.limitedSeats) && (
          <div className="flex flex-wrap gap-1.5">
            {featured && <Tag className="bg-paper/20 text-paper">Starting next</Tag>}
            {batch.limitedSeats &&
              (featured ? (
                <Tag className="bg-coal/25 text-paper" dot="bg-paper">
                  Limited seats
                </Tag>
              ) : (
                <Tag className="bg-orange/14 text-tangerine" dot="bg-orange">
                  Limited seats
                </Tag>
              ))}
          </div>
        )}
        <p
          className={cx(
            "font-medium whitespace-nowrap text-paper",
            featured ? "text-[72px]/none tracking-[-3.6px]" : "text-[52px]/none tracking-[-2.6px]",
          )}
        >
          {day}
          <span className={cx("text-paper/70", featured ? "text-[24px]/none" : "text-[18px]/none")}> {monthShort}</span>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h3
          className={cx(
            "font-medium text-paper",
            featured ? "text-[22px]/[1.28] tracking-[-0.22px]" : "text-[17px]/[1.28] tracking-[-0.17px]",
          )}
        >
          {batch.title}
        </h3>
        <p className={cx("text-[13px]/[1.5]", featured ? "text-paper/85" : "text-paper/55")}>{batch.meta}</p>
        <div className="flex pt-2.5">
          {/* The design's Register pills: a 24px left inset, and a 34px (featured) or 32px knob. */}
          <ArrowPill
            onClick={() => requestEnquiry(batch.title)}
            ariaLabel={`Register for ${batch.title}`}
            surface={featured ? "paper" : "outline-dark"}
            knob={featured ? "char" : "paper"}
            size="sm"
            className={cx("pl-6!", featured ? "[&>span:last-child]:size-[34px]" : "[&>span:last-child]:size-8")}
          >
            Register now
          </ArrowPill>
        </div>
      </div>
    </article>
  );
}

type BatchRailProps = {
  /** Every batch the rail can show, in date order. */
  batches: Batch[];
  /** Ids to show now. Cards that leave fade out, then the rest slide over to close the gaps. */
  shownIds: string[];
  featuredId: string | null;
  /** A calendar day being hovered: its cards lift and the others fade back. */
  spotlightDay: string | null;
  onHoverCard: (day: string | null) => void;
  listRef?: Ref<HTMLUListElement>;
};

/** The row of batch cards. It re-flows with a fade and a slide when the filter or the chosen day changes. */
export default function BatchRail({ batches, shownIds, featuredId, spotlightDay, onHoverCard, listRef }: BatchRailProps) {
  const targetKey = shownIds.join(" ");
  const [rendered, setRendered] = useState(shownIds);
  const nodes = useRef(new Map<string, HTMLLIElement>());
  // Card positions just before a re-flow, read back after it to slide each card from old place to new.
  const before = useRef<Map<string, number> | null>(null);

  useEffect(() => {
    if (rendered.join(" ") === targetKey) return;
    const next = targetKey ? targetKey.split(" ") : [];
    const commit = () => {
      before.current = new Map(rendered.map((id) => [id, nodes.current.get(id)?.offsetLeft ?? 0]));
      setRendered(next);
    };
    const leaving = rendered
      .filter((id) => !next.includes(id))
      .map((id) => nodes.current.get(id))
      .filter((el): el is HTMLLIElement => !!el);
    if (!leaving.length || prefersReducedMotion() || typeof Element.prototype.animate !== "function") {
      commit();
      return;
    }
    let live = true;
    const fades = leaving.map((el) =>
      el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.96)" }], {
        duration: 220,
        easing: "cubic-bezier(.4,0,1,1)",
        fill: "forwards",
      }),
    );
    Promise.all(fades.map((fade) => fade.finished)).then(
      () => live && commit(),
      () => {},
    );
    return () => {
      live = false;
      fades.forEach((fade) => fade.cancel());
    };
  }, [targetKey, rendered]);

  useLayoutEffect(() => {
    const previous = before.current;
    if (!previous) return;
    before.current = null;
    if (prefersReducedMotion()) return;
    let entering = 0;
    for (const id of rendered) {
      const el = nodes.current.get(id);
      if (!el) continue;
      const from = previous.get(id);
      if (from === undefined) {
        el.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
          duration: 450,
          delay: 80 + entering++ * 50,
          easing: EASE,
          fill: "backwards",
        });
      } else if (Math.abs(from - el.offsetLeft) > 0.5) {
        el.animate([{ transform: `translateX(${from - el.offsetLeft}px)` }, { transform: "none" }], {
          duration: 550,
          easing: EASE,
        });
      }
    }
  }, [rendered]);

  const byId = new Map(batches.map((batch) => [batch.id, batch]));

  return (
    <ul ref={listRef} className="relative flex min-h-[360px] w-full items-start gap-4">
      {rendered.map((id) => {
        const batch = byId.get(id);
        if (!batch) return null;
        return (
          <li
            key={id}
            ref={(el) => {
              if (el) nodes.current.set(id, el);
              else nodes.current.delete(id);
            }}
            className="shrink-0"
            onMouseEnter={() => onHoverCard(batch.starts)}
            onMouseLeave={() => onHoverCard(null)}
            onFocus={() => onHoverCard(batch.starts)}
            onBlur={() => onHoverCard(null)}
          >
            <BatchCard
              batch={batch}
              featured={id === featuredId}
              spotlit={spotlightDay === batch.starts}
              dimmed={spotlightDay !== null && spotlightDay !== batch.starts}
            />
          </li>
        );
      })}
    </ul>
  );
}
