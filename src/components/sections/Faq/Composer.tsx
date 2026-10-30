"use client";

import type { FormEvent } from "react";
import { ArrowPill } from "@/components/ui/Pill";
import { counsellorChat } from "@/data/faq-chat";
import { prefersReducedMotion } from "@/lib/motion";

/** Phones and touch tablets, where WhatsApp is the natural way to reach a counsellor. */
function isHandheld(): boolean {
  return window.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)").matches;
}

/**
 * "Ask your own question": nothing answers automatically. The question goes to a counsellor, as a
 * pre-filled WhatsApp message on phones, or through the enquiry form (its first step) on desktop.
 */
export default function Composer() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = String(new FormData(event.currentTarget).get("question") ?? "").trim();

    if (isHandheld()) {
      const text = question ? `?text=${encodeURIComponent(question)}` : "";
      window.open(`https://wa.me/${counsellorChat.whatsappNumber}${text}`, "_blank", "noopener,noreferrer");
      return;
    }

    const section = document.getElementById(counsellorChat.enquirySectionId);
    if (!section) {
      window.location.hash = counsellorChat.enquirySectionId;
      return;
    }
    section.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    // Start the visitor on the form's first field.
    section.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
  };

  return (
    <form onSubmit={onSubmit} className="relative flex w-full items-center gap-2.5 px-6 pt-2 pb-6">
      <input
        type="text"
        name="question"
        aria-label="Ask your own question"
        placeholder={counsellorChat.placeholder}
        autoComplete="off"
        className="h-[52px] min-w-0 flex-1 rounded-full border border-paper/12 bg-paper/5 px-5 text-[15px]/[1.5] text-cream [transition:border-color_.3s_var(--ease-smooth),background-color_.3s_var(--ease-smooth)] placeholder:text-cream/45 hover:border-paper/20 focus:border-paper/30 focus:bg-paper/8"
      />
      <ArrowPill type="submit" surface="orange" knob="paper" size="sm">
        {counsellorChat.cta}
      </ArrowPill>
    </form>
  );
}
