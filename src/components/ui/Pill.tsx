import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * Buttons and chips of the redesign (Figma "new modern design"): fully rounded pills in Geist Medium.
 * The main action is a pill with a round arrow "knob" at its right end; secondary actions are plain
 * outline pills. Both render a link when given `href`, otherwise a button.
 */

/** Pill fill and text colour. The outline tones are for secondary actions on the dark page or on the light panels. */
const SURFACE = {
  paper: "bg-paper text-char hover:bg-white",
  char: "bg-char text-paper hover:bg-[#2a221e]",
  orange: "bg-orange text-paper hover:bg-[#f47b27]",
  "outline-dark": "border border-paper/22 text-cream hover:border-paper/40 hover:bg-paper/6",
  "outline-light": "border border-sand-line text-char hover:border-[#d3cbc1] hover:bg-sand",
} as const;

/** The knob's fill and arrow colour. */
const KNOB = {
  char: "bg-char text-paper",
  paper: "bg-paper text-char",
  orange: "bg-orange text-paper",
} as const;

export type PillSurface = keyof typeof SURFACE;
export type KnobTone = keyof typeof KNOB;

const BASE =
  "group/pill relative inline-flex shrink-0 cursor-pointer items-center rounded-full font-sans font-medium whitespace-nowrap [transition:background-color_.3s_var(--ease-smooth),border-color_.3s_var(--ease-smooth),scale_.3s_var(--ease-smooth)] active:scale-97";

type PillTarget = {
  href?: string;
  /** For links that open elsewhere, e.g. "_blank" for a map. */
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
};

/** Renders a link for `href`, otherwise a button. */
function PillRoot({ href, target, rel, onClick, type = "button", ariaLabel, className, children }: PillTarget & { className: string; children: ReactNode }) {
  if (href !== undefined) {
    return (
      <a href={href} target={target} rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)} onClick={onClick} aria-label={ariaLabel} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  );
}

/**
 * The ↗ arrow inside a knob. On hover it slips out to the top right while a second one slides in from
 * the bottom left. `glyph` swaps the arrow, e.g. "→" for a forward step.
 */
export function KnobArrow({ glyph = "↗", className }: { glyph?: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cx("relative block size-4 overflow-hidden text-[16px]/none", className)}>
      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/pill:translate-x-full group-hover/pill:-translate-y-full group-hover/knob:translate-x-full group-hover/knob:-translate-y-full">
        {glyph}
      </span>
      <span className="absolute inset-0 flex -translate-x-full translate-y-full items-center justify-center transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/pill:translate-0 group-hover/knob:translate-0">
        {glyph}
      </span>
    </span>
  );
}

type ArrowPillProps = PillTarget & {
  children: ReactNode;
  surface: PillSurface;
  knob: KnobTone;
  /** md: 15px label, 38px knob (50px tall). sm: 14px label, 36px knob (48px tall). */
  size?: "md" | "sm";
  glyph?: string;
  className?: string;
};

/** Pill with the label on the left and a round arrow knob at the right end. */
export function ArrowPill({ children, surface, knob, size = "md", glyph, className, ...target }: ArrowPillProps) {
  return (
    <PillRoot
      {...target}
      className={cx(
        BASE,
        SURFACE[surface],
        "gap-3.5 py-1.5 pr-1.5",
        size === "md" ? "pl-6 text-[15px]/[1.2]" : "pl-5 text-[14px]/[1.2]",
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={cx(
          "flex shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/pill:scale-108",
          KNOB[knob],
          size === "md" ? "size-[38px]" : "size-9",
        )}
      >
        <KnobArrow glyph={glyph} />
      </span>
    </PillRoot>
  );
}

type PlainPillProps = PillTarget & {
  children: ReactNode;
  surface: PillSurface;
  /** md: 15px label, 52px tall with an outline. sm: 14px label, 44px tall. */
  size?: "md" | "sm";
  className?: string;
};

/** Pill with just a label, for secondary actions. */
export function PlainPill({ children, surface, size = "md", className, ...target }: PlainPillProps) {
  return (
    <PillRoot
      {...target}
      className={cx(BASE, SURFACE[surface], size === "md" ? "px-6 py-4 text-[15px]/[1.2]" : "px-5 py-3 text-[14px]/[1.2]", className)}
    >
      {children}
    </PillRoot>
  );
}

type ChipProps = {
  children: ReactNode;
  /** "dark" is for the dark page, "light" for the light panels. */
  tone: "dark" | "light";
  /** An orange status dot before the label. */
  dot?: boolean;
  className?: string;
};

/** Small rounded label, such as "Admissions for 2027 are open". */
export function Chip({ children, tone, dot = false, className }: ChipProps) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 font-sans text-[13px]/[1.2] font-medium whitespace-nowrap",
        tone === "dark" ? "border-paper/12 bg-paper/6 text-cream" : "border-sand-line bg-sand text-char",
        className,
      )}
    >
      {dot && <span className="size-[7px] shrink-0 rounded-full bg-orange" aria-hidden="true" />}
      {children}
    </span>
  );
}
