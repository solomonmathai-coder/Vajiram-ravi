"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Cta from "@/components/ui/Cta";
import { cx } from "@/lib/cx";
import { scrollToElement } from "@/lib/smoothScroll";
import { onEnquiryRequest } from "./enquiry";
import SelectMenu from "./SelectMenu";
import { submitEnquiry } from "./submitEnquiry";

type Values = { name: string; programme: string; phone: string; time: string; email: string };
type Field = keyof Values;
const EMPTY: Values = { name: "", programme: "", phone: "", time: "", email: "" };
const ORDER: Field[] = ["name", "programme", "phone", "time", "email"];

const ERRORS: Record<Field, string> = {
  name: "Enter your name.",
  programme: "Choose a programme, or “Not sure yet”.",
  phone: "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.",
  time: "Choose a time for the call.",
  email: "Enter an email like name@example.com, or leave it blank.",
};

function check(field: Field, value: string): string {
  switch (field) {
    case "name":
      return value.trim() ? "" : ERRORS.name;
    case "phone":
      return /^[6-9]\d{9}$/.test(value) ? "" : ERRORS.phone;
    case "email":
      return !value || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? "" : ERRORS.email;
    default:
      return value ? "" : ERRORS[field];
  }
}

/** A blank on the note: a dashed line in the brand orange, the answer written on it. */
/** The answers and the hints in them are in design S's handwriting (Caveat, --font-hand), as on its form. */
const BLANK =
  "min-w-0 border-0 border-b-[1.5px] border-dashed border-[#e3753f] bg-transparent px-1 pb-0.5 font-[family-name:var(--font-hand)] text-[23px]/[30px] font-medium text-[#1b2a52] outline-none placeholder:text-[#a3958a] focus:border-solid focus:border-burnt [transition:border-color_var(--dur-fast)_var(--ease-out)]";

/**
 * Talk to us (homepage v2), design S's sentence form: on a white note in a double rule with diamond corners,
 * the request is a sentence with blanks to fill. "Hi, I'm ___ and I'm preparing for ___. Please call me on
 * +91 ___ in the ___, or email me on ___." The programme and the time are the site's own dropdown
 * (SelectMenu). A batch ticket's "Enroll now" brings it into view with that programme chosen
 * (requestEnquiry). It checks each blank as it is left and all of them on sending, says what is missing
 * under the sentence (an alert) and puts the focus in the first blank to fix; sent, it thanks the visitor.
 * The request goes through submitEnquiry, as v1's postcard did.
 */
export default function SentenceForm({ programmes, times }: { programmes: string[]; times: string[] }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [extra, setExtra] = useState<string | null>(null);
  const controls = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  const options = ["Not sure yet", ...(extra && !programmes.includes(extra) ? [extra] : []), ...programmes];

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: check(field, value) }));
  };
  const leave = (field: Field) => setErrors((e) => ({ ...e, [field]: check(field, values[field]) }));

  // "Enroll now" on a batch: come into view, with that programme chosen.
  useEffect(
    () =>
      onEnquiryRequest((programme) => {
        const form = formRef.current;
        if (!form) return;
        if (programme) {
          setExtra(programme);
          setValues((v) => ({ ...v, programme }));
        }
        scrollToElement(form);
        window.setTimeout(() => {
          const first = ORDER.find((f) => !(f === "programme" && programme) && !values[f]);
          controls.current[first ?? "name"]?.focus({ preventScroll: true });
        }, 700);
      }),
    [values],
  );

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const found = Object.fromEntries(ORDER.map((f) => [f, check(f, values[f])])) as Record<Field, string>;
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (first) {
      controls.current[first]?.focus();
      return;
    }
    setState("sending");
    try {
      await submitEnquiry({ ...values, query: "" });
      setState("sent");
    } catch {
      setState("failed");
    }
  };

  const messages = ORDER.flatMap((f) => (errors[f] ? [errors[f]] : []));

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={send}
      aria-labelledby={`${id}-h`}
      className="relative w-[580px] shrink-0 bg-white p-3 shadow-[0_30px_60px_-28px_rgb(40_10_2/0.6)]"
    >
      {/* The double rule and its diamond corners. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#e3753f]/50" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-[18px] border border-[#e3753f]/25" />
      {[
        "top-[9px] left-[9px]",
        "top-[9px] right-[9px]",
        "bottom-[9px] left-[9px]",
        "right-[9px] bottom-[9px]",
      ].map((at) => (
        <span key={at} aria-hidden="true" className={cx("pointer-events-none absolute size-2 rotate-45 bg-[#e3753f]", at)} />
      ))}

      <div className="relative px-10 pt-9 pb-9">
        {state === "sent" ? (
          <div role="status" className="flex min-h-[340px] flex-col items-start justify-center gap-3">
            <h3 className="font-heading text-[30px]/[1.2] font-semibold text-ink">Request received</h3>
            <p className="text-[17px]/[1.55] text-clay">
              Thank you, {values.name.trim().split(/\s+/)[0]}. A counsellor will call you on +91 {values.phone} in the {values.time.toLowerCase()}.
            </p>
          </div>
        ) : (
          <>
            <h3 id={`${id}-h`} className="text-[12px]/[16px] font-bold tracking-[0.14em] text-burnt uppercase">
              Book your free session today!
            </h3>
            <div className="mt-6 flex flex-col gap-4 font-heading text-[19px]/[30px] text-ink">
              <Line>
                Hi, I&apos;m
                <input
                  ref={(el) => {
                    controls.current.name = el;
                  }}
                  name="name"
                  autoComplete="name"
                  placeholder="your full name"
                  aria-label="Your full name"
                  aria-invalid={!!errors.name || undefined}
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => leave("name")}
                  className={cx(BLANK, "flex-1")}
                />
              </Line>
              <Line>
                and I&apos;m preparing for
                <div className="relative min-w-0 flex-1">
                  <SelectMenu
                    id={`${id}-programme`}
                    name="programme"
                    value={values.programme}
                    options={options}
                    placeholder="pick a programme"
                    onChange={(v) => update("programme", v)}
                    onBlur={() => leave("programme")}
                    invalid={!!errors.programme}
                    buttonRef={(el) => {
                      controls.current.programme = el;
                    }}
                    className={cx(BLANK, "w-full")}
                    layout="h-[34px] pr-8"
                  />
                </div>
              </Line>
              <Line>
                Please call me on
                <span className="text-clay">+91</span>
                <input
                  ref={(el) => {
                    controls.current.phone = el;
                  }}
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  placeholder="10-digit mobile"
                  aria-label="Your 10-digit mobile number"
                  aria-invalid={!!errors.phone || undefined}
                  value={values.phone}
                  onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").replace(/^(91|0)(?=\d{10})/, "").slice(0, 10))}
                  onBlur={() => leave("phone")}
                  className={cx(BLANK, "flex-1")}
                />
              </Line>
              <Line>
                in the
                <div className="relative min-w-0 flex-1">
                  <SelectMenu
                    id={`${id}-time`}
                    name="time"
                    value={values.time}
                    options={times}
                    placeholder="preferred time"
                    onChange={(v) => update("time", v)}
                    onBlur={() => leave("time")}
                    invalid={!!errors.time}
                    buttonRef={(el) => {
                      controls.current.time = el;
                    }}
                    className={cx(BLANK, "w-full")}
                    layout="h-[34px] pr-8"
                  />
                </div>
              </Line>
              <Line>
                or email me on
                <input
                  ref={(el) => {
                    controls.current.email = el;
                  }}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  aria-label="Your email, optional"
                  aria-invalid={!!errors.email || undefined}
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => leave("email")}
                  className={cx(BLANK, "flex-1")}
                />
              </Line>
            </div>

            <p role="alert" className="mt-4 min-h-5 text-[14px]/[20px] font-semibold text-[#b3261e]">
              {state === "failed" ? "That did not go through. Please try again, or call us." : messages[0] ?? ""}
            </p>

            <div className="mt-3">
              <Cta variant="primary" size="lg" type="submit" loading={state === "sending"} className="w-full justify-between">
                Book a free session
              </Cta>
            </div>
          </>
        )}
      </div>
    </form>
  );
}

function Line({ children }: { children: ReactNode }) {
  return <div className="flex items-end gap-2.5 whitespace-nowrap">{children}</div>;
}
