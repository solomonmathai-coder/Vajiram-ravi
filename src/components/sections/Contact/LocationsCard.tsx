"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Photo from "@/components/ui/Photo";
import { ArrowPill } from "@/components/ui/Pill";
import { campuses, locationsIntro } from "@/data/contact";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";

/** How long the details take to fade out before the next campus's details replace them. */
const FADE_OUT_MS = 200;
const THUMB_MS = 450;
const EASE_SMOOTH = "cubic-bezier(.22,.61,.36,1)";

/** One map layer per image; campuses that share an image pan and zoom the same layer. */
const mapLayers = [...new Set(campuses.map((campus) => campus.map.src))];

/**
 * The "Our locations" card. The city switch's thumb slides to the chosen campus, the map pans and
 * zooms to it (or cross-fades when the campus has its own map), and the address fades over.
 */
export default function LocationsCard() {
  const [active, setActive] = useState(0);
  // The campus whose details are on screen. It trails `active` by the fade-out, so the swap is unseen.
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const thumb = useRef<HTMLSpanElement>(null);
  // Where the thumb was just before a switch, so it can slide from there.
  const thumbFrom = useRef<{ x: number; width: number } | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();

  // The thumb sits in the active chip's grid cell, so it is right before any script runs;
  // on a switch it slides over from where it was.
  useLayoutEffect(() => {
    const el = thumb.current;
    const from = thumbFrom.current;
    thumbFrom.current = null;
    if (!el || !from || prefersReducedMotion()) return;
    el.animate(
      [
        { transform: `translateX(${from.x - el.offsetLeft}px)`, width: `${from.width}px` },
        { transform: "translateX(0)", width: `${el.offsetWidth}px` },
      ],
      { duration: THUMB_MS, easing: EASE_SMOOTH },
    );
  }, [active]);

  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  const select = (next: number) => {
    if (next === active) return;
    if (thumb.current) thumbFrom.current = { x: thumb.current.offsetLeft, width: thumb.current.offsetWidth };
    setActive(next);
    clearTimeout(fadeTimer.current);
    if (prefersReducedMotion()) {
      setShown(next);
      return;
    }
    setFading(true);
    fadeTimer.current = setTimeout(() => {
      setShown(next);
      setFading(false);
    }, FADE_OUT_MS);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = mod(active + (event.key === "ArrowLeft" ? -1 : 1), campuses.length);
    select(next);
    tabs.current[next]?.focus();
  };

  const campus = campuses[active];
  const details = campuses[shown];

  return (
    <div data-reveal className="flex min-w-px flex-1 flex-col gap-5 rounded-[28px] border border-paper/8 bg-soot p-[27px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[28px]/[1.2] font-medium tracking-[-0.56px] whitespace-nowrap text-cream">
            {locationsIntro.title}
          </h3>
          <p className="w-[380px] text-[14px]/[1.5] text-cream/60">{locationsIntro.text}</p>
        </div>

        <div
          role="tablist"
          aria-label="Campus"
          onKeyDown={onKeyDown}
          className="grid shrink-0 grid-flow-col gap-0.5 rounded-full border border-paper/10 bg-paper/5 p-[3px]"
        >
          <span
            ref={thumb}
            aria-hidden="true"
            className="row-start-1 rounded-full bg-paper"
            style={{ gridColumnStart: active + 1 }}
          />
          {campuses.map((place, i) => (
            <button
              key={place.city}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${id}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              className={cx(
                "relative row-start-1 rounded-full px-4 py-2 text-[13px]/[1.2] font-medium whitespace-nowrap [transition:color_.3s_var(--ease-smooth),background-color_.3s_var(--ease-smooth)]",
                i === active ? "text-char" : "text-cream hover:bg-paper/8",
              )}
              style={{ gridColumnStart: i + 1 }}
            >
              {place.city}
            </button>
          ))}
        </div>
      </div>

      <div role="img" aria-label={campus.map.alt} className="relative h-[260px] overflow-hidden rounded-[20px]">
        {mapLayers.map((src) => {
          const owner = campus.map.src === src ? campus : campuses.find((place) => place.map.src === src)!;
          const { x, y, zoom } = owner.map.view;
          return (
            <div
              key={src}
              className="absolute top-0 left-0 h-[260px] w-[688px] [transition:opacity_.6s_var(--ease-smooth)]"
              style={{ opacity: campus.map.src === src ? 1 : 0 }}
            >
              {/* Pans and zooms to the campus: the zoom grows from the campus's point on the map. */}
              <Photo
                src={src}
                alt=""
                sizes="688px"
                className="absolute inset-0 [transition:transform_1.1s_var(--ease-smooth),transform-origin_1.1s_var(--ease-smooth)]"
                style={{ transform: `scale(${zoom})`, transformOrigin: `${x * 100}% ${y * 100}%` }}
              />
            </div>
          );
        })}
      </div>

      <dl
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        className={cx(
          "grid grid-cols-[repeat(2,308px)] gap-x-6 gap-y-4 [transition:opacity_.3s_var(--ease-smooth),translate_.3s_var(--ease-smooth)]",
          fading && "translate-y-1.5 opacity-0",
        )}
      >
        <Detail label="Location & Timing">{details.address}</Detail>
        <Detail label="Landmark:">{details.landmark}</Detail>
        <Detail label="Hours">{details.hours}</Detail>
        <Detail label="Phone">
          <a href={details.phoneHref} className="transition-colors duration-200 hover:text-cream">
            {details.phone}
          </a>
        </Detail>
      </dl>

      <ArrowPill href={campus.mapsUrl} target="_blank" surface="paper" knob="char" className="self-start">
        View on maps
      </ArrowPill>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[12px]/[1.5] font-medium whitespace-nowrap text-tangerine">{label}</dt>
      <dd className="w-[300px] text-[15px]/[1.45] text-cream/85">{children}</dd>
    </div>
  );
}
