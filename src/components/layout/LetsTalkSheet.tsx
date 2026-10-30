"use client";

import { useEffect, useRef } from "react";
import { contact } from "@/data/site";
import { cx } from "@/lib/cx";
import { lockScroll } from "@/lib/smoothScroll";

type LetsTalkSheetProps = { open: boolean; onClose: () => void };

/** The same ways to reach us as the contact section, in its words. */
const OPTIONS = [
  { title: "Course counselling", text: "Not sure which programme fits? A counsellor can help you.", action: "Book a free session", href: "#counsellor" },
  { title: "Chat on WhatsApp", text: "Quick answers on courses, batches and fees from our admissions team.", action: "Chat on WhatsApp", href: "https://wa.me/918062206330" },
  { title: "Email us", text: `Write to us on: ${contact.email}`, action: "Send an email", href: `mailto:${contact.email}` },
  { title: "Talk to us", text: `Contact us on: ${contact.phone}`, action: "Call now", href: contact.phoneHref },
];

/**
 * The "Let's talk" sheet the nav button opens: the ways to reach the admissions team, sliding in from
 * the right over a dimmed page. Escape, the backdrop and the close button dismiss it, and focus moves
 * into it on open and back to the button on close.
 */
export default function LetsTalkSheet({ open, onClose }: LetsTalkSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <div className={cx("fixed inset-0 z-60", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open} inert={!open}>
      <div
        className={cx("absolute inset-0 bg-coal/60 backdrop-blur-sm transition-opacity duration-500", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lets-talk-h"
        data-lenis-prevent
        className={cx(
          "absolute top-3 right-3 bottom-3 flex w-[420px] flex-col gap-8 rounded-[28px] border border-paper/10 bg-soot p-8 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.7)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
          open ? "translate-x-0" : "translate-x-[calc(100%+24px)]",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 id="lets-talk-h" className="text-[30px]/[1.15] font-medium tracking-[-0.75px] text-cream">
              Let&rsquo;s talk
            </h2>
            <p className="text-[15px]/[1.5] text-cream/60">We&rsquo;re here to help you anytime, any way</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-paper/15 text-[18px] text-cream/80 transition-colors hover:bg-paper/8 hover:text-paper"
          >
            ×
          </button>
        </div>
        <ul className="flex flex-col gap-3">
          {OPTIONS.map((option) => (
            <li key={option.title}>
              <a
                href={option.href}
                onClick={option.href.startsWith("#") ? onClose : undefined}
                className="group/opt flex items-center justify-between gap-4 rounded-[20px] border border-paper/8 bg-paper/[.03] p-5 transition-colors duration-300 hover:border-paper/16 hover:bg-paper/6"
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[17px]/[1.3] font-medium text-cream">{option.title}</span>
                  <span className="text-[14px]/[1.45] text-cream/65">{option.text}</span>
                  <span className="mt-1 text-[13px]/[1.45] font-medium text-tangerine">{option.action} →</span>
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-paper/15 text-cream transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/opt:rotate-45">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
