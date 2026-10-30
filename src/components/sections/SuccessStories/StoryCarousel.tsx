"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import Photo from "@/components/ui/Photo";
import type { Story } from "@/data/stories";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";

/*
 * Two fixed cards: the large dark card holds the current story and the light side card previews the next.
 * The stories change like a carousel: in both cards at once, the old story slides out to one side as the
 * new one slides in from the other, and the new portrait settles from a slight zoom while the quote and
 * then the name rise into place. It plays on its own every six seconds while it is on screen (the active
 * dot fills as the time runs) and pauses while hovered or focused; the arrows, the dots, the arrow keys,
 * a swipe and a click on the side card move it by hand. The motion runs on the Web Animations API and
 * restarts from wherever it is, so quick clicks never jump.
 */

const EASE = "cubic-bezier(.2,.8,.2,1)";
const SLIDE_MS = 800;
const INTERVAL = 6000;
const SWIPE_PX = 48;

type Slot = "feature" | "side";

/** A story slides out of its card, held fully visible while it goes (its layer is hidden once it has gone). */
function playOut(layer: HTMLElement, dir: 1 | -1) {
  layer.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  layer.animate(
    [
      { opacity: 1, transform: "none" },
      { opacity: 1, transform: `translateX(${-104 * dir}%)` },
    ],
    { duration: SLIDE_MS, easing: EASE },
  );
}

/** A story slides into its card; then its portrait, quote and name settle in turn. */
function playIn(layer: HTMLElement, dir: 1 | -1) {
  layer.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  const timing = (delay: number, duration: number) => ({ duration, delay, easing: EASE, fill: "backwards" as const });
  layer.animate([{ transform: `translateX(${104 * dir}%)` }, { transform: "none" }], timing(0, SLIDE_MS));
  layer.querySelector<HTMLElement>("[data-photo]")?.animate([{ transform: "scale(1.1)" }, { transform: "scale(1)" }], timing(0, 1400));
  layer
    .querySelector<HTMLElement>("[data-quote]")
    ?.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], timing(SLIDE_MS * 0.35, 700));
  layer
    .querySelector<HTMLElement>("[data-meta]")
    ?.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], timing(SLIDE_MS * 0.5, 700));
}

type StoryCarouselProps = {
  stories: Story[];
  /** The section heading, shown left of the arrows. */
  heading: ReactNode;
};

export default function StoryCarousel({ stories, heading }: StoryCarouselProps) {
  const count = stories.length;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const layers = useRef<Record<Slot, Array<HTMLDivElement | null>>>({ feature: [], side: [] });
  const fillRef = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const inView = useRef(false);
  const held = useRef(false);
  const shown = useRef(0);
  const direction = useRef<1 | -1>(1);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
  const next = mod(active + 1, count);

  // Every move, by hand or by the clock, starts the next story's time from zero.
  const step = useCallback(
    (delta: 1 | -1) => {
      direction.current = delta;
      elapsed.current = 0;
      if (fillRef.current) fillRef.current.style.transform = "scaleX(0)";
      setActive((current) => mod(current + delta, count));
    },
    [count],
  );

  const goTo = (index: number) => {
    if (index === active) return;
    direction.current = index > active ? 1 : -1;
    elapsed.current = 0;
    setActive(index);
  };

  useEffect(() => {
    if (prefersReducedMotion() || count < 2) setPlaying(false);
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) {
      inView.current = true;
      return;
    }
    const observer = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting), { threshold: 0.4 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [count]);

  // The clock: it runs while playing, on screen, in a visible tab and not hovered or focused, fills the
  // active dot, and moves on when the time is up.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Capped, so returning to a hidden tab does not count the time away.
      const dt = Math.min(now - last, 100);
      last = now;
      if (inView.current && !held.current && !document.hidden) {
        elapsed.current += dt;
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.min(1, elapsed.current / INTERVAL)})`;
        if (elapsed.current >= INTERVAL) step(1);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, step]);

  // Each card plays its old story out and its new one in.
  useEffect(() => {
    const from = shown.current;
    if (from === active) return;
    shown.current = active;
    if (prefersReducedMotion()) return;
    const dir = direction.current;
    const slots: Array<[Slot, number, number]> = [
      ["feature", from, active],
      ["side", mod(from + 1, count), next],
    ];
    for (const [slot, out, into] of slots) {
      if (out === into) continue;
      const leaving = layers.current[slot][out];
      const arriving = layers.current[slot][into];
      if (leaving) playOut(leaving, dir);
      if (arriving) playIn(arriving, dir);
    }
  }, [active, next, count]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowLeft" ? -1 : 1);
  };

  // Swipe on touch: a mostly horizontal flick moves one story; vertical moves stay page scrolls.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId) return;
    const zoom = getCanvasZoom();
    const dx = (event.clientX - start.x) / zoom;
    const dy = (event.clientY - start.y) / zoom;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  };

  const current = stories[active];

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-12"
      role="region"
      aria-roledescription="carousel"
      aria-label="Student stories"
      onKeyDown={onKeyDown}
      onMouseEnter={() => (held.current = true)}
      onMouseLeave={() => (held.current = false)}
      onFocus={() => (held.current = true)}
      onBlur={() => (held.current = false)}
    >
      <div data-reveal className="flex w-full items-end justify-between">
        {heading}
        <div className="flex items-start gap-2">
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => step(-1)}
            className="group/arrow flex size-12 items-center justify-center rounded-full border border-sand-line text-[16px]/none font-medium text-char [transition:background-color_.3s_var(--ease-smooth),border-color_.3s_var(--ease-smooth),scale_.3s_var(--ease-smooth)] hover:border-[#d3cbc1] hover:bg-sand active:scale-97"
          >
            <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/arrow:-translate-x-0.5">
              ←
            </span>
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => step(1)}
            className="group/arrow flex size-12 items-center justify-center rounded-full bg-char text-[16px]/none font-medium text-paper [transition:background-color_.3s_var(--ease-smooth),scale_.3s_var(--ease-smooth)] hover:bg-[#2a221e] active:scale-97"
          >
            <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/arrow:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>

      <div
        data-reveal
        className="relative flex h-[440px] w-full touch-pan-y gap-4"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <article
          aria-roledescription="slide"
          aria-label={`${active + 1} of ${count}`}
          className="relative h-full w-[860px] shrink-0 overflow-hidden rounded-[28px] bg-char"
        >
          {/* The card's warm glow stays put while the stories change over it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[100px] left-[360px] h-[620px] w-[740px] bg-[radial-gradient(closest-side,rgb(238_106_18/.47),rgb(238_106_18/.42)_28%,rgb(238_106_18/.25)_52%,rgb(238_106_18/.08)_76%,transparent)]"
          />
          {stories.map((story, i) => (
            <FeatureLook
              key={story.name}
              story={story}
              shown={i === active}
              layerRef={(el) => {
                layers.current.feature[i] = el;
              }}
            />
          ))}
        </article>
        {count > 1 && (
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={`Next story: ${stories[next].name}`}
            className="group/side relative h-full min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[28px] border border-sand-line bg-sand text-left transition-[border-color,translate] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1 hover:border-[#d3cbc1]"
          >
            {stories.map((story, i) => (
              <SideLook
                key={story.name}
                story={story}
                shown={i === next}
                layerRef={(el) => {
                  layers.current.side[i] = el;
                }}
              />
            ))}
          </button>
        )}
      </div>

      {/* The dots: the active one is a capsule that fills while its story shows. */}
      <div data-reveal className="flex items-center gap-1.5" role="tablist" aria-label="Choose story">
        {stories.map((story, i) => {
          const isActive = i === active;
          return (
            <button
              key={story.name}
              type="button"
              role="tab"
              aria-label={`Story ${i + 1}: ${story.name}`}
              aria-selected={isActive}
              onClick={() => goTo(i)}
              className={cx(
                "relative h-1.5 overflow-hidden rounded-[9px] [transition:width_.4s_cubic-bezier(.2,.8,.2,1),background-color_.4s_cubic-bezier(.2,.8,.2,1)] before:absolute before:-inset-x-1 before:-inset-y-3",
                isActive ? "w-7 bg-char/20" : "w-1.5 bg-char/20 hover:bg-char/40",
              )}
            >
              {isActive && (
                <span
                  ref={fillRef}
                  key={active}
                  aria-hidden="true"
                  className="absolute inset-0 origin-left rounded-[9px] bg-char"
                  // The clock moves this every frame; a re-render keeps whatever it has reached.
                  style={{ transform: `scaleX(${playing ? Math.min(1, elapsed.current / INTERVAL) : 1})` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Story ${active + 1} of ${count}: ${current.name}`}
      </p>
    </div>
  );
}

type LookProps = {
  story: Story;
  shown: boolean;
  layerRef: (el: HTMLDivElement | null) => void;
};

const layerClass = (shown: boolean) => cx("absolute inset-0", !shown && "pointer-events-none opacity-0");

/** A story in the large dark card: portrait, quote and who said it. */
function FeatureLook({ story, shown, layerRef }: LookProps) {
  return (
    <div ref={layerRef} aria-hidden={!shown || undefined} className={layerClass(shown)}>
      <div className="relative flex h-full w-[860px] items-start">
        {/* The portraits are cut-outs, so they stand on the light backdrop the design shows behind them. */}
        <div className="relative h-[440px] w-[340px] shrink-0 overflow-hidden bg-sand">
          <div data-photo className="absolute inset-0">
            <Photo className="absolute inset-0" src={story.image} alt={story.name} sizes="340px" />
          </div>
        </div>
        <div className="relative flex h-full min-w-0 flex-1 flex-col items-start justify-between p-10">
          <p aria-hidden="true" className="text-[72px]/[0.6] font-medium whitespace-nowrap text-tangerine">
            “
          </p>
          <blockquote data-quote className="w-[440px] text-[26px]/[1.35] font-medium tracking-[-0.39px] text-cream">
            {story.quote}
          </blockquote>
          <div data-meta className="flex flex-col items-start gap-1 leading-[1.5]">
            <p className="text-[17px] font-medium whitespace-nowrap text-cream">{story.name}</p>
            <p className="w-[440px] text-[13px] text-cream/60">{`AIR ${story.rank} · ${story.exam} · ${story.programme}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A story in the light side card: a preview with a small avatar. */
function SideLook({ story, shown, layerRef }: LookProps) {
  return (
    <div ref={layerRef} aria-hidden="true" className={layerClass(shown)}>
      <div className="flex h-full w-full flex-col items-start justify-between p-7">
        <p className="text-[56px]/[0.6] font-medium whitespace-nowrap text-orange">“</p>
        <p data-quote className="w-full text-[19px]/[1.4] font-medium tracking-[-0.19px] text-char">
          {story.quote}
        </p>
        <div data-meta className="flex items-center gap-3">
          <div data-photo className="relative size-12 shrink-0 overflow-hidden rounded-full bg-shell">
            <Photo className="absolute inset-0" src={story.image} alt="" sizes="48px" />
          </div>
          <div className="flex flex-col items-start gap-0.5 leading-[1.5] whitespace-nowrap">
            <p className="text-[15px] font-medium text-char">{story.name}</p>
            <p className="text-[12px] text-stone">{`AIR ${story.rank} · ${story.exam}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
