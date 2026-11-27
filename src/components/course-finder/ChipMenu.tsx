"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ICheck, IChevDown } from "./icons";

/*
 * A category's chips on phones as one chip (27 Nov 2026, user: "make it one chip with a dropdown showing all this options in
 * the same chip design"; then "fix the ui of this and the dropdown view"): the chosen chip, its name and a chevron, and under
 * it a menu card of the choices, each with how many of the category's courses it holds, the chosen one ticked. A tap
 * outside, Escape or a choice closes it; the arrow keys move through it. Styles: course-finder.css (.cf-chip--drop, .cf-cm).
 */
export type ChipOpt = { v: string; label: string; n: number };

export default function ChipMenu({ value, opts, label, onChange }: { value: string; opts: ChipOpt[]; label: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const cur = opts.find((o) => o.v === value) ?? opts[0];

  // a tap anywhere else closes it
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    // the chosen row takes the focus, for the arrow keys
    list.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus({ preventScroll: true });
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);

  const pick = (v: string) => {
    setOpen(false);
    btn.current?.focus({ preventScroll: true });
    if (v !== value) onChange(v);
  };

  return (
    <div
      className={`cf-cm${open ? " is-open" : ""}`}
      ref={wrap}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          btn.current?.focus();
        }
        if (open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault();
          const rows = [...(list.current?.querySelectorAll<HTMLButtonElement>(".cf-cm__o") ?? [])];
          const i = rows.indexOf(document.activeElement as HTMLButtonElement);
          rows[(i + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length]?.focus();
        }
      }}
    >
      <button
        ref={btn}
        type="button"
        className="cf-chip cf-chip--drop"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${label}: ${cur?.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{cur?.label}</span>
        <IChevDown />
      </button>
      <ul className="cf-cm__menu" id={id} role="listbox" aria-label={label} ref={list} hidden={!open}>
        {opts.map((o) => (
          <li key={o.v || "all"}>
            <button type="button" role="option" className="cf-cm__o" aria-selected={o.v === value} tabIndex={-1} onClick={() => pick(o.v)}>
              <span className="cf-cm__t">{o.label}</span>
              <span className="cf-cm__n">{o.n}</span>
              <span className="cf-cm__tick">{o.v === value ? <ICheck /> : null}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
