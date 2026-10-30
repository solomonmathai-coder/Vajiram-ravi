"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { getCanvasZoom } from "@/lib/canvas";

/** The furthest down a pinned card sits: just under the docked nav. */
const UNDER_NAV = 88;

/**
 * Sections that stack as cards while you scroll. Every card is the full width of the page and the same
 * height (shorter sections grow to the tallest, their content centred), and every card pins in exactly
 * the same place, so the next one slides up over the current one and covers it completely: once a card
 * is in place, nothing of the cards before it shows. Cards do not shrink or move aside.
 *
 * A card taller than the screen pins by its bottom edge instead, once all of it has been read, so none
 * of it is ever out of reach.
 */
export default function StackedSections({ children }: { children: ReactNode }) {
  const panels = Children.toArray(children);
  const wrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const measure = () => {
      const viewport = window.innerHeight / getCanvasZoom();
      const cards = cardRefs.current;
      cards.forEach((card) => card && (card.style.minHeight = ""));
      const height = Math.max(...cards.map((card) => card?.offsetHeight ?? 0));
      // Under the nav when there is room; centred in what room there is otherwise; by the bottom edge when
      // the card is taller than the screen.
      const top = height >= viewport ? viewport - height : Math.min(UNDER_NAV, (viewport - height) / 2);
      cards.forEach((card, i) => {
        const wrap = wrapRefs.current[i];
        if (!card || !wrap) return;
        card.style.minHeight = `${height}px`;
        wrap.style.top = `${top}px`;
      });
    };
    measure();
    // Watch each section's content, not the section: the section is stretched by the stack, its content is not.
    const observer = new ResizeObserver(() => requestAnimationFrame(measure));
    cardRefs.current.forEach((card) => {
      const content = card?.firstElementChild?.firstElementChild;
      if (content) observer.observe(content);
    });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="relative">
      {panels.map((panel, i) => (
        <div
          key={i}
          ref={(el) => {
            wrapRefs.current[i] = el;
          }}
          className="sticky"
          style={{ top: UNDER_NAV, zIndex: i + 1 }}
        >
          {/*
            The card: its section stretches to the deck's height with the content centred. A soft, warm shadow
            rises from its top edge in three layers (a hairline, a close shadow and a wide one), so the card
            sits lightly on the one beneath instead of casting a grey band over it.
          */}
          <div
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="flex flex-col rounded-[40px] shadow-[0_-1px_0_rgb(20_16_14/0.05),0_-16px_36px_-20px_rgb(20_16_14/0.22),0_-60px_110px_-50px_rgb(20_16_14/0.18)] [&>*]:flex [&>*]:flex-1 [&>*]:flex-col [&>*]:justify-center"
          >
            {panel}
          </div>
        </div>
      ))}
    </div>
  );
}
