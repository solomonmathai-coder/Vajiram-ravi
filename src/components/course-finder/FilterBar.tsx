"use client";

import { useRef, type RefObject } from "react";
import { IChevDown, IClose, ISearch, IXCircle } from "./icons";
import { DROPS, type FilterKey } from "./model";

/*
 * The bar under the head (Kevin's #cfBar): the search, then Mode, Medium and Target year as outlined dropdowns
 * with a sand fill, their names in a notch on the top border. Each option shows how many courses it holds
 * (counted once, across the categories) and cannot be chosen when it holds none. A picked dropdown swaps its
 * chevron for a clear button that empties just that one; "Clear filters" appears while any is set. The bar
 * sticks under the nav (CourseFinder sets .is-stuck and --cf-navoff).
 */
export default function FilterBar({
  barRef,
  query,
  onQuery,
  drops,
  onDrop,
  onClearDrops,
  counts,
}: {
  barRef: RefObject<HTMLDivElement | null>;
  query: string;
  onQuery: (q: string) => void;
  drops: Record<FilterKey, string>;
  onDrop: (key: FilterKey, value: string) => void;
  onClearDrops: () => void;
  /** Courses behind each option, by filter key and value. */
  counts: Record<FilterKey, Record<string, number>>;
}) {
  const qRef = useRef<HTMLInputElement>(null);
  const selRefs = useRef<Partial<Record<FilterKey, HTMLSelectElement | null>>>({});
  const any = DROPS.some((f) => drops[f.key]);

  return (
    <div className="cf-bar" id="cfBar" ref={barRef}>
      <div className="cf-bar__in">
        <div className="cf-search">
          <ISearch />
          <input
            ref={qRef}
            type="search"
            id="cfQ"
            placeholder="Search courses"
            aria-label="Search courses"
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) onQuery("");
            }}
          />
          <button
            type="button"
            className="cf-search__x"
            id="cfQx"
            aria-label="Clear search"
            hidden={!query}
            onClick={() => {
              onQuery("");
              qRef.current?.focus();
            }}
          >
            <IClose />
          </button>
        </div>
        <div className="cf-filt" id="cfFilt" role="group" aria-label="Filter courses">
          {DROPS.map((f) => (
            <label key={f.key} className={`cf-sel${drops[f.key] ? " is-on" : ""}`} data-key={f.key}>
              <span className="cf-sel__l">{f.label}</span>
              <select
                ref={(el) => {
                  selRefs.current[f.key] = el;
                }}
                data-key={f.key}
                value={drops[f.key]}
                onChange={(e) => onDrop(f.key, e.target.value)}
              >
                <option value="">Any</option>
                {f.opts.map(([v, l]) => {
                  const n = counts[f.key][v] ?? 0;
                  return (
                    <option key={v} value={v} disabled={!n}>
                      {l} ({n})
                    </option>
                  );
                })}
              </select>
              <IChevDown />
              <button
                type="button"
                className="cf-sel__x"
                data-key={f.key}
                aria-label={`Clear ${f.label}`}
                onClick={(e) => {
                  e.preventDefault();
                  onDrop(f.key, "");
                  selRefs.current[f.key]?.focus();
                }}
              >
                <IXCircle />
              </button>
            </label>
          ))}
          <button type="button" className="cf-filt__clear" id="cfFiltX" hidden={!any} onClick={onClearDrops}>
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
