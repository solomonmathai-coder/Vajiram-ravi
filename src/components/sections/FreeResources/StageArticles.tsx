"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowPill, KnobArrow } from "@/components/ui/Pill";
import type { StudyStage } from "@/data/study-materials";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";

const EASE = "cubic-bezier(.2,.8,.2,1)";
/** The dark thumb's slide between tabs. */
const THUMB_MS = 350;

const number = (index: number) => String(index + 1).padStart(2, "0");

type StageArticlesProps = {
  stages: StudyStage[];
  initialStage: StudyStage["id"];
  /** The section heading, shown left of the tabs. */
  heading: ReactNode;
};

/**
 * Prelims / Mains / Quest tabs over the current affairs articles. A dark thumb slides to the chosen
 * tab and the articles cross-fade; all three stages stay in the page, stacked, so switching never
 * changes the section's height.
 */
export default function StageArticles({ stages, initialStage, heading }: StageArticlesProps) {
  const [activeId, setActiveId] = useState(initialStage);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const thumbRefs = useRef<Array<HTMLSpanElement | null>>([]);
  // Where the thumb was before the switch, so the new one can slide over from there.
  const lastThumb = useRef<{ left: number; width: number } | null>(null);
  const activeIndex = Math.max(
    0,
    stages.findIndex((stage) => stage.id === activeId),
  );

  const select = (index: number) => {
    if (index === activeIndex) return;
    const tab = tabRefs.current[activeIndex];
    lastThumb.current = tab ? { left: tab.offsetLeft, width: tab.offsetWidth } : null;
    setActiveId(stages[index].id);
  };

  useEffect(() => {
    const from = lastThumb.current;
    const tab = tabRefs.current[activeIndex];
    const thumb = thumbRefs.current[activeIndex];
    lastThumb.current = null;
    if (!from || !tab || !thumb || prefersReducedMotion()) return;
    thumb.animate(
      [
        { transform: `translateX(${from.left - tab.offsetLeft}px)`, width: `${from.width}px` },
        { transform: "translateX(0)", width: `${tab.offsetWidth}px` },
      ],
      { duration: THUMB_MS, easing: EASE },
    );
  }, [activeIndex]);

  // Arrow keys, Home and End move between the tabs, as in any tab list.
  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: stages.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const index = mod(keys[event.key], stages.length);
    select(index);
    tabRefs.current[index]?.focus();
  };

  return (
    <>
      <div data-reveal className="flex w-full items-end justify-between">
        {heading}
        <div
          role="tablist"
          aria-label="Exam stage"
          onKeyDown={onTabKeyDown}
          className="flex shrink-0 items-start gap-0.5 rounded-full border border-sand-line bg-sand p-1"
        >
          {stages.map((stage, i) => {
            const selected = i === activeIndex;
            return (
              <button
                key={stage.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`fr-tab-${stage.id}`}
                aria-selected={selected}
                aria-controls={`fr-panel-${stage.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={cx(
                  "relative flex items-center rounded-full px-5 py-2.5 text-[14px]/[1.2] font-medium whitespace-nowrap transition-colors duration-300",
                  selected ? "text-paper" : "text-stone hover:text-char",
                )}
              >
                <span
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className={cx("absolute inset-y-0 left-0 w-full rounded-full bg-char", !selected && "opacity-0")}
                />
                <span className="relative">{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div data-reveal className="grid w-full">
        {stages.map((stage, i) => (
          <ArticlePanel key={stage.id} stage={stage} active={i === activeIndex} />
        ))}
      </div>
    </>
  );
}

/** One stage's articles: the featured card, and the numbered list that previews into it on hover. */
function ArticlePanel({ stage, active }: { stage: StudyStage; active: boolean }) {
  // The article the featured card shows: the first one, or the list row being pointed at.
  const [preview, setPreview] = useState(0);
  const featured = stage.articles[preview];

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPreview(0);
  };

  return (
    <div
      role="tabpanel"
      id={`fr-panel-${stage.id}`}
      aria-labelledby={`fr-tab-${stage.id}`}
      inert={!active}
      onPointerLeave={() => setPreview(0)}
      onBlur={onBlur}
      className={cx(
        "col-start-1 row-start-1 flex w-full items-start gap-8 [transition:opacity_.2s_ease,visibility_.2s]",
        !active && "invisible opacity-0",
      )}
    >
      <a
        href={featured.href}
        className="group/knob relative h-[408px] w-[520px] shrink-0 overflow-clip rounded-[28px] bg-char"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[130px] left-[50px] h-[640px] w-[760px] bg-[radial-gradient(closest-side,rgb(238_106_18/.56),rgb(238_106_18/.5)_27%,rgb(238_106_18/.3)_51%,rgb(238_106_18/.1)_75%,transparent)]"
        />
        {/* Every article's text is stacked here; the previewed one fades in over the last. */}
        {stage.articles.map((article, i) => (
          <span
            key={article.title}
            aria-hidden={i !== preview || undefined}
            className={cx(
              "absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
              i !== preview && "opacity-0",
            )}
          >
            <span className="absolute top-8 left-8 flex items-center rounded-full border border-paper/14 bg-paper/8 px-3.5 py-2 text-[12px]/[1.2] font-medium whitespace-nowrap text-cream">
              {`${stage.label} · ${number(i)}`}
            </span>
            <span className="absolute top-24 left-8 w-[440px] text-[34px]/[1.12] font-medium tracking-[-0.85px] text-cream">
              {article.title}
            </span>
          </span>
        ))}
        <span className="absolute top-[324px] left-[436px] flex size-[52px] items-center justify-center rounded-full bg-paper text-char transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/knob:scale-108">
          <KnobArrow />
        </span>
      </a>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        {stage.articles.slice(1).map((article, offset) => {
          const i = offset + 1;
          return (
            <a
              key={article.title}
              href={article.href}
              onPointerEnter={() => setPreview(i)}
              onFocus={() => setPreview(i)}
              className="group/row flex w-full items-center gap-5 rounded-2xl border-b border-sand-line px-4 py-[11px] transition-[background-color,border-color] duration-200 ease-[cubic-bezier(.2,.8,.2,1)] hover:border-transparent hover:bg-sand focus-visible:border-transparent focus-visible:bg-sand"
            >
              <span className="text-[36px]/none font-light tracking-[-1.08px] whitespace-nowrap text-char/28 transition-colors duration-200 group-hover/row:text-orange group-focus-visible/row:text-orange">
                {number(i)}
              </span>
              <span className="min-w-0 flex-1 text-[18px]/[1.35] font-medium tracking-[-0.144px] text-char transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/row:translate-x-1.5 group-focus-visible/row:translate-x-1.5">
                {article.title}
              </span>
              {/* The outlined ↗ turns into a filled →. */}
              <span className="relative size-10 shrink-0 rounded-full border border-sand-line text-[15px]/none font-medium text-char transition-colors duration-200 group-hover/row:border-char group-hover/row:bg-char group-hover/row:text-paper group-focus-visible/row:border-char group-focus-visible/row:bg-char group-focus-visible/row:text-paper">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center transition-[opacity,rotate] duration-200 group-hover/row:rotate-45 group-hover/row:opacity-0 group-focus-visible/row:rotate-45 group-focus-visible/row:opacity-0"
                >
                  ↗
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex -rotate-45 items-center justify-center opacity-0 transition-[opacity,rotate] duration-200 group-hover/row:rotate-0 group-hover/row:opacity-100 group-focus-visible/row:rotate-0 group-focus-visible/row:opacity-100"
                >
                  →
                </span>
              </span>
            </a>
          );
        })}
        <div className="flex items-start px-4 pt-2">
          <ArrowPill href={stage.moreHref} surface="outline-light" knob="char">
            View more
          </ArrowPill>
        </div>
      </div>
    </div>
  );
}
