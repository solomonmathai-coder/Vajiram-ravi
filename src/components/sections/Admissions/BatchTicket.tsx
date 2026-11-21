"use client";

import type { PointerEvent } from "react";
import Cta from "@/components/ui/Cta";
import type { Batch } from "@/data/admissions";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { dateParts } from "./dates";
import { requestEnquiry } from "./enquiry";
import TicketArt from "./TicketArt";

/** The perforation as drawn: 6.09px dashes and gaps (22 of each over 268px), starting on half a dash. */
const DASH = 268 / 44;
const DASH_OFFSET = DASH / 2;
/** On hover the dashes run on two whole periods, so the line ends exactly as it started. */
const TEAR_SHIFT = DASH * 4;
const TEAR_MS = 600;
/** --ease-out, for the Web Animations API (which cannot read CSS variables). */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

type BatchTicketProps = {
  batch: Batch;
  /** The batch's place among all batches, which picks its head colour. */
  tone: number;
};

/**
 * Homepage v2: the ticket in design S's card styling (the client's choice; its head, tag, "Study mode" and
 * "Enroll now"), at v1's 308 × 360 and with v1's motion, its lotus drawn a little bolder.
 *
 * One railway ticket (Figma "ticket – …", 308 × 360): the coloured head with the start date, the target
 * year and the batch's own faint line drawing (TicketArt; the lotus mark where a batch has none), the programme, its modes and, where admissions have confirmed it, "Admissions open"; the perforation
 * between the notches, then "Register now", which opens the counselling postcard with this programme. A
 * batch with limited seats carries the round rubber stamp.
 *
 * Hover (or keyboard focus inside it) lifts the ticket 8px, runs the perforation's dashes along once as if
 * it were being torn, and turns the medallions (the ticket is their `group/medal`). Its shadow is a soft
 * contact shadow: a warm, blurred patch a little narrower than the ticket and set below it, so it reads as
 * lifted off the page and stays within the room the track leaves around it. The departure-board flip of the date and the stamp coming down are played by the
 * track when it is first seen (`data-flip-digit`, `data-stamp`). After that, while the band is on screen,
 * the stamp gives a short wobble every few seconds, as if pressed again (globals.css, .lp-wobble), each
 * ticket's at its own time.
 */
/** The batch's family, for the tag over its name (design S's ticket tag). */
function category(batch: Batch): string {
  if (batch.art === "camp") return "Prelims";
  if (batch.art === "globe" || batch.art === "newspaper") return "Current affairs";
  return batch.featured ? "General Studies · Flagship" : "General Studies";
}

export default function BatchTicket({ batch, tone }: BatchTicketProps) {
  const { year, month, day } = dateParts(batch.startDate);
  const limited = batch.seatStatus === "limited";
  const modes = batch.modes.join(" & ");

  const tear = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    const line = event.currentTarget.querySelector<SVGLineElement>("[data-perforation]");
    if (!line || typeof line.animate !== "function" || line.getAnimations().length) return;
    line.animate([{ strokeDashoffset: `${DASH_OFFSET}px` }, { strokeDashoffset: `${DASH_OFFSET - TEAR_SHIFT}px` }], {
      duration: TEAR_MS,
      easing: EASE_OUT,
    });
  };

  return (
    <article
      data-ticket
      onPointerEnter={tear}
      className="group/ticket group/medal relative h-[360px] w-[308px] [transition:translate_var(--dur-base)_var(--ease-out)] hover:-translate-y-2 has-[:focus-visible]:-translate-y-2"
    >
      {/* The ticket's resting shadow, and a deeper one that fades in as it lifts. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 top-4 -bottom-1 rounded-[18px] bg-[#4d1f08] opacity-10 blur-[10px]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-6 -bottom-2 rounded-[18px] bg-[#4d1f08] opacity-0 blur-[11px] [transition:opacity_var(--dur-fast)_var(--ease-out)] group-hover/medal:opacity-24"
      />
      <img src="/images/admissions/ticket-body-white.svg" alt="" aria-hidden="true" width={308} height={360} className="absolute top-0 left-0" />

      {/* The head, after design S's ticket: the orange gradient inside a fine frame, its lotus drawn bolder. */}
      <div className="absolute inset-x-0 top-0 h-[112px] overflow-clip rounded-t-[18px] bg-[linear-gradient(135deg,#f06a2c_0%,#e85020_45%,#c2410c_100%)] whitespace-nowrap text-white">
        {/* Each batch's own drawing with its loop (TicketArt), at the lotus's line, blended into the head;
            the lotus where a batch has none. */}
        {batch.art ? (
          <TicketArt name={batch.art} bold />
        ) : (
          <img
            src="/images/admissions/lotus-ticket-bold.svg"
            alt=""
            aria-hidden="true"
            width={204}
            height={108}
            className="ticket-lotus pointer-events-none absolute right-0 bottom-0 max-w-none mix-blend-overlay"
          />
        )}
        <span aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[12px] border border-white/30" />
        <div aria-hidden="true" className="absolute top-[18px] left-5">
          <p className="text-[12px]/[16px] font-semibold text-white/90">Batch starts</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="h-[44px] font-heading text-[52px]/[44px] font-semibold">
              {String(day)
                .split("")
                .map((digit, i) => (
                  <span key={i} data-flip-digit className="inline-block">
                    {digit}
                  </span>
                ))}
            </p>
            <div className="flex flex-col font-semibold">
              <p className="text-[16px]/[18px]">{month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()}</p>
              <p className="text-[12px]/[16px] text-white/85">{year}</p>
            </div>
          </div>
        </div>
        <p className="sr-only">
          Starts <time dateTime={batch.startDate}>{`${day} ${month} ${year}`}</time>
        </p>
        <p className="absolute top-[18px] right-5 text-right">
          <span className="block text-[12px]/[16px] font-semibold text-white/75">Target exam</span>
          <span className="block text-[14px]/[18px] font-bold">UPSC CSE {batch.targetYear}</span>
        </p>
      </div>

      <div className="absolute top-[128px] left-5 flex w-[268px] flex-col items-start">
        <p className="text-[12px]/[16px] font-bold tracking-[0.06em] text-[#c2410c] uppercase">{category(batch)}</p>
        <h3 className="mt-1.5 line-clamp-2 font-heading text-[19px]/[24px] font-semibold text-ink">{batch.programme}</h3>
        <p className="mt-3 text-[12px]/[16px] font-bold tracking-[0.06em] text-clay uppercase">Study mode</p>
        <p className="mt-0.5 text-[14px]/[20px] font-medium text-ink">{modes || "Classroom and LIVE-Online"}</p>
      </div>

      {/* The perforation between the notches, drawn inline so its dashes can run on hover. */}
      <svg aria-hidden="true" width={268} height={1.5} viewBox="0 0 268 1.5" className="absolute top-[275.25px] left-5 overflow-visible">
        <line
          data-perforation
          x1={0}
          y1={0.75}
          x2={268}
          y2={0.75}
          stroke="#2B1206"
          strokeOpacity={0.3}
          strokeWidth={1.5}
          strokeDasharray={`${DASH} ${DASH}`}
          strokeDashoffset={DASH_OFFSET}
        />
      </svg>

      {/* The stub: design S's "Enroll now", opening the counselling postcard with this programme. */}
      <div className="absolute inset-x-5 top-[294px]">
        <Cta variant="primary" size="md" onClick={() => requestEnquiry(batch.programme)} ariaLabel={`Enroll now in ${batch.programme}`} className="w-full justify-between">
          Enroll now
        </Cta>
      </div>

      {limited && (
        <>
          <p className="sr-only">Limited seats</p>
          {/* The rubber stamp (Figma "rubber stamp – Limited seats"): 84px, turned 14°, at 85%. */}
          <div
            aria-hidden="true"
            className="lp-wobble pointer-events-none absolute top-[196px] left-[214px] size-[84px] scale-[0.88] rotate-14 opacity-85"
            style={{ animationDelay: `${-((tone * 1.7) % 6.5)}s` }}
          >
            <div data-stamp className="absolute inset-0">
              <img src="/images/admissions/stamp-limited-ring.svg" alt="" width={94} height={94} className="absolute -top-[5px] -left-[5px] max-w-none" />
              <p className="absolute inset-x-0 top-[29px] pl-[0.08em] text-center text-[12px]/[14px] font-bold tracking-[0.08em] whitespace-nowrap text-[#e34234]">
                LIMITED
              </p>
              <p className="absolute inset-x-0 top-[45px] pl-[0.08em] text-center text-[12px]/[14px] font-bold tracking-[0.08em] whitespace-nowrap text-[#e34234]">
                SEATS
              </p>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
