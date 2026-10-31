import { Eyebrow, SectionTitle } from "@/components/ui/Typography";
import { toppers } from "@/data/home";
import ToppersReel from "./ToppersReel";

/** Toppers: the eyebrow and heading, above a scroll-driven reel of cards (blank for now). */
export default function Toppers() {
  return (
    <section id="toppers" className="bg-white" aria-labelledby="toppers-title">
      <ToppersReel count={toppers.placeholders}>
        <div className="flex flex-col items-start gap-3">
          <Eyebrow tone="neutral" tagged>
            {toppers.eyebrow}
          </Eyebrow>
          <SectionTitle id="toppers-title">{toppers.heading}</SectionTitle>
        </div>
      </ToppersReel>
    </section>
  );
}
