"use client";

import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import EnquiryForm from "./EnquiryForm";

type EnquiryStripProps = {
  /** The counsellor intro on the left, rendered on the server. */
  intro: ReactNode;
  programmes: string[];
  timePreferences: string[];
};

/**
 * The dark strip under the batch cards: the counsellor intro and the two-step enquiry form. When a
 * "Register now" asks for it, the strip scrolls into view and its edge glows orange for a moment.
 */
export default function EnquiryStrip({ intro, programmes, timePreferences }: EnquiryStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  const reveal = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const reduce = prefersReducedMotion();
    strip.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    if (reduce) return;
    strip.animate(
      [
        { boxShadow: "0 0 0 1px rgb(238 106 18 / 0), 0 0 0 0 rgb(238 106 18 / 0)" },
        { boxShadow: "0 0 0 1px rgb(238 106 18 / 0.7), 0 0 48px -8px rgb(238 106 18 / 0.45)", offset: 0.35 },
        { boxShadow: "0 0 0 1px rgb(238 106 18 / 0), 0 0 0 0 rgb(238 106 18 / 0)" },
      ],
      { duration: 1600, delay: 350, easing: "ease-out" },
    );
  };

  return (
    <div
      ref={stripRef}
      id="counsellor"
      data-reveal
      className="relative flex w-full items-start gap-12 rounded-[28px] border border-paper/8 bg-soot p-8"
    >
      {intro}
      <EnquiryForm programmes={programmes} timePreferences={timePreferences} onRequested={reveal} />
    </div>
  );
}
