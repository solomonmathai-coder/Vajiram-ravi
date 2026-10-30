import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type SheetProps = {
  id?: string;
  labelledBy?: string;
  /** "shell" is the usual panel colour; "sand" is the deeper panel (programme finder, FAQ). */
  tone?: "shell" | "sand";
  /** Layout of the 1440px inner canvas; the default padding is the design's 80px sides and 120px top and bottom. */
  className?: string;
  children: ReactNode;
  /** Something placed against the panel itself rather than its content, such as a hint at its bottom edge. */
  after?: ReactNode;
};

/**
 * A light panel on the dark page: full width with 40px rounded corners, so the dark page shows around
 * them where panels meet. The content sits on the 1440px canvas.
 */
export default function Sheet({ id, labelledBy, tone = "shell", className, children, after }: SheetProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx("relative overflow-clip rounded-[40px] text-char", tone === "shell" ? "bg-shell" : "bg-sand")}
    >
      <div className={cx("relative mx-auto w-canvas px-20 py-30", className)}>{children}</div>
      {after}
    </section>
  );
}
