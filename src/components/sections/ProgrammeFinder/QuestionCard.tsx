"use client";

import { useEffect, useRef } from "react";
import { ArrowPill } from "@/components/ui/Pill";
import type { Answers, FinderStep } from "@/data/finder";
import { cx } from "@/lib/cx";

type QuestionCardProps = {
  steps: FinderStep[];
  step: number;
  answers: Answers;
  complete: boolean;
  /** Shown when Next is pressed before an option is chosen. */
  showHint: boolean;
  onSelect: (optionId: string) => void;
  onPrimary: () => void;
  onBack: () => void;
};

const EASE = "ease-[cubic-bezier(.2,.8,.2,1)]";
/** Each question is 522px wide; the gap keeps the next one out of view until it slides in. */
const PANEL_STEP = 522 + 64;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One question at a time. The questions sit side by side on a track that slides horizontally (240ms)
 * from step to step. Options are radio tiles; the chosen one turns dark with an orange check.
 */
export default function QuestionCard({ steps, step, answers, complete, showHint, onSelect, onPrimary, onBack }: QuestionCardProps) {
  const headings = useRef<Array<HTMLHeadingElement | null>>([]);
  const shownStep = useRef(step);

  // Moving between steps takes focus to the new question, so keyboard and screen reader users follow along.
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    headings.current[step]?.focus({ preventScroll: true });
  }, [step]);

  const current = steps[step];
  const answered = answers[current.id] !== undefined;
  const last = step === steps.length - 1;
  const primaryLabel = complete ? "Start over" : last ? "See my match" : "Next";

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col justify-between overflow-clip rounded-[28px] border border-sand-line bg-shell p-8">
      <img
        src="/images/programme-finder/glow-question.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[179px] left-[139px] h-[580px] w-[680px] max-w-none"
      />

      <div className="relative flex flex-col items-start gap-4">
        <span className="rounded-full border border-sand-line bg-sand px-3 py-1.5 text-[12px]/[1.2] font-medium whitespace-nowrap text-stone">
          Step {step + 1} of {steps.length}
        </span>
        <div className={cx("flex gap-16 transition-transform duration-[240ms]", EASE)} style={{ transform: `translateX(${-step * PANEL_STEP}px)` }}>
          {steps.map((item, i) => (
            <div key={item.id} className="flex w-[522px] shrink-0 flex-col gap-4" inert={i !== step}>
              <h3
                ref={(el) => {
                  headings.current[i] = el;
                }}
                id={`finder-q-${item.id}`}
                tabIndex={-1}
                className="text-[30px]/[1.15] font-medium tracking-[-0.75px] text-char outline-none"
              >
                {item.question}
              </h3>
              <div role="radiogroup" aria-labelledby={`finder-q-${item.id}`} className="flex flex-wrap gap-3">
                {item.options.map((option, n) => {
                  const selected = answers[item.id] === option.id;
                  return (
                    <label
                      key={option.id}
                      className={cx(
                        "relative flex h-[150px] w-[248px] cursor-pointer flex-col justify-end gap-1.5 rounded-[18px] border p-[18px] transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange",
                        selected ? "border-char bg-char" : "border-sand-line bg-sand hover:border-[#d3cbc1]",
                      )}
                    >
                      <input
                        type="radio"
                        name={`finder-${item.id}`}
                        value={option.id}
                        checked={selected}
                        onChange={() => onSelect(option.id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute top-[15px] left-[17px] text-[12px]/[1.5] font-medium transition-colors duration-300",
                          selected ? "text-tangerine" : "text-[#8f867f]",
                        )}
                      >
                        {pad(n + 1)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute top-[13px] left-[207px] flex size-[26px] items-center justify-center rounded-full bg-orange text-[13px]/none font-semibold text-paper transition-[opacity,scale] duration-300",
                          EASE,
                          selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                        )}
                      >
                        ✓
                      </span>
                      <span
                        className={cx(
                          "text-[17px]/[1.25] font-medium tracking-[-0.17px] transition-colors duration-300",
                          selected ? "text-paper" : "text-char",
                        )}
                      >
                        {option.title}
                      </span>
                      <span className={cx("text-[13px]/[1.5] transition-colors duration-300", selected ? "text-cream/75" : "text-stone")}>
                        {option.description}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col gap-4">
        {/* Steps reached so far. */}
        <div className="flex gap-1.5" aria-hidden="true">
          {steps.map((item, i) => (
            <span key={item.id} className="relative h-[3px] flex-1 overflow-hidden rounded-[9px] bg-sand-line">
              <span
                className={cx(
                  "absolute inset-0 origin-left bg-orange transition-transform duration-500",
                  EASE,
                  i <= step ? "scale-x-100" : "scale-x-0",
                )}
              />
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={onBack}
              className="group/back flex cursor-pointer items-center gap-1.5 text-[14px]/[1.5] font-medium text-stone transition-colors hover:text-char"
            >
              <span aria-hidden="true" className={cx("transition-transform duration-500 group-hover/back:-translate-x-1", EASE)}>
                ←
              </span>
              Back
            </button>
          ) : (
            <span aria-hidden="true" className="text-[14px]/[1.5]">
              {"​"}
            </span>
          )}
          <div className="flex items-center gap-4">
            <p aria-live="polite" className="text-[13px]/[1.5] text-stone">
              {showHint && !answered ? "Choose an option to continue" : ""}
            </p>
            <ArrowPill
              surface="char"
              knob="orange"
              glyph={complete ? "↺" : "→"}
              onClick={onPrimary}
              className={cx(!answered && !complete && "opacity-50")}
            >
              {primaryLabel}
            </ArrowPill>
          </div>
        </div>
      </div>
    </div>
  );
}
