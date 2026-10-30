"use client";

import { useEffect, useRef } from "react";
import { announcements, type Announcement } from "@/data/site";
import { cx } from "@/lib/cx";
import { prefersReducedMotion, whenFontsReady } from "@/lib/motion";

/** Marquee speed in canvas pixels per second. */
const SPEED = 40;

function Item({ item, index, clone }: { item: Announcement; index: number; clone?: boolean }) {
  return (
    <a
      className={cx(
        // Every item ends with a small orange dot, which also separates the last item from the repeat.
        "flex shrink-0 items-center gap-7 text-[13px]/[1.5] font-medium whitespace-nowrap transition-colors duration-200 after:size-1 after:shrink-0 after:rounded-full after:bg-orange hover:text-tangerine",
        item.lead ? "text-cream/95" : "text-cream/65",
        // Reduced motion: the strip stands still and shows the first item only.
        index > 0 && "motion-reduce:hidden",
        clone && "motion-reduce:hidden",
      )}
      href={item.href}
      aria-hidden={clone ? "true" : undefined}
      tabIndex={clone ? -1 : undefined}
    >
      {item.text}
    </a>
  );
}

/**
 * The announcement ticker at the very top of the page. The items are rendered twice and the track
 * slides by exactly one set's width, so the loop is seamless; the second set is hidden from assistive
 * tech. The edges fade over 64px, and hovering the strip pauses it.
 */
export default function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    whenFontsReady().then(() => {
      const track = trackRef.current;
      if (cancelled || !track || prefersReducedMotion()) return;
      const first = track.children[0] as HTMLElement | undefined;
      const firstClone = track.children[announcements.length] as HTMLElement | undefined;
      if (!first || !firstClone) return;
      const distance = firstClone.offsetLeft - first.offsetLeft;
      if (!distance) return;
      track.style.setProperty("--dist", `${distance}px`);
      track.style.setProperty("--dur", `${distance / SPEED}s`);
      // `run` starts the marquee animation (see the [&.run] utility on the track).
      track.classList.add("run");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="group/ann relative h-10 border-b border-paper/8 bg-coal" aria-label="Announcements">
      <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_64px,#000_calc(100%_-_64px),transparent)]">
        <div
          ref={trackRef}
          // Starts at the canvas's 80px margin, also on screens wider than the canvas.
          className="absolute inset-y-0 left-[max(80px,calc((100%_-_1440px)/2_+_80px))] flex w-max items-center gap-7 will-change-transform group-hover/ann:[animation-play-state:paused]! [&.run]:animate-marquee"
        >
          {announcements.map((item, i) => (
            <Item key={item.text} item={item} index={i} />
          ))}
          {announcements.map((item, i) => (
            <Item key={`clone-${item.text}`} item={item} index={i} clone />
          ))}
        </div>
      </div>
    </div>
  );
}
