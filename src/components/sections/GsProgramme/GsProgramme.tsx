import Image from "next/image";
import { ArrowUpRightIcon } from "@/components/icons";
import { ARROW_TILE, NUDGE } from "@/components/ui/Buttons";
import RibbonGradient from "@/components/ui/RibbonGradient";
import { Eyebrow } from "@/components/ui/Typography";
import { gsProgramme } from "@/data/home";
import { cx } from "@/lib/cx";
import type { RibbonPalette } from "@/lib/ribbonGradient";
import ProgrammeReel from "./ProgrammeReel";

/**
 * The frame's animated ribbon gradient in Vajiram & Ravi colours. Each palette is [base, colour 1,
 * colour 2, colour 3]; the background holds each one for a while, then crossfades to the next.
 */
const PALETTES: RibbonPalette[] = [
  ["#fef8ec", "#f6b653", "#73e2bd", "#fde57c"], // brand/50, brand/300, green/300, yellow/200
  ["#fafaf9", "#f39c2c", "#fcd54d", "#cbb9a6"], // sand/50, brand/400, yellow/300, brown/300
  ["#edfcf6", "#3acda1", "#f9d38e", "#fde57c"], // green/50, green/400, brand/200, yellow/200
];

/**
 * The GS programme: a white card set in a frame with an animated ribbon gradient, after
 * amplemarket.com's MCP section. The copy and marks sit on the left, with the same orange arrow link
 * as the course cards in the top right corner of the copy; on the right a window
 * cut out of the card shows the moving gradient behind, with a looping reel of programme highlights
 * floating in it (ProgrammeReel).
 */
export default function GsProgramme() {
  return (
    <section id="gs-programme" className="bg-white" aria-labelledby="gs-title">
      <div className="mx-auto w-canvas px-6 py-10">
        <div className="relative flex flex-col items-center overflow-clip rounded-[32px] px-34 py-22">
          <RibbonGradient className="absolute inset-0" palettes={PALETTES} />

          <div className="relative flex h-[580px] w-[1120px] overflow-clip rounded-[20px] p-2.5">
            {/* The white card surface, with the window on the right cut out of it. */}
            <Image
              className="absolute inset-0"
              src="/images/gs-programme/card-surface.svg"
              alt=""
              width={1120}
              height={580}
            />
            <div className="relative flex min-w-px flex-1 flex-col justify-between py-9 pr-12 pl-[38px]">
              <div className="flex flex-col items-start gap-3.5">
                <div className="flex w-full items-center justify-between">
                  <Eyebrow tone="neutral" tagged>
                    {gsProgramme.eyebrow}
                  </Eyebrow>
                  {/* Pulled in by -my-2 so the taller tile doesn't push the heading down. */}
                  <a
                    href={gsProgramme.cta.href}
                    aria-label={gsProgramme.cta.label}
                    className={cx(ARROW_TILE, "group/cta -my-2 hover:bg-brand-600")}
                  >
                    <ArrowUpRightIcon className={cx(NUDGE, "group-hover/cta:translate-x-px group-hover/cta:-translate-y-px")} />
                  </a>
                </div>
                <h2 id="gs-title" className="font-display text-[36px]/[44px] font-semibold text-balance text-neutral-900">
                  {gsProgramme.heading}
                </h2>
                <p className="font-sans text-[16px]/[23px] font-medium text-neutral-500">{gsProgramme.intro}</p>
              </div>

              <div className="flex flex-col gap-3.5">
                <p className="font-sans text-[14px]/[20px] font-bold text-neutral-500">{gsProgramme.statsLabel}</p>
                <dl className="grid grid-cols-[220px_1fr] gap-x-10">
                  {gsProgramme.stats.map((stat) => (
                    <div key={stat.stage} className="flex flex-col gap-3">
                      <dt className="font-display text-[16px]/[22px] font-semibold text-neutral-500">{stat.stage}</dt>
                      <dd className="font-display whitespace-nowrap lining-nums proportional-nums">
                        <span className="text-[40px]/[47px] font-semibold text-[#451b03]">{stat.marks}</span>
                        <span className="text-[18px]/[25px] font-bold text-neutral-600">{stat.total}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="relative h-full w-[520px] shrink-0 overflow-clip rounded-[14px]">
              <ProgrammeReel
                className="absolute inset-11 rounded-2xl shadow-[0_16px_36px_rgba(66,18,5,.22)]"
                slides={gsProgramme.reel}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
