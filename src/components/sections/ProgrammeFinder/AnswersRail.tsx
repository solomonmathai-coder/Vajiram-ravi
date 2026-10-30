import Photo from "@/components/ui/Photo";
import { finderIntro, type Answers, type FinderStep } from "@/data/finder";
import { cx } from "@/lib/cx";
import Roll from "./Roll";

type AnswersRailProps = {
  steps: FinderStep[];
  answers: Answers;
  step: number;
  complete: boolean;
};

const EASE = "duration-500 ease-[cubic-bezier(.2,.8,.2,1)]";
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The "Your answers" rail: the three steps as a vertical timeline. A step fills in once it is confirmed:
 * its marker turns to a ✓, the chosen answer replaces the hint, and the connector below it runs orange.
 */
export default function AnswersRail({ steps, answers, step, complete }: AnswersRailProps) {
  return (
    <div className="relative flex h-full w-[300px] shrink-0 flex-col justify-between overflow-clip rounded-[28px] border border-sand-line bg-shell p-7">
      <img
        src="/images/programme-finder/glow-answers.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[-171px] left-[29px] h-[380px] w-[440px] max-w-none"
      />

      <div className="relative">
        <p className="text-[13px]/[1.5] font-medium text-[#8f867f]">Your answers</p>
        <ol className="mt-5 flex flex-col">
          {steps.map((item, i) => {
            const state = complete || i < step ? "done" : i === step ? "current" : "pending";
            const chosen = item.options.find((o) => o.id === answers[item.id]);
            return (
              <li key={item.id} className="flex items-start gap-4" aria-current={state === "current" ? "step" : undefined}>
                <div className="flex flex-col items-center">
                  <span
                    className={cx(
                      "flex size-9 items-center justify-center rounded-full border font-medium transition-colors",
                      EASE,
                      state === "current" && "border-orange bg-orange text-paper",
                      state === "done" && "border-orange bg-orange/10 text-orange",
                      state === "pending" && "border-sand-line text-[#8f867f]",
                    )}
                  >
                    {state === "done" ? (
                      <span className="text-[13px]/none font-semibold">
                        <span aria-hidden="true">✓</span>
                        <span className="sr-only">Done:</span>
                      </span>
                    ) : (
                      <span className="text-[12px]/none">{pad(i + 1)}</span>
                    )}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="relative h-[52px] w-0.5 overflow-hidden bg-sand-line" aria-hidden="true">
                      <span
                        className={cx(
                          "absolute inset-0 origin-top bg-orange transition-transform",
                          EASE,
                          state === "done" ? "scale-y-100" : "scale-y-0",
                        )}
                      />
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px] pt-1.5 leading-[1.5]">
                  <span className={cx("text-[16px] font-medium transition-colors", EASE, state === "pending" ? "text-char/55" : "text-char")}>
                    {item.label}
                  </span>
                  <Roll
                    text={state === "done" && chosen ? chosen.title : item.hint}
                    className={cx(
                      "text-[13px] transition-colors",
                      EASE,
                      state === "done" && "text-char",
                      state === "current" && "text-stone/90",
                      state === "pending" && "text-stone/55",
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <a href={finderIntro.counsellor.href} className="group/counsellor relative flex items-center gap-3 border-t border-sand-line pt-5">
        <Photo className="relative size-10 shrink-0 overflow-clip rounded-full" src={finderIntro.counsellor.image} alt="" sizes="40px" />
        <span className="flex flex-col gap-0.5 leading-[1.5] whitespace-nowrap">
          <span className="text-[13px] text-stone">{finderIntro.counsellor.prompt}</span>
          <span className="text-[14px] font-medium text-orange">
            {finderIntro.counsellor.link}{" "}
            <span aria-hidden="true" className={cx("inline-block transition-transform", EASE, "group-hover/counsellor:translate-x-1")}>
              →
            </span>
          </span>
        </span>
      </a>
    </div>
  );
}
