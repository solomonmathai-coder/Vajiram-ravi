import RevealWords from "@/components/ui/RevealWords";
import Sheet from "@/components/ui/Sheet";
import { educators } from "@/data/educators";
import FacultyCarousel from "./FacultyCarousel";

/**
 * Faculty, on a light panel: the heading row with prev / next buttons, a draggable track of educator
 * cards that runs off the right edge of the page, and a scrubber line that shows where the track is.
 */
export default function Faculty() {
  return (
    <Sheet id="faculty" labelledBy="faculty-h" className="flex flex-col gap-12">
      <FacultyCarousel
        educators={educators}
        heading={
          <div className="flex flex-col gap-4 whitespace-nowrap">
            <h2 id="faculty-h" data-reveal-words className="text-[64px]/none font-medium tracking-[-2.88px] text-char">
              <RevealWords text="Learn from top educators" />
            </h2>
            <p className="text-[16px]/[1.5] text-stone">
              Subject specialists for every GS paper, the essay, the optionals and the interview.
            </p>
          </div>
        }
      />
    </Sheet>
  );
}
