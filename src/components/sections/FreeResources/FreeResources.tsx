import RevealWords from "@/components/ui/RevealWords";
import Sheet from "@/components/ui/Sheet";
import { defaultStage, otherResources, studyStages } from "@/data/study-materials";
import ResourceShelf from "./ResourceShelf";
import StageArticles from "./StageArticles";

/**
 * Free study material: current affairs by exam stage, then a shelf of the other free resources. It is a
 * little more compact than the design (tighter padding, gaps and card heights), so the whole panel fits
 * on screen as a card in the stack.
 */
export default function FreeResources() {
  return (
    <Sheet id="resources" labelledBy="resources-h" className="flex flex-col items-start gap-9 pt-20 pb-16">
      <StageArticles
        stages={studyStages}
        initialStage={defaultStage}
        heading={
          <h2 id="resources-h" data-reveal-words className="w-[760px] text-[64px]/none font-medium tracking-[-2.88px] text-char">
            <RevealWords text="Study materials for every stage of UPSC" />
          </h2>
        }
      />
      <ResourceShelf resources={otherResources} />
    </Sheet>
  );
}
