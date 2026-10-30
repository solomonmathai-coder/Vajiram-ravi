"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { bentoProgrammes, stages, type Stage } from "@/data/programme-bento";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { CounsellingTile, SmallCard, WideCard } from "./ProgrammeCards";

type Filter = Stage | "all";
/** A card's box inside the grid, in canvas pixels. */
type Box = { x: number; y: number; w: number; h: number };

const EASE = "cubic-bezier(.2,.8,.2,1)";
const MOVE_MS = 400;
const EXIT_MS = 300;
const COUNSELLING = "counselling";

const FILTERS: { id: Filter; label: string; count: number }[] = [
  { id: "all", label: "All", count: bentoProgrammes.length },
  ...stages.map((s) => ({ id: s.id, label: s.label, count: bentoProgrammes.filter((p) => p.stage === s.id).length })),
];

const shows = (filter: Filter, key: string) =>
  key === COUNSELLING || filter === "all" || bentoProgrammes.find((p) => p.title === key)?.stage === filter;

/**
 * The stage filter and the programme bento. A dark thumb slides to the chosen stage; cards that do not
 * match fade and shrink to 0.96 where they stand, while the rest glide to their new places (FLIP, 400ms)
 * and the grid's height follows, so the page below moves smoothly too.
 */
export default function ProgrammeExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  // Cards fading out, held at the box they had when the filter changed.
  const [leaving, setLeaving] = useState<Map<string, Box>>(() => new Map());

  const gridRef = useRef<HTMLDivElement>(null);
  const items = useRef(new Map<string, HTMLDivElement>());
  const buttons = useRef(new Map<Filter, HTMLButtonElement>());
  const thumbRef = useRef<HTMLSpanElement>(null);
  const before = useRef<{ boxes: Map<string, Box>; opacity: Map<string, number>; height: number; wasLeaving: Set<string> } | null>(
    null,
  );

  // The thumb follows the active button; measured again once fonts load and on resize.
  useLayoutEffect(() => {
    const place = () => {
      const button = buttons.current.get(filter);
      const thumb = thumbRef.current;
      if (!button || !thumb) return;
      thumb.style.width = `${button.offsetWidth}px`;
      thumb.style.translate = `${button.offsetLeft}px 0`;
    };
    place();
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [filter]);

  const choose = (next: Filter) => {
    if (next === filter) return;
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) {
      setLeaving(new Map());
      setFilter(next);
      return;
    }
    // First: where every shown card is right now, including any move still in flight.
    const gridRect = grid.getBoundingClientRect();
    const scale = gridRect.width / grid.offsetWidth || 1;
    const boxes = new Map<string, Box>();
    const opacity = new Map<string, number>();
    items.current.forEach((el, key) => {
      if (el.hidden) return;
      const held = leaving.get(key);
      const rect = el.getBoundingClientRect();
      boxes.set(
        key,
        held ?? { x: (rect.left - gridRect.left) / scale, y: (rect.top - gridRect.top) / scale, w: el.offsetWidth, h: el.offsetHeight },
      );
      opacity.set(key, Number(getComputedStyle(el).opacity));
    });
    before.current = { boxes, opacity, height: gridRect.height / scale, wasLeaving: new Set(leaving.keys()) };

    const exits = new Map<string, Box>();
    boxes.forEach((box, key) => {
      if (!shows(next, key)) exits.set(key, box);
    });
    setLeaving(exits);
    setFilter(next);
  };

  // Last, invert, play: runs after React has applied the new filter, before the browser paints.
  useLayoutEffect(() => {
    const snapshot = before.current;
    const grid = gridRef.current;
    if (!snapshot || !grid) return;
    before.current = null;

    // A height animation still running would be read back as the new height.
    grid.getAnimations().forEach((a) => a.cancel());
    grid.animate([{ height: `${snapshot.height}px` }, { height: `${grid.offsetHeight}px` }], { duration: MOVE_MS, easing: EASE });

    items.current.forEach((el, key) => {
      if (el.hidden) return;
      if (leaving.has(key)) {
        // A card already on its way out keeps its running fade.
        if (snapshot.wasLeaving.has(key)) return;
        el.getAnimations().forEach((a) => a.cancel());
        const exit = el.animate([{ opacity: 1, scale: 1 }, { opacity: 0, scale: 0.96 }], { duration: EXIT_MS, easing: EASE, fill: "forwards" });
        exit.onfinish = () =>
          setLeaving((current) => {
            const rest = new Map(current);
            rest.delete(key);
            return rest;
          });
        return;
      }
      el.getAnimations().forEach((a) => a.cancel());
      const from = snapshot.boxes.get(key);
      if (!from) {
        // Newly shown: grows in where it lands.
        el.animate([{ opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1 }], { duration: MOVE_MS, delay: 80, easing: EASE, fill: "backwards" });
        return;
      }
      const dx = from.x - el.offsetLeft;
      const dy = from.y - el.offsetTop;
      const startOpacity = snapshot.opacity.get(key) ?? 1;
      if (dx || dy || startOpacity < 1) {
        el.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)`, opacity: startOpacity },
            { transform: "none", opacity: 1 },
          ],
          { duration: MOVE_MS, easing: EASE },
        );
      }
    });
  }, [filter, leaving]);

  const visibleCount = filter === "all" ? bentoProgrammes.length : bentoProgrammes.filter((p) => p.stage === filter).length;

  const itemProps = (key: string, className?: string) => {
    const held = leaving.get(key);
    const style: CSSProperties | undefined = held
      ? { position: "absolute", left: held.x, top: held.y, width: held.w, height: held.h, pointerEvents: "none" }
      : undefined;
    return {
      ref: (el: HTMLDivElement | null) => {
        if (el) items.current.set(key, el);
        else items.current.delete(key);
      },
      hidden: !held && !shows(filter, key),
      inert: !!held,
      style,
      className,
    };
  };

  return (
    <>
      <div data-reveal className="self-start">
        <div
          role="group"
          aria-label="Filter programmes by stage"
          className="relative flex items-start gap-0.5 rounded-full border border-sand-line bg-sand p-1 font-medium whitespace-nowrap"
        >
          {/* Starts on "All" (as measured in the design) until the first measurement. */}
          <span
            ref={thumbRef}
            aria-hidden="true"
            className="absolute top-1 left-0 h-[39px] w-[70px] translate-x-1 rounded-full bg-char transition-[translate,width] duration-400 ease-[cubic-bezier(.2,.8,.2,1)]"
          />
          {FILTERS.map(({ id, label, count }) => {
            const active = id === filter;
            return (
              <button
                key={id}
                ref={(el) => {
                  if (el) buttons.current.set(id, el);
                  else buttons.current.delete(id);
                }}
                type="button"
                aria-pressed={active}
                onClick={() => choose(id)}
                className="group/filter relative flex cursor-pointer items-center gap-2 rounded-full px-[18px] py-[9px] leading-[1.5]"
              >
                <span
                  className={cx(
                    "text-[14px] transition-colors duration-400",
                    active ? "text-paper" : "text-stone group-hover/filter:text-char",
                  )}
                >
                  {label}
                </span>
                <span className={cx("text-[12px] transition-colors duration-400", active ? "text-tangerine" : "text-[#8f867f]")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Showing ${visibleCount} programme${visibleCount === 1 ? "" : "s"}`}
      </p>

      <div
        ref={gridRef}
        data-reveal-group
        className="relative grid w-full grid-cols-[repeat(4,308px)] auto-rows-[332px] gap-4"
      >
        {bentoProgrammes.map((programme) =>
          programme.size === "wide" ? (
            <div key={programme.title} {...itemProps(programme.title, "col-span-2")}>
              <WideCard programme={programme} />
            </div>
          ) : (
            <div key={programme.title} {...itemProps(programme.title)}>
              <SmallCard programme={programme} />
            </div>
          ),
        )}
        <div {...itemProps(COUNSELLING, "col-span-2")}>
          <CounsellingTile />
        </div>
      </div>
    </>
  );
}
