"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COVER } from "./Book";
import type { RailItem } from "./CategoryRail";
import FieldDrop from "./FieldDrop";

/*
 * The categories on phones and tablets (27 Nov 2026, user: the rail's lines at the screen's edge "could be a drop down,
 * need to find a new method to show the course category"): the first field of the sticky bar, in the same design as
 * Mode, Medium and Target year ("Category: CSAT (2)"), only as wide as what it says. As the page scrolls it shows the
 * category being read; its menu (FieldDrop) lists every category with its book's colour and its course count, the ones
 * the search and dropdowns have emptied greyed out; choosing one goes to it. Shown at 1100px and below only
 * (course-finder.css .cf-sel--cat); wider screens keep the rail.
 */
export default function CategoryDrop({ items, onGo }: { items: RailItem[]; onGo: (k: string) => void }) {
  const [cur, setCur] = useState(items[0]?.k ?? "");
  const itemsRef = useRef(items);
  itemsRef.current = items;
  // while the page scrolls to a chosen category the sections it passes don't take the field
  const holdUntil = useRef(0);

  // the section being read: the last one whose top has passed a line a third of the way down the screen under the bar
  const spy = useCallback(() => {
    const bar = document.getElementById("cfBar");
    const field = bar?.querySelector<HTMLElement>(".cf-sel--cat");
    if (!bar || !field?.offsetParent || performance.now() < holdUntil.current) return;
    const below = bar.getBoundingClientRect().bottom;
    const line = below + (innerHeight - below) / 3;
    const all = itemsRef.current;
    let k = all.find((x) => !x.hidden)?.k ?? "";
    for (const x of all) {
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

  const now = items.find((x) => x.k === cur);
  return (
    <FieldDrop
      className="cf-sel--cat"
      dataKey="cat"
      label="Category"
      listLabel="Go to a course category"
      value={cur}
      text={now ? `${now.name} (${now.n})` : ""}
      opts={items.map((x) => ({ v: x.k, label: x.name, n: x.n, disabled: x.hidden, dot: (COVER[x.k] || COVER.top).base }))}
      onPick={(k) => {
        setCur(k);
        holdUntil.current = performance.now() + 1200;
        onGo(k);
      }}
    />
  );
}
