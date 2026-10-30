"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { campuses } from "@/data/contact";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * The India globe beside the hero copy (Figma "India globe", 1960:3312), in its own 480 × 540 frame, as a
 * particle globe in the manner of Framer's Atomic Globe. Every flat layer sits where the design puts it;
 * the numbers below are the design's, in frame pixels.
 *
 * The world is a field of dots on a sphere (Natural Earth outlines, public/images/hero/globe/globe-points.json),
 * drawn on a canvas in orthographic view, with India in the denser brand dots. At rest it faces India so
 * that New Delhi and Chennai sit exactly on the design's pins, and the dots shrink and dim towards the
 * edge as the design's do. On load the dots bloom out of the core; then the globe turns a full circle
 * now and then and always settles back on India. It can be dragged any way and springs back, the dots
 * light up around the pointer, a click sends a sonar ring across the surface, a light runs along the
 * Delhi–Chennai route, and clicking a city flies the globe to it. Without JavaScript or with reduced
 * motion, the design's still artwork shows.
 */

const IMG = "/images/hero/globe";

/** Absolute placement in frame pixels. */
const at = (left: number, top: number, width: number, height = width): CSSProperties => ({ left, top, width, height });

const DEG = Math.PI / 180;

/** The sphere: its box in the frame, centre and radius. */
const SPHERE = { left: -12, top: 22, size: 496 };
const RADIUS = SPHERE.size / 2;
/** The view at rest: the longitude and latitude at the centre, which put the cities on the design's pins. */
const HOME = { lon: 80.8, lat: 21 };

/** Motion: the rest on India, the full turn, the bloom on load, and the spring a drag or a flight uses. */
const REST_MS = 6000;
const TURN_MS = 14000;
const BLOOM_MS = 1600;
const BLOOM_DELAY_MS = 350;
const SPRING = 26;
const DAMPING = 2 * Math.sqrt(SPRING) * 0.9;
const TILT_LIMIT = { min: -15, max: 60 };
/** The pointer's halo and a click's sonar ring, in frame pixels and milliseconds. */
const HALO = 72;
const SONAR_MS = 1400;
const SONAR_REACH = 190;
/** How long the globe stays on a city it flew to, before it heads home. */
const VISIT_MS = 5000;
/** One trip of the light along the Delhi–Chennai route. */
const ROUTE_MS = 2400;

type Orbit = { cx: number; cy: number; a: number; b: number; rot: number };

/** Each orbit is drawn twice, split along its long axis: the far (upper) half and the near (lower) half. */
const FAR_HALF = "[mask-image:linear-gradient(to_bottom,#000_49%,transparent_51%)]";
const NEAR_HALF = "[mask-image:linear-gradient(to_bottom,transparent_49%,#000_51%)]";

/** The two tilted orbits: centre, half-axes and tilt (degrees, clockwise). */
const ORBITS: Orbit[] = [
  { cx: 236.0, cy: 435.38, a: 300, b: 80, rot: 16 },
  { cx: 323.67, cy: 270.0, a: 270, b: 100, rot: -26 },
];

/** A node riding each orbit, where the design draws it, and the tag that travels with it. */
const RIDERS = [
  { orbit: 0, node: { x: -51.79, y: 323.79 }, tag: { x: -149.29, y: 314.29, label: "Classroom", dot: "light" as const } },
  { orbit: 1, node: { x: 273.31, y: 390.44 }, tag: { x: 227.81, y: 406.94, label: "LIVE-Online", dot: "orange" as const } },
];

/** The campuses: where they are, their pulse ring, pin and tag in the design, and where the address opens. */
const CITIES = [
  { city: "New Delhi", lon: 77.21, lat: 28.61, ring: [208.57, 224.03], pin: [216.57, 232.03], tag: { x: 103.57, y: 207.03 }, side: "above" as const },
  { city: "Chennai", lon: 80.27, lat: 13.08, ring: [219.92, 291.16], pin: [227.92, 299.16], tag: { x: 132.92, y: 312.16 }, side: "below" as const },
];
/** India's glow travels with the country. */
const INDIA = { lon: 79.5, lat: 22.5 };

/** How far, in radians, an orbit node glides either way, and how long one swing takes. */
const SWING = 0.16;
const SWING_MS = [11000, 14000];

/** Pointer parallax: how far each depth layer shifts, in frame pixels. */
const DEPTH = { glow: 5, orbitsBehind: 16, back: 5, mid: 10, front: 16 };
const LERP = 0.06;
const NODE = 9;
/** Opacity steps the dots are drawn in, so the canvas fills a few paths a frame instead of thousands of dots. */
const ALPHA_STEPS = 40;

const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function pointOn(o: Orbit, t: number): [number, number] {
  const r = (o.rot * Math.PI) / 180;
  const x = o.a * Math.cos(t);
  const y = o.b * Math.sin(t);
  return [o.cx + x * Math.cos(r) - y * Math.sin(r), o.cy + x * Math.sin(r) + y * Math.cos(r)];
}

function angleOf(o: Orbit, px: number, py: number): number {
  const r = (-o.rot * Math.PI) / 180;
  const dx = px - o.cx;
  const dy = py - o.cy;
  return Math.atan2((dx * Math.sin(r) + dy * Math.cos(r)) / o.b, (dx * Math.cos(r) - dy * Math.sin(r)) / o.a);
}

/** Orthographic projection: a place's offset from the sphere's centre in frame pixels, and its depth (1 facing us, 0 at the edge). */
function project(lon: number, lat: number, view: { lon: number; lat: number }): [number, number, number] {
  const phi = lat * DEG;
  const dl = (lon - view.lon) * DEG;
  const phi0 = view.lat * DEG;
  const cosPhi = Math.cos(phi);
  const z = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * cosPhi * Math.cos(dl);
  const x = RADIUS * cosPhi * Math.sin(dl);
  const y = -RADIUS * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * cosPhi * Math.cos(dl));
  return [x, y, z];
}

/** The nearest longitude to `from` that faces the same way as `to`, so a return never takes the long way round. */
const nearestTurn = (from: number, to: number) => to + 360 * Math.round((from - to) / 360);

function Tag({ label, dot }: { label: string; dot: "light" | "orange" }) {
  return (
    <span className="flex h-8 items-center gap-2 overflow-clip rounded-full border border-paper/16 bg-coal/60 px-3 text-[12px] font-medium whitespace-nowrap text-cream backdrop-blur-[8px]">
      {dot === "light" ? (
        <img src={`${IMG}/tag-dot-classroom.svg`} alt="" className="size-[7px] shrink-0" />
      ) : (
        <span className="size-[7px] shrink-0 rounded-full bg-orange" />
      )}
      {label}
    </span>
  );
}

type CityProps = { city: (typeof CITIES)[number]; onVisit: () => void };

/** A campus beacon: the hover and focus target over its pin and tag, the address card it opens, and a click that flies to it. */
function CityBeacon({ city, onVisit }: CityProps) {
  const campus = campuses.find((c) => c.city === city.city);
  const left = city.tag.x - 6;
  const width = city.pin[0] + 16 - left;
  return (
    <button
      type="button"
      onClick={onVisit}
      className="group/city pointer-events-auto absolute cursor-pointer rounded-full outline-offset-2"
      style={at(left, city.tag.y - 6, width, 44)}
      aria-label={`${city.city} campus${campus ? `: ${campus.address}` : ""}`}
    >
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute left-0 z-10 w-[260px] rounded-2xl border border-paper/14 bg-coal/85 px-4 py-3 text-left opacity-0 shadow-[0_20px_40px_-16px_rgb(0_0_0/0.8)] backdrop-blur-md transition-[opacity,translate] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/city:translate-y-0 group-hover/city:opacity-100 group-focus-visible/city:translate-y-0 group-focus-visible/city:opacity-100",
          city.side === "above" ? "bottom-[calc(100%+6px)] translate-y-1" : "top-[calc(100%+6px)] -translate-y-1",
        )}
      >
        <span className="block text-[11px]/[1.4] font-semibold tracking-[0.12em] text-tangerine uppercase">{city.city} campus</span>
        <span className="mt-1 block text-[13px]/[1.45] text-cream">{campus?.address}</span>
        {campus?.hours && <span className="mt-1 block text-[12px]/[1.45] text-cream/55">{campus.hours}</span>}
      </span>
    </button>
  );
}

type Points = { lon: number; lat: number; cosPhi: number; sinPhi: number; cosLon: number; sinLon: number; seed: number }[];

const toPoints = (pairs: [number, number][]): Points =>
  pairs.map(([lon, lat]) => ({
    lon,
    lat,
    cosPhi: Math.cos(lat * DEG),
    sinPhi: Math.sin(lat * DEG),
    cosLon: Math.cos(lon * DEG),
    sinLon: Math.sin(lon * DEG),
    seed: Math.random(),
  }));

export default function HeroGlobe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stillRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Record<keyof typeof DEPTH, HTMLDivElement | null>>({
    glow: null,
    orbitsBehind: null,
    back: null,
    mid: null,
    front: null,
  });
  const nodeRefs = useRef<Array<HTMLElement | null>>([]);
  const tagRefs = useRef<Array<HTMLElement | null>>([]);
  /** The cities' layers, then India's glow: everything that travels with the surface. */
  const surfaceRefs = useRef<Array<HTMLElement | null>>([]);
  /** The globe's state, shared by the frame loop and the pointer handlers. */
  const state = useRef({
    view: { ...HOME },
    velocity: { lon: 0, lat: 0 },
    mode: "idle" as "idle" | "drag" | "return" | "visit",
    target: { ...HOME },
    idleFrom: 0,
    visitUntil: 0,
    drag: { x: 0, y: 0, lon: 0, lat: 0, t: 0 },
    halo: { x: 0, y: 0, on: false },
    sonars: [] as { x: number; y: number; t: number }[],
    enabled: false,
  });

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = state.current;
    s.enabled = true;

    let world: Points = [];
    let india: Points = [];
    let ready = false;
    let cancelled = false;
    let bloomFrom = 0;

    let scale = 1;
    const sizeCanvas = () => {
      scale = (window.devicePixelRatio || 1) * getCanvasZoom();
      canvas.width = Math.round(SPHERE.size * scale);
      canvas.height = Math.round(SPHERE.size * scale);
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    fetch(`${IMG}/globe-points.json`)
      .then((r) => r.json())
      .then((data: { world: [number, number][]; india: [number, number][] }) => {
        if (cancelled) return;
        world = toPoints(data.world);
        india = toPoints(data.india);
        ready = true;
        bloomFrom = performance.now() + BLOOM_DELAY_MS;
        // The first rest on India starts once the dots have bloomed in.
        if (s.mode === "idle") s.idleFrom = bloomFrom + BLOOM_MS;
        // The live globe takes over from the still artwork, which fades as the dots bloom in.
        canvas.style.opacity = "1";
        if (stillRef.current) stillRef.current.style.opacity = "0";
      });

    /** Draws one set of dots for the current view, grouped into a few opacity steps. */
    const drawDots = (points: Points, now: number, look: "world" | "india") => {
      const { view, halo, sonars } = s;
      const phi0 = view.lat * DEG;
      const sin0 = Math.sin(phi0);
      const cos0 = Math.cos(phi0);
      const cosL0 = Math.cos(view.lon * DEG);
      const sinL0 = Math.sin(view.lon * DEG);
      const bloom = clamp01((now - bloomFrom) / BLOOM_MS);
      const paths: Array<Path2D | undefined> = [];
      for (const p of points) {
        // cos and sin of (lon - view.lon), from the precomputed parts.
        const cosDl = p.cosLon * cosL0 + p.sinLon * sinL0;
        const sinDl = p.sinLon * cosL0 - p.cosLon * sinL0;
        const z = sin0 * p.sinPhi + cos0 * p.cosPhi * cosDl;
        if (z <= 0.02) continue;
        let x = RADIUS * p.cosPhi * sinDl;
        let y = -RADIUS * (cos0 * p.sinPhi - sin0 * p.cosPhi * cosDl);
        // Bloom: each dot travels out from the core, the nearer ones first, with a little scatter.
        const reach = clamp01(bloom * 1.6 - (Math.hypot(x, y) / RADIUS) * 0.55 - p.seed * 0.12);
        if (reach <= 0) continue;
        const grow = easeOut(reach);
        x *= grow;
        y *= grow;
        let alpha: number;
        let r: number;
        if (look === "world") {
          // The design's dots: about 1.3px and 25% at the centre, 0.55px and 6% at the edge.
          r = 0.52 + 0.78 * z;
          alpha = 0.06 + 0.19 * z;
        } else {
          r = 1.45 * (0.6 + 0.4 * z);
          alpha = 0.95 * Math.sqrt(z);
        }
        // The pointer's halo lights the dots around it.
        if (halo.on) {
          const d = Math.hypot(x - halo.x, y - halo.y);
          if (d < HALO) {
            const lift = (1 - d / HALO) ** 2;
            alpha += lift * (look === "world" ? 0.55 : 0.05);
            r *= 1 + lift * 0.6;
          }
        }
        // A sonar ring brightens the dots it passes.
        for (const ring of sonars) {
          // Clamped: a ring can start a moment after the frame's own timestamp.
          const age = clamp01((now - ring.t) / SONAR_MS);
          const front = easeOut(age) * SONAR_REACH;
          const d = Math.abs(Math.hypot(x - ring.x, y - ring.y) - front);
          if (d < 14) alpha += (1 - d / 14) * (1 - age) * 0.6;
        }
        const step = Math.round(Math.min(1, alpha * grow) * ALPHA_STEPS);
        if (!step) continue;
        const path = (paths[step] ??= new Path2D());
        const px = (RADIUS + x) * scale;
        const py = (RADIUS + y) * scale;
        path.moveTo(px + r * scale, py);
        path.arc(px, py, r * scale, 0, Math.PI * 2);
      }
      ctx.fillStyle = look === "world" ? "#F5F0EA" : "#FF8A3D";
      paths.forEach((path, step) => {
        if (!path) return;
        ctx.globalAlpha = step / ALPHA_STEPS;
        ctx.fill(path);
      });
    };

    /** The Delhi–Chennai route: the design's dashed arc, with a light running along it. */
    const drawRoute = (now: number) => {
      const [x1, y1, z1] = project(CITIES[0].lon, CITIES[0].lat, s.view);
      const [x2, y2, z2] = project(CITIES[1].lon, CITIES[1].lat, s.view);
      const fade = clamp01(Math.min(z1, z2) * 3) * clamp01((now - bloomFrom - BLOOM_MS * 0.6) / 600);
      if (fade <= 0) return;
      // The arc bulges to the right of the line between the cities, as in the design.
      const dx = x2 - x1;
      const dy = y2 - y1;
      const cxp = (x1 + x2) / 2 - dy * 0.56;
      const cyp = (y1 + y2) / 2 + dx * 0.56;
      const along = (t: number): [number, number] => [
        (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cxp + t * t * x2,
        (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cyp + t * t * y2,
      ];
      const px = (v: number) => (RADIUS + v) * scale;
      ctx.save();
      ctx.globalAlpha = 0.75 * fade;
      ctx.strokeStyle = "#F5F0EA";
      ctx.lineWidth = 1.5 * scale;
      ctx.lineCap = "round";
      ctx.setLineDash([2 * scale, 4.2 * scale]);
      ctx.beginPath();
      ctx.moveTo(px(x1), px(y1));
      ctx.quadraticCurveTo(px(cxp), px(cyp), px(x2), px(y2));
      ctx.stroke();
      ctx.setLineDash([]);
      // The light: a bright head with a fading tail.
      const head = ((now - bloomFrom) % ROUTE_MS) / ROUTE_MS;
      for (let i = 0; i < 14; i++) {
        const t = head - i * 0.018;
        if (t < 0 || t > 1) continue;
        const [hx, hy] = along(t);
        ctx.globalAlpha = fade * (1 - i / 14) ** 2;
        ctx.fillStyle = i === 0 ? "#FFFDFB" : "#FF8A3D";
        ctx.beginPath();
        ctx.arc(px(hx), px(hy), (i === 0 ? 2.2 : 1.8 - i * 0.08) * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    /** The rings a click sends out, clipped to the globe. */
    const drawSonars = (now: number) => {
      s.sonars = s.sonars.filter((ring) => now - ring.t < SONAR_MS);
      if (!s.sonars.length) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(RADIUS * scale, RADIUS * scale, RADIUS * scale, 0, Math.PI * 2);
      ctx.clip();
      for (const ring of s.sonars) {
        const age = clamp01((now - ring.t) / SONAR_MS);
        ctx.globalAlpha = (1 - age) * 0.55;
        ctx.strokeStyle = "#FF8A3D";
        ctx.lineWidth = 1.2 * scale;
        ctx.beginPath();
        ctx.arc((RADIUS + ring.x) * scale, (RADIUS + ring.y) * scale, easeOut(age) * SONAR_REACH * scale, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    /** Where the idle motion is: a rest facing India, then a slow full turn that lands on India again. */
    const idleLon = (now: number) => {
      if (now < s.idleFrom) return HOME.lon;
      const t = (now - s.idleFrom) % (REST_MS + TURN_MS);
      return t < REST_MS ? HOME.lon : HOME.lon - 360 * easeInOut((t - REST_MS) / TURN_MS);
    };

    const starts = RIDERS.map((r) => angleOf(ORBITS[r.orbit], r.node.x + NODE / 2, r.node.y + NODE / 2));
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let visible = true;
    let frame = 0;
    let last = performance.now();
    const t0 = last;
    s.idleFrom = last;

    const tick = (now: number) => {
      frame = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // The view: idling, held by a drag, or springing to a target (home after a drag, or a city).
      if (s.mode === "idle") {
        s.view.lon = idleLon(now);
        s.view.lat = HOME.lat;
      } else if (s.mode === "return" || s.mode === "visit") {
        for (const axis of ["lon", "lat"] as const) {
          s.velocity[axis] += (-SPRING * (s.view[axis] - s.target[axis]) - DAMPING * s.velocity[axis]) * dt;
          s.view[axis] += s.velocity[axis] * dt;
        }
        const settled =
          Math.abs(s.view.lon - s.target.lon) < 0.05 &&
          Math.abs(s.view.lat - s.target.lat) < 0.05 &&
          Math.hypot(s.velocity.lon, s.velocity.lat) < 0.5;
        if (s.mode === "return" && settled) {
          s.mode = "idle";
          s.idleFrom = now;
          s.view = { ...HOME };
        } else if (s.mode === "visit" && settled && now > s.visitUntil) {
          s.mode = "return";
          s.target = { lon: nearestTurn(s.view.lon, HOME.lon), lat: HOME.lat };
        }
      }

      if (ready) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDots(world, now, "world");
        drawDots(india, now, "india");
        drawRoute(now);
        drawSonars(now);
        ctx.globalAlpha = 1;
      }

      // Pins, tags and India's glow travel with the surface and fade as they turn away.
      [...CITIES, INDIA].forEach((place, i) => {
        const el = surfaceRefs.current[i];
        if (!el) return;
        const [hx, hy] = project(place.lon, place.lat, HOME);
        const [x, y, z] = project(place.lon, place.lat, s.view);
        el.style.transform = `translate3d(${(x - hx).toFixed(2)}px, ${(y - hy).toFixed(2)}px, 0)`;
        const show = clamp01((z - 0.15) / 0.35) * (ready ? clamp01((now - bloomFrom - BLOOM_MS * 0.5) / 500) : 1);
        el.style.opacity = String(show);
        el.style.visibility = show > 0.05 ? "" : "hidden";
      });

      // The orbit nodes glide back and forth; each tag keeps its place beside its node.
      RIDERS.forEach((rider, i) => {
        const orbit = ORBITS[rider.orbit];
        const t = starts[i] + SWING * Math.sin(((now - t0) / SWING_MS[i]) * Math.PI * 2);
        const [x, y] = pointOn(orbit, t);
        const move = `translate3d(${(x - NODE / 2 - rider.node.x).toFixed(2)}px, ${(y - NODE / 2 - rider.node.y).toFixed(2)}px, 0)`;
        const node = nodeRefs.current[i];
        const tag = tagRefs.current[i];
        if (node) node.style.transform = move;
        if (tag) tag.style.transform = move;
      });
      // Layers drift towards the pointer by their depth.
      eased.x += (pointer.x - eased.x) * LERP;
      eased.y += (pointer.y - eased.y) * LERP;
      (Object.keys(DEPTH) as Array<keyof typeof DEPTH>).forEach((layer) => {
        const el = layerRefs.current[layer];
        if (el) el.style.transform = `translate3d(${(eased.x * DEPTH[layer]).toFixed(2)}px, ${(eased.y * DEPTH[layer]).toFixed(2)}px, 0)`;
      });
      frame = requestAnimationFrame(tick);
    };

    /** The pointer in frame pixels from the sphere's centre. */
    const local = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const k = SPHERE.size / rect.width;
      return { x: (event.clientX - rect.left) * k - RADIUS, y: (event.clientY - rect.top) * k - RADIUS };
    };

    const onPointer = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 1.5)));
      pointer.y = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (rect.height * 1.5)));
      const p = local(event);
      s.halo = { x: p.x, y: p.y, on: Math.hypot(p.x, p.y) < RADIUS + HALO / 2 };
      if (s.mode !== "drag") return;
      const zoom = getCanvasZoom();
      const lon = s.drag.lon - ((event.clientX - s.drag.x) / zoom / RADIUS) / DEG;
      const lat = Math.max(TILT_LIMIT.min, Math.min(TILT_LIMIT.max, s.drag.lat + ((event.clientY - s.drag.y) / zoom / RADIUS) / DEG));
      const dtDrag = Math.max(8, event.timeStamp - s.drag.t) / 1000;
      s.velocity = { lon: (lon - s.view.lon) / dtDrag, lat: (lat - s.view.lat) / dtDrag };
      s.view = { lon, lat };
      s.drag.t = event.timeStamp;
    };
    const onUp = () => {
      if (s.mode !== "drag") return;
      root.classList.remove("dragging");
      // Let go: the spring brings India back to the front, the shortest way round.
      s.mode = "return";
      s.target = { lon: nearestTurn(s.view.lon, HOME.lon), lat: HOME.lat };
      s.velocity = { lon: Math.max(-400, Math.min(400, s.velocity.lon)), lat: Math.max(-200, Math.min(200, s.velocity.lat)) };
    };
    const onLeave = () => (s.halo.on = false);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    observer.observe(root);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    root.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      s.enabled = false;
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", sizeCanvas);
      cancelAnimationFrame(frame);
    };
  }, []);

  /** A press on the globe starts a drag and sends a sonar ring out from where it landed. */
  const onGrab = (event: ReactPointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (event.button !== 0 || !s.enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const k = SPHERE.size / rect.width;
    s.sonars.push({ x: (event.clientX - rect.left) * k - RADIUS, y: (event.clientY - rect.top) * k - RADIUS, t: performance.now() });
    s.mode = "drag";
    s.drag = { x: event.clientX, y: event.clientY, lon: s.view.lon, lat: s.view.lat, t: event.timeStamp };
    s.velocity = { lon: 0, lat: 0 };
    rootRef.current?.classList.add("dragging");
  };

  /** Flies the globe to a city and stays there a while before heading home. */
  const visit = (city: (typeof CITIES)[number]) => {
    const s = state.current;
    if (!s.enabled) return;
    s.mode = "visit";
    s.target = { lon: nearestTurn(s.view.lon, city.lon), lat: city.lat };
    s.visitUntil = performance.now() + VISIT_MS;
  };

  return (
    <div ref={rootRef} className="group/globe relative h-[540px] w-[480px] shrink-0 animate-globe-in select-none">
      <div className="absolute inset-0 animate-globe-float">
        <div
          ref={(el) => {
            layerRefs.current.glow = el;
          }}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <img src={`${IMG}/halo-glow.svg`} alt="" className="absolute max-w-none" style={at(-132, -98, 736)} />
        </div>

        {/*
          The globe sits inside its orbits: the far half of each ring passes behind the sphere, the near half
          (in the front layer) crosses in front of it. Both halves move with the front layer's depth, so they
          stay joined.
        */}
        <div
          ref={(el) => {
            layerRefs.current.orbitsBehind = el;
          }}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {ORBITS.map((orbit, i) => (
            <img
              key={i}
              src={`${IMG}/orbit-${i + 1}.svg`}
              alt=""
              className={cx("absolute max-w-none", FAR_HALF)}
              style={{ ...at(orbit.cx - orbit.a, orbit.cy - orbit.b, orbit.a * 2, orbit.b * 2), transform: `rotate(${orbit.rot}deg)` }}
            />
          ))}
        </div>

        <div
          ref={(el) => {
            layerRefs.current.back = el;
          }}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <img src={`${IMG}/sphere.svg`} alt="" className="absolute max-w-none" style={at(SPHERE.left, SPHERE.top, SPHERE.size)} />
          {/* The design's still artwork: it shows until the live globe draws, and stays without JavaScript or with reduced motion. */}
          <div ref={stillRef} className="absolute inset-0 transition-opacity duration-700">
            <img src={`${IMG}/world-dots.svg`} alt="" className="absolute max-w-none" style={at(-12.2, 21.69, 496.39, 496.48)} />
            <img src={`${IMG}/india-dots.svg`} alt="" className="absolute max-w-none" style={at(186.68, 206.65, 110.9, 116.04)} />
            <img src={`${IMG}/arc-delhi-chennai.svg`} alt="" className="absolute max-w-none" style={at(221.31, 236.31, 44.72, 68.57)} />
          </div>
          <canvas ref={canvasRef} className="absolute opacity-0 transition-opacity duration-500" style={at(SPHERE.left, SPHERE.top, SPHERE.size)} />
          {/* Grab the globe to turn it. */}
          <div
            className="absolute cursor-grab rounded-full group-[.dragging]/globe:cursor-grabbing"
            style={at(SPHERE.left, SPHERE.top, SPHERE.size)}
            onPointerDown={onGrab}
            onDragStart={(event) => event.preventDefault()}
          />
        </div>

        <div
          ref={(el) => {
            layerRefs.current.mid = el;
          }}
          className="pointer-events-none absolute inset-0"
        >
          <img
            ref={(el) => {
              surfaceRefs.current[CITIES.length] = el;
            }}
            src={`${IMG}/india-glow.svg`}
            alt=""
            aria-hidden="true"
            className="absolute max-w-none"
            style={at(86.99, 120.66, 290)}
          />
          {CITIES.map((c, i) => (
            <div
              key={c.city}
              ref={(el) => {
                surfaceRefs.current[i] = el;
              }}
              className="absolute inset-0"
            >
              <img src={`${IMG}/pulse-ring.svg`} alt="" aria-hidden="true" className="absolute" style={at(c.ring[0], c.ring[1], 26)} />
              <img
                src={`${IMG}/pulse-ring.svg`}
                alt=""
                aria-hidden="true"
                className="absolute animate-pulse-ring"
                style={at(c.ring[0], c.ring[1], 26)}
              />
              <img src={`${IMG}/pin.svg`} alt="" aria-hidden="true" className="absolute" style={at(c.pin[0] - 2.5, c.pin[1] - 2.5, 15)} />
              <span className="absolute" style={{ left: c.tag.x, top: c.tag.y }} aria-hidden="true">
                <Tag label={c.city} dot="orange" />
              </span>
              <CityBeacon city={c} onVisit={() => visit(c)} />
            </div>
          ))}
        </div>

        <div
          ref={(el) => {
            layerRefs.current.front = el;
          }}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {ORBITS.map((orbit, i) => (
            <img
              key={i}
              src={`${IMG}/orbit-${i + 1}.svg`}
              alt=""
              className={cx("absolute max-w-none", NEAR_HALF)}
              style={{ ...at(orbit.cx - orbit.a, orbit.cy - orbit.b, orbit.a * 2, orbit.b * 2), transform: `rotate(${orbit.rot}deg)` }}
            />
          ))}
          {RIDERS.map((rider, i) => (
            <span key={rider.tag.label}>
              <img
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                src={`${IMG}/orbit-node.svg`}
                alt=""
                className="absolute"
                style={at(rider.node.x, rider.node.y, NODE)}
              />
              <span
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                className="absolute"
                style={{ left: rider.tag.x, top: rider.tag.y }}
              >
                <Tag label={rider.tag.label} dot={rider.tag.dot} />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
