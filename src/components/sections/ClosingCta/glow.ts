import type { CSSProperties } from "react";

/**
 * A soft glow: the design's blurred ellipse as a radial gradient that fills its box (the ellipse plus
 * twice its blur on every side). `rgb` is space-separated, e.g. "238 106 18".
 */
export function glow(rgb: string, alpha: number): CSSProperties {
  const at = (share: number, stop: number) => `rgb(${rgb} / ${+(alpha * share).toFixed(3)}) ${stop}%`;
  return {
    background: `radial-gradient(closest-side, ${at(1, 0)}, ${at(0.9, 30)}, ${at(0.5, 57)}, ${at(0.2, 75)}, ${at(0.05, 90)}, transparent)`,
  };
}
