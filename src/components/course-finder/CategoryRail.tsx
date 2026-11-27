"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getCanvasZoom } from "@/lib/canvas";
import { COVER } from "./Book";

/*
 * The category rail (Kevin's, 2026-11-18, after a wireframe): a slim column on the left of the course list, held
 * near the middle of the screen. A short line for every section, the one being read longer and in the brand
 * colour. Hovering the lines (or tabbing to them) opens a list of every category, its cloth colour and its
 * number of courses; choosing one scrolls to it. Sections the filters have hidden are dimmed there. A tap
 * elsewhere closes it (his 2026-11-19 touch handling). Wider than 1100px only: on tablets and phones the categories are
 * the homepage's tab bar instead (CategoryTabs; his floating rail there is not used). The open list stays between the sticky search bar and the bottom of the
 * screen (his 10eea1b fit(): --py nudges it from its centred spot, --ph caps its height and it scrolls, .is-capped),
 * fitted again as the page scrolls while it is open.
 */

export type RailItem = { k: string; name: string; n: number; hidden: boolean };

export default function CategoryRail({ items, onGo }: { items: RailItem[]; onGo: (k: string) => void }) {
  const railRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [cur, setCur] = useState(items[0]?.k ?? "");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  // which section is being read: measured at the rail's lines, a section is the current one from when its
  // heading comes level with them until the next section's top (its divider line) gets there
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const spy = useCallback(() => {
    const btn = btnRef.current;
    const list = itemsRef.current;
    if (!btn || !list.length) return;
    const rb = btn.getBoundingClientRect();
    const bar = document.getElementById("cfBar");
    const line = rb.height ? rb.top + rb.height / 2 : (bar ? bar.getBoundingClientRect().bottom : 0) + 140;
    let k = list[0].k;
    for (const x of list) {
      if (x.hidden) continue;
      const s = document.getElementById(`cat-${x.k}`);
      if (!s) continue;
      if (s.getBoundingClientRect().top <= line) k = x.k;
      else break;
    }
    setCur(k);
    // the list closes while the course list is not what's being read (his .is-shown, which also floats the rail on
    // tablets and phones; on the 1440px canvas only the closing applies)
    const lr = railRef.current?.closest(".cf-list")?.getBoundingClientRect();
    const mid = innerHeight / 2;
    if (lr && !(lr.top < mid && lr.bottom > mid)) setOpen(false);
  }, []);

  useEffect(() => {
    addEventListener("scroll", spy, { passive: true });
    addEventListener("resize", spy);
    spy();
    setReady(true);
    return () => {
      removeEventListener("scroll", spy);
      removeEventListener("resize", spy);
    };
  }, [spy]);
  // and again after the filters lay the list out anew
  const hiddenKey = items.map((x) => (x.hidden ? 0 : 1)).join("");
  useEffect(() => {
    spy();
  }, [hiddenKey, spy]);

  // (openedAt: a tap fires focus, which opens the list, and then click; the click must not close it again straight away)
  const openedAt = useRef(0);
  const openRef = useRef(open);
  openRef.current = open;
  const show = useCallback((on: boolean) => {
    if (on && !openRef.current) openedAt.current = performance.now();
    setOpen(on);
  }, []);
  // a tap anywhere else closes it (touch screens have no pointer leaving the rail)
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!railRef.current?.contains(e.target as Node)) show(false);
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open, show]);

  // the open list kept between the sticky search bar (or the nav) and the bottom of the screen (his 2026-11-21: it opened
  // centred on the lines and its top half went under the bar). Measured in the canvas's own px: the rects and the
  // window height are the zoomed screen's, the panel's offsets and --py / --ph its own
  const panelRef = useRef<HTMLDivElement>(null);
  const fit = useCallback(() => {
    const panel = panelRef.current;
    if (!panel || !panel.offsetParent) return;
    panel.style.removeProperty("--ph");
    panel.classList.remove("is-capped");
    const z = getCanvasZoom();
    const gap = 12;
    const bar = document.getElementById("cfBar");
    const nav = document.getElementById("nav");
    const vh = innerHeight / z;
    const top = Math.max(0, bar ? bar.getBoundingClientRect().bottom / z : 0, nav ? nav.getBoundingClientRect().bottom / z : 0) + gap;
    const room = vh - gap - top;
    const h = Math.min(panel.offsetHeight, room);
    if (panel.offsetHeight > room) {
      panel.style.setProperty("--ph", `${Math.max(160, room)}px`);
      panel.classList.add("is-capped");
    }
    const mid = (panel.offsetParent as HTMLElement).getBoundingClientRect().top / z + panel.offsetTop; // where top: 50% puts its centre
    const want = Math.min(Math.max(mid - h / 2, top), vh - gap - h);
    panel.style.setProperty("--py", `${Math.round(want - (mid - h / 2))}px`);
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    fit();
    addEventListener("scroll", fit, { passive: true });
    return () => removeEventListener("scroll", fit);
  }, [open, fit]);

  const now = items.find((x) => x.k === cur);

  return (
    <nav
      ref={railRef}
      className={`cf-rail${ready ? " is-ready" : ""}${open ? " is-open" : ""}`}
      id="cfRail"
      aria-label="Course categories"
      onMouseLeave={() => show(false)}
      onBlur={(e) => {
        // only when focus moves to something else on the page: the window losing focus is no reason to close it
        if (e.relatedTarget && !railRef.current?.contains(e.relatedTarget as Node)) show(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          show(false);
          btnRef.current?.focus();
        }
      }}
    >
      <div className="cf-rail__in">
        {/* the list opens only from the lines: hovering them, or tabbing to them; it stays open while the pointer crosses to it */}
        <button
          ref={btnRef}
          type="button"
          className="cf-rail__btn"
          aria-expanded={open}
          aria-controls="cfRailPanel"
          onMouseEnter={() => show(true)}
          onFocus={() => show(true)}
          onClick={() => {
            if (performance.now() - openedAt.current > 400) show(!openRef.current);
          }}
        >
          <span className="vh">Categories, now showing: </span>
          <span className="cf-rail__now">{now?.name}</span>
          <ol className="cf-rail__ticks" aria-hidden="true">
            {items.map((x) => (
              <li key={x.k} data-k={x.k} className={[x.k === cur ? "is-on" : "", x.hidden ? "is-off" : ""].filter(Boolean).join(" ") || undefined} />
            ))}
          </ol>
        </button>
        <div className="cf-rail__panel" id="cfRailPanel" ref={panelRef}>
          <p className="cf-rail__h">Categories</p>
          <ul>
            {items.map((x) => (
              <li key={x.k}>
                <button
                  type="button"
                  className="cf-rail__go"
                  data-k={x.k}
                  aria-current={x.k === cur ? "true" : undefined}
                  disabled={x.hidden}
                  onClick={() => {
                    show(false);
                    onGo(x.k);
                  }}
                >
                  <i style={{ background: (COVER[x.k] || COVER.top).base }} />
                  <span>{x.name}</span>
                  <b>{x.n}</b>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
