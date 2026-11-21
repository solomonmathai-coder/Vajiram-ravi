import type { ReactNode } from "react";
import { IArrow } from "./icons";

/**
 * The homepage's pill button (Kevin's .bt buttons as js/course-finder.js enhances them, from js/page-motion.js):
 * a rolling label (the text twice, the second sliding up on hover) and an arrow disc whose two arrows slide
 * through. `sq` is the disc's classes.
 */
export default function Pill({ href, className, sq = "sq", children }: { href: string; className: string; sq?: string; children: ReactNode }) {
  return (
    <a className={`bt bt--brand ${className} cta`} href={href} data-cta="1">
      <span className="btn__label">
        <span className="btn__t">{children}</span>
        <span className="btn__t" aria-hidden="true">
          {children}
        </span>
      </span>
      <span className={sq}>
        <IArrow />
        <IArrow />
      </span>
    </a>
  );
}
