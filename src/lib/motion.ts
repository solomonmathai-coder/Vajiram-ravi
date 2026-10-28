export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Resolves once web fonts have loaded, so text measurements are final. */
export function whenFontsReady(): Promise<unknown> {
  return document.fonts?.ready ?? Promise.resolve();
}

/** Always-positive modulo, for wrapping carousel indexes. */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
