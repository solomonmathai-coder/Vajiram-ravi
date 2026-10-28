import { RankShapeNarrow, RankShapeWide } from "@/components/icons";
import { cx } from "@/lib/cx";

type RankBadgeProps = { rank: number; narrow?: boolean };

/** Orange "AIR n" ribbon pinned to the top-left of a topper's photo. */
export default function RankBadge({ rank, narrow = false }: RankBadgeProps) {
  const Shape = narrow ? RankShapeNarrow : RankShapeWide;
  return (
    <div
      className={cx(
        "absolute top-0 left-0 z-1 flex h-[78px] flex-col items-center pt-2.5 text-white",
        narrow ? "w-[46px]" : "w-[67px]",
      )}
    >
      <Shape className="absolute inset-0" />
      <span className={cx("relative font-display text-[14px]/[20px] font-bold uppercase", narrow && "tracking-[.84px]")}>
        AIR
      </span>
      <span className={cx("relative font-display text-[26px]/[32px]", narrow ? "font-bold" : "font-semibold")}>{rank}</span>
    </div>
  );
}
