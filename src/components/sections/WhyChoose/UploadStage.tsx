"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { clamp01, followScroll } from "@/lib/scroll";

/** Page scroll, in canvas pixels, over which the section stays pinned and the sequence plays. */
const TRAVEL = 1400;
const SMOOTHING_MS = 140;
/** Width of every card while stacked, so cards of different sizes make an even pile. */
const STACK_WIDTH = 170;
/** Each stacked card's tilt and nudge, so the pile looks dropped in rather than aligned. The first
 * card waits on its own, so it sits straight. */
const TILT = [0, 4, -7, 6, -3, 5];
const NUDGE: [number, number][] = [[0, 0], [14, -10], [-16, 8], [10, 14], [-12, -12], [18, 6]];

function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Share of the way through a stretch of the sequence that starts at `start` and lasts `length`. */
function phase(progress: number, start: number, length: number): number {
  return ease(clamp01((progress - start) / length));
}

/** An element's offset from an ancestor, ignoring transforms. */
function offsetIn(el: HTMLElement, ancestor: HTMLElement): { left: number; top: number } {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { left, top };
}

/**
 * Pins its content while you scroll and plays an upload sequence over it, after frontify.com.
 * The markup marks what moves:
 * - `[data-card]`: the cards, shown complete throughout. They start as a small pile under the
 *   header, the first on its own, the rest dropping onto it one by one, then spread out to their
 *   places, growing to full size.
 * - `[data-count]`: numbers that count up from zero to their value once the cards are in place.
 * - `[data-card-grid]`: the area the pile sits in the middle of (the visible part of it).
 * With reduced motion everything simply shows as designed.
 */
export default function UploadStage({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage || prefersReducedMotion()) return;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const counters = Array.from(stage.querySelectorAll<HTMLElement>("[data-count]"));
    const grid = stage.querySelector<HTMLElement>("[data-card-grid]") ?? stage;

    // Where each card travels from: the middle of the part of the grid on screen while pinned.
    let piles: { x: number; y: number; scale: number }[] = [];
    const layout = () => {
      const visible = Math.min(window.innerHeight / getCanvasZoom(), stage.offsetHeight);
      const gridTop = offsetIn(grid, stage).top;
      const centre = { x: stage.offsetWidth / 2, y: gridTop + Math.max(150, (visible - gridTop) / 2) };
      piles = cards.map((card) => {
        const at = offsetIn(card, stage);
        return {
          x: centre.x - (at.left + card.offsetWidth / 2),
          y: centre.y - (at.top + card.offsetHeight / 2),
          scale: STACK_WIDTH / card.offsetWidth,
        };
      });
    };

    let progress = 0;
    const paint = (value: number) => {
      progress = value;
      cards.forEach((card, k) => {
        const dropped = k === 0 ? 1 : phase(value, 0.04 + (k - 1) * 0.055, 0.08);
        const spread = phase(value, 0.4 + k * 0.035, 0.3);
        const stay = 1 - spread;
        const [nx, ny] = NUDGE[k % NUDGE.length];
        const pile = piles[k];
        const x = (pile.x + nx) * stay;
        const y = (pile.y + ny - (1 - dropped) * 40) * stay;
        const stacked = pile.scale * (0.8 + 0.2 * dropped);
        card.style.transform = `translate(${x}px, ${y}px) rotate(${TILT[k % TILT.length] * dropped * stay}deg) scale(${stacked + (1 - stacked) * spread})`;
        card.style.opacity = String(dropped);
        card.style.boxShadow = `0 18px 40px -16px rgba(28, 25, 23, ${(0.45 * dropped * stay).toFixed(3)})`;
      });

      const counted = phase(value, 0.75, 0.2);
      counters.forEach((el) => {
        el.textContent = String(Math.round(Number(el.dataset.count) * counted));
      });
    };

    layout();
    const resize = new ResizeObserver(() => {
      layout();
      paint(progress);
    });
    resize.observe(stage);

    const stop = followScroll(
      () => {
        const box = wrap.getBoundingClientRect();
        const scale = box.width / wrap.offsetWidth || 1;
        return clamp01(-box.top / scale / TRAVEL);
      },
      paint,
      SMOOTHING_MS,
    );
    return () => {
      stop();
      resize.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef}>
      {/* 40px side padding, the same as the Results section above. */}
      <div ref={stageRef} className="sticky top-0 mx-auto w-canvas px-10">
        {children}
      </div>
      {/* Extra scroll distance while the stage is pinned. */}
      <div aria-hidden="true" className="motion-reduce:hidden" style={{ height: TRAVEL }} />
    </div>
  );
}
