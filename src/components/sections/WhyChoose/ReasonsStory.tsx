"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Photo from "@/components/ui/Photo";
import type { Reason } from "@/data/why-choose";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";

/** Scroll distance, in canvas pixels, that each reason stays active while the row is pinned. */
const SCROLL_PER_REASON = 360;
const ROW_HEIGHT = 600;
/** Pinned just under the docked nav (12px from the top, 56px tall), or centred when the viewport is taller. */
const PIN_TOP = `max(104px, calc((100svh / var(--canvas-zoom, 1) - ${ROW_HEIGHT}px) / 2))`;
const EASE = "duration-500 ease-[cubic-bezier(.2,.8,.2,1)]";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The six reasons as a sticky scroll story: the photo and the list pin while the page scrolls on, and the
 * scroll position picks the active reason. It brightens, its description opens, and the orange line along
 * its top fills as you read; the photo cross-fades to match. Each title also jumps to its reason.
 */
export default function ReasonsStory({ reasons }: { reasons: Reason[] }) {
  const count = reasons.length;
  const pinnedDistance = SCROLL_PER_REASON * count;
  const [active, setActive] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Reads the pinned row's offset inside its track: 0 until it pins, the full distance once it lets go.
  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    let frame = 0;
    let current = 0;
    const update = () => {
      frame = 0;
      const position = clamp01((canvasTop(pin) - canvasTop(track)) / pinnedDistance) * count;
      const index = Math.min(count - 1, Math.floor(position));
      const fill = clamp01(position - index);
      lineRefs.current.forEach((line, i) => {
        if (line) line.style.transform = `scaleX(${i === index ? fill : 0})`;
      });
      if (index !== current) {
        current = index;
        setActive(index);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();

    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      const method = on ? "addEventListener" : "removeEventListener";
      window[method]("scroll", schedule, { passive: true });
      window[method]("resize", schedule);
      if (on) schedule();
    };
    if (!("IntersectionObserver" in window)) {
      listen(true);
      return () => listen(false);
    }
    const observer = new IntersectionObserver(([entry]) => listen(entry.isIntersecting), { rootMargin: "200px 0px" });
    observer.observe(track);
    return () => {
      observer.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
    };
  }, [count, pinnedDistance]);

  /** Scrolls to the start of a reason's stretch, a little in, so its line has begun to fill. */
  const goTo = (index: number) => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;
    const pinTop = parseFloat(getComputedStyle(pin).top) || 0;
    const offset = ((index + 0.08) / count) * pinnedDistance;
    window.scrollBy({ top: (canvasTop(track) - (pinTop - offset)) * getCanvasZoom() });
  };

  return (
    <div ref={trackRef} className="relative w-full" style={{ height: ROW_HEIGHT + pinnedDistance }}>
      <div ref={pinRef} data-reveal-group className="sticky flex h-[600px] w-full items-start gap-20" style={{ top: PIN_TOP }}>
        <div className="relative h-[600px] w-[560px] shrink-0 overflow-clip rounded-[28px] bg-soot">
          {reasons.map(({ photo }, i) => (
            <Photo
              key={photo.alt}
              className={cx(
                "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(.2,.8,.2,1)] [&_img]:[object-position:var(--pos)]",
                i === active ? "opacity-100" : "opacity-0",
              )}
              style={
                {
                  "--pos": photo.position ?? "50% 50%",
                  scale: photo.zoom,
                  transformOrigin: photo.position,
                } as CSSProperties
              }
              src={photo.src}
              alt={i === active ? photo.alt : ""}
              sizes="560px"
            />
          ))}
          <span
            aria-hidden="true"
            className="absolute top-5 left-5 rounded-full border border-paper/14 bg-coal/60 px-3.5 py-2 text-[12px]/[1.2] font-medium whitespace-nowrap text-paper"
          >
            {pad(active + 1)} / {pad(count)}
          </span>
        </div>

        <ol className="flex min-w-0 flex-1 flex-col">
          {reasons.map((reason, i) => {
            const isActive = i === active;
            return (
              <li key={reason.title} className="relative border-t border-paper/10 py-6">
                {/* The reading line: filled by the scroll position while this reason is active. */}
                <span
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  // Starts empty; the scroll handler sets its fill. (Not the scale-x utility: that sets `scale`,
                  // which would multiply with the transform written here and keep the line at zero.)
                  className="absolute -top-px left-0 h-0.5 w-full origin-left bg-orange"
                  style={{ transform: "scaleX(0)" }}
                />
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-expanded={isActive}
                  aria-controls={`reason-${i}`}
                  className={cx(
                    "group/reason flex cursor-pointer items-baseline gap-6 text-left font-medium whitespace-nowrap transition-colors",
                    EASE,
                    isActive ? "text-cream" : "text-cream/35 hover:text-cream/60",
                  )}
                >
                  <span className={cx("text-[14px]/[1.5] transition-colors", EASE, isActive && "text-tangerine")}>{pad(i + 1)}</span>
                  <span className="text-[32px]/[1.2] tracking-[-0.8px]">{reason.title}</span>
                </button>
                {/* Opens by animating its row from 0fr to 1fr, so the list below moves smoothly. */}
                <div
                  id={`reason-${i}`}
                  className={cx(
                    "grid transition-[grid-template-rows,opacity]",
                    EASE,
                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="w-[520px] pt-3 text-[17px]/[1.55] text-cream/68">{reason.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
