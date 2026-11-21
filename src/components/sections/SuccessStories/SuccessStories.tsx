"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import IndianLink from "@/components/ui/IndianLink";
import { stories, storiesIntro, type Story } from "@/data/stories";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import "./running.css";

/** Each card's tilt and drop, in turn (design S's). */
const LAY = [
  [-3.2, 12],
  [1.8, -14],
  [-1.5, 6],
  [2.6, -6],
] as const;

/**
 * The testimonials (homepage v2, IA 4): the students' words running across the page on paper cards,
 * after design S's running testimonials (the client's choice): tilted, overlapping cards in one seamless
 * loop that the pointer holds; the card under it straightens and lifts while the rest blur back, and it
 * tilts a little towards the pointer. The cards are dealt onto the table as the section comes in. The
 * heading and the words are this site's (data/stories). The look is ./running.css.
 *
 * Assistive technology reads the first set of cards; the second, there only to close the loop, is hidden
 * from it and from the keyboard. Reduced motion: the strip stands still and scrolls sideways.
 */
export default function SuccessStories() {
  const { heading, cta } = storiesIntro;
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"rest" | "wait" | "in">("rest");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    setState("wait");
    return whenVisible(el, 0.25, () => setState("in"));
  }, []);

  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const card = (event.target as Element).closest<HTMLElement>(".run-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--tx", ((event.clientX - r.left) / r.width - 0.5).toFixed(3));
    card.style.setProperty("--ty", ((event.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const untilt = (event: PointerEvent<HTMLElement>) => {
    const card = (event.target as Element).closest<HTMLElement>(".run-card");
    if (card && !card.contains(event.relatedTarget as Node | null)) {
      card.style.setProperty("--tx", "0");
      card.style.setProperty("--ty", "0");
    }
  };

  return (
    <section ref={ref} id="stories" aria-labelledby="stories-h" className={`relative overflow-clip bg-cream ${state === "rest" ? "" : `run-${state}`}`}>
      <div className="mx-auto flex w-canvas flex-col items-center px-20 pt-20">
        <h2 id="stories-h" data-split className="w-[760px] text-center font-heading text-[52px]/[1.08] font-semibold tracking-[-0.02em] text-ink">
          {heading.lead}{" "}
          <em data-reveal-em className="text-orange not-italic">
            {heading.emphasis}
          </em>{" "}
          {heading.after}
        </h2>
        {cta.href !== null && (
          <span className="mt-5">
            <IndianLink tone="light" href={cta.href}>
              {cta.label}
            </IndianLink>
          </span>
        )}
      </div>
      <div className="run-strip" onPointerMove={tilt} onPointerOut={untilt}>
        <ul className="run-track" style={{ ["--dur" as string]: `${((stories.length * 380) / 48).toFixed(1)}s` }}>
          {[false, true].flatMap((copy) => stories.map((story, i) => <Card key={`${copy}-${story.name}`} story={story} i={i} copy={copy} />))}
        </ul>
      </div>
    </section>
  );
}

function Card({ story, i, copy }: { story: Story; i: number; copy: boolean }) {
  const [t, y] = LAY[i % LAY.length];
  return (
    <li
      aria-hidden={copy || undefined}
      inert={copy || undefined}
      className="run-card"
      style={{ ["--t" as string]: `${t}deg`, ["--y" as string]: `${y}px`, ["--z" as string]: (i % 9) + 1, ["--n" as string]: i, ["--from-r" as string]: `${i % 2 ? -9 : 9}deg` }}
    >
      <figure tabIndex={copy ? -1 : 0} className="run-paper block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burnt">
        <p aria-hidden="true" className="absolute top-4 left-7 text-[12px]/[1] font-semibold tracking-[0.3em] text-[#1b2a52]/50">TESTIMONIAL</p>
        <blockquote className="absolute top-10 right-7 bottom-[84px] left-7 overflow-hidden font-heading text-[18px]/[25px] text-[#1b2a52] text-pretty">
          <img className="run-photo" src={story.image} alt="" loading="lazy" decoding="async" />
          {story.quote}
        </blockquote>
        <figcaption className="absolute right-7 bottom-5 left-7 grid border-t border-[#1b2a52]/25 pt-2">
          <b className="font-heading text-[20px]/[24px] font-semibold text-[#1b2a52]">{story.name}</b>
          <span className="text-[14px]/[20px] text-[#1b2a52]/75">
            AIR {story.rank}, UPSC {story.exam} {story.year}
          </span>
        </figcaption>
      </figure>
    </li>
  );
}
