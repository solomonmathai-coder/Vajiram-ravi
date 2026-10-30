"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { searchIndex, searchSuggestions, type SearchItem } from "@/data/search";
import { cx } from "@/lib/cx";
import { TOPPERS_YEAR_EVENT } from "@/lib/events";
import { lockScroll, scrollToElement } from "@/lib/smoothScroll";

type SearchDialogProps = { open: boolean; onClose: () => void };

const MAX_RESULTS = 24;

/** Ranks a match: a title that starts with the query first, then one that contains it, then the detail. */
function score(item: SearchItem, words: string[]): number {
  const title = item.title.toLowerCase();
  const haystack = `${title} ${item.detail?.toLowerCase() ?? ""} ${item.group.toLowerCase()}`;
  if (!words.every((word) => haystack.includes(word))) return 0;
  if (title.startsWith(words[0])) return 3;
  if (words.every((word) => title.includes(word))) return 2;
  return 1;
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="m12.5 12.5 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The nav's search box, a dialog in the middle of the screen. It finds sections, programmes, batches,
 * faculty, study materials, FAQs and toppers of every year, all from the page's own data, and takes you
 * there. The arrow keys move through the results, Enter opens one and Escape closes the box.
 */
export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return searchSuggestions;
    return searchIndex
      .map((item, order) => ({ item, order, rank: score(item, words) }))
      .filter((r) => r.rank > 0)
      .sort((a, b) => b.rank - a.rank || a.order - b.order)
      .slice(0, MAX_RESULTS)
      .map((r) => r.item);
  }, [query]);

  // Results keep their groups, in the order the best match of each group first appears.
  const groups = useMemo(() => {
    const map = new Map<string, { item: SearchItem; index: number }[]>();
    results.forEach((item, index) => {
      const group = map.get(item.group) ?? [];
      group.push({ item, index });
      map.set(item.group, group);
    });
    return Array.from(map);
  }, [results]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    setQuery("");
    inputRef.current?.focus();
    lockScroll(true);
    return () => {
      lockScroll(false);
      previous?.focus();
    };
  }, [open]);

  // Keeps the active result in view as the arrow keys move through a long list.
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    onClose();
    if (item.year) window.dispatchEvent(new CustomEvent(TOPPERS_YEAR_EVENT, { detail: item.year }));
    // After the dialog has let go of focus, so the page scrolls from where it is.
    requestAnimationFrame(() => {
      const target = document.querySelector(item.href);
      if (target) scrollToElement(target);
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${item.href}`);
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => (results.length ? (current + step + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div className={cx("fixed inset-0 z-60", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open} inert={!open}>
      <div
        className={cx("absolute inset-0 bg-coal/60 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onKeyDown={onKeyDown}
        className={cx(
          "absolute top-[max(96px,calc(16svh/var(--canvas-zoom,1)))] left-1/2 flex w-[640px] -translate-x-1/2 flex-col overflow-hidden rounded-[28px] border border-paper/10 bg-soot shadow-[0_40px_90px_-24px_rgb(0_0_0/0.8)] transition-[opacity,scale] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
          open ? "scale-100 opacity-100" : "scale-[.97] opacity-0",
        )}
      >
        <div className="flex items-center gap-3 border-b border-paper/8 px-6">
          <SearchIcon className="text-cream/55" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search programmes, batches, faculty, toppers…"
            aria-label="Search the page"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
            className="h-16 min-w-0 flex-1 bg-transparent text-[17px] text-cream outline-none placeholder:text-cream/40"
          />
          <kbd className="rounded-md border border-paper/12 px-1.5 py-0.5 font-sans text-[11px] text-cream/50">Esc</kbd>
        </div>

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Results"
          data-lenis-prevent
          className="max-h-[min(480px,calc(56svh/var(--canvas-zoom,1)))] overflow-y-auto overscroll-contain p-2"
        >
          {groups.map(([group, items]) => (
            <li key={group} role="presentation">
              <p className="px-4 pt-3 pb-1.5 text-[11px]/[1.4] font-semibold tracking-[0.12em] text-cream/40 uppercase">
                {query.trim() ? group : group === "Sections" ? "Jump to" : "Popular programmes"}
              </p>
              <ul role="presentation">
                {items.map(({ item, index }) => (
                  <li
                    key={`${item.group}-${item.title}-${item.detail ?? ""}`}
                    id={`${listId}-${index}`}
                    data-index={index}
                    role="option"
                    aria-selected={index === active}
                    onMouseMove={() => setActive(index)}
                    onClick={() => go(item)}
                    className={cx(
                      "flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors duration-150",
                      index === active ? "bg-paper/7" : "bg-transparent",
                    )}
                  >
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-[15px]/[1.35] font-medium text-cream">{item.title}</span>
                      {item.detail && <span className="truncate text-[13px]/[1.4] text-cream/55">{item.detail}</span>}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cx("shrink-0 text-[13px] text-tangerine transition-opacity", index === active ? "opacity-100" : "opacity-0")}
                    >
                      ↵
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {!results.length && (
            <li className="px-4 py-10 text-center text-[15px] text-cream/55">
              Nothing found for &ldquo;{query.trim()}&rdquo;. Try a programme, a topper or a subject.
            </li>
          )}
        </ul>

        <div className="flex items-center gap-4 border-t border-paper/8 px-6 py-3 text-[12px] text-cream/45">
          <span>↑ ↓ to move</span>
          <span>↵ to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
