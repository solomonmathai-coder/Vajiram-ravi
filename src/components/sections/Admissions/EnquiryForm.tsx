"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowPill, PlainPill } from "@/components/ui/Pill";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { onEnquiryRequest } from "./enquiry";

type Step = 1 | 2 | "done";
type Field = "name" | "phone" | "email" | "programme" | "time";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: "", phone: "", email: "", programme: "", time: "" };
const STEP_FIELDS: Record<1 | 2, Field[]> = { 1: ["name", "phone", "email"], 2: ["programme", "time"] };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ERROR = "#f06a4b";

/** The error for a field's value, or "" when it is fine. */
function check(field: Field, value: string): string {
  switch (field) {
    case "name":
      return value.trim().length >= 2 ? "" : "Enter your name";
    case "phone":
      return value.replace(/\D/g, "").length === 10 ? "" : "Enter a 10-digit number";
    case "email":
      return EMAIL_PATTERN.test(value.trim()) ? "" : "Enter a valid email";
    case "programme":
      return value ? "" : "Choose a programme";
    case "time":
      return value ? "" : "Choose a time";
  }
}

/** The bordered box of an input or select. Errors win over hover and focus. */
function boxClass(error: boolean) {
  return cx(
    "rounded-[14px] border bg-paper/4 [transition:border-color_.2s,background-color_.2s,box-shadow_.2s]",
    error
      ? "border-[#f06a4b] shadow-[0_0_0_3px_rgb(240_106_75/0.14)]"
      : "border-paper/10 hover:border-paper/20 focus-within:border-orange/70 focus-within:bg-paper/6 focus-within:shadow-[0_0_0_3px_rgb(238_106_18/0.16)]",
  );
}

/** Inputs and selects inside the boxes. outline-none and the radius override the global focus ring, which the box replaces. */
const CONTROL = "h-full w-full min-w-0 rounded-none bg-transparent text-[15px]/[1.5] outline-none placeholder:text-cream/40";
const SELECT = cx(CONTROL, "cursor-pointer appearance-none pr-10 pl-4 [&_option]:bg-soot [&_option]:text-cream");

function FieldShell({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      {/* The error shares the label's line, so showing it never moves the layout. */}
      <div className="flex items-baseline justify-between gap-3 text-[13px]/[1.5] whitespace-nowrap">
        <label htmlFor={id} className="font-medium text-cream/70">
          {label}
        </label>
        {error && (
          <span id={`${id}-error`} className="truncate" style={{ color: ERROR }}>
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/** The caret from the design (pointing up as drawn), turned to point down. */
function Caret({ className = "relative" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cx("block h-[7px] w-[10px] rotate-180", className)}>
      <img src="/images/admissions/caret.svg" alt="" width={8.66} height={5.25} className="absolute top-0 left-[6.7%] block" />
    </span>
  );
}

type EnquiryFormProps = {
  programmes: string[];
  timePreferences: string[];
  /** Called when a "Register now" asks for the form, after the programme is filled in. */
  onRequested: () => void;
};

/**
 * Two-step enquiry. Step 1 asks only for contact details; step 2 slides in with the programme
 * (filled in when a batch card asked for the form) and a time preference, then Submit shows a
 * thank-you. Fields check themselves when left. Nothing is sent: there is no backend yet.
 */
export default function EnquiryForm({ programmes, timePreferences, onRequested }: EnquiryFormProps) {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    phone: `${uid}-phone`,
    email: `${uid}-email`,
    programme: `${uid}-programme`,
    time: `${uid}-time`,
  } satisfies Record<Field, string>;

  const [step, setStep] = useState<Step>(1);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  // A programme asked for from elsewhere on the page that is not in the list.
  const [extraProgramme, setExtraProgramme] = useState<string | null>(null);

  const fields = useRef<Partial<Record<Field, HTMLInputElement | HTMLSelectElement | null>>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const stepRef = useRef<Step>(1);
  const lastStep = useRef<Step>(1);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const focusField = (field: Field) => fields.current[field]?.focus({ preventScroll: true });

  // "Register now" on a batch card: pick its programme and bring the form into view.
  useEffect(
    () =>
      onEnquiryRequest((programme) => {
        const finished = stepRef.current === "done";
        setExtraProgramme(programmes.includes(programme) ? null : programme);
        setValues((current) => ({ ...(finished ? EMPTY : current), programme }));
        setErrors((current) => (finished ? {} : { ...current, programme: undefined }));
        if (finished) setStep(1);
        onRequested();
        requestAnimationFrame(() => {
          const onStep = finished ? 1 : stepRef.current;
          const order = onStep === 2 ? STEP_FIELDS[2] : STEP_FIELDS[1];
          const empty = order.find((field) => !fields.current[field]?.value);
          focusField(empty ?? order[0]);
        });
      }),
    [programmes, onRequested],
  );

  // The incoming step slides in from the side it is moving towards.
  useLayoutEffect(() => {
    const from = lastStep.current;
    lastStep.current = step;
    if (from === step || prefersReducedMotion()) return;
    const direction = step === 1 ? -1 : 1;
    stageRef.current?.animate(
      [
        { opacity: 0, transform: `translateX(${direction * 32}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
  }, [step]);

  const update = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // An error shown for this field clears as soon as the value is fixed.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: check(field, value) || undefined }));
  };

  // Check a field when it is left, once something has been entered (or it already shows an error).
  const leave = (field: Field) => {
    const value = values[field];
    if (!value && !errors[field]) return;
    setErrors((current) => ({ ...current, [field]: check(field, value) || undefined }));
  };

  const validateStep = (which: 1 | 2) => {
    const found: Errors = {};
    for (const field of STEP_FIELDS[which]) {
      const error = check(field, values[field]);
      if (error) found[field] = error;
    }
    setErrors((current) => ({ ...current, ...Object.fromEntries(STEP_FIELDS[which].map((f) => [f, found[f]])) }));
    const firstInvalid = STEP_FIELDS[which].find((field) => found[field]);
    if (firstInvalid) focusField(firstInvalid);
    return !firstInvalid;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 1 && validateStep(1)) {
      setStep(2);
      requestAnimationFrame(() => focusField(values.programme ? "time" : "programme"));
    } else if (step === 2 && validateStep(2)) {
      setStep("done");
      requestAnimationFrame(() => doneRef.current?.focus({ preventScroll: true }));
    }
  };

  const back = () => {
    setStep(1);
    requestAnimationFrame(() => focusField("name"));
  };

  const startOver = () => {
    setValues(EMPTY);
    setErrors({});
    setExtraProgramme(null);
    setStep(1);
    requestAnimationFrame(() => focusField("name"));
  };

  const errorProps = (field: Field) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${ids[field]}-error` : undefined,
  });

  const inputProps = (field: Field) => ({
    id: ids[field],
    name: field,
    value: values[field],
    ref: (el: HTMLInputElement | null) => {
      fields.current[field] = el;
    },
    onBlur: () => leave(field),
    onChange: (event: { target: { value: string } }) => update(field, event.target.value),
    ...errorProps(field),
  });

  const selectProps = (field: Field) => ({
    id: ids[field],
    name: field,
    value: values[field],
    ref: (el: HTMLSelectElement | null) => {
      fields.current[field] = el;
    },
    onBlur: () => leave(field),
    onChange: (event: { target: { value: string } }) => update(field, event.target.value),
    ...errorProps(field),
  });

  const programmeOptions = extraProgramme ? [extraProgramme, ...programmes] : programmes;
  const firstName = values.name.trim().split(/\s+/)[0];

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby={`${uid}-title`} className="flex min-w-0 flex-1 flex-col gap-4.5">
      <div className="flex items-center justify-between text-[13px]/[1.5] whitespace-nowrap">
        <p id={`${uid}-title`} className="text-[16px]/[1.5] font-medium text-tangerine">
          Book your free session today!
        </p>
        <p className="text-cream/50" aria-live="polite">
          {step === "done" ? "Done" : `Step ${step} of 2`}
        </p>
      </div>

      <div className="flex gap-1.5" aria-hidden="true">
        <span className="h-[3px] flex-1 rounded-[9px] bg-orange" />
        <span className="relative h-[3px] flex-1 overflow-hidden rounded-[9px] bg-paper/15">
          <span
            className={cx(
              "absolute inset-0 origin-left bg-orange transition-transform duration-600 ease-[cubic-bezier(.2,.8,.2,1)]",
              step === 1 ? "scale-x-0" : "scale-x-100",
            )}
          />
        </span>
      </div>

      {/* Fields and footer of the current step; the height stays put from step to step. */}
      <div ref={stageRef} className="flex min-h-[150px] flex-col gap-4.5">
        {step === 1 && (
          <>
            <div className="flex gap-3">
              <FieldShell id={ids.name} label="Name" error={errors.name}>
                <div className={cx("flex h-[52px] items-center px-4", boxClass(!!errors.name))}>
                  <input {...inputProps("name")} className={cx(CONTROL, "text-cream")} type="text" placeholder="Your full name" autoComplete="name" />
                </div>
              </FieldShell>
              <FieldShell id={ids.phone} label="Contact Number" error={errors.phone}>
                <div className={cx("flex h-[52px] items-center gap-2.5 px-4", boxClass(!!errors.phone))}>
                  <span className="flex shrink-0 items-center gap-1.5 border-r border-paper/12 pr-2.5" aria-hidden="true">
                    <span className="text-[15px]/[1.5] font-medium text-cream">+91</span>
                    <Caret />
                  </span>
                  <input
                    {...inputProps("phone")}
                    className={cx(CONTROL, "text-cream")}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={14}
                    aria-label="Contact Number, after +91"
                  />
                </div>
              </FieldShell>
              <FieldShell id={ids.email} label="Email" error={errors.email}>
                <div className={cx("flex h-[52px] items-center px-4", boxClass(!!errors.email))}>
                  <input {...inputProps("email")} className={cx(CONTROL, "text-cream")} type="email" placeholder="you@email.com" autoComplete="email" />
                </div>
              </FieldShell>
            </div>
            <div className="flex items-center justify-between gap-6 pt-1">
              <p className="min-w-0 truncate text-[13px]/[1.5] text-cream/50">
                Next: {values.programme || "Select Programmes"} · Select Time Preferences
              </p>
              <ArrowPill type="submit" surface="orange" knob="paper" glyph="→">
                Continue
              </ArrowPill>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex gap-3">
              <FieldShell id={ids.programme} label="Select Programmes" error={errors.programme}>
                <div className={cx("relative h-[52px]", boxClass(!!errors.programme))}>
                  <select
                    {...selectProps("programme")}
                    className={cx(SELECT, values.programme ? "text-cream" : "text-cream/40")}
                  >
                    <option value="">Choose a programme</option>
                    {programmeOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <Caret className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2" />
                </div>
              </FieldShell>
              <FieldShell id={ids.time} label="Select Time Preferences" error={errors.time}>
                <div className={cx("relative h-[52px]", boxClass(!!errors.time))}>
                  <select
                    {...selectProps("time")}
                    className={cx(SELECT, values.time ? "text-cream" : "text-cream/40")}
                  >
                    <option value="">Choose a time</option>
                    {timePreferences.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <Caret className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2" />
                </div>
              </FieldShell>
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={back}
                className="text-[13px]/[1.5] whitespace-nowrap text-cream/60 transition-colors duration-300 hover:text-cream"
              >
                ← Back to contact details
              </button>
              <ArrowPill type="submit" surface="orange" knob="paper" glyph="→">
                Submit
              </ArrowPill>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="flex h-[150px] items-center justify-between gap-6 rounded-[18px] border border-paper/8 bg-paper/3 px-6">
            <div className="flex min-w-0 items-center gap-4">
              <span
                aria-hidden="true"
                className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-orange text-[16px]/none font-medium text-paper"
              >
                ✓
              </span>
              <div className="min-w-0">
                <p ref={doneRef} tabIndex={-1} className="text-[20px]/[1.3] font-medium text-cream outline-none">
                  Thank you{firstName ? `, ${firstName}` : ""} – we’ll call you soon
                </p>
                <p className="truncate text-[13px]/[1.5] text-cream/60">
                  +91 {values.phone.replace(/\D/g, "")} · {values.programme} · {values.time}
                </p>
              </div>
            </div>
            <PlainPill surface="outline-dark" size="sm" onClick={startOver}>
              Book another session
            </PlainPill>
          </div>
        )}
      </div>
    </form>
  );
}
