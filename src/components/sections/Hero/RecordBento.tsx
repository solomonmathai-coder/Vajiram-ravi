import CountUp from "@/components/ui/CountUp";
import Photo from "@/components/ui/Photo";
import { records, type RecordCard } from "@/data/hero";
import { cx } from "@/lib/cx";

/** Card fills and text colours, after the four record cards in the design. */
const LOOK: Record<RecordCard["look"], { card: string; value: string; label: string }> = {
  gradient: {
    card: "bg-[linear-gradient(144.4deg,#ff8a3d_14.3%,#ee6a12_46.4%,#420727_85.7%)]",
    value: "text-paper",
    label: "text-paper/80",
  },
  light: { card: "bg-sand", value: "text-char", label: "text-char/70" },
  dark: { card: "border border-paper/8 bg-soot", value: "text-paper", label: "text-paper/80" },
  photo: { card: "bg-soot", value: "text-paper", label: "text-paper/80" },
};

/** The four record cards under the hero copy. Each figure counts up once, when the row is 40% in view. */
export default function RecordBento() {
  return (
    <div data-reveal-group className="mt-14 flex gap-4">
      {records.map((record) => {
        const look = LOOK[record.look];
        return (
          <div
            key={record.value}
            className={cx(
              "group/rec relative h-[220px] min-w-px flex-1 overflow-clip rounded-3xl transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1",
              look.card,
            )}
          >
            {record.image && (
              <>
                <Photo
                  className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/rec:scale-105"
                  src={record.image}
                  alt=""
                  sizes="308px"
                />
                <div className="absolute inset-0 bg-coal/62" />
              </>
            )}
            <p className={cx("absolute top-[22px] left-6 text-[64px]/none font-medium tracking-[-3.2px] whitespace-nowrap", look.value)}>
              <CountUp value={record.value} />
            </p>
            <p className={cx("absolute top-[156px] left-6 w-[200px] text-[15px]/[1.4] font-medium", look.label)}>{record.label}</p>
          </div>
        );
      })}
    </div>
  );
}
