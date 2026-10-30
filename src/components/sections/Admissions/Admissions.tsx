import type { CSSProperties } from "react";
import Photo from "@/components/ui/Photo";
import { Chip } from "@/components/ui/Pill";
import RevealWords from "@/components/ui/RevealWords";
import { batches, enquiryProgrammes, timePreferences } from "@/data/admissions";
import { contact } from "@/data/site";
import AdmissionsBoard from "./AdmissionsBoard";
import EnquiryStrip from "./EnquiryStrip";

/** A soft glow: the design's blurred ellipse as a radial gradient that fills its box (the ellipse plus its blur). */
function glow(rgb: string, alpha: number): CSSProperties {
  const at = (share: number, stop: number) => `rgb(${rgb} / ${+(alpha * share).toFixed(3)}) ${stop}%`;
  return {
    background: `radial-gradient(closest-side, ${at(1, 0)}, ${at(0.9, 30)}, ${at(0.5, 57)}, ${at(0.2, 75)}, ${at(0.05, 90)}, transparent)`,
  };
}

/** Quick-contact links in the enquiry intro: the dark chip, brightening on hover. */
const QUICK_LINK = "group/qc rounded-full";
const QUICK_CHIP = "transition-colors duration-300 group-hover/qc:border-paper/24 group-hover/qc:bg-paper/10";

/**
 * Admissions: the next batches (a mode filter, a calendar strip of start dates and the batch cards),
 * then a strip to book a free session with a counsellor.
 */
export default function Admissions() {
  return (
    <section id="batches" aria-labelledby="batches-h" className="relative isolate overflow-clip bg-coal">
      <div className="relative mx-auto flex w-canvas flex-col gap-10 px-20 py-35">
        {/* Plum light at the top left, orange light low on the right; under the content (the section isolates them). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -z-1 -top-35 -left-105 h-[820px] w-[1000px]"
          style={glow("66 7 39", 0.9)}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -z-1 top-[530px] left-[750px] h-[840px] w-[1080px]"
          style={glow("238 106 18", 0.45)}
        />

        <AdmissionsBoard
          batches={batches}
          heading={
            <div data-reveal className="relative flex flex-col gap-4 whitespace-nowrap">
              <h2 id="batches-h" data-reveal-words className="text-[64px]/none font-medium tracking-[-2.88px] text-cream">
                <RevealWords text="Next batches starting soon." />
              </h2>
              <p className="text-[16px]/[1.5] text-cream/65">
                Register online, or call{" "}
                <a href={contact.phoneHref} className="underline-offset-4 transition-colors hover:text-cream hover:underline">
                  {contact.phone}
                </a>{" "}
                for registration or seat allotment.
              </p>
            </div>
          }
        />

        <EnquiryStrip
          programmes={enquiryProgrammes}
          timePreferences={timePreferences}
          intro={
            <div className="flex w-[420px] shrink-0 flex-col items-start gap-3.5">
              <div className="flex items-center gap-3">
                <Photo
                  className="relative size-12 shrink-0 overflow-hidden rounded-full"
                  src="/images/admissions/counsellor.webp"
                  alt="A Vajiram & Ravi counsellor"
                  sizes="48px"
                />
                <Chip tone="dark" dot className="text-[12px]/[1.2]!">
                  Talk to us
                </Chip>
              </div>
              <h3 className="text-[28px]/[1.15] font-medium tracking-[-0.7px] text-cream">
                Need assistance? Talk to our expert counsellor.
              </h3>
              <p className="w-[400px] text-[15px]/[1.5] text-cream/62">
                Schedule a free call with a Vajiram &amp; Ravi counsellor to answer your questions—no pressure to enrol.
              </p>
              <div className="flex items-start gap-2 pt-1">
                <a href={contact.phoneHref} className={QUICK_LINK}>
                  <Chip tone="dark" className={QUICK_CHIP}>
                    Call {contact.phone}
                  </Chip>
                </a>
                <a href="#" className={QUICK_LINK}>
                  <Chip tone="dark" className={`${QUICK_CHIP} text-[13px]/[1.5]!`}>
                    <Photo className="relative size-4 shrink-0" src="/images/icons/whatsapp.webp" alt="" sizes="16px" fit="contain" />
                    Chat on WhatsApp
                  </Chip>
                </a>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
