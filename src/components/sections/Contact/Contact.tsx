import Image from "next/image";
import type { CSSProperties } from "react";
import { KnobArrow } from "@/components/ui/Pill";
import RevealWords from "@/components/ui/RevealWords";
import { contactIntro, contactWays, type ContactWay } from "@/data/contact";
import LocationsCard from "./LocationsCard";

/**
 * A soft glow: the design's blurred ellipse as a radial gradient that fills its box (the ellipse plus
 * twice its blur on every side).
 */
function glow(rgb: string, alpha: number): CSSProperties {
  const at = (share: number, stop: number) => `rgb(${rgb} / ${+(alpha * share).toFixed(3)}) ${stop}%`;
  return {
    background: `radial-gradient(closest-side, ${at(1, 0)}, ${at(0.9, 30)}, ${at(0.5, 57)}, ${at(0.2, 75)}, ${at(0.05, 90)}, transparent)`,
  };
}

/** One way to reach us: the whole card is the link, with a round ↗ knob at its right end. */
function WayCard({ way }: { way: ContactWay }) {
  return (
    <a
      href={way.href}
      target={way.external ? "_blank" : undefined}
      rel={way.external ? "noopener noreferrer" : undefined}
      className="group/knob flex items-center gap-5 rounded-[20px] border border-paper/8 bg-soot p-[23px] [transition:background-color_.3s_var(--ease-smooth),border-color_.3s_var(--ease-smooth)] hover:border-paper/14 hover:bg-[#1c1613]"
    >
      <div className="flex min-w-px flex-1 flex-col gap-1.5">
        <h3 className="flex items-center gap-2.5 text-[20px]/[1.5] font-medium tracking-[-0.2px] whitespace-nowrap text-cream">
          {way.icon && <Image src={way.icon} alt="" width={20} height={20} className="size-5 shrink-0 object-contain" />}
          {way.title}
        </h3>
        <p className="w-[330px] text-[14px]/[1.5] text-cream/60">{way.text}</p>
        <span className="text-[14px]/[1.5] font-medium whitespace-nowrap text-tangerine">
          {way.cta}{" "}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-smooth group-hover/knob:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-paper/16 text-cream [transition:background-color_.3s_var(--ease-smooth),border-color_.3s_var(--ease-smooth)] group-hover/knob:border-paper/36 group-hover/knob:bg-paper/6">
        <KnobArrow />
      </span>
    </a>
  );
}

/** "What are you looking for?": four ways to get in touch beside the campus card with its city switch. */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h">
      <div className="relative mx-auto flex w-canvas flex-col gap-14 px-20 pt-[140px] pb-30">
        {/* Plum glow behind the cards, spilling in from the left edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[100px] left-[-400px] h-[860px] w-[1100px]"
          style={glow("66 7 39", 0.9)}
        />

        <div data-reveal className="relative flex items-end justify-between whitespace-nowrap">
          <h2 id="contact-h" data-reveal-words className="text-[64px]/none font-medium tracking-[-2.88px] text-cream">
            <RevealWords text={contactIntro.title} />
          </h2>
          <p className="text-[16px]/[1.5] text-cream/60">{contactIntro.lead}</p>
        </div>

        <div className="relative flex items-start gap-6">
          <div data-reveal-group className="flex w-[520px] shrink-0 flex-col gap-2.5">
            {contactWays.map((way) => (
              <WayCard key={way.title} way={way} />
            ))}
          </div>
          <LocationsCard />
        </div>
      </div>
    </section>
  );
}
