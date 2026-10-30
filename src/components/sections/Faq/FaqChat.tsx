"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Photo from "@/components/ui/Photo";
import { counsellorChat, type FaqEntry } from "@/data/faq-chat";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import Composer from "./Composer";

const EASE = "cubic-bezier(.2,.8,.2,1)";
/** The question settles in before the counsellor starts "typing". */
const QUESTION_MS = 350;
const TYPING_MS = 600;

/** The counsellor's speech bubble, for the typing dots and the answer. */
const BUBBLE = "flex origin-bottom-left flex-col items-start rounded-[20px] rounded-bl-[6px] border border-paper/10 bg-paper/7 px-[18px] py-3.5";

type Phase = "question" | "typing" | "answer";

const whatsappHref = `https://wa.me/${counsellorChat.whatsappNumber}`;

type FaqChatProps = {
  entries: FaqEntry[];
  /** The section heading, above the questions. */
  heading: ReactNode;
};

/**
 * Suggested questions on the left; picking one "sends" it into the counsellor chat on the right:
 * the question appears as a bubble, the counsellor types for a moment, then the answer fades in.
 * Every question and answer is in the page's HTML (the others are hidden), so the FAQ stays crawlable.
 */
export default function FaqChat({ entries, heading }: FaqChatProps) {
  // The first answer is already showing when the page loads.
  const [chat, setChat] = useState<{ active: number; phase: Phase }>({ active: 0, phase: "answer" });
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const played = useRef(false);
  const questionRef = useRef<HTMLParagraphElement>(null);
  const replyRef = useRef<HTMLDivElement>(null);
  const { active, phase } = chat;

  const ask = (index: number) => {
    if (index === active && phase === "answer") return;
    timers.current.forEach(clearTimeout);
    played.current = true;
    if (prefersReducedMotion()) {
      setChat({ active: index, phase: "answer" });
      return;
    }
    setChat({ active: index, phase: "question" });
    timers.current = [
      setTimeout(() => setChat({ active: index, phase: "typing" }), QUESTION_MS),
      setTimeout(() => setChat({ active: index, phase: "answer" }), QUESTION_MS + TYPING_MS),
    ];
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Each step enters with a short rise: the question from the right, the replies from the left.
  useEffect(() => {
    if (!played.current || prefersReducedMotion()) return;
    const target = phase === "question" ? questionRef.current : replyRef.current;
    const from = phase === "question" ? "translate(12px, 8px) scale(.96)" : "translate(-8px, 8px) scale(.97)";
    target?.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: "none" }], {
      duration: phase === "answer" ? 380 : 300,
      easing: EASE,
    });
  }, [active, phase]);

  return (
    <div className="flex w-full items-start gap-16">
      <div data-reveal className="flex w-[440px] shrink-0 flex-col items-start gap-7">
        {heading}
        <ul className="flex w-full flex-col items-start gap-2">
          {entries.map((entry, i) => {
            const selected = i === active;
            return (
              <li key={entry.question} className="w-full">
                <button
                  type="button"
                  onClick={() => ask(i)}
                  aria-controls="faq-chat-log"
                  aria-current={selected ? "true" : undefined}
                  className={cx(
                    "group/prompt flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left font-medium [transition:background-color_.3s_var(--ease-smooth),border-color_.3s_var(--ease-smooth),color_.3s_var(--ease-smooth)]",
                    selected ? "border-char bg-char text-paper" : "border-sand-line bg-shell text-char hover:border-[#d3cbc1] hover:bg-paper",
                  )}
                >
                  <span className="min-w-0 flex-1 text-[16px]/[1.35] tracking-[-0.08px]">{entry.question}</span>
                  {selected ? (
                    <span aria-hidden="true" className="text-[10px]/none whitespace-nowrap text-orange">
                      ●
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="text-[16px]/none whitespace-nowrap text-char/50 transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/prompt:translate-x-0.5"
                    >
                      →
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div data-reveal className="relative flex h-[560px] min-w-0 flex-1 flex-col items-start justify-between overflow-clip rounded-[28px] bg-char">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[210px] left-[210px] h-[600px] w-[760px] bg-[radial-gradient(closest-side,rgb(238_106_18/.3),rgb(238_106_18/.28)_24%,rgb(238_106_18/.175)_49%,rgb(238_106_18/.056)_74%,transparent)]"
        />

        <div className="relative flex w-full items-center justify-between border-b border-paper/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="relative size-11 shrink-0">
              <Photo className="absolute inset-0 overflow-hidden rounded-full" src={counsellorChat.avatar} alt="" sizes="44px" />
              <span aria-hidden="true" className="absolute top-8 left-8 size-3 rounded-[99px] border-2 border-char bg-orange" />
            </div>
            <div className="flex flex-col items-start gap-0.5 leading-[1.5] whitespace-nowrap">
              <h3 className="text-[16px] font-medium text-cream">{counsellorChat.title}</h3>
              <p className="text-[12px] text-tangerine">{counsellorChat.hours}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={counsellorChat.phoneHref}
              className="flex h-10 items-center rounded-full border border-paper/14 bg-paper/6 px-4 text-[13px]/[1.5] font-medium whitespace-nowrap text-cream [transition:background-color_.3s_var(--ease-smooth),border-color_.3s_var(--ease-smooth)] hover:border-paper/30 hover:bg-paper/12"
            >
              Call
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex size-10 items-center justify-center rounded-full border border-paper/14 bg-paper/6 [transition:background-color_.3s_var(--ease-smooth),border-color_.3s_var(--ease-smooth)] hover:border-paper/30 hover:bg-paper/12"
            >
              <Photo className="relative size-[18px]" src="/images/icons/whatsapp.webp" alt="" sizes="18px" fit="contain" />
            </a>
          </div>
        </div>

        <div id="faq-chat-log" role="log" data-scroll-inside className="relative flex min-h-0 w-full flex-1 flex-col items-start gap-4 overflow-y-auto p-6">
          {entries.map((entry, i) => {
            const current = i === active;
            const step: Phase = current ? phase : "answer";
            return (
              <div key={entry.question} hidden={!current} className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-start justify-end">
                  <p
                    ref={current ? questionRef : undefined}
                    className="max-w-[560px] origin-bottom-right rounded-[20px] rounded-br-[6px] bg-orange px-[18px] py-3 text-[16px]/[1.5] font-medium text-paper"
                  >
                    {entry.question}
                  </p>
                </div>
                {step !== "question" && (
                  <div className="flex w-full items-end gap-2.5">
                    <Photo className="relative size-7 shrink-0 overflow-hidden rounded-full" src={counsellorChat.avatar} alt="" sizes="28px" />
                    {step === "typing" ? (
                      <div ref={current ? replyRef : undefined} role="status" aria-label="Counsellor is typing" className={BUBBLE}>
                        <TypingDots />
                      </div>
                    ) : (
                      <div ref={current ? replyRef : undefined} className={BUBBLE}>
                        <p className="max-w-[440px] text-[16px]/[1.55] text-cream">{entry.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {/* The counsellor's promise follows each answer. */}
          <p
            className={cx(
              "w-full pt-2 text-center text-[13px]/[1.5] whitespace-nowrap text-cream/45 transition-opacity duration-300",
              phase !== "answer" && "opacity-0",
            )}
          >
            {counsellorChat.note}
          </p>
        </div>

        <Composer />
      </div>
    </div>
  );
}

/** Three dots that rise and fall in turn while the counsellor "types". */
function TypingDots() {
  const dots = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const animations = dots.current.map((dot, i) =>
      dot?.animate(
        [
          { opacity: 0.35, transform: "translateY(0)" },
          { opacity: 1, transform: "translateY(-3px)" },
          { opacity: 0.35, transform: "translateY(0)" },
        ],
        { duration: 900, delay: i * 150, iterations: Infinity, easing: "ease-in-out" },
      ),
    );
    return () => animations.forEach((animation) => animation?.cancel());
  }, []);

  return (
    <span className="flex h-[25px] items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          ref={(el) => {
            dots.current[i] = el;
          }}
          className="size-1.5 rounded-full bg-cream opacity-35"
        />
      ))}
    </span>
  );
}
