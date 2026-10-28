import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type EyebrowProps = { children: ReactNode; tone?: "brown" | "rust" };

/** Small label above a section heading, e.g. "WHY CHOOSE VAJIRAM & RAVI". */
export function Eyebrow({ children, tone = "brown" }: EyebrowProps) {
  return (
    <p
      className={cx(
        "font-display text-[14px]/[21px] font-semibold whitespace-nowrap",
        tone === "brown" ? "text-brown-700" : "text-brand-900",
      )}
    >
      {children}
    </p>
  );
}

type SectionTitleProps = { id: string; children: ReactNode; className?: string };

/** The 40px section heading. Use `className` for width and alignment only. */
export function SectionTitle({ id, children, className }: SectionTitleProps) {
  return (
    <h2 id={id} className={cx("font-display text-[40px]/[47px] font-semibold text-neutral-900", className)}>
      {children}
    </h2>
  );
}

type LeadProps = { children: ReactNode; className?: string; tone?: "muted" | "body" };

/** The 18px intro paragraph under a section heading. Use `className` for width and alignment only. */
export function Lead({ children, className, tone = "muted" }: LeadProps) {
  return (
    <p
      className={cx(
        "font-sans text-[18px]/[25px] font-medium",
        tone === "muted" ? "text-neutral-500" : "text-neutral-600",
        className,
      )}
    >
      {children}
    </p>
  );
}
