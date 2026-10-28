import type { ReactNode } from "react";
import { ArrowRightIcon, ChevronRightMdIcon, ChevronRightSmIcon, PhoneIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

/** Pill-button base. `group/btn` lets the icon react when the whole button is hovered. */
export const BUTTON_BASE =
  "group/btn relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-display font-semibold whitespace-nowrap [transition:background-color_.25s_var(--ease-smooth),box-shadow_.25s_var(--ease-smooth),color_.25s,scale_.15s] active:scale-98";

export const BUTTON_SIZE = {
  lg: "h-14 text-[18px]/[25px]",
  md: "h-12 text-[16px]/[23px]",
  sm: "h-10 text-[14px]/[21px]",
};

export const BUTTON_PRIMARY = "bg-brand-500 text-white hover:bg-brand-600";

const BUTTON_OUTLINE =
  "bg-white text-neutral-900 shadow-[inset_0_0_0_1px_var(--color-neutral-300)] hover:bg-neutral-50 hover:shadow-[inset_0_0_0_1px_var(--color-neutral-400)]";

/** Smooth icon movement used for the little hover nudges on arrows and chevrons. */
export const NUDGE = "transition-transform duration-300 ease-smooth";

/** Orange text link (16px semibold). Pass `pre` to keep the design's spacing around the label. */
export function textLink(pre = false): string {
  return cx(
    "inline-flex items-center gap-1.5 font-display text-[16px]/[22px] font-semibold text-brand-700",
    pre ? "whitespace-pre" : "whitespace-nowrap",
  );
}

type KnobButtonProps = {
  href: string;
  children: ReactNode;
  size?: "lg" | "md";
  /** "primary" is the orange pill; "light" is the white pill with a dark knob. */
  tone?: "primary" | "light";
  icon?: "arrow" | "phone";
};

/** Pill button with a round icon "knob" on the right. */
export function KnobButton({ href, children, size = "lg", tone = "primary", icon = "arrow" }: KnobButtonProps) {
  const Icon = icon === "phone" ? PhoneIcon : ArrowRightIcon;
  const toneClass =
    tone === "primary"
      ? cx(BUTTON_PRIMARY, "gap-3 py-1.5 pr-1.5", size === "lg" ? "pl-6" : "pl-4.5")
      : "gap-5 bg-white py-1.5 pr-1.5 pl-6 text-neutral-900 shadow-[inset_0_0_0_1px_var(--color-neutral-300)] hover:shadow-[inset_0_0_0_1px_var(--color-neutral-300),0_10px_24px_-10px_rgba(43,20,5,.45)]";

  return (
    <a href={href} className={cx(BUTTON_BASE, BUTTON_SIZE[size], toneClass)}>
      <span>{children}</span>
      <span
        className={cx(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
          size === "lg" ? "size-11" : "size-9",
          tone === "primary" ? "bg-white text-brand-500" : "bg-neutral-900 text-white",
        )}
      >
        <Icon
          className={cx(
            "transition-transform duration-300 ease-smooth",
            icon === "phone" ? "group-hover/btn:scale-106 group-hover/btn:-rotate-12" : "group-hover/btn:translate-x-[3px]",
          )}
        />
      </span>
    </a>
  );
}

type OutlineButtonProps = { href: string; children: ReactNode; size?: "lg" | "md"; className?: string };

/** White outlined pill button. */
export function OutlineButton({ href, children, size = "lg", className }: OutlineButtonProps) {
  return (
    <a
      href={href}
      className={cx(BUTTON_BASE, BUTTON_SIZE[size], BUTTON_OUTLINE, size === "lg" ? "gap-2 px-7 py-4" : "gap-2 px-6 py-3", className)}
    >
      <span>{children}</span>
    </a>
  );
}

type ChevronButtonProps = { href: string; children: ReactNode; size: "sm" | "md" };

/** Outlined pill button with a trailing chevron. */
export function ChevronButton({ href, children, size }: ChevronButtonProps) {
  const chevron = cx(NUDGE, "group-hover/btn:translate-x-0.5");
  return (
    <a
      href={href}
      className={cx(BUTTON_BASE, BUTTON_SIZE[size], BUTTON_OUTLINE, "gap-2", size === "sm" ? "py-2 pr-4 pl-5" : "py-3 pr-5 pl-6")}
    >
      {size === "sm" ? (
        <>
          <span>{children}</span>
          <ChevronRightSmIcon className={chevron} />
        </>
      ) : (
        <>
          <span className="whitespace-pre">{children}</span>
          <ChevronRightMdIcon className={chevron} />
        </>
      )}
    </a>
  );
}
