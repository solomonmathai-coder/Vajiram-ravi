"use client";

import { useEffect, useRef } from "react";
import Photo from "@/components/ui/Photo";
import { ArrowPill } from "@/components/ui/Pill";
import { matchImages, type FinderMatch } from "@/data/finder";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import Roll from "./Roll";

type MatchCardProps = {
  match: FinderMatch;
  /** Tags of the confirmed answers, in step order. */
  tags: string[];
  answered: number;
  total: number;
  complete: boolean;
};

const EASE = "cubic-bezier(.2,.8,.2,1)";
const EASE_CLASS = "duration-500 ease-[cubic-bezier(.2,.8,.2,1)]";

/** A small tag that pops in when its answer is confirmed. */
function Tag({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    ref.current?.animate(
      [
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1 },
      ],
      { duration: 360, easing: EASE },
    );
  }, []);
  return (
    <span
      ref={ref}
      className="rounded-full border border-paper/14 bg-paper/8 px-2.5 py-[5px] text-[12px]/[1.2] font-medium whitespace-nowrap text-cream"
    >
      {label}
    </span>
  );
}

function remainingText(remaining: number, complete: boolean) {
  if (remaining > 0) return `${remaining} more answer${remaining > 1 ? "s" : ""} to confirm`;
  return complete ? "Your match is confirmed" : "All answers in — see your match";
}

/**
 * The live "Likely match": updates after every answer. The illustration cross-fades, the title, track and
 * batch date roll to their new values, the "Updating live" dot pulses, tags appear as answers are
 * confirmed, and "Enrol now" unlocks once all three steps are done.
 */
export default function MatchCard({ match, tags, answered, total, complete }: MatchCardProps) {
  const dotRef = useRef<HTMLSpanElement>(null);
  // Pulses the "Updating live" dot whenever anything on the card changes (not on the first render).
  const signature = `${match.title}|${match.track}|${tags.join()}|${answered}|${complete}`;
  const shownSignature = useRef(signature);

  useEffect(() => {
    if (shownSignature.current === signature) return;
    shownSignature.current = signature;
    if (prefersReducedMotion()) return;
    dotRef.current?.animate(
      [
        { scale: 1, opacity: 1 },
        { scale: 1.9, opacity: 0.45 },
        { scale: 1, opacity: 1 },
      ],
      { duration: 700, easing: EASE },
    );
  }, [signature]);

  return (
    <div className="relative flex h-full w-[360px] shrink-0 flex-col justify-between overflow-clip rounded-[28px] bg-char p-6">
      <img
        src="/images/programme-finder/glow-match.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[210px] left-[-50px] h-[540px] w-[620px] max-w-none"
      />

      <div className="relative flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[13px]/[1.5] font-medium text-cream/70">Likely match</p>
          <span className="flex items-center gap-1.5 rounded-full border border-paper/14 bg-paper/8 px-3 py-1.5 text-[12px]/[1.2] font-medium whitespace-nowrap text-cream">
            <span ref={dotRef} className="size-[7px] rounded-full bg-tangerine" aria-hidden="true" />
            Updating live
          </span>
        </div>
        <div className="relative h-[140px] w-full overflow-clip rounded-2xl">
          {matchImages.map((src) => (
            <Photo
              key={src}
              className={cx("absolute inset-0 transition-opacity", EASE_CLASS, src === match.image ? "opacity-100" : "opacity-0")}
              src={src}
              alt=""
              sizes="312px"
            />
          ))}
        </div>
        <Roll text={match.title} className="min-h-[52px] text-[22px]/[1.18] font-medium tracking-[-0.33px] text-cream" />
        <Roll text={match.track} className="text-[14px]/[1.5] whitespace-nowrap text-cream/65" />
        {/* Empty until the first answer is confirmed; then it opens to fit one row of tags. */}
        <div className={cx("transition-[height]", EASE_CLASS, tags.length ? "h-[26px]" : "h-[10px]")}>
          <div className="flex gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-paper/10 pt-3.5">
          <div className="flex flex-col gap-0.5 leading-[1.5] whitespace-nowrap">
            <span className="text-[12px] text-cream/55">Next batch</span>
            <Roll text={match.nextBatch} className="text-[16px] font-medium text-cream" />
          </div>
          <span
            aria-hidden={!match.admissionOpen}
            className={cx(
              "flex items-center gap-1.5 rounded-full bg-orange/16 px-3 py-1.5 text-[12px]/[1.2] font-medium whitespace-nowrap text-tangerine transition-opacity",
              EASE_CLASS,
              match.admissionOpen ? "opacity-100" : "opacity-0",
            )}
          >
            <span className="size-[7px] rounded-full bg-orange" aria-hidden="true" />
            Admission open
          </span>
        </div>
      </div>

      <div className="relative flex flex-col">
        {/* "Enrol now" opens upwards into the free space once all three steps are done. */}
        <div
          className={cx("grid transition-[grid-template-rows,opacity]", EASE_CLASS, complete ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
          inert={!complete}
        >
          <div className="-m-1 min-h-0 overflow-hidden p-1">
            <div className="pb-4">
              <ArrowPill href={match.enrolHref} surface="orange" knob="paper">
                Enrol now
              </ArrowPill>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-[9px] bg-paper/15">
                <span
                  className={cx(
                    "absolute inset-0 origin-left bg-orange transition-transform",
                    EASE_CLASS,
                    i < answered ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            ))}
          </div>
          <p className="text-[13px]/[1.5] text-cream/55">{remainingText(total - answered, complete)}</p>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Likely match: ${match.title}, ${match.track}. Next batch: ${match.nextBatch}.`}
      </p>
    </div>
  );
}
