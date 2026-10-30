import { ArrowPill } from "@/components/ui/Pill";
import RevealWords from "@/components/ui/RevealWords";
import Sheet from "@/components/ui/Sheet";
import { coursesIntro } from "@/data/programme-bento";
import ProgrammeExplorer from "./ProgrammeExplorer";

/**
 * "Featured UPSC CSE programmes" (Figma 1934:3312), on a light panel: the heading row, a stage filter,
 * and the programmes as a bento of dark wide cards, light small cards and an orange counselling tile.
 */
export default function Courses() {
  return (
    <Sheet id="courses" labelledBy="c-h" className="flex flex-col gap-12">
      <div data-reveal className="flex w-full items-end justify-between">
        <h2 id="c-h" data-reveal-words className="w-[700px] text-[64px]/none font-medium tracking-[-2.88px] text-char">
          <RevealWords text={coursesIntro.title} />
        </h2>
        <div className="flex w-[420px] flex-col items-start gap-5">
          <p className="text-[16px]/[1.55] text-stone">{coursesIntro.lead}</p>
          <ArrowPill href={coursesIntro.viewAll.href} surface="outline-light" knob="char">
            {coursesIntro.viewAll.label}
          </ArrowPill>
        </div>
      </div>
      <ProgrammeExplorer />
    </Sheet>
  );
}
