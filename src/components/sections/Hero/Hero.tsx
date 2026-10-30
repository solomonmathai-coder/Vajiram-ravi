import { ArrowPill, Chip, PlainPill } from "@/components/ui/Pill";
import WordRise from "@/components/ui/WordRise";
import { heroIntro, programmeBanners } from "@/data/hero";
import HeroGlobe from "./HeroGlobe";
import RecordBento from "./RecordBento";
import StoryBanners from "./StoryBanners";

/**
 * The hero (Figma "Hero", 1931:3322): the headline and calls to action beside the India globe, the
 * record cards, and the programme banners. The floating nav (SiteHeader) sits over its top.
 */
export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-h" className="relative overflow-clip">
      {/* Two soft glows: plum behind the headline, orange behind the globe. */}
      <div className="pointer-events-none absolute inset-0 mx-auto w-canvas" aria-hidden="true">
        <img src="/images/hero/glow-left.svg" alt="" className="absolute top-[-20px] left-[-460px] h-[920px] w-[1300px] max-w-none" />
        <img src="/images/hero/glow-right.svg" alt="" className="absolute top-[330px] left-[470px] h-[920px] w-[1280px] max-w-none" />
      </div>

      <div className="relative mx-auto w-canvas px-20 pt-[136px] pb-24">
        <div className="flex h-[540px] gap-5">
          <div className="flex w-[780px] shrink-0 flex-col items-start gap-8 pt-4">
            <Chip tone="dark" dot className="animate-fade-rise">
              {heroIntro.chip}
            </Chip>
            <h1 id="hero-h" className="text-[96px]/[0.96] font-medium tracking-[-4.8px] text-cream">
              <WordRise
                delay={120}
                parts={[{ text: heroIntro.headline }, { text: heroIntro.accent, className: "text-tangerine" }]}
              />
            </h1>
            <p className="w-[540px] animate-fade-rise-delay-2 text-[19px]/[1.55] text-cream/68">{heroIntro.lead}</p>
            <div className="flex animate-fade-rise-delay-3 items-center gap-3">
              <ArrowPill href="#finder" surface="paper" knob="char">
                Find your course
              </ArrowPill>
              <PlainPill href="#counsellor" surface="outline-dark">
                Talk to a counsellor
              </PlainPill>
            </div>
            <p className="animate-fade-rise-delay-3 text-[15px]/[1.5] text-cream/60">
              {heroIntro.newToUpsc.text}
              <a
                href={heroIntro.newToUpsc.href}
                className="text-tangerine underline-offset-4 transition-colors hover:text-[#ffa266] hover:underline"
              >
                {heroIntro.newToUpsc.link}
              </a>
            </p>
          </div>
          <HeroGlobe />
        </div>

        <RecordBento />
        <StoryBanners slides={programmeBanners} />
      </div>
    </section>
  );
}
