"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import Photo from "@/components/ui/Photo";
import { KnobArrow } from "@/components/ui/Pill";
import type { Topper } from "@/data/toppers";
import { cx } from "@/lib/cx";
import { TOPPERS_YEAR_EVENT } from "@/lib/events";
import { prefersReducedMotion } from "@/lib/motion";

/** The panels' grow and shrink, as in the design's notes. */
const GROW = "500ms cubic-bezier(.2,.8,.2,1)";

type ToppersGalleryProps = {
  years: number[];
  /** The toppers to show for each year. */
  galleries: Record<number, Topper[]>;
};

/**
 * The year switch and the expanding gallery (Figma "year switch" and "expanding gallery").
 *
 * The switch is a segmented control whose dark thumb glides between years with a little spring; picking
 * a year cross-fades the gallery to that year's toppers and puts ?year= in the address. In the gallery one panel is open at
 * 440px and the others share the rest; hovering or focusing a panel opens it, and its name and
 * programme fade in a moment later. The arrow keys move between panels.
 */
export default function ToppersGallery({ years, galleries }: ToppersGalleryProps) {
  // `year` drives the switch at once; `shown` is the year in the gallery, which changes mid cross-fade.
  const [year, setYear] = useState(years[0]);
  const [shown, setShown] = useState(years[0]);
  const [open, setOpen] = useState(0);
  const toppers = galleries[shown] ?? [];
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);

  // A year in the address (?year=2023) selects that tab on load.
  useEffect(() => {
    const fromUrl = Number(new URLSearchParams(window.location.search).get("year"));
    if (!years.includes(fromUrl)) return;
    setYear(fromUrl);
    setShown(fromUrl);
  }, [years]);

  // The thumb follows the selected tab.
  useLayoutEffect(() => {
    const tab = tabRefs.current[years.indexOf(year)];
    const thumb = thumbRef.current;
    if (!tab || !thumb) return;
    thumb.style.width = `${tab.offsetWidth}px`;
    thumb.style.transform = `translateX(${tab.offsetLeft}px)`;
  }, [year, years]);

  const selectYear = (next: number) => {
    if (next === year) return;
    setYear(next);
    const url = new URL(window.location.href);
    url.searchParams.set("year", String(next));
    window.history.replaceState(null, "", url);
    const gallery = galleryRef.current;
    const swap = () => {
      setShown(next);
      setOpen(0);
      gallery?.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
        duration: 420,
        easing: "cubic-bezier(.2,.8,.2,1)",
      });
    };
    if (!gallery || prefersReducedMotion()) return swap();
    const fadeOut = gallery.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: "ease-out", fill: "forwards" });
    fadeOut.onfinish = () => {
      swap();
      // The fade-in has taken over from opacity 0; drop the held fade-out so it does not linger underneath.
      fadeOut.cancel();
    };
  };

  // The nav search can open a topper's year.
  const selectRef = useRef(selectYear);
  selectRef.current = selectYear;
  useEffect(() => {
    const onYear = (event: Event) => {
      const next = (event as CustomEvent<number>).detail;
      if (years.includes(next)) selectRef.current(next);
    };
    window.addEventListener(TOPPERS_YEAR_EVENT, onYear);
    return () => window.removeEventListener(TOPPERS_YEAR_EVENT, onYear);
  }, [years]);

  const onPanelKey = (event: KeyboardEvent<HTMLElement>, i: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = Math.max(0, Math.min(toppers.length - 1, i + (event.key === "ArrowLeft" ? -1 : 1)));
    panelRefs.current[next]?.focus();
  };

  return (
    <>
      <div
        className="relative flex gap-0.5 self-start rounded-full border border-sand-line bg-sand p-1"
        role="tablist"
        aria-label="Result year"
      >
        <span
          ref={thumbRef}
          aria-hidden="true"
          className="absolute top-1 bottom-1 left-0 rounded-full bg-char [transition:transform_280ms_cubic-bezier(.34,1.56,.64,1),width_280ms_cubic-bezier(.34,1.56,.64,1)]"
        />
        {years.map((y, i) => (
          <button
            key={y}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={y === year}
            onClick={() => selectYear(y)}
            className={cx(
              "relative rounded-full px-[18px] py-[9px] text-[14px]/[1.2] font-medium whitespace-nowrap transition-colors duration-300",
              y === year ? "text-paper" : "text-stone hover:text-char",
            )}
          >
            {y}
          </button>
        ))}
      </div>

      <div ref={galleryRef} data-reveal className="flex h-[540px] gap-2" role="tabpanel" aria-label={`UPSC CSE ${shown} toppers`}>
        {toppers.map((topper, i) => {
          const isOpen = i === open;
          return (
            <article
              key={`${shown}-${topper.rank}`}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              tabIndex={0}
              aria-label={`AIR ${topper.rank}, ${topper.name}`}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onKeyDown={(event) => onPanelKey(event, i)}
              className="group/panel relative h-full min-w-0 overflow-clip rounded-3xl bg-sand outline-offset-2 focus-visible:outline-2 focus-visible:outline-orange"
              style={{
                flex: isOpen ? "0 0 440px" : "1 1 0px",
                transition: `flex-grow ${GROW}, flex-basis ${GROW}`,
              }}
            >
              {/* The portrait fills a 440px frame centred on the panel: a sliver shows when closed, all of it when open. */}
              <Photo
                className={cx(
                  "absolute top-0 left-1/2 h-full w-[440px] -translate-x-1/2 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]",
                  isOpen && "group-hover/panel:scale-[1.03]",
                )}
                src={topper.image}
                alt=""
                sizes="440px"
              />
              <div
                className={cx(
                  "absolute inset-0 bg-linear-to-b from-coal/0 to-coal/82 transition-opacity duration-500",
                  isOpen ? "opacity-100" : "opacity-0",
                )}
              />
              <div
                className={cx(
                  "absolute inset-0 bg-linear-to-b from-coal/0 to-coal/60 transition-opacity duration-500",
                  isOpen ? "opacity-0" : "opacity-100",
                )}
              />

              {/* Closed: the rank at the foot of the sliver. */}
              <div
                className={cx(
                  "absolute inset-x-0 top-[468px] flex flex-col items-center transition-opacity",
                  isOpen ? "opacity-0 duration-150" : "opacity-100 delay-200 duration-300",
                )}
                aria-hidden="true"
              >
                <span className="text-[10px]/[1.5] font-semibold tracking-[1px] text-paper/70">AIR</span>
                <span className="text-[28px]/[1.2] font-medium tracking-[-0.56px] text-paper">{topper.rank}</span>
              </div>

              {/* Open: the rank chip, a link to the story, then the name and programme, fading in after 120ms. */}
              <div
                className={cx(
                  "absolute inset-0 transition-opacity",
                  isOpen ? "opacity-100 delay-[120ms] duration-500" : "pointer-events-none opacity-0 duration-150",
                )}
              >
                <span className="absolute top-6 left-6 rounded-full bg-orange px-3 py-1.5 text-[12px]/[1.2] font-medium whitespace-nowrap text-paper">
                  AIR {topper.rank} · CSE {shown}
                </span>
                <a
                  href="#"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={`Read ${topper.name}'s story`}
                  className="group/knob absolute top-6 right-6 flex size-11 items-center justify-center rounded-full bg-paper text-char transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:scale-108"
                >
                  <KnobArrow />
                </a>
                <p className="absolute top-[420px] left-6 text-[34px]/[1.2] font-medium tracking-[-1.02px] whitespace-nowrap text-paper">
                  {topper.name}
                </p>
                {topper.programme && (
                  <p className="absolute top-[466px] left-6 w-[380px] text-[14px]/[1.5] text-paper/78">{topper.programme}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
