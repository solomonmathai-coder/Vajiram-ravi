import ScrubText from "@/components/ui/ScrubText";
import { Eyebrow } from "@/components/ui/Typography";
import { about } from "@/data/home";

/**
 * About us: the tagged eyebrow (as in Results), above a large paragraph that fills in letter by
 * letter as it scrolls into view, after cominvi.com.mx.
 */
export default function About() {
  return (
    <section className="bg-white" aria-labelledby="about-title">
      <div className="mx-auto flex w-canvas flex-col items-start gap-4 px-10 pt-16 pb-10">
        <Eyebrow tone="neutral" tagged as="h2" id="about-title">
          {about.title}
        </Eyebrow>
        <ScrubText
          className="w-[1140px] font-display text-[52px]/[56px] font-semibold tracking-[-0.015em] text-neutral-950"
          text={about.intro}
        />
      </div>
    </section>
  );
}
