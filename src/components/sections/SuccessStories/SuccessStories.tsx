import RevealWords from "@/components/ui/RevealWords";
import Sheet from "@/components/ui/Sheet";
import { stories } from "@/data/stories";
import StoryCarousel from "./StoryCarousel";

/** "Hear it from our students": a featured story card with the next story waiting beside it. */
export default function SuccessStories() {
  return (
    <Sheet id="stories" labelledBy="stories-h">
      <StoryCarousel
        stories={stories}
        heading={
          <div className="flex flex-col items-start gap-4 whitespace-nowrap">
            <h2 id="stories-h" data-reveal-words className="text-[64px]/none font-medium tracking-[-2.88px] text-char">
              <RevealWords text="Hear it from our students" />
            </h2>
            <p className="text-[16px]/[1.5] text-stone">
              Honest words from students who prepared with us, in the classroom and LIVE-Online.
            </p>
          </div>
        }
      />
    </Sheet>
  );
}
