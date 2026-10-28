"use client";

import { useState } from "react";
import { PlusMinusIcon } from "@/components/icons";
import type { Faq } from "@/data/faqs";
import { cx } from "@/lib/cx";

/** Accordion that keeps at most one answer open. The first one starts open. */
export default function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div data-reveal className="flex w-full flex-col" id="faqList">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = i + 1;
        return (
          <div
            key={item.question}
            className={cx(
              "border-b [transition:padding_.35s_var(--ease-smooth)] first:border-t first:border-t-line-warm",
              isOpen ? "border-b-line-warm px-1 py-5.5" : "border-b-line py-7 last:border-b-0",
            )}
          >
            <button
              className="group/q flex w-full items-center gap-6 rounded-lg text-left"
              aria-expanded={isOpen}
              aria-controls={`a${id}`}
              id={`q${id}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="min-w-0 flex-1 font-display text-[20px]/[27px] font-normal text-neutral-900 transition-colors duration-200 group-hover/q:text-brand-700">
                {item.question}
              </span>
              <PlusMinusIcon open={isOpen} />
            </button>
            <div
              id={`a${id}`}
              role="region"
              aria-labelledby={`q${id}`}
              className={cx(
                "grid transition-[grid-template-rows] duration-350 ease-smooth",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="w-[934px] pt-2.5 font-sans text-[16px]/[23px] font-medium text-neutral-500">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
