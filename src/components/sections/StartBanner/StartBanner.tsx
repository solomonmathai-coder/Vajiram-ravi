import { SplitButton } from "@/components/ui/Buttons";
import { startBanner } from "@/data/home";
import { contact } from "@/data/site";
import PixelField from "./PixelField";

/**
 * The closing banner: the design's copy and actions on a yellow panel, with pixels moving across a
 * faint grid on the right after the banner on lightdash.com (PixelField).
 */
export default function StartBanner() {
  return (
    // A white band, as in the design. It slides up over the empty end of the pinned courses stage
    // (CourseRail), so it is positioned to paint above it, and its top fades in from clear so the
    // courses glow melts into the white instead of stopping at a hard edge.
    <section
      className="relative bg-[linear-gradient(to_bottom,transparent,var(--color-white)_96px)]"
      aria-labelledby="start-title"
    >
      <div className="mx-auto w-canvas px-10 py-24">
        <div className="relative flex h-[376px] items-center overflow-clip rounded-[32px] bg-yellow-300 px-20">
          <PixelField />

          <div className="relative flex flex-col items-start gap-7">
            <div className="flex flex-col gap-3 font-medium">
              <h2 id="start-title" className="font-display text-[44px]/[52px] text-neutral-900">
                {startBanner.heading}
              </h2>
              <p className="w-[560px] font-sans text-[18px]/[27px] text-neutral-800">{startBanner.intro}</p>
            </div>
            <div className="flex items-center gap-4">
              <SplitButton href={startBanner.primary.href} tone="primary">
                {startBanner.primary.label}
              </SplitButton>
              <SplitButton href={startBanner.secondary.href}>{startBanner.secondary.label}</SplitButton>
            </div>
            <p className="font-sans text-[14px]/[18px] font-medium whitespace-pre text-neutral-800">
              {"Prefer to call? "}
              <a href={contact.phoneHref} className="underline-offset-2 hover:underline">
                {contact.phone}
              </a>
              {`  ·  ${contact.hours}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
