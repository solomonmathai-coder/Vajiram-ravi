import { programmes, programmesIntro } from "@/data/programmes";
import CourseShelf from "./CourseShelf";

/**
 * The UPSC programmes (homepage v2, IA 2): the course shelf of homepage v1 (the client kept it), on design
 * S's ground, and with design S's way in.
 *
 *   - The ground: the paper (#fffaf3) with design S's jaali lattice (a faint diamond trellis, 36px, its
 *     bg-jaali.svg) showing at the sides and veiled to near cream in the middle, where the books stand.
 *   - The way in (design S): the section is a sheet with rounded top corners and a soft shadow above it that
 *     slides up over the hero, which stays pinned, darkens and draws back as it is covered; the sheet's
 *     content fades and lifts in as it rises (ui/CoverSheet sets --cov from the scroll).
 *   - The heading in Mukta semibold, for contrast (the client: the old heading "lacks contrast… maybe the
 *     font weight"), then the filter and the books on at most two planks (CourseShelf; more than eight go
 *     to "View all").
 *
 * The flagship card, the second heading and the counsellor note of v1 are gone, to save the scroll.
 */
export default function Programmes() {
  const { title } = programmesIntro;
  return (
    <section
      id="programmes"
      aria-labelledby="programmes-h"
      className="relative z-[2] overflow-clip rounded-t-[28px] shadow-[0_-30px_60px_-24px_rgb(20_8_2/0.55)]"
      style={{
        background:
          "linear-gradient(90deg, rgb(255 250 243 / 0) 0%, rgb(255 250 243 / 0.94) 30%, rgb(255 250 243 / 0.94) 70%, rgb(255 250 243 / 0) 100%), url(/images/ornaments/bg-jaali.svg) 0 0 / 36px 36px repeat, #fffaf3",
      }}
    >
      <div
        className="relative mx-auto flex w-canvas flex-col items-center px-20 pt-20 pb-20"
        // Fades and lifts in as the sheet rises over the hero (ui/CoverSheet); at rest without the script.
        style={{ opacity: "var(--cov, 1)", translate: "0 calc((1 - var(--cov, 1)) * 44px)" }}
      >
        <h2 id="programmes-h" className="w-[860px] text-center font-heading text-[54px]/[1.08] font-semibold tracking-[-0.02em] text-ink">
          {title.before}{" "}
          <em className="text-burnt not-italic">{title.em}</em> {title.after}
        </h2>
        <div className="mt-10 w-full">
          <CourseShelf programmes={programmes} />
        </div>
      </div>
    </section>
  );
}
