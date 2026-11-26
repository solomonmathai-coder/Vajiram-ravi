// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/sections/Faculties.tsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
"use client";

import SectionWrapper from "@/team/components/ui/section_wrapper";
import { useEffect, useState, type CSSProperties } from "react";
import CircularCarousel from "@/team/components/ui/CircularCarousel";
import "@/team/tailwind-sections.css";
import SectionLabel from "@/team/components/ui/SectionLabel";
import { facultyIntro, educators, type Educator } from "@/team/lib/data/faculty";
import { FacultyCardDetails, FacultyCardText, facultyCardLabel, facultyCardSize } from "@/team/components/sections/FacultyCard";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const CHAR_MS = 480;
const CHAR_STAGGER = 8;
const CHAR_SPREAD_MS = 120;
const MAX_DELAY_MS = 200;
const STEP_MS = 40;
const MAX_STEPS = 5;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SHUFFLE_MS = 50;
const COUNT_MS = 600;
const COUNT_POLL_MS = 300;

const DECK_DEPTH = [0.85, 0.35, 1, 0.55, 0.9, 0.3, 0.7, 0.45];
const DECK_TURN = [-2.4, 1.6, -1.2, 2.2, -1.8, 1.2, -2, 1.4];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const stagger = (i: number) => Math.min(i, MAX_STEPS) * STEP_MS;

type Playable = HTMLElement & { tmPlay?: () => void };

function textNodes(el: HTMLElement): Text[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
}

function splitLetters(el: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = [];
  for (const node of textNodes(el)) {
    const parts = (node.textContent ?? "").split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(document.createTextNode(" "));
        continue;
      }
      const mask = document.createElement("span");
      mask.className = "tm-mask cu:inline-block cu:overflow-clip cu:align-top cu:py-[0.14em] cu:my-[-0.14em]";
      mask.setAttribute("aria-hidden", "true");
      for (const letter of Array.from(part)) {
        const ch = document.createElement("span");
        ch.className = "tm-ch cu:inline-block";
        ch.textContent = letter;
        mask.append(ch);
        chars.push(ch);
      }
      frag.append(mask);
    }
    node.replaceWith(frag);
  }
  return chars;
}

type Scramble = { nodes: Text[]; finals: string[]; total: number; start: number; duration: number; shuffled: number };
type Counter = { el: HTMLElement; node: Text; final: string; head: string; tail: string; target: number; commas: boolean; start: number };
type Drifter = { el: HTMLElement; frame: Element; y: number; turn: number; last: string };
type Expand = { el: HTMLElement; size: [number, number]; focus: [number, number]; radius: number; last: number };

function pair(value: string | undefined, fallback: [number, number]): [number, number] {
  const [a, b] = (value ?? "").trim().split(/\s+/).map(Number);
  const first = Number.isFinite(a) && a > 0 ? a : fallback[0];
  return [first, Number.isFinite(b) && b > 0 ? b : Number.isFinite(a) && a > 0 ? a : fallback[1]];
}

function TextMotion({ rootId }: { rootId: string }) {
  useEffect(() => {
    if (prefersReducedMotion() || typeof document.body.animate !== "function") return;
    const scope = document.getElementById(rootId);
    if (!scope) return;
    const cleanups: Array<() => void> = [];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          (entry.target as Playable).tmPlay?.();
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    scope.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      if (el.dataset.tmDone) return;
      el.dataset.tmDone = "1";
      if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", (el.textContent ?? "").replace(/\s+/g, " ").trim());
      const chars = splitLetters(el);
      const step = Math.min(CHAR_STAGGER, CHAR_SPREAD_MS / Math.max(1, chars.length));
      const animations = chars.map((ch, i) =>
        ch.animate([{ transform: "translateY(110%)" }, { transform: "none" }], { duration: CHAR_MS, delay: i * step, easing: EASE, fill: "backwards" }),
      );
      animations.forEach((a) => a.pause());
      (el as Playable).tmPlay = () => animations.forEach((a) => a.playState === "paused" && a.play());
      observer.observe(el);
      cleanups.push(() => animations.forEach((a) => a.finish()));
    });
    cleanups.push(() => observer.disconnect());

    const zones = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) (entry.target as HTMLElement).style.setProperty("--lp", entry.isIntersecting ? "running" : "paused");
      },
      { rootMargin: "80px 0px" },
    );
    const zoneEls = [scope, ...Array.from(scope.querySelectorAll<HTMLElement>("section, footer, [data-lp-zone]"))];
    zoneEls.forEach((zone) => zones.observe(zone));
    cleanups.push(() => {
      zones.disconnect();
      zoneEls.forEach((zone) => zone.style.removeProperty("--lp"));
    });

    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
    const enter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          enter.unobserve(entry.target);
          (entry.target as Playable).tmPlay?.();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const arm = (el: HTMLElement, animations: Animation[]) => {
      animations.forEach((a) => a.pause());
      (el as Playable).tmPlay = () => animations.forEach((a) => a.playState === "paused" && a.play());
      enter.observe(el);
      cleanups.push(() => animations.forEach((a) => a.finish()));
    };
    const held = (value: string | undefined) => Math.min(MAX_DELAY_MS, Number(value) || 0);
    scope.querySelectorAll<HTMLElement>("[data-zoom]").forEach((el) => {
      if (!below(el)) return;
      arm(el, [el.animate([{ opacity: 0, transform: "translateY(32px) scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: EASE, fill: "backwards" })]);
    });
    scope.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
      if (!below(el)) return;
      arm(el, [el.animate([{ opacity: 0, transform: "translateY(40px) scale(0.97)" }, { opacity: 1, transform: "none" }], { duration: 560, easing: EASE, fill: "backwards" })]);
    });
    scope.querySelectorAll<HTMLElement>("[data-stagger]").forEach((el) => {
      if (!below(el)) return;
      const items = Array.from(el.children) as HTMLElement[];
      arm(el, items.map((item, i) => item.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: stagger(i), easing: EASE, fill: "backwards" })));
    });
    const WIPES: Record<string, string> = { up: "inset(100% 0 0 0)", down: "inset(0 0 100% 0)", left: "inset(0 0 0 100%)", right: "inset(0 100% 0 0)" };
    scope.querySelectorAll<HTMLElement>("[data-wipe]").forEach((el) => {
      if (!below(el)) return;
      const delay = held(el.dataset.wipeDelay);
      const from = WIPES[el.dataset.wipe ?? ""] ?? WIPES.up;
      const animations = [el.animate([{ clipPath: from }, { clipPath: "inset(0 0 0 0)" }], { duration: 700, delay, easing: EASE, fill: "backwards" })];
      const picture = el.querySelector("img");
      if (picture) animations.push(picture.animate([{ scale: "1.08" }, { scale: "1" }], { duration: 900, delay, easing: EASE, fill: "backwards" }));
      arm(el, animations);
    });
    const FADE: Keyframe[] = [
      { opacity: 0, filter: "blur(6px)" },
      { opacity: 1, filter: "blur(0px)" },
    ];
    scope.querySelectorAll<HTMLElement>("[data-fade], [data-fade-each]").forEach((el) => {
      if (!below(el)) return;
      const delay = held(el.dataset.fade);
      const items = el.hasAttribute("data-fade-each") ? (Array.from(el.children) as HTMLElement[]) : [el];
      arm(el, items.map((item, i) => item.animate(FADE, { duration: 500, delay: delay + stagger(i), easing: EASE, fill: "backwards" })));
    });
    const deep = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          deep.unobserve(entry.target);
          (entry.target as Playable).tmPlay?.();
        }
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    cleanups.push(() => deep.disconnect());
    scope.querySelectorAll<HTMLElement>("[data-depth-cards]").forEach((el) => {
      if (!below(el)) return;
      const animations = (Array.from(el.children) as HTMLElement[]).map((card, i) => {
          const depth = DECK_DEPTH[i % DECK_DEPTH.length];
          return card.animate(
            [
              {
                translate: `${((i % 2 ? 1 : -1) * 18 * depth).toFixed(1)}px ${(-24 + 64 * depth).toFixed(1)}px`,
                scale: String(1 - 0.12 * depth),
                rotate: `${DECK_TURN[i % DECK_TURN.length]}deg`,
                opacity: 1 - 0.6 * depth,
              },
              { translate: "0 0", scale: "1", rotate: "0deg", opacity: 1 },
            ],
            { duration: 560, delay: stagger(i), easing: EASE, fill: "backwards" },
          );
        });
      animations.forEach((animation) => animation.pause());
      (el as Playable).tmPlay = () => animations.forEach((animation) => animation.playState === "paused" && animation.play());
      deep.observe(el);
      cleanups.push(() => animations.forEach((animation) => animation.cancel()));
    });
    cleanups.push(() => enter.disconnect());

    let frame = 0;
    let dirty = true;
    const request = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const scrambles: Scramble[] = [];
    scope.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
      if (!below(el)) return;
      const nodes = textNodes(el).filter((node) => (node.nodeValue ?? "").trim());
      if (!nodes.length) return;
      const finals = nodes.map((node) => node.nodeValue ?? "");
      const total = finals.reduce((sum, text) => sum + text.length, 0);
      (el as Playable).tmPlay = () => {
        scrambles.push({ nodes, finals, total, start: performance.now(), duration: Math.min(600, 300 + total * 10), shuffled: 0 });
        request();
      };
      enter.observe(el);
      cleanups.push(() => nodes.forEach((node, i) => (node.nodeValue = finals[i])));
    });
    const runScrambles = (now: number) => {
      for (let s = scrambles.length - 1; s >= 0; s--) {
        const job = scrambles[s];
        const progress = (now - job.start) / job.duration;
        if (progress >= 1) {
          job.nodes.forEach((node, i) => (node.nodeValue = job.finals[i]));
          scrambles.splice(s, 1);
          continue;
        }
        if (now - job.shuffled < SHUFFLE_MS) continue;
        job.shuffled = now;
        let k = 0;
        job.nodes.forEach((node, i) => {
          let out = "";
          for (const char of job.finals[i]) {
            const settled = progress >= 0.2 + 0.8 * (k++ / job.total);
            if (settled || !/[a-z0-9]/i.test(char)) out += char;
            else {
              const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              out += char === char.toLowerCase() && char !== char.toUpperCase() ? glyph.toLowerCase() : glyph;
            }
          }
          node.nodeValue = out;
        });
      }
      return scrambles.length > 0;
    };

    const pending: Counter[] = [];
    const counting: Counter[] = [];
    scope.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const node = textNodes(el).find((n) => /\d/.test(n.nodeValue ?? ""));
      if (!node) return;
      const final = node.nodeValue ?? "";
      const match = final.match(/\d[\d,]*/);
      if (!match || match.index === undefined) return;
      const target = Number(match[0].replace(/,/g, ""));
      if (!target) return;
      pending.push({ el, node, final, head: final.slice(0, match.index), tail: final.slice(match.index + match[0].length), target, commas: match[0].includes(","), start: 0 });
    });
    cleanups.push(() =>
      counting.splice(0).forEach((c) => {
        c.node.nodeValue = c.final;
        c.el.style.removeProperty("display");
        c.el.style.removeProperty("min-width");
      }),
    );
    let poll = 0;
    const checkCounters = () => {
      const vh = window.innerHeight;
      let waiting = false;
      for (let i = pending.length - 1; i >= 0; i--) {
        const c = pending[i];
        const box = c.el.getBoundingClientRect();
        if (box.top > vh * 0.9 || box.bottom < 0) continue;
        const seen = typeof c.el.checkVisibility === "function" ? c.el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true;
        if (!seen) {
          waiting = true;
          continue;
        }
        pending.splice(i, 1);
        if (getComputedStyle(c.el).display === "inline") c.el.style.display = "inline-block";
        c.el.style.minWidth = `${c.el.offsetWidth}px`;
        c.start = performance.now();
        counting.push(c);
      }
      if (waiting && !poll) {
        poll = window.setTimeout(() => {
          poll = 0;
          checkCounters();
          if (counting.length) request();
        }, COUNT_POLL_MS);
      }
    };
    cleanups.push(() => window.clearTimeout(poll));
    const runCounters = (now: number) => {
      for (let i = counting.length - 1; i >= 0; i--) {
        const c = counting[i];
        const t = clamp01((now - c.start) / COUNT_MS);
        if (t >= 1) {
          c.node.nodeValue = c.final;
          c.el.style.removeProperty("display");
          c.el.style.removeProperty("min-width");
          counting.splice(i, 1);
          continue;
        }
        const n = Math.round(c.target * (1 - Math.pow(1 - t, 4)));
        c.node.nodeValue = c.head + (c.commas ? n.toLocaleString("en-US") : String(n)) + c.tail;
      }
      return counting.length > 0;
    };

    const pictures = Array.from(scope.querySelectorAll<HTMLElement>("[data-par]"), (el) => ({ el, amount: Number(el.dataset.par) || 6 }));
    const drifters: Drifter[] = Array.from(scope.querySelectorAll<HTMLElement>("[data-drift], [data-turn]"), (el) => ({
      el,
      frame: el.closest("[data-drift-frame]") ?? el.parentElement?.closest("section, footer") ?? el.parentElement ?? el,
      y: Number(el.dataset.drift) || 0,
      turn: Number(el.dataset.turn) || 0,
      last: "",
    }));
    const curtains = Array.from(scope.querySelectorAll<HTMLElement>("[data-curtain]"));
    const expands: Expand[] = Array.from(scope.querySelectorAll<HTMLElement>("[data-expand]"), (el) => ({
      el,
      size: pair(el.dataset.expand, [0.4, 0.45]),
      focus: pair(el.dataset.expandFocus, [0.5, 0.5]),
      radius: Number(el.dataset.expandRadius) || 28,
      last: -1,
    }));
    const marquees = Array.from(scope.querySelectorAll<HTMLElement>("[data-marquee]"), (el) => ({
      el,
      track: el.querySelector<HTMLElement>("[data-marquee-track]") ?? el,
      travel: Number(el.dataset.marquee) || -480,
    }));
    const viewportBlur = scope.querySelector<HTMLElement>("[data-gb-viewport]");

    const scrollUpdate = () => {
      const vh = window.innerHeight;
      for (const { el, amount } of pictures) {
        const frameBox = (el.parentElement ?? el).getBoundingClientRect();
        if (frameBox.bottom < 0 || frameBox.top > vh) continue;
        const progress = clamp01((vh - frameBox.top) / (vh + frameBox.height));
        el.style.transform = `translateY(${(-amount + 2 * amount * progress).toFixed(2)}%)`;
      }
      for (const d of drifters) {
        const box = d.frame.getBoundingClientRect();
        const progress = clamp01((vh - box.top) / (vh + box.height)) - 0.5;
        const value = `translate3d(0, ${(d.y * progress).toFixed(1)}px, 0)${d.turn ? ` rotate(${(d.turn * progress).toFixed(2)}deg)` : ""}`;
        if (value === d.last) continue;
        d.last = value;
        d.el.style.transform = value;
      }
      for (const el of curtains) {
        const top = el.getBoundingClientRect().top;
        const progress = clamp01((vh - top) / (vh * 0.6));
        if (progress >= 1) {
          el.style.clipPath = "";
        } else {
          const inset = (1 - progress) * 4;
          const radius = (1 - progress) * 40;
          el.style.clipPath = `inset(0 ${inset.toFixed(2)}% round ${radius.toFixed(1)}px)`;
        }
      }
      for (const x of expands) {
        const box = x.el.getBoundingClientRect();
        const centre = box.top + x.focus[1] * box.height;
        const start = vh - (x.size[1] / 2) * box.height;
        const p = clamp01((start - centre) / Math.max(1, start - vh * 0.5));
        const step = Math.round(p * 1000);
        if (step === x.last) continue;
        x.last = step;
        if (p >= 1) {
          x.el.style.clipPath = "";
          continue;
        }
        const e = 1 - p * p * (3 - 2 * p);
        const [w, h] = x.size;
        const [fx, fy] = x.focus;
        const left = Math.max(0, fx - w / 2) * 100 * e;
        const right = Math.max(0, 1 - fx - w / 2) * 100 * e;
        const top = Math.max(0, fy - h / 2) * 100 * e;
        const bottom = Math.max(0, 1 - fy - h / 2) * 100 * e;
        x.el.style.clipPath = `inset(${top.toFixed(2)}% ${right.toFixed(2)}% ${bottom.toFixed(2)}% ${left.toFixed(2)}% round ${(x.radius * e).toFixed(1)}px)`;
      }
      for (const m of marquees) {
        const box = m.el.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) continue;
        const progress = clamp01((vh - box.top) / (vh + box.height));
        m.track.style.transform = `translate3d(${(m.travel * progress).toFixed(1)}px, 0, 0)`;
      }
      if (viewportBlur) {
        const end = document.documentElement.getBoundingClientRect().bottom - vh;
        viewportBlur.toggleAttribute("data-on", window.scrollY > vh * 0.5 && end > vh * 0.25);
      }
      checkCounters();
    };

    function tick(now: number) {
      frame = 0;
      if (dirty) {
        dirty = false;
        scrollUpdate();
      }
      const counts = runCounters(now);
      const shuffles = runScrambles(now);
      if (counts || shuffles) request();
    }
    const onScroll = () => {
      dirty = true;
      request();
    };
    request();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      drifters.forEach(({ el }) => (el.style.transform = ""));
      expands.forEach(({ el }) => (el.style.clipPath = ""));
      marquees.forEach((m) => (m.track.style.transform = ""));
      viewportBlur?.removeAttribute("data-on");
    });

    return () => cleanups.forEach((fn) => fn());
  }, [rootId]);

  return null;
}

const AUTOPLAY_MS = 4500;

function EducatorFlow({ educators }: { educators: Educator[] }) {
  const [phoneWidth, setPhoneWidth] = useState(0);
  const phone = phoneWidth > 0;
  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => setPhoneWidth(query.matches ? document.documentElement.clientWidth : 0);
    sync();
    query.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);
  return (
    <CircularCarousel
      items={educators}
      label="Our educators"
      itemName="educator"
      slideTitle={(educator) => `${educator.name}, ${educator.focus}`}
      image={(educator) => educator.photo}
      href={(educator) => educator.profile}
      renderSlide={(educator) => <FacultyCardText educator={educator} />}
      cardLabel={facultyCardLabel}
      cardDetail={(educator) => <FacultyCardDetails educator={educator} />}
      {...facultyCardSize(phoneWidth)}
      gap={phone ? 12 : 24}
      interval={AUTOPLAY_MS}
      fadeColor="#fff8ec"
      backColor="#ead9c2"
      tone="light"
      spacing={20}
      arrowReach={phone ? 470 : 580}
    />
  );
}

export default function Faculties() {
  const { heading, lead } = facultyIntro;
  return (
    <SectionWrapper id="educators" labelledBy="educators-h" compact className="cu:isolate cu:overflow-clip cu:text-[#2a1a12] cu:leading-[1.45]">
      <TextMotion rootId="educators" />
      <div className="cu:flex cu:flex-col cu:items-center cu:w-full cu:text-center cu:[&_.h2]:mx-auto cu:[&_.h2]:text-center cu:[&_.intro]:mx-auto cu:[&_.intro]:text-center cu:[&_.intro]:[text-wrap:balance]">
        <SectionLabel>Faculty</SectionLabel>
        <h2 id="educators-h" className="h2 h2--sec rv" style={{ "--d": ".12s" } as CSSProperties}>
          {heading.lead} {heading.emphasis}
        </h2>
        <p className="intro rv" style={{ "--d": ".2s" } as CSSProperties}>{lead}</p>
      </div>
      <div className="cu:mt-(--hd-in) cu:-mx-[calc(var(--px)-12px)]">
        <div data-rise>
          <EducatorFlow educators={educators} />
        </div>
      </div>
    </SectionWrapper>
  );
}
