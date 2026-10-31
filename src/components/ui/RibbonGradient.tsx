"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { mountRibbonGradient, type RibbonPalette } from "@/lib/ribbonGradient";

type RibbonGradientProps = {
  palettes: RibbonPalette[];
  /** Positioning classes; the gradient fills this box. */
  className?: string;
};

/**
 * The animated ribbon gradient (lib/ribbonGradient) as a background layer. Until the WebGL canvas
 * draws its first frame, and where WebGL is unavailable, the box shows the first palette's base colour.
 */
export default function RibbonGradient({ palettes, className }: RibbonGradientProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const gradient = mountRibbonGradient(el, { palettes });
    return () => gradient?.destroy();
  }, [palettes]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx(
        "pointer-events-none overflow-hidden [&>canvas]:absolute [&>canvas]:inset-0 [&>canvas]:block [&>canvas]:size-full",
        className,
      )}
      style={{ backgroundColor: palettes[0][0] }}
    />
  );
}
