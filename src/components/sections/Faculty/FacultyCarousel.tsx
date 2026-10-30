"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import Photo from "@/components/ui/Photo";
import type { Educator } from "@/data/educators";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

const CARD_WIDTH = 300;
const CARD_GAP = 16;
const STEP = CARD_WIDTH + CARD_GAP;
/** The content column of the 1440px canvas: the track starts at its left edge and ends at its right edge. */
const VIEW_WIDTH = 1280;
/** Beyond either end, the track follows the pointer at this rate. */
const RUBBER = 0.35;
const DRAG_START_PX = 6;
/** The release speed is measured over this last stretch of a drag. */
const VELOCITY_WINDOW_MS = 100;
/** How far a flick carries: the release speed (px/ms) times this. */
const MOMENTUM_MS = 320;
/** A release faster than this (px/ms) moves at least one card. */
const FLICK_SPEED = 0.3;
/** Wheel scrolling settles onto a card once the wheel has been still this long. */
const WHEEL_SETTLE_MS = 160;
/** Share of the remaining distance the "Drag" disc closes per 60 fps frame as it follows the pointer. */
const CURSOR_FOLLOW = 0.3;
const EASE = cubicBezier(0.2, 0.8, 0.2, 1);
/** Starting slope of EASE, used to match a glide's opening speed to the release speed. */
const EASE_START_SLOPE = 4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** CSS-style cubic-bezier easing, solved for x with a few Newton steps. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx3 = 3 * x1;
  const bx = 3 * (x2 - x1) - cx3;
  const ax = 1 - cx3 - bx;
  const cy3 = 3 * y1;
  const by = 3 * (y2 - y1) - cy3;
  const ay = 1 - cy3 - by;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const error = ((ax * t + bx) * t + cx3) * t - x;
      const slope = (3 * ax * t + 2 * bx) * t + cx3;
      if (Math.abs(error) < 1e-5 || Math.abs(slope) < 1e-6) break;
      t = clamp(t - error / slope, 0, 1);
    }
    return ((ay * t + by) * t + cy3) * t;
  };
}

/** Where the track can rest: each card's left edge, capped at the far end. */
function snapPoints(lefts: number[], max: number): number[] {
  return Array.from(new Set(lefts.map((left) => Math.min(left, max)))).sort((a, b) => a - b);
}

type Drag = {
  pointer: number;
  startX: number;
  /** Track offset when the drag took hold, and when the pointer went down. */
  from: number;
  origin: number;
  moved: boolean;
  /** The canvas zoom, which pointer deltas are divided by. */
  zoom: number;
  samples: { t: number; x: number }[];
};

type Status = { start: boolean; end: boolean; first: number };

function EducatorCard({ educator }: { educator: Educator }) {
  return (
    <li className="relative h-[420px] w-[300px] shrink-0 overflow-clip rounded-3xl bg-sand">
      {/* The name below says who it is, so the photo needs no alt text of its own. */}
      <Photo className="absolute inset-0" src={educator.photo} alt="" sizes="420px" />
      <div className="absolute inset-0 bg-linear-to-b from-coal/0 to-coal/55" />
      <div className="absolute top-[328px] left-4 flex w-[268px] flex-col gap-0.5 rounded-2xl border border-paper/16 bg-coal/35 p-4 backdrop-blur-[9px]">
        <h3 className="text-[18px]/[1.5] font-medium tracking-[-0.18px] whitespace-nowrap text-paper">{educator.name}</h3>
        <p className="text-[13px]/[1.5] text-paper/75">{educator.subject}</p>
      </div>
    </li>
  );
}

const ARROW =
  "flex size-12 items-center justify-center rounded-full text-[16px]/none font-medium [transition:background-color_.3s,border-color_.3s,scale_.3s_cubic-bezier(.2,.8,.2,1)] enabled:active:scale-95 disabled:cursor-default";

type FacultyCarouselProps = { heading: ReactNode; educators: Educator[] };

/**
 * The faculty track. It drags freely with momentum and settles on a card; the wheel or trackpad
 * scrolls it sideways while hovered; the arrows step one card; the scrubber line shows the position
 * and can be dragged or used with the arrow keys. With a mouse, the pointer becomes an orange "Drag"
 * disc over the track.
 */
export default function FacultyCarousel({ heading, educators }: FacultyCarouselProps) {
  const count = educators.length;
  const trackWidth = count * CARD_WIDTH + (count - 1) * CARD_GAP;
  const initialMax = Math.max(0, trackWidth - VIEW_WIDTH);
  const visibleCards = Math.floor((VIEW_WIDTH + CARD_GAP) / STEP);
  const lastFirst = Math.round(initialMax / STEP);
  const trackId = useId();

  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // How far the track has moved left, in canvas pixels.
  const offset = useRef(0);
  const maxOffset = useRef(initialMax);
  const snaps = useRef(snapPoints(educators.map((_, i) => i * STEP), initialMax));
  const sizes = useRef({ line: VIEW_WIDTH, thumb: (VIEW_WIDTH * VIEW_WIDTH) / trackWidth });
  const glideFrame = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const drag = useRef<Drag | null>(null);
  const scrub = useRef<{ pointer: number; grab: number } | null>(null);
  const cursor = useRef({ x: 0, y: 0, tx: 0, ty: 0, clientX: 0, clientY: 0, frame: 0, last: 0 });

  const [status, setStatus] = useState<Status>({ start: true, end: initialMax === 0, first: 0 });
  const [dragging, setDragging] = useState(false);
  const [fineCursor, setFineCursor] = useState(false);
  const [cursorOn, setCursorOn] = useState(false);

  /** Moves the track and the scrubber thumb to the current offset. */
  const paint = useCallback(() => {
    const x = offset.current;
    const max = maxOffset.current;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${-x}px, 0, 0)`;
    if (thumbRef.current) {
      const progress = max > 0 ? clamp(x / max, 0, 1) : 0;
      thumbRef.current.style.transform = `translate3d(${progress * (sizes.current.line - sizes.current.thumb)}px, 0, 0)`;
    }
    const next = { start: x <= 1, end: x >= max - 1, first: clamp(Math.round(x / STEP), 0, count - 1) };
    setStatus((prev) => (prev.start === next.start && prev.end === next.end && prev.first === next.first ? prev : next));
  }, [count]);

  const measure = useCallback(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    if (!view || !track) return;
    const max = Math.max(0, track.offsetWidth - view.clientWidth);
    maxOffset.current = max;
    snaps.current = snapPoints(
      Array.from(track.children, (card) => (card as HTMLElement).offsetLeft),
      max,
    );
    const thumb = thumbRef.current;
    if (thumb) thumb.style.width = `${Math.min(100, (view.clientWidth / track.offsetWidth) * 100)}%`;
    sizes.current = { line: lineRef.current?.offsetWidth ?? 0, thumb: thumb?.offsetWidth ?? 0 };
    offset.current = clamp(offset.current, 0, max);
    paint();
  }, [paint]);

  /** Eases the track to `target`. A release speed (px/ms) keeps a flick's pace into the glide. */
  const glideTo = useCallback(
    (target: number, speed = 0) => {
      cancelAnimationFrame(glideFrame.current);
      const from = offset.current;
      const to = clamp(target, 0, maxOffset.current);
      const distance = Math.abs(to - from);
      if (distance < 0.5 || prefersReducedMotion()) {
        offset.current = to;
        paint();
        return;
      }
      let duration = clamp(380 + distance * 0.5, 420, 850);
      if (Math.abs(speed) > 0.05 && Math.sign(speed) === Math.sign(to - from)) {
        duration = clamp((EASE_START_SLOPE * distance) / Math.abs(speed), 320, duration);
      }
      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        offset.current = from + (to - from) * EASE(t);
        paint();
        if (t < 1) glideFrame.current = requestAnimationFrame(frame);
      };
      glideFrame.current = requestAnimationFrame(frame);
    },
    [paint],
  );

  const nearestSnap = (x: number) =>
    snaps.current.reduce((best, snap) => (Math.abs(snap - x) < Math.abs(best - x) ? snap : best), 0);

  /** Glides one card forward (1) or back (-1). */
  const stepBy = (direction: 1 | -1) => {
    const x = offset.current;
    const list = snaps.current;
    const target =
      direction > 0
        ? (list.find((snap) => snap > x + 1) ?? maxOffset.current)
        : ([...list].reverse().find((snap) => snap < x - 1) ?? 0);
    glideTo(target);
  };

  useEffect(() => {
    measure();
    const view = viewRef.current;
    if (!view || !("ResizeObserver" in window)) return;
    const observer = new ResizeObserver(measure);
    observer.observe(view);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFineCursor(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Sideways trackpad swipes (or Shift + wheel) scroll the track while hovered; an ordinary vertical wheel
  // always scrolls the page, so the carousel never catches the page mid-scroll.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || drag.current) return;
      const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!sideways && !event.shiftKey) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.clientWidth : 1;
      const delta = ((sideways ? event.deltaX : event.deltaY) * unit) / getCanvasZoom();
      const next = clamp(offset.current + delta, 0, maxOffset.current);
      if (Math.abs(next - offset.current) < 0.5) return;
      event.preventDefault();
      cancelAnimationFrame(glideFrame.current);
      offset.current = next;
      paint();
      clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => glideTo(nearestSnap(offset.current)), WHEEL_SETTLE_MS);
    };
    view.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      view.removeEventListener("wheel", onWheel);
      clearTimeout(wheelTimer.current);
    };
    // nearestSnap reads only refs, so the first render's copy stays correct.
  }, [glideTo, paint]);

  useEffect(
    () => () => {
      cancelAnimationFrame(glideFrame.current);
      cancelAnimationFrame(cursor.current.frame);
    },
    [],
  );

  // ---- The "Drag" disc ----

  /** Points the disc at a pointer position; it eases there frame by frame and stops once it arrives. */
  const aimCursor = (clientX: number, clientY: number, jump = false) => {
    const view = viewRef.current;
    if (!view) return;
    const c = cursor.current;
    const rect = view.getBoundingClientRect();
    const scale = rect.width / view.offsetWidth || 1;
    c.clientX = clientX;
    c.clientY = clientY;
    c.tx = (clientX - rect.left) / scale;
    c.ty = (clientY - rect.top) / scale;
    if (jump || prefersReducedMotion()) {
      c.x = c.tx;
      c.y = c.ty;
      if (cursorRef.current) cursorRef.current.style.translate = `${c.x}px ${c.y}px`;
      return;
    }
    if (c.frame) return;
    c.last = performance.now();
    const frame = (now: number) => {
      const k = 1 - Math.pow(1 - CURSOR_FOLLOW, (now - c.last) / (1000 / 60));
      c.last = now;
      c.x += (c.tx - c.x) * k;
      c.y += (c.ty - c.y) * k;
      if (cursorRef.current) cursorRef.current.style.translate = `${c.x}px ${c.y}px`;
      c.frame = Math.abs(c.tx - c.x) > 0.1 || Math.abs(c.ty - c.y) > 0.1 ? requestAnimationFrame(frame) : 0;
    };
    c.frame = requestAnimationFrame(frame);
  };

  // The page can scroll under a still pointer (the wheel at either end of the track): keep the disc on it.
  useEffect(() => {
    if (!cursorOn) return;
    const onScroll = () => {
      const view = viewRef.current;
      const c = cursor.current;
      if (!view) return;
      const rect = view.getBoundingClientRect();
      const over = c.clientX >= rect.left && c.clientX <= rect.right && c.clientY >= rect.top && c.clientY <= rect.bottom;
      if (over || drag.current) aimCursor(c.clientX, c.clientY, true);
      else setCursorOn(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // aimCursor reads only refs, so the first render's copy stays correct.
  }, [cursorOn]);

  // ---- Dragging the track ----

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const view = event.currentTarget;
    cancelAnimationFrame(glideFrame.current);
    clearTimeout(wheelTimer.current);
    const x = offset.current;
    drag.current = {
      pointer: event.pointerId,
      startX: event.clientX,
      from: x,
      origin: x,
      moved: false,
      zoom: getCanvasZoom(),
      samples: [{ t: event.timeStamp, x }],
    };
    view.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && fineCursor) {
      // Also covers a pointer that was already over the track when the page loaded.
      aimCursor(event.clientX, event.clientY, !cursorOn);
      if (!cursorOn) setCursorOn(true);
    }
    const d = drag.current;
    if (!d || event.pointerId !== d.pointer) return;
    if (!d.moved) {
      if (Math.abs(event.clientX - d.startX) / d.zoom < DRAG_START_PX) return;
      // Take hold from here, so the track does not jump by the dead zone.
      d.moved = true;
      d.startX = event.clientX;
      setDragging(true);
    }
    const max = maxOffset.current;
    let x = d.from - (event.clientX - d.startX) / d.zoom;
    if (x < 0) x *= RUBBER;
    else if (x > max) x = max + (x - max) * RUBBER;
    offset.current = x;
    paint();
    d.samples.push({ t: event.timeStamp, x });
    while (d.samples.length > 2 && event.timeStamp - d.samples[0].t > VELOCITY_WINDOW_MS) d.samples.shift();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || event.pointerId !== d.pointer) return;
    drag.current = null;
    setDragging(false);
    // A press without a drag can still have stopped a glide part-way: settle onto a card.
    if (!d.moved) {
      glideTo(nearestSnap(offset.current));
      return;
    }
    const recent = d.samples.filter((sample) => event.timeStamp - sample.t <= VELOCITY_WINDOW_MS);
    const first = recent[0];
    const last = recent[recent.length - 1];
    const speed = recent.length > 1 && last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;
    let target = nearestSnap(clamp(offset.current + speed * MOMENTUM_MS, 0, maxOffset.current));
    // A quick flick always moves on at least one card.
    if (Math.abs(speed) > FLICK_SPEED && target === nearestSnap(d.origin)) {
      const list = snaps.current;
      const i = list.indexOf(target) + Math.sign(speed);
      target = list[clamp(i, 0, list.length - 1)];
    }
    glideTo(target, speed);
  };

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !fineCursor) return;
    aimCursor(event.clientX, event.clientY, true);
    setCursorOn(true);
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setCursorOn(false);
  };

  // ---- The scrubber ----

  /** Moves the track to match a pointer on the scrubber line, with the thumb held at `grab` px from its left end. */
  const scrubTo = (clientX: number, grab: number, smooth: boolean) => {
    const line = lineRef.current;
    if (!line) return;
    const rect = line.getBoundingClientRect();
    const scale = rect.width / line.offsetWidth || 1;
    const travel = sizes.current.line - sizes.current.thumb;
    const left = (clientX - rect.left) / scale - grab;
    const target = travel > 0 ? clamp(left / travel, 0, 1) * maxOffset.current : 0;
    if (smooth) {
      glideTo(target);
      return;
    }
    cancelAnimationFrame(glideFrame.current);
    offset.current = target;
    paint();
  };

  const onScrubDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const line = lineRef.current;
    if (!line) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = line.getBoundingClientRect();
    const scale = rect.width / line.offsetWidth || 1;
    const max = maxOffset.current;
    const thumbLeft = max > 0 ? (offset.current / max) * (sizes.current.line - sizes.current.thumb) : 0;
    const local = (event.clientX - rect.left) / scale;
    const onThumb = local >= thumbLeft && local <= thumbLeft + sizes.current.thumb;
    // Grabbing the thumb keeps it under the pointer; a press elsewhere on the line glides the thumb's middle there.
    const grab = onThumb ? local - thumbLeft : sizes.current.thumb / 2;
    scrub.current = { pointer: event.pointerId, grab };
    if (!onThumb) scrubTo(event.clientX, grab, true);
  };

  const onScrubMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = scrub.current;
    if (s && event.pointerId === s.pointer) scrubTo(event.clientX, s.grab, false);
  };

  const onScrubUp = (event: PointerEvent<HTMLDivElement>) => {
    const s = scrub.current;
    if (!s || event.pointerId !== s.pointer) return;
    scrub.current = null;
    glideTo(nearestSnap(offset.current));
  };

  const onScrubKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => stepBy(1),
      ArrowDown: () => stepBy(1),
      PageDown: () => stepBy(1),
      ArrowLeft: () => stepBy(-1),
      ArrowUp: () => stepBy(-1),
      PageUp: () => stepBy(-1),
      Home: () => glideTo(0),
      End: () => glideTo(maxOffset.current),
    };
    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  const lastShown = Math.min(count, status.first + visibleCards);

  return (
    <>
      <div className="flex w-full items-end justify-between">
        {heading}
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => stepBy(-1)}
            disabled={status.start}
            aria-controls={trackId}
            aria-label="Previous educators"
            className={cx(ARROW, "border border-sand-line text-char enabled:hover:border-[#d3cbc1] enabled:hover:bg-sand")}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => stepBy(1)}
            disabled={status.end}
            aria-controls={trackId}
            aria-label="Next educators"
            className={cx(ARROW, "bg-char text-paper enabled:hover:bg-[#2a221e]")}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div data-reveal>
        <div
          ref={viewRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Faculty"
          className={cx("relative touch-pan-y select-none", fineCursor ? "cursor-none" : dragging ? "cursor-grabbing" : "cursor-grab")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onDragStart={(event) => event.preventDefault()}
        >
          <ul id={trackId} ref={trackRef} className="relative flex w-max gap-4 will-change-transform">
            {educators.map((educator) => (
              <EducatorCard key={educator.name} educator={educator} />
            ))}
          </ul>
          {fineCursor && (
            <div
              ref={cursorRef}
              aria-hidden="true"
              className={cx(
                "pointer-events-none absolute top-0 left-0 z-10 -mt-[38px] -ml-[38px] flex size-[76px] items-center justify-center rounded-full bg-orange text-[13px]/[1.5] font-medium whitespace-nowrap text-paper [transition:scale_.4s_cubic-bezier(.2,.8,.2,1),opacity_.25s_ease]",
                !cursorOn ? "scale-0 opacity-0" : dragging ? "scale-[.86]" : "scale-100",
              )}
            >
              Drag
            </div>
          )}
        </div>
      </div>

      {/* A 2px line inside a taller hit area; the negative margins keep the layout at 2px. */}
      <div
        role="slider"
        tabIndex={0}
        aria-controls={trackId}
        aria-label="Faculty position"
        aria-valuemin={1}
        aria-valuemax={lastFirst + 1}
        aria-valuenow={Math.min(status.first, lastFirst) + 1}
        aria-valuetext={`Educators ${status.first + 1} to ${lastShown} of ${count}`}
        className="group/scrub relative -my-[11px] cursor-pointer touch-none py-[11px]"
        onPointerDown={onScrubDown}
        onPointerMove={onScrubMove}
        onPointerUp={onScrubUp}
        onPointerCancel={onScrubUp}
        onKeyDown={onScrubKey}
      >
        <div
          ref={lineRef}
          className="relative h-0.5 w-full bg-sand-line transition-[scale] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/scrub:scale-y-200"
        >
          <div
            ref={thumbRef}
            className="absolute top-0 left-0 h-0.5 bg-char"
            style={{ width: `${(VIEW_WIDTH / trackWidth) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
