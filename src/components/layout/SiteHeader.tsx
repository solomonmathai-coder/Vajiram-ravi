"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LetsTalkSheet from "@/components/layout/LetsTalkSheet";
import SearchDialog, { SearchIcon } from "@/components/layout/SearchDialog";
import { ArrowPill } from "@/components/ui/Pill";
import { mainNav } from "@/data/site";
import { canvasTop } from "@/lib/canvas";
import { cx } from "@/lib/cx";

/** Where the pill sits over the hero: 24px under the 40px ticker. */
const START_TOP = 64;
/** Where it docks once the page has scrolled. */
const DOCKED_TOP = 12;
/** Scroll distance after which the pill condenses, and the least movement that counts as a direction. */
const CONDENSE_AFTER = 80;
const DIRECTION_SLOP = 6;
/** A section counts as "current" while it crosses a thin band just below the middle of the viewport. */
const BAND = { rootMargin: "-45% 0px -50% 0px" };

const MORPH = "duration-500 ease-[cubic-bezier(.2,.8,.2,1)]";

/**
 * The floating pill nav. Over the hero it is a clear glass pill under the ticker; it rides up with the
 * page and docks 12px from the top. After 80px of scroll it condenses from 64px to 56px with a strong
 * blur and an 85% fill. It slides away while scrolling down and returns on any scroll up. The search
 * button (or ⌘K / Ctrl+K anywhere) opens the search box; "Let's talk" opens the contact sheet.
 */
export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // ⌘K on a Mac, Ctrl+K elsewhere, toggles the search box from anywhere on the page.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSheetOpen(false);
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastScroll = 0;
    const update = () => {
      frame = 0;
      const header = headerRef.current;
      const hero = document.getElementById("hero");
      if (!header || !hero) return;
      // The hero starts under the 40px ticker, so its top tells how far the page has scrolled, in canvas pixels.
      const scrolled = 40 - canvasTop(hero);
      header.style.transform = `translateY(${Math.max(DOCKED_TOP, START_TOP - scrolled)}px)`;
      setCondensed(scrolled > CONDENSE_AFTER);
      const delta = scrolled - lastScroll;
      if (Math.abs(delta) > DIRECTION_SLOP) {
        setHidden(delta > 0 && scrolled > START_TOP + CONDENSE_AFTER);
        lastScroll = scrolled;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The link of the section in view gets a small orange dot.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setCurrent(`#${entry.target.id}`);
    }, BAND);
    for (const link of mainNav) {
      const section = link.href.length > 1 ? document.querySelector(link.href) : null;
      if (section) observer.observe(section);
    }
    const hero = document.getElementById("hero");
    const clearer = new IntersectionObserver((entries) => entries[0].isIntersecting && setCurrent(null), BAND);
    if (hero) clearer.observe(hero);
    return () => {
      observer.disconnect();
      clearer.disconnect();
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 [&_a:focus-visible]:outline-paper"
        // The scroll handler moves it from here; this is its place over the hero before that runs.
        style={{ transform: `translateY(${START_TOP}px)` }}
      >
        <div
          className={cx(
            "pointer-events-auto mx-auto flex w-[1280px] items-center justify-between rounded-full border px-2 transition-[height,background-color,border-color,box-shadow,translate,opacity]",
            MORPH,
            condensed
              ? "h-14 border-paper/10 bg-soot/85 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.75)] backdrop-blur-xl"
              : "h-16 border-paper/10 bg-paper/6 backdrop-blur-[12px]",
            hidden && !sheetOpen && !searchOpen ? "-translate-y-[calc(100%+24px)] opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          <a
            href="#top"
            aria-label="Vajiram & Ravi – Institute for IAS Examination, home"
            className={cx(
              "flex h-12 origin-left items-center rounded-full bg-paper px-[18px] transition-transform",
              MORPH,
              condensed && "scale-[.875]",
            )}
          >
            <img src="/images/hero/logo.webp" alt="" width={150} height={34} className="h-[34px] w-[150px] object-contain" />
          </a>

          <nav className="flex items-center gap-6" aria-label="Main">
            {mainNav.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={current === link.href ? "true" : undefined}
                className={cx(
                  "relative text-[14px]/[1.5] font-medium whitespace-nowrap transition-colors duration-300 hover:text-paper",
                  "after:absolute after:-bottom-1.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-orange after:transition-opacity after:duration-300",
                  current === link.href ? "text-paper after:opacity-100" : "text-cream/82 after:opacity-0",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={cx("flex origin-right items-center gap-2 transition-transform", MORPH, condensed && "scale-[.875]")}>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              title="Search (Ctrl K)"
              className="flex size-12 items-center justify-center rounded-full border border-paper/12 bg-paper/6 text-cream/85 transition-[background-color,color,scale] duration-300 hover:bg-paper/12 hover:text-paper active:scale-95"
            >
              <SearchIcon />
            </button>
            <ArrowPill surface="orange" knob="paper" size="sm" onClick={() => setSheetOpen(true)}>
              Let&apos;s talk
            </ArrowPill>
          </div>
        </div>
      </header>
      <LetsTalkSheet open={sheetOpen} onClose={closeSheet} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}
