import Photo from "@/components/ui/Photo";
import { ArrowPill } from "@/components/ui/Pill";
import { counsellingTile, stages, type BentoProgramme } from "@/data/programme-bento";
import { cx } from "@/lib/cx";

/*
 * The cards of the programme bento. The ↗ sits in every card's bottom right corner, clear of the text.
 * On hover a card lifts 4px, its illustration grows to 1.04 and the ↗ turns 45° to point ahead; the whole
 * card is the link.
 */

const EASE = "duration-500 ease-[cubic-bezier(.2,.8,.2,1)]";
const CARD = cx("group/card relative block h-[332px] overflow-clip rounded-3xl transition-[translate] hover:-translate-y-1", EASE);

const stageLabel = (programme: BentoProgramme) => stages.find((s) => s.id === programme.stage)?.label ?? "";

/** The illustration in its rounded frame; only the picture grows on hover, so the frame stays put. */
function Illustration({ programme, className, sizes }: { programme: BentoProgramme; className: string; sizes: string }) {
  return (
    <div className={cx("overflow-clip rounded-2xl", className)}>
      <Photo
        className={cx("absolute inset-0 transition-[scale] group-hover/card:scale-104", EASE)}
        src={programme.image}
        alt=""
        sizes={sizes}
      />
    </div>
  );
}

/** The round ↗ button. */
function Knob({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={cx("absolute flex size-10 items-center justify-center rounded-full", className)}>
      <span className={cx("block text-[16px]/none font-medium transition-[rotate] group-hover/card:rotate-45", EASE)}>↗</span>
    </span>
  );
}

/** Dark double-width card with a large illustration and a warm glow behind it. */
export function WideCard({ programme }: { programme: BentoProgramme }) {
  return (
    <a href={programme.href} className={cx(CARD, "bg-soot")}>
      <img
        src="/images/courses/glow-card.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[-20px] left-[192px] h-[540px] w-[660px] max-w-none"
      />
      <Illustration programme={programme} className="absolute top-4 left-[316px] h-[268px] w-[300px]" sizes="300px" />
      <div className="relative flex h-full w-[280px] flex-col items-start pt-7 pb-5 pl-7">
        <span className="rounded-full border border-paper/12 bg-paper/8 px-2.5 py-[5px] text-[12px]/[1.2] font-medium text-cream">
          {stageLabel(programme)}
        </span>
        <h3 className="mt-3.5 text-[34px]/[1.15] font-medium tracking-[-1.02px] text-cream">{programme.title}</h3>
        <p className="mt-2.5 text-[14px]/[1.5] text-cream/60">{programme.modes}</p>
        <p className="mt-auto text-[14px]/[1.5] font-medium text-cream/80">{programme.courseCount} courses</p>
      </div>
      <Knob className="right-4 bottom-4 bg-paper text-char" />
    </a>
  );
}

/** Light single card: illustration on top, then the stage, the title and the modes. */
export function SmallCard({ programme }: { programme: BentoProgramme }) {
  return (
    <a href={programme.href} className={cx(CARD, "border border-sand-line bg-sand p-[15px]")}>
      <Illustration programme={programme} className="relative h-[140px] w-[276px]" sizes="276px" />
      <div className="flex flex-col items-start px-1">
        <span className="mt-4 rounded-full border border-sand-line bg-shell px-2.5 py-[5px] text-[12px]/[1.2] font-medium text-stone">
          {stageLabel(programme)}
        </span>
        <h3 className="mt-3.5 w-[268px] text-[20px]/[1.15] font-medium tracking-[-0.3px] text-char">{programme.title}</h3>
        <p className="mt-2.5 text-[14px]/[1.5] whitespace-nowrap text-char/60">{programme.modes}</p>
        <p className="mt-1 text-[14px]/[1.5] font-medium whitespace-nowrap text-char/80">{programme.courseCount} courses</p>
      </div>
      <Knob className="right-[15px] bottom-[15px] bg-char text-paper" />
    </a>
  );
}

/** The orange tile that closes the bento and points to a counsellor. */
export function CounsellingTile() {
  return (
    <div className="flex h-[332px] flex-col items-start overflow-clip rounded-3xl bg-[linear-gradient(154.6deg,#ff8a3d_14.286%,#ee6a12_50%,#420727_85.714%)] px-7 pt-7 pb-[22px]">
      <h3 className="w-[420px] text-[34px]/[1.1] font-medium tracking-[-1.02px] text-paper">{counsellingTile.title}</h3>
      <p className="mt-[13px] text-[16px]/[1.5] text-paper/85">{counsellingTile.text}</p>
      <ArrowPill href={counsellingTile.cta.href} surface="paper" knob="char" className="mt-auto">
        {counsellingTile.cta.label}
      </ArrowPill>
    </div>
  );
}
