import Photo from "@/components/ui/Photo";
import { ArrowPill, PlainPill } from "@/components/ui/Pill";
import RevealWords from "@/components/ui/RevealWords";
import { closingCta } from "@/data/closing-cta";
import { glow } from "./glow";
import GradientDrift from "./GradientDrift";

/** The one bright moment before the dark footer: a warm gradient banner with the closing call to action. */
export default function ClosingCta() {
  const { call } = closingCta;
  return (
    <section aria-labelledby="cta-h">
      <div className="mx-auto w-canvas px-20 pt-10">
        <div
          data-reveal
          className="relative flex h-[500px] flex-col items-center justify-center gap-[22px] overflow-hidden rounded-[36px]"
        >
          <GradientDrift />
          {/* A pale bloom rising from the bottom edge, and a faint plum shade in the top left corner. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[220px] left-[-50px] h-[580px] w-[1380px]"
            style={glow("255 253 251", 0.55)}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[-340px] left-[-380px] h-[680px] w-[880px]"
            style={glow("66 7 39", 0.35)}
          />

          <div className="relative flex items-center gap-3 rounded-full bg-paper/22 py-1.5 pr-4 pl-2">
            {/* The toppers overlap from left to right, each cut-out on its own light disc. */}
            <div className="flex" aria-hidden="true">
              {closingCta.rankers.map((ranker) => (
                <Photo
                  key={ranker.src}
                  src={ranker.src}
                  alt=""
                  sizes="34px"
                  className="relative -mr-2.5 size-[34px] shrink-0 overflow-hidden rounded-full border-2 border-tangerine bg-sand last:mr-0"
                />
              ))}
            </div>
            <p className="text-[14px]/[1.5] font-medium whitespace-nowrap text-char">{closingCta.proof}</p>
          </div>

          <h2
            id="cta-h"
            data-reveal-words
            className="relative w-[860px] text-center text-[68px]/none font-medium tracking-[-3.4px] text-char"
          >
            <RevealWords text={closingCta.title} />
          </h2>
          <p className="relative w-[580px] text-center text-[18px]/[1.55] text-char/72">{closingCta.text}</p>

          <div className="relative flex items-center gap-2.5 pt-1.5">
            <ArrowPill href={closingCta.primary.href} surface="char" knob="orange">
              {closingCta.primary.label}
            </ArrowPill>
            {/* The design's outline is a char hairline on the orange, and the pill is 50px tall like its neighbour. */}
            <PlainPill
              href={closingCta.secondary.href}
              surface="outline-light"
              className="border-char/35! py-[15px]! hover:border-char/60! hover:bg-char/6!"
            >
              {closingCta.secondary.label}
            </PlainPill>
          </div>

          <p className="relative text-[14px]/[1.5] whitespace-nowrap text-char/60">
            {call.lead}{" "}
            <a href={call.phoneHref} className="transition-colors duration-200 hover:text-char">
              {call.phone}
            </a>
            {` · ${call.hours}`}
          </p>
        </div>
      </div>
    </section>
  );
}
