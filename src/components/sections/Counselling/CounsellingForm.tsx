"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SelectChevronIcon } from "@/components/icons";
import { BUTTON_BASE, BUTTON_PRIMARY, BUTTON_SIZE } from "@/components/ui/Buttons";
import { cx } from "@/lib/cx";
import { showToast } from "@/lib/toast";

type Field = "name" | "email" | "phone";

const THANKS_MS = 3500;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type ControlOptions = { error?: boolean; lightPlaceholder?: boolean; select?: boolean; empty?: boolean };

/** Classes for the pill-shaped text inputs and selects. An error outline wins over hover and focus. */
function controlClass({ error = false, lightPlaceholder = false, select = false, empty = false }: ControlOptions) {
  return cx(
    "block h-[53px] w-full rounded-full border bg-neutral-50 px-4 py-3.5 font-sans text-[14px]/[23px] font-medium outline-none placeholder:opacity-100 [transition:border-color_.2s,background-color_.2s,box-shadow_.2s] focus:bg-white",
    lightPlaceholder ? "placeholder:text-neutral-400" : "placeholder:text-neutral-500",
    select ? cx("cursor-pointer appearance-none pr-11", empty ? "text-neutral-500" : "text-neutral-900") : "text-neutral-900",
    error
      ? "border-[#d93a1b] shadow-[0_0_0_3px_rgba(217,58,27,.12)] hover:border-[#d93a1b] focus:border-[#d93a1b] focus:shadow-[0_0_0_3px_rgba(217,58,27,.12)]"
      : "border-neutral-200 hover:border-neutral-300 focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,117,18,.14)]",
  );
}

function FormField({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-display text-[14px]/[21px] font-semibold whitespace-nowrap text-neutral-900">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Wraps a <select> with the design's chevron, which flips while the select has focus. */
function SelectBox({ children }: { children: ReactNode }) {
  return (
    <div className="group/sel relative">
      {children}
      <SelectChevronIcon className="pointer-events-none absolute top-[17.5px] right-4 transition-transform duration-250 ease-smooth group-focus-within/sel:rotate-180" />
    </div>
  );
}

type CounsellingFormProps = { programmes: string[]; timePreferences: string[] };

/**
 * "Book your free session" form. Validates name, email and a 10-digit phone number,
 * then shows a thank-you state and resets. There is no backend yet; nothing is sent.
 */
export default function CounsellingForm({ programmes, timePreferences }: CounsellingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fields = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };
  const [errors, setErrors] = useState<Field[]>([]);
  const [programme, setProgramme] = useState("");
  const [time, setTime] = useState("");
  const [sent, setSent] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const clearError = (field: Field) => setErrors((current) => current.filter((f) => f !== field));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = (field: Field) => fields[field].current?.value ?? "";
    const invalid: Field[] = [];
    if (!value("name").trim()) invalid.push("name");
    if (!EMAIL_PATTERN.test(value("email").trim())) invalid.push("email");
    if (value("phone").replace(/\D/g, "").length < 10) invalid.push("phone");
    setErrors(invalid);

    if (invalid.length) {
      fields[invalid[0]].current?.focus();
      showToast("Please add your name, email and a 10-digit number");
      return;
    }

    setSent(true);
    resetTimer.current = setTimeout(() => {
      formRef.current?.reset();
      setProgramme("");
      setTime("");
      setSent(false);
    }, THANKS_MS);
  };

  return (
    <form
      ref={formRef}
      id="leadForm"
      noValidate
      onSubmit={onSubmit}
      className="relative flex w-[528px] flex-none flex-col gap-6 rounded-[20px] bg-white p-7 shadow-[0_8px_12px_rgba(56,56,56,.1)]"
    >
      <h3 className="font-display text-[20px]/[27px] font-semibold whitespace-nowrap text-neutral-900">
        Book your free session today!
      </h3>
      <div className="flex flex-col gap-4.5">
        <div className="flex gap-4.5">
          <FormField label="Name" htmlFor="f-name">
            <input
              ref={fields.name}
              className={controlClass({ error: errors.includes("name") })}
              id="f-name"
              name="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              required
              onInput={() => clearError("name")}
            />
          </FormField>
        </div>
        <div className="flex gap-4.5">
          <FormField label="Email" htmlFor="f-email">
            <input
              ref={fields.email}
              className={controlClass({ error: errors.includes("email") })}
              id="f-email"
              name="email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              required
              onInput={() => clearError("email")}
            />
          </FormField>
          <FormField label="Contact Number" htmlFor="f-phone">
            <input
              ref={fields.phone}
              className={controlClass({ error: errors.includes("phone"), lightPlaceholder: true })}
              id="f-phone"
              name="phone"
              type="tel"
              placeholder="+91 "
              autoComplete="tel"
              inputMode="tel"
              required
              onInput={() => clearError("phone")}
            />
          </FormField>
        </div>
        <div className="flex flex-col gap-3.5">
          <FormField label="Select Programmes" htmlFor="f-prog">
            <SelectBox>
              <select
                className={controlClass({ select: true, empty: !programme })}
                id="f-prog"
                name="programme"
                value={programme}
                onChange={(event) => setProgramme(event.target.value)}
              >
                <option value="">Pick a programme</option>
                {programmes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </SelectBox>
          </FormField>
          <FormField label="Select Time Preferences" htmlFor="f-time">
            <SelectBox>
              <select
                className={controlClass({ select: true, empty: !time })}
                id="f-time"
                name="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              >
                <option value="">Preferred time</option>
                {timePreferences.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </SelectBox>
          </FormField>
        </div>
      </div>
      <button
        type="submit"
        id="f-submit"
        disabled={sent}
        className={cx(BUTTON_BASE, BUTTON_SIZE.lg, "w-full gap-2 px-7 py-4", sent ? "bg-[#2f8a4e] text-white" : BUTTON_PRIMARY)}
      >
        <span>{sent ? "Thank you – we’ll call you soon" : "Submit"}</span>
      </button>
    </form>
  );
}
