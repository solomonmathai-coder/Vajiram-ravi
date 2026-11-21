"use client";

import { useEffect, useRef, useState } from "react";
import Cta from "@/components/ui/Cta";
import { aboutIntro, institutionCards, whyChapters } from "@/data/about";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * The scroll, in vh after the section pins (design S's story.js, without its opening scene): chapter k
 * (from the second) swings in over STEP vh, each DUR vh long; the scene holds a little at the end.
 */
const N = institutionCards.length;
const STEP = 85;
const DUR = 80;
const RUN = (N - 1) * STEP + 30;
/** How closely the drawing follows the scroll: an exponential ease of this time constant, s (design S's). */
const TAU = 0.12;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (u: number, a: number, b: number) => clamp((u - a) / (b - a));
/** Design S's in-out curve: the mean of a quadratic and a cubic ease. */
const io = (t: number) => ((t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) + (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)) / 2;

/**
 * Why Vajiram & Ravi (homepage v2, IA 6), in design S's style and with its scroll (the client: "the exact
 * scroll animation style… of how each point will come", not the section's opening). On the orange ground
 * with design S's jaali, the heading and the lead, then the six points as chapters, one screen wide: the
 * photograph on the left (design S's), and on the right the number out of six, the title, the sentence and
 * a button on to the part of the page it speaks of. The section pins while it is read; as the page scrolls
 * the next chapter swings in about its bottom left corner from 30°, the row sliding a screen to make room,
 * and its photograph settles from a slight zoom. What is drawn trails the scroll on a short ease. A link
 * focused in a chapter brings that chapter to rest.
 *
 * Reduced motion: no pinning; the six chapters simply stand one under another.
 */
export default function About() {
  const { heading, lead } = aboutIntro;
  const outerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    setRun(true);
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!run || !outer || !track) return;
    const panels = Array.from(track.children) as HTMLElement[];
    let smooth: number | null = null;
    let frame = 0;
    let last = 0;
    const aim = () => clamp((-outer.getBoundingClientRect().top / window.innerHeight) * 100, 0, RUN);
    const draw = (u: number) => {
      let shift = 0;
      panels.forEach((panel, k) => {
        if (!k) return;
        const e = io(seg(u, (k - 1) * STEP, (k - 1) * STEP + DUR));
        shift += e;
        const r = 30 * (1 - e);
        panel.style.rotate = r > 0.01 ? `${r.toFixed(3)}deg` : "";
        panel.style.setProperty("--e", e.toFixed(4));
      });
      track.style.translate = `${((-shift / N) * 100).toFixed(4)}% 0`;
    };
    const tick = (now: number) => {
      frame = 0;
      const want = aim();
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      smooth = smooth === null ? want : smooth + (want - smooth) * (1 - Math.exp(-dt / TAU));
      draw(smooth);
      if (Math.abs(want - smooth) > 0.02) frame = requestAnimationFrame(tick);
      else {
        smooth = want;
        draw(smooth);
        last = 0;
      }
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    queue();
    return () => {
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      cancelAnimationFrame(frame);
      track.style.translate = "";
      panels.forEach((panel) => {
        panel.style.rotate = "";
        panel.style.removeProperty("--e");
      });
    };
  }, [run]);

  // A link focused in a chapter brings that chapter to rest.
  const bring = (k: number) => {
    const outer = outerRef.current;
    if (!run || !outer) return;
    const u = k ? (k - 1) * STEP + DUR : 0;
    const y = outer.getBoundingClientRect().top + window.scrollY + (u / 100) * window.innerHeight;
    window.scrollTo({ top: y, behavior: "instant" });
  };

  return (
    <section
      ref={outerRef}
      id="about"
      aria-labelledby="about-h"
      className="relative text-white"
      style={{
        height: run ? `calc(${(RUN + 100) / 100} * 100svh / var(--canvas-zoom, 1))` : undefined,
        background:
          "url(/images/ornaments/bg-jaali.svg) 0 0 / 36px 36px repeat, radial-gradient(70% 60% at 50% 40%, #e85020 0%, #c2410c 58%, #a8380a 100%)",
      }}
    >
      {/* Pinned, the heading and the chapters sit together in the middle of the screen below the header. */}
      <div className={cx("overflow-clip", run && "sticky top-0 flex h-[calc(100svh/var(--canvas-zoom,1))] flex-col justify-center pt-20")}>
        <div className={cx("mx-auto flex w-canvas flex-col items-center px-20 text-center", !run && "pt-20")}>
          <h2 id="about-h" className="font-heading text-[44px]/[1.1] font-semibold tracking-[-0.02em] text-white">
            {heading.lead} <span className="block">{heading.emphasis}</span>
          </h2>
          <p className="mt-2 w-[720px] text-[16px]/[1.5] text-white/85">{lead}</p>
        </div>

        <div className={cx("relative w-full", run ? "mt-14" : "mt-12 pb-20")}>
          <ol
            ref={trackRef}
            className={cx(run ? "flex w-max will-change-[translate]" : "flex flex-col gap-16")}
          >
            {institutionCards.map((card, k) => {
              const chapter = whyChapters[card.icon];
              return (
                <li
                  key={card.title}
                  onFocus={() => bring(k)}
                  className="w-[max(calc(100vw/var(--canvas-zoom,1)),1440px)] shrink-0 origin-bottom-left"
                >
                  <div className="mx-auto grid w-canvas grid-cols-[560px_480px] items-center justify-center gap-16 px-20">
                    <div className="relative h-[340px] overflow-clip rounded-[14px] bg-[#7a2a08] shadow-[0_30px_60px_-30px_rgb(40_10_2/0.7)]">
                      <img
                        src={chapter.photo}
                        alt=""
                        width={chapter.width}
                        height={chapter.height}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-cover"
                        // Settles from a slight zoom as its chapter lands (--e, set on the scroll).
                        style={{ scale: "calc(1 + (1 - var(--e, 1)) * 0.08)" }}
                      />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <p className="flex items-baseline gap-1 font-heading text-white">
                        <span className="text-[56px]/[1] font-light">{card.number}</span>
                        <span className="text-[18px]/[1] text-white/70">/{String(N).padStart(2, "0")}</span>
                      </p>
                      <h3 className="mt-3 font-heading text-[34px]/[1.15] font-semibold tracking-[-0.01em]">{card.title}</h3>
                      <span aria-hidden="true" className="mt-4 h-px w-full bg-white/30" />
                      <p className="mt-4 text-[18px]/[1.55] text-white/88">{card.text}</p>
                      <div className="mt-7">
                        <Cta variant="ink" size="md" href={chapter.cta.href}>
                          {chapter.cta.label}
                        </Cta>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
