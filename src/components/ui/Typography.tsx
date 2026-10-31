import Image from "next/image";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type EyebrowProps = {
  children: ReactNode;
  tone?: "brown" | "rust" | "neutral" | "green";
  tagged?: boolean;
  /** Colour of the tag shape in the tagged style. */
  tag?: "dark" | "amber" | "green";
  /** Renders the label as the section's heading, for sections without a separate title. */
  as?: "p" | "h2";
  id?: string;
};

const EYEBROW_TONE = {
  brown: "text-brown-700",
  rust: "text-brand-900",
  neutral: "text-neutral-600",
  green: "text-green-800",
};

const TAG_IMAGE = {
  dark: "/images/icons/eyebrow-tag.svg",
  amber: "/images/icons/eyebrow-tag-amber.svg",
  green: "/images/icons/eyebrow-tag-green.svg",
};

/**
 * Small label above a section heading, e.g. "WHY CHOOSE VAJIRAM & RAVI". `tagged` is the newer
 * style: uppercase, led by a small dark tag shape.
 */
export function Eyebrow({ children, tone = "brown", tagged = false, tag = "dark", as: Label = "p", id }: EyebrowProps) {
  const label = (
    <Label
      id={id}
      className={cx(
        "font-display text-[14px]/[21px] font-semibold whitespace-nowrap",
        EYEBROW_TONE[tone],
        tagged && "uppercase",
      )}
    >
      {children}
    </Label>
  );
  if (!tagged) return label;
  return (
    <div className="flex items-center gap-2.5">
      <Image src={TAG_IMAGE[tag]} alt="" width={18} height={10} />
      {label}
    </div>
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
