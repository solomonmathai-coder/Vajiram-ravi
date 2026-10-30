import { reasons, whyChoose } from "@/data/why-choose";
import ReasonsStory from "./ReasonsStory";
import ScrubbedStatement from "./ScrubbedStatement";

/**
 * "Why choose V&R" (Figma 1933:3403), on the dark page: a statement that lights up word by word as it
 * scrolls past, then the six reasons as a sticky scroll story beside a pinned photo.
 */
export default function WhyChoose() {
  return (
    <section id="why-choose" aria-labelledby="why-h" className="relative overflow-clip bg-coal">
      <div className="relative mx-auto flex w-canvas flex-col gap-24 px-20 py-[140px]">
        {/* Warm glow rising behind the photo's lower corner. Anchored to the bottom, where the pinned row ends. */}
        <img
          src="/images/why-choose/glow.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-457px] left-[-440px] h-[980px] w-[1180px] max-w-none"
        />

        <div className="relative flex flex-col gap-7 font-medium">
          <h2 id="why-h" data-reveal className="text-[18px]/[1.5] text-tangerine">
            {whyChoose.eyebrow}
          </h2>
          <ScrubbedStatement
            text={whyChoose.statement}
            className="w-[1180px] text-[56px]/[1.12] tracking-[-1.96px] text-cream"
          />
        </div>

        <ReasonsStory reasons={reasons} />
      </div>
    </section>
  );
}
