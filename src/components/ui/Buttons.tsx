import type { ReactNode } from "react";
import { ChevronRightSmIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

/** Smooth icon movement used for the little hover nudges on arrows and chevrons. */
export const NUDGE = "transition-transform duration-300 ease-smooth";

/** The small orange square with an up-right arrow: the call to action on the course cards and the GS programme. */
export const ARROW_TILE =
  "flex size-9 shrink-0 items-center justify-center rounded-[4px] bg-brand-500 text-white transition-colors duration-300";

/**
 * The site's button, after "Watch video" in the design: two 36px boxes 2px apart, the label and a
 * square chevron. "primary" is orange with white text; "secondary" is white with black text, with a
 * faint outline so it still reads on light backgrounds.
 */
export type ButtonTone = "primary" | "secondary";

/** Classes for the <a> or <button> that holds the two boxes. `group/btn` lets both react to hovering either. */
export const SPLIT_BUTTON =
  "group/btn inline-flex shrink-0 cursor-pointer items-center gap-0.5 font-display text-[16px]/[22px] font-medium whitespace-nowrap transition-[scale] duration-150 active:scale-98 focus-visible:rounded-[6px]";

const BOX = "flex h-9 items-center rounded-[4px] transition-colors duration-200";

const TONE: Record<ButtonTone, string> = {
  primary: "bg-brand-500 text-white group-hover/btn:bg-brand-600",
  secondary:
    "bg-white text-neutral-900 shadow-[inset_0_0_0_1px_rgba(26,26,26,.1)] group-hover/btn:bg-neutral-100",
};

/** The label box and the chevron box. Use inside an element with SPLIT_BUTTON, e.g. a <button> that opens a dialog. */
export function SplitButtonParts({ children, tone = "secondary" }: { children: ReactNode; tone?: ButtonTone }) {
  return (
    <>
      <span className={cx(BOX, TONE[tone], "px-3.5")}>{children}</span>
      <span className={cx(BOX, TONE[tone], "w-9 justify-center")}>
        <ChevronRightSmIcon className={cx(NUDGE, "group-hover/btn:translate-x-0.5")} />
      </span>
    </>
  );
}

type SplitButtonProps = { href: string; children: ReactNode; tone?: ButtonTone; className?: string };

/** A link styled as the site's button. */
export function SplitButton({ href, children, tone = "secondary", className }: SplitButtonProps) {
  return (
    <a href={href} className={cx(SPLIT_BUTTON, className)}>
      <SplitButtonParts tone={tone}>{children}</SplitButtonParts>
    </a>
  );
}
