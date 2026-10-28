"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ZoomInIcon, ZoomOutIcon } from "@/components/icons";
import Photo from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import { whenFontsReady } from "@/lib/motion";

const MIN_ZOOM = 1;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.2;
const FADE_MS = 260;

const FLOATING_SHADOW = "shadow-[0_10px_30px_-4px_rgba(28,25,23,.07),0_1px_3px_rgba(28,25,23,.05)]";
const ZOOM_BUTTON =
  "flex size-11 items-center justify-center transition-colors duration-200 hover:bg-neutral-50 disabled:cursor-default disabled:bg-white disabled:opacity-35";

type LocationMapProps = {
  cities: string[];
  mapImage: string;
  /** Centre details shown in the white card over the map. */
  children: ReactNode;
};

/** City tabs with a sliding pill, plus the map card with zoom buttons. */
export default function LocationMap({ cities, mapImage, children }: LocationMapProps) {
  const [city, setCity] = useState(0);
  const [fading, setFading] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const pill = useRef<HTMLSpanElement>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const placePill = useCallback(() => {
    const tab = tabs.current[city];
    if (!tab || !pill.current) return;
    pill.current.style.width = `${tab.offsetWidth}px`;
    pill.current.style.transform = `translateX(${tab.offsetLeft}px)`;
  }, [city]);

  useLayoutEffect(placePill, [placePill]);

  // Tab widths change once the web font arrives and when the canvas is re-fitted.
  useEffect(() => {
    let cancelled = false;
    whenFontsReady().then(() => !cancelled && placePill());
    window.addEventListener("resize", placePill);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", placePill);
    };
  }, [placePill]);

  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  const selectCity = (next: number) => {
    if (next === city) return;
    setCity(next);
    setFading(true);
    clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => setFading(false), FADE_MS);
  };

  const changeZoom = (delta: number) =>
    setZoom((current) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round((current + delta) * 10) / 10)));

  return (
    <div data-reveal className="flex w-full flex-col items-center gap-6">
      <div className="relative flex items-start overflow-hidden rounded-full bg-neutral-200 p-1" role="tablist" aria-label="City" id="cityTabs">
        <span
          ref={pill}
          aria-hidden="true"
          className="absolute top-1 left-0 h-[43px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.06),0_2px_6px_rgba(0,0,0,.1)] [transition:transform_.4s_var(--ease-smooth),width_.4s_var(--ease-smooth)]"
        />
        {cities.map((name, i) => (
          <button
            key={name}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            aria-selected={i === city}
            onClick={() => selectCity(i)}
            className={cx(
              "relative z-1 rounded-full px-5 py-2.5 font-display text-[16px]/[23px] font-medium whitespace-nowrap transition-colors duration-300",
              i === city ? "text-ink" : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="relative h-[428px] w-full rounded-[20px] p-6 shadow-[0_4px_8px_rgba(56,56,56,.1)]">
        <div className="absolute inset-0 overflow-hidden rounded-[20px]">
          <Photo
            id="mapImg"
            className="absolute inset-0 origin-[79%_39%] transition-transform duration-600 ease-smooth"
            src={mapImage}
            alt="Map showing the centre location"
            sizes="1280px"
            style={zoom === MIN_ZOOM ? undefined : { transform: `scale(${zoom})` }}
          />
        </div>
        <div
          id="mapDet"
          className={cx(
            "relative flex h-[380px] w-[394px] flex-col justify-between overflow-hidden rounded-2xl bg-white p-7 transition-opacity duration-300",
            FLOATING_SHADOW,
            fading && "opacity-35",
          )}
        >
          {children}
        </div>
        <div className={cx("absolute right-6 bottom-6 flex flex-col overflow-hidden rounded-xl bg-white", FLOATING_SHADOW)}>
          <button
            type="button"
            id="zIn"
            aria-label="Zoom in"
            disabled={zoom === MAX_ZOOM}
            onClick={() => changeZoom(ZOOM_STEP)}
            className={cx(ZOOM_BUTTON, "border-b border-neutral-200")}
          >
            <ZoomInIcon />
          </button>
          <button
            type="button"
            id="zOut"
            aria-label="Zoom out"
            disabled={zoom === MIN_ZOOM}
            onClick={() => changeZoom(-ZOOM_STEP)}
            className={ZOOM_BUTTON}
          >
            <ZoomOutIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
