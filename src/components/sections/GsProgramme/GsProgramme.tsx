import type { CSSProperties } from "react";
import Photo from "@/components/ui/Photo";
import { ArrowPill, Chip } from "@/components/ui/Pill";
import RevealWords from "@/components/ui/RevealWords";
import { flagship } from "@/data/flagship";
import ScoreMeter from "./ScoreMeter";

/** A soft glow: the design's blurred ellipse as a radial gradient that fills its box (the ellipse plus its blur). */
function glow(rgb: string, alpha: number): CSSProperties {
  const at = (share: number, stop: number) => `rgb(${rgb} / ${+(alpha * share).toFixed(3)}) ${stop}%`;
  return {
    background: `radial-gradient(closest-side, ${at(1, 0)}, ${at(0.9, 30)}, ${at(0.5, 57)}, ${at(0.2, 75)}, ${at(0.05, 90)}, transparent)`,
  };
}

const formatMarks = (marks: number) => marks.toLocaleString("en-IN");

/**
 * Flagship GS Prelims & Mains Programme: the pitch on the left; on the right a classroom photo over two
 * score meters that show how much of each exam stage General Studies carries.
 */
export default function GsProgramme() {
  return (
    <section id="gs-programme" aria-labelledby="gs-programme-h" className="relative isolate overflow-clip bg-coal">
      <div className="relative mx-auto flex w-canvas items-start gap-20 px-20 py-35">
        {/* Orange light behind the visual, plum light low on the left; under the content (the section isolates them). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -z-1 -top-45 left-[540px] h-[1000px] w-[1240px]"
          style={glow("238 106 18", 0.55)}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -z-1 top-[300px] -left-100 h-[800px] w-[1000px]"
          style={glow("66 7 39", 0.9)}
        />

        <div data-reveal-group className="relative flex w-[540px] shrink-0 flex-col items-start gap-7">
          <Chip tone="dark" dot>
            {flagship.chip}
          </Chip>
          <h2 id="gs-programme-h" data-reveal-words className="text-[56px]/[1.02] font-medium tracking-[-2.24px] text-cream">
            <RevealWords text={flagship.title} />
          </h2>
          <p className="w-[520px] text-[17px]/[1.6] text-cream/68">{flagship.body}</p>
          <div className="flex pt-2">
            <ArrowPill href={flagship.cta.href} surface="paper" knob="orange">
              {flagship.cta.label}
            </ArrowPill>
          </div>
        </div>

        <div data-reveal className="relative flex min-w-0 flex-1 flex-col gap-4">
          <Photo
            className="relative h-80 w-full overflow-hidden rounded-3xl"
            src={flagship.photo.src}
            alt={flagship.photo.alt}
            sizes="660px"
          />
          <div className="flex gap-4">
            {flagship.meters.map((meter) => (
              <ScoreMeter
                key={meter.stage}
                stage={meter.stage}
                marks={formatMarks(meter.gsMarks)}
                total={`/${formatMarks(meter.totalMarks)}`}
                share={meter.gsMarks / meter.totalMarks}
                caption={flagship.meterCaption}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
