import { ArrowRightIcon } from "@/components/icons";
import { NUDGE } from "@/components/ui/Buttons";
import { heroStats, heroVideo } from "@/data/home";
import { cx } from "@/lib/cx";
import HeroStats from "./HeroStats";
import HeroVideo from "./HeroVideo";

/** Glass pill used for the hero's main call to action. */
const GLASS_CTA =
  "liquid-glass inline-flex items-center justify-center rounded-full font-inter text-white [transition:scale_.3s_var(--ease-smooth)] hover:scale-[1.03] active:scale-[.99]";

/**
 * Cinematic hero: a full-screen looping video with the headline, lead, calls to action and the
 * headline numbers on top. The header turns transparent while it floats over this section
 * (see SiteHeader), so the section is pulled up underneath it.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Welcome"
      className={cx(
        // -mt-20 pulls the section up under the 80px sticky header.
        "relative isolate -mt-20 flex flex-col overflow-hidden bg-navy text-white",
        // The brand-orange focus ring is hard to see on the video, so use white here.
        "[&_a:focus-visible]:outline-white",
        // Fill the screen below the 39px utility bar, between 760px and 1080px of canvas.
        // The canvas zoom shrinks viewport units too, so divide it back out.
        "min-h-[clamp(760px,calc(100svh_/_var(--canvas-zoom,1)_-_39px),1080px)]",
      )}
    >
      <HeroVideo src={heroVideo.src} />

      <div className="relative z-10 mx-auto flex w-canvas flex-1 flex-col items-center justify-center px-6 pt-38 pb-14 text-center">
        <h1 className="max-w-7xl animate-fade-rise font-serif text-8xl/[0.95] font-normal tracking-[-2.46px] text-balance">
          Best IAS Coaching <em className="text-mist not-italic">in Delhi, India</em>
        </h1>
        <p className="mt-8 max-w-2xl animate-fade-rise-delay font-inter text-lg/relaxed text-mist">
          For five decades, aspirants have trusted us to take them from their first class to the interview with
          experienced faculty, a structured method and honest guidance.
        </p>
        <div className="mt-12 flex animate-fade-rise-delay-2 flex-col items-center gap-7">
          <div className="flex items-center gap-4">
            <a href="#courses" className={cx(GLASS_CTA, "px-14 py-5 text-base")}>
              Find your course
            </a>
            <a
              href="#contact"
              className="rounded-full px-8 py-5 font-inter text-base text-mist transition-colors duration-300 hover:text-white"
            >
              Talk to a counsellor
            </a>
          </div>
          <a
            href="#"
            className="group/link inline-flex items-center gap-1.5 font-inter text-sm text-mist transition-colors duration-300 hover:text-white"
          >
            <span>
              New to UPSC?{" "}
              <span className="text-white underline-offset-4 group-hover/link:underline">See how the preparation works</span>
            </span>
            <ArrowRightIcon className={cx(NUDGE, "text-white group-hover/link:translate-x-[3px]")} />
          </a>
        </div>
      </div>

      <HeroStats stats={heroStats} />
    </section>
  );
}
