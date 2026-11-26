// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/ui/CircularCarousel.tsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import Button from "@/team/components/ui/Button";
import SiteDots from "@/team/components/ui/CarouselDots";
import "@/team/tailwind-sections.css";

function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(" ");
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function getCanvasZoom(): number {
  return parseFloat(document.documentElement.style.zoom) || 1;
}

function canvasTop(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const scale = rect.width && el.offsetWidth ? rect.width / el.offsetWidth : 1;
  return rect.top / scale;
}

type Watch = { ratio: number; done: () => void };

const watches = new Map<Element, Watch[]>();
let observer: IntersectionObserver | null = null;

function reached(entry: IntersectionObserverEntry, ratio: number) {
  return entry.intersectionRatio >= ratio || entry.intersectionRect.height >= window.innerHeight * 0.6;
}

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const list = watches.get(entry.target);
        if (!list) continue;
        const left = list.filter((watch) => {
          if (!reached(entry, watch.ratio)) return true;
          watch.done();
          return false;
        });
        if (left.length) watches.set(entry.target, left);
        else {
          watches.delete(entry.target);
          observer?.unobserve(entry.target);
        }
      }
    },
    { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.7, 0.75, 0.8, 0.9, 1] },
  );
  return observer;
}

function whenVisible(el: Element, ratio: number, done: () => void): () => void {
  if (typeof IntersectionObserver === "undefined") {
    done();
    return () => {};
  }
  const watch: Watch = { ratio, done };
  watches.set(el, [...(watches.get(el) ?? []), watch]);
  getObserver().observe(el);
  return () => {
    const left = (watches.get(el) ?? []).filter((w) => w !== watch);
    if (left.length) watches.set(el, left);
    else {
      watches.delete(el);
      observer?.unobserve(el);
    }
  };
}

const STRIPS = 6;
const MIN_CARDS = 10;
const bw = (src: string) => src.replace(/(\.\w+)$/, "-bw$1");
const TILT = 0;
const PERSPECTIVE = 2400;
const LEAN = 0;
const SNAP_HAND = 9;
const SNAP_AUTO = 6.5;
const SNAP_INTRO = 9.5;
const INTRO_TURN = 1.5;
const FIRST_STEP_MS = 6000;
const MOMENTUM = 0.28;
const MAX_SPEED = 10;
const CAROUSEL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export type CircularCarouselProps<T> = {
  items: readonly T[];
  label: string;
  itemName: string;
  slideTitle: (item: T) => string;
  image: (item: T) => string;
  href?: (item: T) => string | null;
  renderSlide: (item: T) => ReactNode;
  cardLabel?: (item: T) => { title: string; sub?: string };
  cardDetail?: (item: T) => ReactNode;
  imageY?: string;
  width: number;
  height: number;
  gap?: number;
  interval?: number;
  fadeColor: string;
  backColor: string;
  tone?: "light" | "dark";
  spacing?: number;
  arrowReach?: number;
  className?: string;
};

type Sim = {
  pos: number;
  vel: number;
  target: number;
  stiffness: number;
  held: boolean;
  lean: { x: number; y: number; aimX: number; aimY: number };
  clock: number;
};

export default function CircularCarousel<T>({
  items,
  label,
  itemName,
  slideTitle,
  image,
  href,
  renderSlide,
  cardLabel,
  cardDetail,
  imageY = "30%",
  width,
  height,
  gap = 32,
  interval = 0,
  fadeColor,
  backColor,
  tone = "light",
  spacing = 32,
  arrowReach,
  className,
}: CircularCarouselProps<T>) {
  const count = items.length;
  const slots = count ? count * Math.max(1, Math.ceil(MIN_CARDS / count)) : 0;
  const step = slots ? 360 / slots : 0;
  const pitch = width + gap;
  const radius = slots ? (slots * pitch) / (2 * Math.PI) : 0;
  const lift = -radius * Math.sin((-TILT * Math.PI) / 180) * 0.55;
  const stageHeight = Math.round(height + radius * Math.sin((-TILT * Math.PI) / 180) * 0.9 + 24);

  const [front, setFront] = useState(0);
  const [still, setStill] = useState(false);
  const [shown, setShown] = useState(true);
  const [playing, setPlaying] = useState(interval > 0);
  const [near, setNear] = useState(false);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || near) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "150% 0px" });
    io.observe(stage);
    return () => io.disconnect();
  }, [near]);
  const active = count ? mod(front, count) : 0;

  const regionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const sim = useRef<Sim>({ pos: 0, vel: 0, target: 0, stiffness: SNAP_HAND, held: false, lean: { x: 0, y: 0, aimX: 0, aimY: 0 }, clock: 0 });
  const flags = useRef({ playing: interval > 0, onScreen: false, still: false, entered: true, hover: false, focus: false, edge: false, open: false });
  const frontRef = useRef(0);
  const depths = useRef<string[]>([]);
  const frame = useRef(0);
  const kickRef = useRef<() => void>(() => {});

  const strips = useMemo(() => {
    if (!radius) return [];
    const wide = width / STRIPS;
    return Array.from({ length: STRIPS }, (_, j) => {
      const angle = (-width / 2 + (j + 0.5) * wide) / radius;
      const before = j === 0 ? 0 : 1.5;
      const after = j === STRIPS - 1 ? 0 : 1.5;
      return {
        width: wide + before + after,
        left: -wide / 2 - before,
        offset: j * wide - before,
        transform: `translate3d(${(radius * Math.sin(angle)).toFixed(3)}px, 0, ${(radius * Math.cos(angle) - radius).toFixed(3)}px) rotateY(${((angle * 180) / Math.PI).toFixed(3)}deg)`,
      };
    });
  }, [radius, width]);

  useEffect(() => {
    const s = sim.current;
    const f = flags.current;
    let last = 0;

    let ringLast = "";
    let cameraLast = "";
    const draw = () => {
      const ring = `rotateY(${(-s.pos * step).toFixed(3)}deg)`;
      if (ringRef.current && ring !== ringLast) ringRef.current.style.transform = ringLast = ring;
      const camera = `translate3d(0, ${lift.toFixed(1)}px, ${(-radius).toFixed(1)}px) rotateX(${(TILT - s.lean.y * LEAN * 0.5).toFixed(3)}deg) rotateY(${(s.lean.x * LEAN).toFixed(3)}deg)`;
      if (cameraRef.current && camera !== cameraLast) cameraRef.current.style.transform = cameraLast = camera;
      for (let i = 0; i < slots; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const turn = ((mod(i - s.pos + slots / 2, slots) - slots / 2) * step * Math.PI) / 180;
        const depth = ((1 - Math.cos(turn)) / 2).toFixed(2);
        if (depths.current[i] === depth) continue;
        depths.current[i] = depth;
        el.style.setProperty("--cc-depth", depth);
      }
      const nearest = mod(Math.round(s.pos), slots);
      if (nearest !== frontRef.current) {
        frontRef.current = nearest;
        f.hover = false;
        f.open = false;
        setOpened(false);
        setFront(nearest);
      }
    };

    const tick = (time: number) => {
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
      last = time;
      let busy = false;

      if (!s.held) {
        if (f.still) {
          s.pos = s.target;
          s.vel = 0;
        } else {
          const k = s.stiffness;
          s.vel += (k * k * (s.target - s.pos) - 2 * k * s.vel) * dt;
          s.pos += s.vel * dt;
          if (Math.abs(s.target - s.pos) < 0.003 && Math.abs(s.vel) < 0.02) {
            s.pos = s.target;
            s.vel = 0;
          } else busy = true;
        }
      } else busy = true;

      const lean = s.lean;
      const ease = 1 - Math.exp(-dt * 5);
      lean.x += (lean.aimX - lean.x) * ease;
      lean.y += (lean.aimY - lean.y) * ease;
      if (Math.abs(lean.aimX - lean.x) > 1e-3 || Math.abs(lean.aimY - lean.y) > 1e-3) busy = true;

      const counting = interval > 0 && f.playing && !f.still && f.entered && f.onScreen && slots > 1;
      if (counting) {
        busy = true;
        if (!f.hover && !f.open && !f.edge && !f.focus && !s.held && !document.hidden) s.clock += dt * 1000;
        if (s.clock >= interval) {
          s.clock = 0;
          s.target = Math.round(s.target) + 1;
          s.stiffness = SNAP_AUTO;
        }
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${counting ? Math.max(0, Math.min(1, s.clock / interval)).toFixed(4) : 0})`;

      draw();
      frame.current = busy ? requestAnimationFrame(tick) : 0;
      if (!busy) last = 0;
    };

    kickRef.current = () => {
      if (!frame.current) frame.current = requestAnimationFrame(tick);
    };
    draw();
    kickRef.current();
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [slots, step, radius, lift, interval]);

  const kick = () => kickRef.current();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const f = flags.current;
    const s = sim.current;
    const reduced = prefersReducedMotion();
    setStill(reduced);
    f.still = reduced;
    if (reduced) {
      setPlaying(false);
      f.playing = false;
    }
    let cancel = () => {};
    const alreadyThere = canvasTop(stage) < (window.innerHeight / getCanvasZoom()) * 0.85;
    const phone = window.matchMedia("(max-width: 760px)").matches;
    if (!reduced && !alreadyThere && !phone) {
      f.entered = false;
      setShown(false);
      s.pos = s.target = -INTRO_TURN;
      s.vel = 0;
      kick();
      cancel = whenVisible(stage, 0.35, () => {
        f.entered = true;
        setShown(true);
        s.target = 0;
        s.stiffness = SNAP_INTRO;
        kick();
      });
    }
    let seen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        f.onScreen = entry.isIntersecting;
        if (entry.isIntersecting && !seen) {
          seen = true;
          s.clock = Math.min(0, interval - FIRST_STEP_MS);
        }
        kick();
      },
      { threshold: 0.25 },
    );
    io.observe(stage);
    return () => {
      cancel();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    flags.current.playing = playing;
    if (!playing) sim.current.clock = 0;
    kick();
  }, [playing]);

  const announce = () => {
    if (!liveRef.current || !count) return;
    const index = mod(Math.round(sim.current.target), count);
    liveRef.current.textContent = `${index + 1} of ${count}: ${slideTitle(items[index])}`;
  };

  const shiftRef = useRef<HTMLDivElement>(null);
  const edge = useRef({ target: 0, leave: 0 as ReturnType<typeof setTimeout> | 0, x: -1, y: -1, card: null as HTMLElement | null, zone: null as null | { l: number; r: number; t: number; b: number } });
  const EDGE_MARGIN = 16;
  const EDGE_MS = 520;
  const EDGE_GRACE = 140;
  const setShift = (px: number) => {
    const e = edge.current;
    if (e.leave) clearTimeout(e.leave);
    e.leave = 0;
    if (!px) {
      e.zone = null;
      e.card = null;
    }
    const el = shiftRef.current;
    if (!el || Math.abs(px - e.target) < 0.5) return;
    e.target = px;
    if (prefersReducedMotion()) el.style.transition = "none";
    el.style.translate = px ? `${px.toFixed(1)}px 0` : "";
    flags.current.edge = px !== 0;
    if (!px) kick();
  };
  const fitCard = (card: HTMLElement) => {
    const el = shiftRef.current;
    if (!el) return;
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;
    card.querySelectorAll<HTMLElement>("span[aria-hidden]").forEach((part) => {
      const r = part.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        left = Math.min(left, r.left);
        right = Math.max(right, r.right);
        top = Math.min(top, r.top);
        bottom = Math.max(bottom, r.bottom);
      }
    });
    if (!Number.isFinite(left)) return;
    const zoom = getCanvasZoom();
    const drawn = (parseFloat(getComputedStyle(el).translate) || 0) * zoom;
    const l0 = left - drawn;
    const r0 = right - drawn;
    const vw = document.documentElement.clientWidth;
    const now = edge.current.target * zoom;
    let next = now;
    if (r0 - l0 > vw - 2 * EDGE_MARGIN) next = EDGE_MARGIN - l0;
    else if (l0 + now < EDGE_MARGIN) next = EDGE_MARGIN - l0;
    else if (r0 + now > vw - EDGE_MARGIN) next = vw - EDGE_MARGIN - r0;
    else if (l0 >= EDGE_MARGIN && r0 <= vw - EDGE_MARGIN) next = 0;
    setShift(next / zoom);
    edge.current.card = next ? card : null;
    edge.current.zone = next ? { l: Math.min(l0, l0 + next), r: Math.max(r0, r0 + next), t: top - 12, b: bottom + 12 } : null;
  };
  const inZone = (x: number, y: number) => {
    const z = edge.current.zone;
    return !!z && x >= z.l && x <= z.r && y >= z.t && y <= z.b;
  };
  const leaveSoon = () => {
    const e = edge.current;
    if (e.leave || !e.target) return;
    e.leave = setTimeout(() => {
      e.leave = 0;
      if (!inZone(e.x, e.y)) setShift(0);
    }, EDGE_GRACE);
  };
  const onCardEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || drag.current?.moved) return;
    const e = edge.current;
    e.x = event.clientX;
    e.y = event.clientY;
    if (e.target && e.card && e.card !== event.currentTarget && inZone(e.x, e.y)) return;
    if (e.leave) clearTimeout(e.leave);
    e.leave = 0;
    fitCard(event.currentTarget);
  };
  const onCardLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const e = edge.current;
    e.x = event.clientX;
    e.y = event.clientY;
    if (!inZone(e.x, e.y)) leaveSoon();
  };
  useEffect(() => {
    const e = edge.current;
    const off = () => setShift(0);
    const track = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse" || !e.target) return;
      e.x = event.clientX;
      e.y = event.clientY;
      if (inZone(e.x, e.y)) {
        if (e.leave) clearTimeout(e.leave);
        e.leave = 0;
      } else leaveSoon();
    };
    addEventListener("resize", off);
    addEventListener("pointermove", track, { passive: true });
    document.addEventListener("pointerleave", off);
    return () => {
      removeEventListener("resize", off);
      removeEventListener("pointermove", track);
      document.removeEventListener("pointerleave", off);
    };
  }, []);

  const move = (by: number, byHand: boolean) => {
    if (!slots || by === 0) return;
    setShift(0);
    const s = sim.current;
    s.clock = 0;
    s.held = false;
    s.target = Math.round(s.target) + by;
    s.stiffness = SNAP_HAND;
    kick();
    if (byHand) announce();
  };

  const offsetTo = (slot: number) => mod(slot - Math.round(sim.current.target) + Math.floor(slots / 2), slots) - Math.floor(slots / 2);

  const goTo = (index: number) => move(mod(index - mod(Math.round(sim.current.target), count) + Math.floor(count / 2), count) - Math.floor(count / 2), true);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1, true);
  };

  const drag = useRef<{ id: number; x: number; y: number; pos: number; moved: boolean; trail: { t: number; pos: number }[] } | null>(null);
  const swallowClick = useRef(false);

  const release = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    const s = sim.current;
    const trail = d.trail;
    const first = trail[0];
    const lastPoint = trail[trail.length - 1];
    const span = (lastPoint.t - first.t) / 1000;
    const speed = span > 0.02 ? Math.max(-MAX_SPEED, Math.min(MAX_SPEED, (lastPoint.pos - first.pos) / span)) : 0;
    s.held = false;
    s.vel = flags.current.still ? 0 : speed;
    const carry = speed * MOMENTUM;
    s.target = Math.round(s.pos + carry);
    s.stiffness = SNAP_HAND;
    s.clock = 0;
    swallowClick.current = true;
    kick();
    announce();
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, pos: sim.current.pos, moved: false, trail: [] };
    swallowClick.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    const d = drag.current;
    edge.current.x = event.clientX;
    edge.current.y = event.clientY;
    if (!d || d.id !== event.pointerId) return;
    const zoom = getCanvasZoom();
    const dx = (event.clientX - d.x) / zoom;
    const dy = (event.clientY - d.y) / zoom;
    const s = sim.current;
    if (!d.moved) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        d.moved = true;
        setShift(0);
        d.pos = s.pos;
        s.held = true;
        s.vel = 0;
        stage?.setPointerCapture(event.pointerId);
        kick();
      } else {
        if (Math.abs(dy) > 10) drag.current = null;
        return;
      }
    }
    s.pos = d.pos - dx / pitch;
    s.target = s.pos;
    const now = performance.now();
    d.trail.push({ t: now, pos: s.pos });
    while (d.trail.length > 2 && now - d.trail[0].t > 90) d.trail.shift();
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let timer = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      (event as WheelEvent & { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
      event.preventDefault();
      const s = sim.current;
      const scale = event.deltaMode === 1 ? 16 : 1;
      s.held = true;
      s.vel = 0;
      s.pos += (event.deltaX * scale) / pitch;
      s.target = s.pos;
      s.clock = 0;
      kickRef.current();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        s.held = false;
        s.target = Math.round(s.pos);
        s.stiffness = SNAP_HAND;
        kickRef.current();
        announce();
      }, 140);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      window.clearTimeout(timer);
    };
  }, [pitch]);

  const name = itemName.charAt(0).toUpperCase() + itemName.slice(1);
  const radiusPx = 8;

  const autoFill = interval && playing && !still ? fillRef : undefined;

  if (!count) return null;

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={(event) => {
        if ((event.target as Element).matches(":focus-visible")) flags.current.focus = true;
      }}
      onBlur={(event) => {
        if (!regionRef.current?.contains(event.relatedTarget as Node | null)) flags.current.focus = false;
      }}
      onPointerLeave={() => {
        const lean = sim.current.lean;
        lean.aimX = lean.aimY = 0;
        kick();
      }}
      className={cx("cu:relative cu:flex cu:w-full cu:flex-col cu:items-center cu:rounded-[8px] cu:outline-none cu:focus-visible:outline-2 cu:focus-visible:outline-offset-4 cu:focus-visible:outline-[#cc5500]", className)}
    >
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onClickCapture={(event) => {
          if (swallowClick.current) {
            swallowClick.current = false;
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          const el = (event.target as Element | null)?.closest<HTMLElement>("[data-slot]");
          if (!el) return;
          const by = offsetTo(Number(el.dataset.slot));
          if (by === 0) {
            if (!cardDetail || (event.target as Element).closest("a[href]")) return;
            setOpened((o) => {
              flags.current.open = !o;
              return !o;
            });
            return;
          }
          event.preventDefault();
          move(by, true);
        }}
        className="cu:relative cu:w-full cu:touch-pan-y cu:select-none"
        style={{ height: stageHeight }}
      >
        <div
          ref={shiftRef}
          className="cu:pointer-events-none cu:absolute cu:inset-0 cu:motion-reduce:transition-none"
          style={{ transition: `translate ${EDGE_MS}ms ${CAROUSEL_EASE}` }}
        >
        <span
          aria-hidden="true"
          className="cu:pointer-events-none cu:absolute cu:left-1/2 cu:h-12 cu:w-[760px] cu:-translate-x-1/2 cu:rounded-[50%] cu:bg-[radial-gradient(closest-side,rgb(77_31_8/0.16),rgb(77_31_8/0))]"
          style={{ top: stageHeight / 2 + height / 2 - 18 }}
        />
        <div
          className="cu:pointer-events-auto cu:absolute cu:inset-0 cu:flex cu:items-center cu:justify-center"
          style={{
            perspective: PERSPECTIVE,
            opacity: shown ? 1 : 0,
            transition: still ? "none" : `opacity 450ms ${CAROUSEL_EASE}`,
          }}
        >
          <div ref={cameraRef} className="cu:relative cu:size-0 cu:[transform-style:preserve-3d]">
            <div ref={ringRef} className="cu:absolute cu:top-0 cu:left-0 cu:size-0 cu:[transform-style:preserve-3d]">
              {Array.from({ length: slots }, (_, slot) => {
                const index = slot % count;
                const item = items[index];
                const copy = slot >= count;
                const isFront = slot === front;
                const link = href?.(item) ?? null;
                const src = image(item);
                const faces = strips.map((strip, j) => {
                  const edge = j === 0 ? "left" : j === STRIPS - 1 ? "right" : null;
                  const round = (side: "left" | "right" | null) =>
                    side === "left" ? `${radiusPx}px 0 0 ${radiusPx}px` : side === "right" ? `0 ${radiusPx}px ${radiusPx}px 0` : "0";
                  const box: CSSProperties = { left: strip.left, top: -height / 2, width: strip.width, height };
                  return (
                    <Fragment key={j}>
                      <span aria-hidden="true" className="cu:absolute cu:outline cu:outline-1 cu:outline-transparent cu:[backface-visibility:hidden]" style={{ ...box, transform: strip.transform }}>
                        <span
                          className="cu:absolute cu:inset-0 cu:overflow-hidden cu:bg-no-repeat"
                          style={{
                            borderRadius: round(edge),
                            backgroundImage: near ? `url("${bw(src)}")` : undefined,
                            backgroundSize: `${width}px auto`,
                            backgroundPosition: `${-strip.offset}px ${imageY}`,
                            backgroundColor: backColor,
                          }}
                        >
                          <span
                            className={cx(
                              "cu:absolute cu:inset-0 cu:bg-no-repeat cu:[transition:opacity_600ms_cubic-bezier(0.22,1,0.36,1)] cu:motion-reduce:transition-none",
                              isFront ? "cu:opacity-100" : "cu:opacity-0 cu:group-hover/cc:opacity-100",
                            )}
                            style={{
                              backgroundImage: near ? `url("${src}")` : undefined,
                              backgroundSize: `${width}px auto`,
                              backgroundPosition: `${-strip.offset}px ${imageY}`,
                            }}
                          />
                          {cardLabel && (
                            <span
                              className={cx("cu:absolute cu:inset-0 cu:[transition:opacity_400ms_cubic-bezier(0.22,1,0.36,1)]", isFront ? "cu:opacity-80 cu:group-hover/cc:opacity-100 cu:group-focus-within/cc:opacity-100" : "cu:opacity-0")}
                              style={{ backgroundImage: "linear-gradient(180deg, transparent 52%, rgb(30 14 6 / 0.55) 76%, rgb(30 14 6 / 0.88) 100%)", backgroundSize: `${width}px ${height}px`, backgroundPosition: `${-strip.offset}px 0` }}
                            />
                          )}
                          <span className="cu:absolute cu:inset-0" style={{ background: fadeColor, opacity: "calc(var(--cc-depth, 0) * 0.9)" }} />
                        </span>
                      </span>
                    </Fragment>
                  );
                });
                const cardStyle: CSSProperties = { transform: `rotateY(${(slot * step).toFixed(3)}deg) translateZ(${radius.toFixed(2)}px)` };
                const cardClass = "cu:group/cc cu:absolute cu:top-0 cu:left-0 cu:size-0 cu:[transform-style:preserve-3d] cu:[translate:0_0] cu:[transition:translate_450ms_cubic-bezier(0.22,1,0.36,1)] cu:hover:[translate:0_-10px] cu:focus-within:[translate:0_-10px] cu:data-[open]:[translate:0_-10px] cu:motion-reduce:transition-none";
                const label = cardLabel?.(item);
                const plate = label ? (
                  <span
                    aria-hidden="true"
                    className={cx(
                      "cu:pointer-events-none cu:absolute cu:[backface-visibility:hidden] cu:[transition:opacity_350ms_cubic-bezier(0.22,1,0.36,1),translate_450ms_cubic-bezier(0.22,1,0.36,1)] cu:motion-reduce:transition-none",
                      isFront ? "cu:[translate:0_0] cu:opacity-100" : "cu:[translate:0_8px] cu:opacity-0",
                      isFront && cardDetail && "cu:group-hover/cc:opacity-0 cu:group-focus-within/cc:opacity-0 cu:group-data-[open]/cc:opacity-0",
                    )}
                    style={{ left: -width / 2, top: -height / 2, width, height, transform: "translateZ(2px)" }}
                  >
                    <span className="cu:absolute cu:inset-x-0 cu:bottom-0 cu:flex cu:flex-col cu:gap-0.5 cu:px-4 cu:pb-4 cu:text-left">
                      <span className="cu:[font:500_22px/1.15_Newsreader,Georgia,serif] cu:tracking-[-.01em] cu:text-white cu:[text-shadow:0_1px_12px_rgb(20_8_2/.35)] cu:max-[640px]:text-[19px]">{label.title}</span>
                      {label.sub && <span className="cu:[font:600_13px/1.3_var(--f)] cu:tracking-[.02em] cu:text-[#FFD9A8]">{label.sub}</span>}
                      {cardDetail && <span className="cu:hidden cu:[@media(hover:none)]:inline-flex cu:mt-1.5 cu:self-start cu:items-center cu:gap-1 cu:rounded-full cu:bg-white/20 cu:px-2 cu:py-0.5 cu:[font:600_11px/1.4_var(--f)] cu:text-white cu:backdrop-blur-[2px]">Tap for details</span>}
                    </span>
                  </span>
                ) : null;
                const details = !!cardDetail && isFront;
                const plane: CSSProperties = { left: -width / 2, top: -height / 2, width, height };
                const info = details ? (
                  <span
                    className={cx(
                      "cu:absolute cu:overflow-hidden",
                      "cu:pointer-events-none cu:opacity-0 cu:[transition:opacity_.4s_ease] cu:motion-reduce:transition-none",
                      "cu:group-hover/cc:pointer-events-auto cu:group-hover/cc:opacity-100 cu:group-focus-within/cc:pointer-events-auto cu:group-focus-within/cc:opacity-100 cu:group-data-[open]/cc:pointer-events-auto cu:group-data-[open]/cc:opacity-100",
                    )}
                    style={{ ...plane, borderRadius: radiusPx, transform: "translateZ(3px)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="cu:absolute cu:inset-0 cu:bg-no-repeat cu:[filter:blur(3px)_saturate(1.1)] cu:scale-[1.04]"
                      style={{ backgroundImage: near ? `url("${src}")` : undefined, backgroundSize: `${width}px auto`, backgroundPosition: `0 ${imageY}`, backgroundColor: backColor }}
                    />
                    <span aria-hidden="true" className="cu:absolute cu:inset-0 cu:bg-[linear-gradient(180deg,rgb(243_232_214/.02)_0%,rgb(243_232_214/.05)_6%,rgb(243_232_214/.1)_12%,rgb(243_232_214/.19)_18%,rgb(243_232_214/.32)_24%,rgb(243_232_214/.49)_30%,rgb(243_232_214/.67)_36%,rgb(243_232_214/.82)_42%,rgb(243_232_214/.93)_48%,rgb(243_232_214/.99)_55%,#F3E8D6_62%,#F3E8D6_100%)]" />                    <span aria-hidden="true" className="cu:absolute cu:inset-0 cu:rounded-[inherit] cu:shadow-[inset_0_0_0_1px_rgb(255_255_255/.7),inset_0_1px_0_rgb(255_255_255/.9)]" />
                    <span
                      className="cu:relative cu:flex cu:size-full cu:flex-col cu:justify-end cu:gap-0 cu:px-5 cu:pt-5 cu:pb-5 cu:text-left cu:[translate:0_8px] cu:[transition:translate_.45s_cubic-bezier(0.22,1,0.36,1)] cu:group-hover/cc:[translate:0_0] cu:group-focus-within/cc:[translate:0_0] cu:group-data-[open]/cc:[translate:0_0] cu:motion-reduce:transition-none"
                    >
                      {cardDetail(item)}
                    </span>
                  </span>
                ) : null;
                const turn = (
                  <div className="cu:absolute cu:top-0 cu:left-0 cu:size-0 cu:[transform-style:preserve-3d]">
                    {faces}
                    {plate}
                    {info}
                  </div>
                );
                return (
                  <div
                    key={slot}
                    ref={(el) => {
                      cardRefs.current[slot] = el;
                    }}
                    data-slot={slot}
                    data-open={isFront && opened ? "" : undefined}
                    {...(copy ? { "aria-hidden": true } : { role: "group", "aria-roledescription": "slide", "aria-label": `${index + 1} of ${count}` })}
                    onFocus={() => {
                      const by = offsetTo(slot);
                      if (by !== 0) move(by, true);
                    }}
                    onPointerEnter={(event) => {
                      if (isFront && event.pointerType === "mouse") flags.current.hover = true;
                      onCardEnter(event);
                    }}
                    onPointerLeave={(event) => {
                      if (isFront) flags.current.hover = false;
                      onCardLeave(event);
                    }}
                    className={cardClass}
                    style={cardStyle}
                  >
                    {link !== null ? (
                      <a href={link} draggable={false} tabIndex={copy ? -1 : undefined} className="cu:absolute cu:top-0 cu:left-0 cu:size-0 cu:[transform-style:preserve-3d]">
                        {turn}
                        <div className="cu:sr-only">{renderSlide(item)}</div>
                      </a>
                    ) : (
                      <>
                        {turn}
                        {!copy && <div className="cu:sr-only">{renderSlide(item)}</div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>

        {([-1, 1] as const).map((side) => (
          <div
            key={side}
            className={cx("cu:absolute cu:top-1/2 cu:z-10 cu:-translate-y-1/2", arrowReach ? "cu:-translate-x-1/2" : side < 0 ? "cu:left-10" : "cu:right-10")}
            style={arrowReach ? { left: `calc(50% + ${side * arrowReach}px)` } : undefined}
          >
            <Button
              variant="outline"
              size="sm"
              iconOnly
              onDark={tone === "dark"}
              iconStart={side < 0 ? "arrow-left" : "arrow"}
              label={`${side < 0 ? "Previous" : "Next"} ${itemName}`}
              onClick={() => move(side, true)}
              className="carousel-arrow"
            />
          </div>
        ))}
      </div>

      <div className="cu:flex cu:items-center" style={{ marginTop: spacing }}>
        <SiteDots
          label={`Choose ${itemName}`}
          labels={Array.from({ length: count }, (_, i) => `${name} ${i + 1} of ${count}`)}
          active={active}
          onSelect={goTo}
          tone={tone}
          fillRef={autoFill}
          fillProps={(_: number, on: boolean) => (on && autoFill ? { style: { transform: "scaleX(0)" } } : {})}
          className={undefined}
        />
      </div>

      <p ref={liveRef} aria-live="polite" aria-atomic="true" className="cu:sr-only" />
    </div>
  );
}
