"use client";

import CircularCarousel from "@/components/ui/CircularCarousel";
import type { Educator } from "@/data/faculty";

/** The autoplay step, ms. */
const AUTOPLAY_MS = 4500;

/**
 * The educators on a circular carousel (after React Bits' "Circular Carousel"): portrait cards standing
 * round a ring, each bent to follow it, the camera looking a little down onto it. The card at the front is
 * in colour; the rest are in black and white (colour on hover) and fade into the cream as they turn away.
 * Homepage v2: each card is the Figma topper card (a dark fade up from its foot), and the front one carries
 * its educator's subject, name and experience on itself (FrontCard), with no caption under the ring, to
 * save the scroll. It turns by drag, swipe, the arrows just beside the ring, dots
 * and keys, and plays on its own, pausing while the pointer is on the front card, on keyboard focus and
 * off screen (no pause button).
 *
 * `plate="reference"` (the About page): the final site's ring (vajiram-ravi.abhishek-ps.workers.dev, as measured
 * there): cards 264 × 340 with 8px corners, each picture at the card's width set 30% down, a card lifting 10px
 * under the pointer, the orange arrows and dots, and the front card's plate drawn inside the card (turning and
 * lifting with it): its own dark fade, the name in Newsreader and the subject in amber, no chip or border.
 */
export default function EducatorFlow({ educators, plate = "homepage" }: { educators: Educator[]; plate?: "homepage" | "reference" }) {
  if (plate === "reference") {
    return (
      <CircularCarousel
        items={educators}
        label="Our educators"
        itemName="educator"
        slideTitle={(educator) => `${educator.name}, ${educator.focus}`}
        image={(educator) => educator.photo}
        href={(educator) => educator.profile}
        renderSlide={(educator) => <SlideText educator={educator} />}
        renderFront={(educator) => <ReferencePlate educator={educator} />}
        frontInCard
        lift
        cardRadius={8}
        photoY="30%"
        width={264}
        height={340}
        gap={30}
        interval={AUTOPLAY_MS}
        fadeColor="#fff8ec"
        backColor="#ead9c2"
        tone="brand"
        spacing={28}
        arrowReach={523}
      />
    );
  }
  return (
    <CircularCarousel
      items={educators}
      label="Our educators"
      itemName="educator"
      slideTitle={(educator) => `${educator.name}, ${educator.focus}`}
      image={(educator) => educator.photo}
      href={(educator) => educator.profile}
      renderSlide={(educator) => <SlideText educator={educator} />}
      renderFront={(educator) => <FrontCard educator={educator} />}
      shade
      width={264}
      height={372}
      gap={30}
      interval={AUTOPLAY_MS}
      fadeColor="#fff8ec"
      backColor="#ead9c2"
      tone="light"
      spacing={28}
      // The ring's visible ends are about 467px either side of the centre; the arrows sit 32px clear of them.
      arrowReach={523}
    />
  );
}

/** The slide's content for assistive technology: the card itself is only the portrait. */
function SlideText({ educator }: { educator: Educator }) {
  const { name, focus, qualifications, experience, introduction } = educator;
  const details = [focus, qualifications, experience, introduction].filter(Boolean).join(". ");
  return (
    <>
      <h3>{name}</h3>
      {details && <p>{details}</p>}
    </>
  );
}

/**
 * The front card's type, as the Figma topper card (homepage v2: the details on the card itself, kept
 * short): the subject in the orange chip at the top left, and at the foot, over the card's dark fade, the
 * name and the experience. An orange border marks the card at the front.
 */
function FrontCard({ educator }: { educator: Educator }) {
  const { name, focus, experience, qualifications } = educator;
  return (
    <div className="relative size-full rounded-[18px] ring-2 ring-[#e57512] ring-inset">
      {focus && (
        <span className="absolute top-3 left-3 rounded-full bg-[#e57512] px-2.5 py-1 text-[12px]/[14px] font-semibold tracking-[0.02em] text-white">{focus}</span>
      )}
      <div className="absolute inset-x-4 bottom-4 text-left text-white">
        <p className="font-heading text-[20px]/[1.2] font-semibold">{name}</p>
        {(experience || qualifications) && <p className="mt-1 text-[13px]/[1.35] text-white/75">{experience || qualifications}</p>}
      </div>
    </div>
  );
}

/**
 * The final site's front plate (its .cc-plate): the card's dark fade, and at its foot the name in Newsreader with
 * a soft shadow and the subject under it in amber; no chip, no border.
 */
function ReferencePlate({ educator }: { educator: Educator }) {
  const { name, focus } = educator;
  return (
    <div className="relative size-full overflow-hidden rounded-[8px] bg-[linear-gradient(180deg,rgb(0_0_0/0)_52%,rgb(30_14_6/0.55)_76%,rgb(30_14_6/0.88)_100%)]">
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-4 pb-4 text-left">
      <span className="font-[family-name:var(--font-news)] text-[22px]/[1.15] font-medium tracking-[-0.01em] text-white [text-shadow:0_1px_12px_rgb(20_8_2/0.35)]">{name}</span>
      {focus && <span className="font-heading text-[13px]/[1.3] font-semibold tracking-[0.02em] text-[#ffd9a8]">{focus}</span>}
    </div>
    </div>
  );
}
