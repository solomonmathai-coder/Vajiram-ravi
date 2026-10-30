import { ArrowPill, PlainPill } from "@/components/ui/Pill";
import RevealWords from "@/components/ui/RevealWords";
import Sheet from "@/components/ui/Sheet";
import { resultYears, toppersByYear } from "@/data/toppers";
import ToppersGallery from "./ToppersGallery";

/** The toppers panel (Figma "Toppers", 1933:3312): heading, year switch, expanding gallery and a call to action. */
export default function Toppers() {
  return (
    <Sheet id="toppers" labelledBy="toppers-h" className="flex flex-col gap-12">
      <div data-reveal className="flex items-end justify-between">
        <h2 id="toppers-h" data-reveal-words className="w-[760px] text-[64px]/none font-medium tracking-[-2.88px]">
          <RevealWords text="Toppers who prepared with Vajiram & Ravi" />
        </h2>
        <p className="w-[420px] text-[16px]/[1.55] text-stone">
          Ranks 1 to 10 in UPSC CSE 2025 all studied with us. Each took at least one of our programmes: a classroom
          course, a test series or the Interview Guidance Programme.
        </p>
      </div>

      <ToppersGallery years={resultYears} galleries={toppersByYear} />

      <div data-reveal className="flex items-center justify-between border-t border-sand-line pt-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-[30px]/[1.2] font-medium tracking-[-0.75px] whitespace-nowrap">Start where these toppers started.</h3>
          <p className="w-[620px] text-[16px]/[1.5] text-stone">
            Every topper above began with our classroom courses, test series or interview guidance. Admissions for 2027
            are open.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <PlainPill href="#" surface="outline-light">
            See all toppers
          </PlainPill>
          <ArrowPill href="#finder" surface="char" knob="orange">
            Find your course
          </ArrowPill>
        </div>
      </div>
    </Sheet>
  );
}
