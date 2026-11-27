"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ICheck, IChevDown } from "./icons";

/*
 * One dropdown field of the /courses bar (Category, Mode, Medium, Target year) with its own menu (27 Nov 2026, user: the
 * browser's own list "is not styled, why"): the split-button field ("Mode: Any", the chevron in its segment at the right,
 * or once something is picked its clear button), and under it a menu card, the chip menu's: each choice on a row, with its
 * colour (Category) and its count, the chosen one ticked; a choice with nothing behind it cannot be picked. The card is
 * fixed to the screen under the field, so the phone bar's sideways-scrolling row of fields never clips it, and follows the
 * field while the page or that row scrolls. A tap outside, Escape or a choice closes it; the arrow keys move through it.
 * Styles: course-finder.css (.cf-sel--btn, .cf-fm, and the chip menu's .cf-cm__*).
 */
export type DropOpt = { v: string; label: string; n?: number; disabled?: boolean; dot?: string };

export default function FieldDrop({
  label,
  value,
  text,
  opts,
  onPick,
  className = "",
  on = false,
  dataKey,
  listLabel,
  after,
}: {
  label: string;
  value: string;
  /** What the field shows for the current choice (by default its label). */
  text?: ReactNode;
  opts: DropOpt[];
  onPick: (v: string) => void;
  className?: string;
  /** Something is picked (the field in the brand colour, its clear button in place of the chevron). */
  on?: boolean;
  dataKey?: string;
  listLabel?: string;
  /** After the field's button: its clear button. */
  after?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const cur = opts.find((o) => o.v === value);

  // the card under the field, on screen, at least as wide as the field (220 to 300px)
  const place = useCallback(() => {
    const b = ref.current?.getBoundingClientRect();
    if (!b) return;
    const width = Math.min(Math.max(b.width, 220), 300, innerWidth - 24);
    setPos({ top: Math.round(b.bottom + 8), left: Math.round(Math.max(12, Math.min(b.left, innerWidth - 12 - width))), width: Math.round(width) });
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    place();
    const row = ref.current?.closest(".cf-filt");
    addEventListener("scroll", place, { passive: true });
    addEventListener("resize", place);
    row?.addEventListener("scroll", place, { passive: true });
    // the chosen row in view and focused, for the arrow keys
    const now = list.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (now && list.current) list.current.scrollTop = now.offsetTop - list.current.clientHeight / 2 + now.offsetHeight / 2;
    now?.focus({ preventScroll: true });
    return () => {
      removeEventListener("scroll", place);
      removeEventListener("resize", place);
      row?.removeEventListener("scroll", place);
    };
  }, [open, place]);
  // a tap anywhere else closes it
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);

  const pick = (v: string) => {
    setOpen(false);
    btn.current?.focus({ preventScroll: true });
    if (v !== value) onPick(v);
  };

  return (
    <div
      ref={ref}
      className={`cf-sel cf-sel--btn${className ? ` ${className}` : ""}${on ? " is-on" : ""}${open ? " is-open" : ""}`}
      data-key={dataKey}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          btn.current?.focus();
        }
        if (open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault();
          const rows = [...(list.current?.querySelectorAll<HTMLButtonElement>(".cf-cm__o:not(:disabled)") ?? [])];
          const i = rows.indexOf(document.activeElement as HTMLButtonElement);
          const next = rows[(i + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length];
          next?.focus({ preventScroll: true });
          next?.scrollIntoView({ block: "nearest" });
        }
      }}
    >
      <fieldset className="cf-sel__o" aria-hidden="true">
        <legend>{label}</legend>
      </fieldset>
      <button ref={btn} type="button" className="cf-sel__btn" aria-haspopup="listbox" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span className="cf-sel__l">{label}</span>
        <span className="cf-sel__v" data-empty={value === "" ? "" : undefined}>
          {text ?? cur?.label}
        </span>
      </button>
      <IChevDown />
      {after}
      <ul
        className="cf-cm__menu cf-fm"
        id={id}
        role="listbox"
        aria-label={listLabel ?? label}
        ref={list}
        hidden={!open}
        style={pos ? ({ top: pos.top, left: pos.left, width: pos.width } as CSSProperties) : undefined}
      >
        {opts.map((o) => (
          <li key={o.v || "any"}>
            <button type="button" role="option" className="cf-cm__o" aria-selected={o.v === value} disabled={o.disabled} tabIndex={-1} onClick={() => pick(o.v)}>
              {o.dot ? <i className="cf-fm__dot" style={{ background: o.dot }} aria-hidden="true" /> : null}
              <span className="cf-cm__t">{o.label}</span>
              {o.n !== undefined ? <span className="cf-cm__n">{o.n}</span> : null}
              <span className="cf-cm__tick">{o.v === value ? <ICheck /> : null}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
