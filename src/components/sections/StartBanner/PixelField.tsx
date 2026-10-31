"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Pixel size, and the grid the pixels move on: COLS × ROWS cells starting FIELD_LEFT px into the banner. */
const CELL = 32;
const FIELD_LEFT = 896;
const COLS = 12;
const ROWS = 11;
/** The snake: how many cells long, how fast it steps, how often it turns, and how many steps it lives. */
const LENGTH = 6;
const STEP_MS = 110;
const TURN_CHANCE = 0.3;
const MIN_LIFE = 14;
const MAX_LIFE = 26;
/** Pause between one snake vanishing and the next appearing. */
const REST_MS = 700;
/** The single pixels that fade in and out: how long each stays shown or hidden. */
const TWINKLE_MIN_MS = 2200;
const TWINKLE_MAX_MS = 4800;

/** Pixel finishes in the brand oranges, after the lightdash.com banner's violet ones. */
const TEXTURES = [
  "linear-gradient(135deg, var(--color-brand-600), var(--color-brand-500))",
  "repeating-linear-gradient(135deg, rgb(255 255 255 / .9) 0 2px, rgb(255 255 255 / .4) 2px 4px)",
  "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-300))",
  "linear-gradient(135deg, var(--color-brand-800), var(--color-brand-600))",
];

type Cell = [number, number];
type Direction = [number, number];

/** The snake as first drawn (and as it stays with reduced motion), tail first: an L that turns up and to the right. */
const START: Cell[] = [[2, 8], [2, 7], [2, 6], [3, 6], [4, 6], [5, 6]];
/** Where the single pixels sit before they start moving about. */
const TWINKLES: Cell[] = [[9, 1], [6, 3], [11, 7], [7, 10]];

const at = ([col, row]: Cell) => `translate(${FIELD_LEFT + col * CELL}px, ${row * CELL}px)`;
const random = (min: number, max: number) => min + Math.random() * (max - min);
const inside = ([col, row]: Cell) => col >= 0 && col < COLS && row >= 0 && row < ROWS;

const PIXEL = "absolute top-0 left-0 size-8";

/**
 * The pixel decoration on the closing banner, after the "Ready to free up your data team?" banner on
 * lightdash.com: faint dashed guide lines, two pixels stepped into the top-left corner, a few single
 * pixels that fade in and out, and a short snake of pixels that crawls across the grid on the right,
 * turning now and then, before it shrinks away and a new one starts somewhere else.
 * - It only moves while on screen and while the tab is visible.
 * - With reduced motion everything stays still.
 */
export default function PixelField() {
  const snakeRef = useRef<HTMLDivElement>(null);
  const twinkleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const snakeHost = snakeRef.current;
    const twinkleHost = twinkleRef.current;
    if (!snakeHost || !twinkleHost || prefersReducedMotion()) return;
    const segments = Array.from(snakeHost.children) as HTMLElement[];
    const twinkles = Array.from(twinkleHost.children) as HTMLElement[];

    // The snake's cells, tail first; the head is the last one.
    let body: Cell[] = [...START];
    let direction: Direction = [1, 0];
    let life = MAX_LIFE;
    let shrinking = false;
    let snakeTimer = 0;
    const twinkleTimers: number[] = [];
    let running = false;

    const draw = () => {
      segments.forEach((segment, i) => {
        const cell = body[body.length - 1 - i];
        segment.style.visibility = cell ? "visible" : "hidden";
        if (cell) segment.style.transform = at(cell);
      });
    };

    const turn = (): Direction => {
      const options: Direction[] = direction[0] === 0 ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]];
      const head = body[body.length - 1];
      const open = options.filter(([dc, dr]) => inside([head[0] + dc, head[1] + dr]));
      return open[Math.floor(Math.random() * open.length)] ?? [-direction[0], -direction[1]];
    };

    const spawn = () => {
      body = [[Math.floor(random(0, COLS)), Math.floor(random(0, ROWS))]];
      direction = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(random(0, 4))] as Direction;
      life = Math.round(random(MIN_LIFE, MAX_LIFE));
      shrinking = false;
    };

    const step = () => {
      if (shrinking) {
        body.shift();
        if (body.length === 0) {
          draw();
          spawn();
          snakeTimer = window.setTimeout(step, REST_MS);
          return;
        }
      } else {
        const head = body[body.length - 1];
        if (Math.random() < TURN_CHANCE || !inside([head[0] + direction[0], head[1] + direction[1]])) direction = turn();
        body.push([head[0] + direction[0], head[1] + direction[1]]);
        if (body.length > LENGTH) body.shift();
        life -= 1;
        if (life <= 0) shrinking = true;
      }
      draw();
      snakeTimer = window.setTimeout(step, STEP_MS);
    };

    // Each single pixel fades out, moves to a free spot while hidden, and fades back in.
    const twinkle = (pixel: HTMLElement, index: number) => {
      const shown = pixel.style.opacity !== "0";
      if (!shown) pixel.style.transform = at([Math.floor(random(0, COLS)), Math.floor(random(0, ROWS))]);
      pixel.style.opacity = shown ? "0" : "1";
      twinkleTimers[index] = window.setTimeout(() => twinkle(pixel, index), random(TWINKLE_MIN_MS, TWINKLE_MAX_MS));
    };

    const start = () => {
      if (running) return;
      running = true;
      snakeTimer = window.setTimeout(step, STEP_MS);
      twinkles.forEach((pixel, i) => {
        twinkleTimers[i] = window.setTimeout(() => twinkle(pixel, i), random(800, TWINKLE_MAX_MS));
      });
    };
    const stop = () => {
      running = false;
      window.clearTimeout(snakeTimer);
      twinkleTimers.forEach((timer) => window.clearTimeout(timer));
    };

    let visible = false;
    const update = () => (visible && !document.hidden ? start() : stop());
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(snakeHost.parentElement ?? snakeHost);
    document.addEventListener("visibilitychange", update);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Guide lines: the content's left edge, the start of the pixel grid, and the right inset. */}
      <span className="absolute inset-y-0 left-20 border-l border-dashed border-neutral-900/15" />
      <span className="absolute inset-y-0 border-l border-dashed border-neutral-900/15" style={{ left: FIELD_LEFT }} />
      <span className="absolute inset-y-0 right-20 border-l border-dashed border-neutral-900/15" />

      {/* Two pixels stepped into the top-left corner, clear of the rounded corner. */}
      <span className={PIXEL} style={{ backgroundImage: TEXTURES[0], transform: `translate(${CELL}px, 0)` }} />
      <span className={PIXEL} style={{ backgroundImage: TEXTURES[1], transform: `translate(0, ${CELL}px)` }} />

      <div ref={twinkleRef}>
        {TWINKLES.map((cell, i) => (
          <span
            key={i}
            className={`${PIXEL} transition-opacity duration-700 ease-smooth`}
            style={{ backgroundImage: TEXTURES[(i + 1) % TEXTURES.length], transform: at(cell) }}
          />
        ))}
      </div>

      <div ref={snakeRef}>
        {/* Head first, so each segment keeps its finish as the snake moves. */}
        {START.map((_, i) => (
          <span
            key={i}
            className={PIXEL}
            style={{ backgroundImage: TEXTURES[i % TEXTURES.length], transform: at(START[START.length - 1 - i]) }}
          />
        ))}
      </div>
    </div>
  );
}
