"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Photo from "@/components/ui/Photo";
import type { ProgrammeBanner } from "@/data/hero";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";

/** Time each banner stays, in milliseconds. */
const INTERVAL = 6000;
/** The active banner's width and the gap to its neighbours, which peek in 56px at either side. */
const SLIDE = 1136;
const GAP = 16;
const PEEK = 56;
const DRAG_START_PX = 6;
const SWIPE_PX = 60;
const EASE = "cubic-bezier(.2,.8,.2,1)";

/**
 * Story-style banner carousel (Figma "Programme banners"). Each banner shows for 6 seconds while its
 * segment in the progress bar fills; the neighbours peek in at 35% opacity. It loops, follows a drag,
 * takes the arrow keys, and pauses while hovered, off screen or in a hidden tab.
 *
 * Banners are keyed by a virtual index that grows without bound, so moving either way never makes a
 * banner jump across the row.
 */
export default function StoryBanners({ slides }: { slides: ProgrammeBanner[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const active = mod(index, count);
  // Read by the clock, so a frame that lands just after a slide change fills the new segment, not the old one.
  const activeRef = useRef(active);
  activeRef.current = active;

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fillRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const elapsed = useRef(0);
  const hovering = useRef(false);
  const inView = useRef(false);
  const drag = useRef({ down: false, moved: false, startX: 0, dx: 0 });

  const go = useCallback((delta: number) => {
    if (!delta) return;
    elapsed.current = 0;
    setIndex((current) => current + delta);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting), { threshold: 0.3 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // The clock fills the current segment and moves on when it is full.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Capped, so returning to a hidden tab does not count the time away.
      const dt = Math.min(now - last, 100);
      last = now;
      if (inView.current && !hovering.current && !document.hidden && !drag.current.down) {
        elapsed.current += dt;
        const fill = fillRefs.current[activeRef.current];
        if (fill) fill.style.transform = `scaleX(${Math.min(1, elapsed.current / INTERVAL)})`;
        if (elapsed.current >= INTERVAL) go(1);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [go]);

  // Drag: tracked on the window so it can leave the row; the stage follows the pointer without easing.
  useEffect(() => {
    const onMove = (event: globalThis.PointerEvent) => {
      const d = drag.current;
      if (!d.down) return;
      d.dx = (event.clientX - d.startX) / getCanvasZoom();
      if (!d.moved && Math.abs(d.dx) < DRAG_START_PX) return;
      d.moved = true;
      const stage = stageRef.current;
      if (stage) {
        stage.style.transition = "none";
        stage.style.transform = `translateX(${d.dx}px)`;
      }
    };
    const onUp = () => {
      const d = drag.current;
      if (!d.down) return;
      d.down = false;
      const stage = stageRef.current;
      if (stage) {
        stage.style.transition = `transform 600ms ${EASE}`;
        stage.style.transform = "";
      }
      if (d.moved && Math.abs(d.dx) > SWIPE_PX) go(d.dx < 0 ? 1 : -1);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [go]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { down: true, moved: false, startX: event.clientX, dx: 0 };
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    go(event.key === "ArrowLeft" ? -1 : 1);
  };

  /** Jumps to a banner by the shortest way round the loop. */
  const toSlide = (target: number) => {
    let delta = target - active;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    go(delta);
  };

  return (
    <div
      ref={rootRef}
      className="mt-14 flex flex-col gap-4 outline-none"
      aria-roledescription="carousel"
      aria-label="Programme banners"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {/* Segmented progress: banners already shown are full, the current one fills, the rest wait. */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Choose banner">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Banner ${i + 1}`}
            onClick={() => toSlide(i)}
            // The bar is 3px tall; ::after widens what can be clicked.
            className="group/seg relative h-[3px] w-[120px] after:absolute after:inset-x-0 after:-inset-y-2.5"
          >
            <span className="relative block size-full overflow-hidden rounded-[9px] bg-paper/18 transition-colors group-hover/seg:bg-paper/30">
              <span
                ref={(el) => {
                  fillRefs.current[i] = el;
                }}
                key={i === active ? `on-${index}` : "off"}
                className="absolute inset-0 origin-left rounded-[9px] bg-orange"
                style={{ transform: `scaleX(${i < active ? 1 : i === active ? Math.min(1, elapsed.current / INTERVAL) : 0})` }}
              />
            </span>
          </button>
        ))}
      </div>

      <div
        className="relative h-[400px] w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onDragStart={(event) => event.preventDefault()}
      >
        <div ref={stageRef} className="absolute inset-0">
          {[-2, -1, 0, 1, 2].map((p) => {
            const k = index + p;
            const slide = slides[mod(k, count)];
            const isActive = p === 0;
            return (
              <div
                key={k}
                aria-hidden={isActive ? "false" : "true"}
                className={cx(
                  "absolute top-0 h-[400px] overflow-hidden rounded-3xl",
                  !isActive && "cursor-pointer",
                )}
                style={{
                  left: PEEK + GAP,
                  width: SLIDE,
                  transform: `translateX(${p * (SLIDE + GAP)}px)`,
                  opacity: isActive ? 1 : 0.35,
                  transition: `transform 700ms ${EASE}, opacity 700ms ${EASE}`,
                }}
                onClick={() => !drag.current.moved && !isActive && go(p)}
              >
                {slide.fit === "contain" && (
                  <Photo
                    className="absolute -inset-6 scale-110 blur-2xl brightness-90 saturate-125"
                    src={slide.src}
                    alt=""
                    sizes="1136px"
                  />
                )}
                <Photo className="absolute inset-0" src={slide.src} alt={isActive ? slide.alt : ""} sizes="1136px" fit={slide.fit} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
