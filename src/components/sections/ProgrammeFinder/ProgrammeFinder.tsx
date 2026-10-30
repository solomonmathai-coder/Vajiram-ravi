import RevealWords from "@/components/ui/RevealWords";
import Sheet from "@/components/ui/Sheet";
import { finderIntro } from "@/data/finder";
import Finder from "./Finder";

/**
 * "Which programme is right for you?" (Figma 1958:3312), on the deeper sand panel: three quick questions
 * beside a "Your answers" rail and a live "Likely match" card. "Find your course" in the hero links here (#finder).
 */
export default function ProgrammeFinder() {
  return (
    <Sheet id="finder" labelledBy="finder-h" tone="sand" className="flex flex-col gap-12">
      <img
        src="/images/programme-finder/glow-section.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[-360px] left-[620px] h-[900px] w-[1180px] max-w-none"
      />
      <div data-reveal className="relative flex w-full items-end justify-between">
        <h2 id="finder-h" data-reveal-words className="w-[760px] text-[64px]/none font-medium tracking-[-2.88px] text-char">
          <RevealWords text={finderIntro.title} />
        </h2>
        <p className="w-[420px] text-[17px]/[1.55] text-stone">{finderIntro.lead}</p>
      </div>
      <Finder />
    </Sheet>
  );
}
