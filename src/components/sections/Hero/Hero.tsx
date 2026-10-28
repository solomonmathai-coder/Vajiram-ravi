import type { CSSProperties } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { KnobButton, NUDGE, OutlineButton, textLink } from "@/components/ui/Buttons";
import PeekCarousel from "@/components/ui/PeekCarousel";
import { Lead } from "@/components/ui/Typography";
import { heroStats } from "@/data/home";
import { cx } from "@/lib/cx";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <section className="overflow-x-clip pt-3.5 pb-16" aria-label="Welcome">
      <PeekCarousel
        label="Featured banners"
        slideLabel="Banner"
        dotsLabel="Choose banner"
        prevLabel="Previous banner"
        nextLabel="Next banner"
        count={3}
        slideWidth={1258}
        activeWidth={1258}
        gap={12}
        start={1}
        dotOffset={0}
        nearDot={false}
        interval={5000}
      />
      <div className="relative mx-auto w-canvas">
        <div className="flex flex-col items-center gap-10 px-38 py-10">
          <div data-reveal className="flex flex-col items-center gap-3 text-center">
            <h1 className="w-[682px] font-display text-[64px]/[71px] font-semibold text-neutral-900">
              Best IAS Coaching in Delhi, India
            </h1>
            <Lead className="w-[780px]">
              For five decades, aspirants have trusted us to take them from their first class to the interview with
              experienced faculty, a structured method and honest guidance.
            </Lead>
          </div>
          <div data-reveal className="flex flex-col items-center gap-6" style={{ "--d": "80ms" } as CSSProperties}>
            <div className="flex items-center gap-3">
              <KnobButton href="#courses">Find your course</KnobButton>
              <OutlineButton href="#contact">Talk to a counsellor</OutlineButton>
            </div>
            <a className={cx(textLink(), "group/link")} href="#">
              <span>
                <span className="text-neutral-600">New to UPSC?</span>{" "}
                <span className="group-hover/link:underline group-hover/link:underline-offset-3">
                  See how the preparation works
                </span>
              </span>
              <ArrowRightIcon className={cx(NUDGE, "group-hover/link:translate-x-[3px]")} />
            </a>
          </div>
        </div>
        <HeroStats stats={heroStats} />
      </div>
    </section>
  );
}
