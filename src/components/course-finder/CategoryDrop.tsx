"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IChevDown } from "./icons";
import type { RailItem } from "./CategoryRail";

/*
 * The categories on phones and tablets (27 Nov 2026, user: the rail's lines at the screen's edge "could be a drop down,
 * need to find a new method to show the course category"): the first field of the sticky bar, in the same design as
 * Mode, Medium and Target year ("Category: GS Foundation"). As the page scrolls it shows the category being read;
 * choosing another goes to it. Categories the search and dropdowns have emptied cannot be chosen. Shown at 1100px and
 * below only (course-finder.css .cf-sel--cat); wider screens keep the rail.
 */
export default function CategoryDrop({ items, onGo }: { items: RailItem[]; onGo: (k: string) => void }) {
  const ref = useRef<HTMLLabelElement>(null);
  const selRef = useRef<HTMLSelectElement>(null);
  const [cur, setCur] = useState(items[0]?.k ?? "");
  const itemsRef = useRef(items);
  itemsRef.current = items;
  // while the page scrolls to a chosen category the sections it passes don't take the field
  const holdUntil = useRef(0);

  // the section being read: the last one whose top has passed a line a third of the way down the screen under the bar
  const spy = useCallback(() => {
    const el = ref.current;
    if (!el || !el.offsetParent || performance.now() < holdUntil.current) return;
    const bar = document.getElementById("cfBar");
    const below = bar ? bar.getBoundingClientRect().bottom : 0;
    const line = below + (innerHeight - below) / 3;
    const list = itemsRef.current;
    let k = list.find((x) => !x.hidden)?.k ?? "";
    for (const x of list) {
      if (x.hidden) continue;
      const s = document.getElementById(`cat-${x.k}`);
      if (!s) continue;
      if (s.getBoundingClientRect().top <= line) k = x.k;
      else break;
    }
    setCur(k);
  }, []);

  useEffect(() => {
    addEventListener("scroll", spy, { passive: true });
    addEventListener("resize", spy);
    spy();
    return () => {
      removeEventListener("scroll", spy);
      removeEventListener("resize", spy);
    };
  }, [spy]);
  const hiddenKey = items.map((x) => (x.hidden ? 0 : 1)).join("");
  useEffect(() => {
    spy();
  }, [hiddenKey, spy]);

  return (
    <label
      ref={ref}
      className="cf-sel cf-sel--cat"
      data-key="cat"
      onClick={(e) => {
        // a click anywhere on the field opens its menu, as the other dropdowns do
        if ((e.target as HTMLElement).tagName === "SELECT") return;
        try {
          selRef.current?.showPicker();
        } catch {
          selRef.current?.focus();
        }
      }}
    >
      <fieldset className="cf-sel__o" aria-hidden="true">
        <legend>Category</legend>
      </fieldset>
      <span className="cf-sel__l">Category</span>
      <select
        ref={selRef}
        aria-label="Go to a course category"
        value={cur}
        onChange={(e) => {
          const k = e.target.value;
          setCur(k);
          holdUntil.current = performance.now() + 1200;
          onGo(k);
        }}
      >
        {items.map((x) => (
          <option key={x.k} value={x.k} disabled={x.hidden}>
            {x.name} ({x.n})
          </option>
        ))}
      </select>
      <IChevDown />
    </label>
  );
}
