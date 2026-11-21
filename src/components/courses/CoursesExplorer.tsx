"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import FilterBar from "@/components/course-finder/FilterBar";
import { GoButton, ICal, IClose, IDur, ILive, IRoom, ISearch, ITime } from "@/components/course-finder/icons";
import { BADGE, CHIPS, DROPS, buildSections, fold, hasChip, passes, type Card, type FilterKey, type Filters, type Section } from "@/components/course-finder/model";
import CoverArt from "@/components/sections/Programmes/CoverArt";
import GeoArt from "@/components/sections/Programmes/GeoArt";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { lockScroll, scrollToY } from "@/lib/smoothScroll";
import { BOOKS, type ShelfBook } from "./routes";
import "@/components/sections/Programmes/shelf.css";
import "@/components/course-finder/base.css";
import "@/components/course-finder/shared.css";
import "@/components/course-finder/course-finder.css";
import "./courses.css";

/** The gold foil of the homepage's books. */
const FOIL = "#f6c77a";
/** The header over the page, in canvas px: on a desktop canvas, and on a phone (CoursesHeader's slimmer pill). */
const HEADER = 84;
const HEADER_PHONE = 60;

/**
 * Whether the page is laid out for a phone: lib/canvas sets the class "phone" on <html> on a narrow screen
 * (and the page is then not zoomed). The server renders the desktop page; a phone switches once it has loaded.
 */
const onPhoneChange = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const usePhone = () =>
  useSyncExternalStore(
    onPhoneChange,
    () => document.documentElement.classList.contains("phone"),
    () => false,
  );

/** Kevin's chips for a row: All, or the courses with a badge or a batch still to start (Upcoming, soonest first). */
function useChips(cards: Card[]) {
  const [chip, setChip] = useState("");
  const disabled = useMemo(() => Object.fromEntries(CHIPS.map(([v]) => [v, !cards.some((c) => hasChip(c, v))])), [cards]);
  const f = chip && disabled[chip] ? "" : chip;
  const list = useMemo(() => {
    const l = cards.filter((c) => !f || hasChip(c, f));
    return f === "up:1" ? [...l].sort((a, b) => a.start - b.start || a.i - b.i) : l;
  }, [cards, f]);
  return { f, setChip, disabled, list };
}

function Chips({ name, f, setChip, disabled, className }: { name: string; f: string; setChip: (v: string) => void; disabled: Record<string, boolean>; className?: string }) {
  return (
    <div className={cx("cf-chips", className)} role="group" aria-label={`Show ${name} courses`}>
      <button type="button" className="cf-chip" data-f="" aria-pressed={!f} onClick={() => setChip("")}>
        All
      </button>
      {CHIPS.map(([v, l]) => (
        <button key={v} type="button" className="cf-chip" data-f={v} aria-pressed={f === v} disabled={disabled[v]} onClick={() => setChip(v)}>
          {l}
        </button>
      ))}
    </div>
  );
}
/**
 * A category's strip, in canvas px from its band's left: its book standing at BOOK_X, as far in from the
 * band's edge as from its top and foot (its cover, swung open, reaches out past that edge into the gap
 * beside the categories); the homepage book, 148 × 214, drawn BOOK_SCALE times as large, so it stands taller
 * than a card (Kevin's, at 83%: 237 × 344, four of them in view with room to spare at the strip's end); the first card out of it at FIRST, the round arrow over the gap; a card
 * laid in the book at INSIDE_X (on the pages, past the spine), drawn down to the pages' width. The cover takes
 * LID_MS to swing open or shut, a card MOVE_MS to go in or come out.
 */
/** Kevin's card as he draws it (285 × 414), shown at CARD_ZOOM so four stand in a row beside the book. */
const CARD_ZOOM = 0.83;
const CARD_W = Math.round(285 * CARD_ZOOM);
const CARD_H = Math.round(414 * CARD_ZOOM);
const CARD_GAP = 12;
const BOOK_X = 18;
const BOOK_SCALE = 1.75;
const BOOK_W = Math.round(148 * BOOK_SCALE);
const BOOK_H = Math.round(214 * BOOK_SCALE);
const FIRST = BOOK_X + BOOK_W + 20;
const INSIDE_X = BOOK_X + Math.round(13 * BOOK_SCALE);
const INSIDE_S = 0.95;
const LID_MS = 420;
const MOVE_MS = 720;

/**
 * The cards' pictures: flat line illustrations in black and orange (the Figma workfile's illustration sheets,
 * 2788:44810, cut one by one into public/images/course-illus), in place of the course pages' banners; the card's
 * text is as it was. Each card's picture matches its course (illusPool: an interview, a mentorship, essay or
 * answer writing, current affairs, CSAT, a test series, a crash course, the postal course, Forestry or Geology,
 * GS, or an optional subject; LIVE-Online courses lean to the online ones: a laptop, a video call), and along a
 * row no two neighbouring cards share one, each picking the least used of its fitting ones.
 */
/** LIVE-Online learning: a lecture in a browser window, a video call, a laptop with an idea, reading on a device, chat, a laptop on the books. */
const ONLINE = ["c12", "c00", "a12", "b11", "c02", "a20"];
/** Reading and study, for an optional subject in the classroom. */
const READING = ["b00", "b22", "c21", "c01", "c22", "c11", "c20", "b20", "a02", "a00", "b02"];
const RULES: [RegExp, string[], string[]][] = [
  // [what the title says, its classroom pictures, its LIVE-Online pictures]
  [/interview|साक्षात्कार/, ["a21", "b21"], ["c00", "c12"]],
  [/mentor|step ?up|prodigy|pragyan|मेंटर|स्टेपअप|प्रज्ञान/, ["b21", "a21", "c10"], ["c02", "c00"]],
  [/essay|निबंध/, ["c10", "a10", "a01"], ["c10", "a12", "a01"]],
  [/answer writing|marks improvement|rehearsal/, ["a10", "a01", "c10"], ["a10", "a12", "a01"]],
  [/current affairs|smart|करंट अफेयर्स|समसामयिकी/, ["b11", "b02", "c01"], ["b11", "c12", "a12"]],
  [/csat/, ["b10", "a12"], ["a12", "b12"]],
  [/crash/, ["a22", "a11", "b20"], ["a22", "b12", "a12"]],
  [/test series|tests|camp|flt|pyq|sure ?shot|power ?up|dominator|टेस्ट|श्योर शॉट|परीक्षा कार्यक्रम|कैंप/, ["a11", "a01", "b12", "a10"], ["b12", "a12", "a01"]],
  [/postal/, ["b01", "b02"], ["b01", "b02"]],
  [/forestry|geology/, ["c22", "c11", "c20"], ["c12", "c22", "c11"]],
  [/ethics/, ["b22", "c10", "a02"], ["c12", "b22"]],
  [/ranker|module|economics/, ["a01", "b10", "c01"], ["a12", "c12", "a01"]],
  [/fledgling|2[- ]year/, ["a00", "b21", "a20"], ["a20", "c12", "a12"]],
  [/gs |general studies|prelims (&|and) mains|foundation/, ["b21", "a00"], ["c12", "a20"]],
];
/** The pictures that fit a course, best first. */
function illusPool(k: Card): string[] {
  const t = ` ${k.title.toLowerCase()} `;
  const online = k.mode === "online";
  for (const [re, room, live] of RULES) if (re.test(t)) return online ? live : room;
  if (online) return ONLINE;
  // An optional subject in the classroom: reading, starting from a place that depends on the subject.
  const h = [...(k.sub || k.title)].reduce((n, ch) => n + ch.charCodeAt(0), 0) % READING.length;
  return [...READING.slice(h), ...READING.slice(0, h)];
}
/** A row's pictures: each card the least used of its fitting ones so far, never the same as the card before. */
function illusRow(cards: Card[]): string[] {
  const used = new Map<string, number>();
  let prev = "";
  return cards.map((k) => {
    const pool = illusPool(k);
    const pick = [...pool].filter((x) => x !== prev).sort((x, y) => (used.get(x) ?? 0) - (used.get(y) ?? 0) || pool.indexOf(x) - pool.indexOf(y))[0] ?? pool[0];
    used.set(pick, (used.get(pick) ?? 0) + 1);
    prev = pick;
    return `/images/course-illus/${pick}.webp`;
  });
}

/** Our Top Picks' own book: Kevin's (course-finder/Book, COVER.top), dark and plain. */
const TOP_BOOK: ShelfBook = {
  key: "top",
  title: "Top Picks",
  line: "",
  families: [],
  cover: { light: "#4a3b31", base: "#33281f", deep: "#1c1510", emblem: "layers", art: "arcs" },
};
const bookFor = (s: Section) => (s.top ? TOP_BOOK : BOOKS.find((b) => b.key === s.k) ?? BOOKS[0]);
const nameOf = (s: Section) => (s.top ? "Our Top Picks" : s.label);

/** Where to scroll for `el` to sit `offset` canvas px below the top of the screen, in screen px. */
function canvasY(el: HTMLElement, offset: number) {
  const zoom = parseFloat(document.documentElement.style.zoom) || 1;
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) y += node.offsetTop;
  return Math.max(0, (y - offset) * zoom);
}

type Drops = Record<FilterKey, string>;
const NO_DROPS: Drops = { mode: "", lang: "", yr: "" };

/**
 * Our course finder (/courses/books): the client's courses, as Kevin's course finder has them (his data, cards,
 * badges and stand-ins: components/course-finder/model), in our book strips. The head; under it, staying in view,
 * Kevin's bar (the search, then Mode, Medium and Target year as outlined dropdowns, each option with its count);
 * the categories down the left, the one in view lit; then a strip for each, Our Top Picks first and the only one
 * highlighted (on Kevin's mahogany Top Picks ground), every other on white. Over each strip, its count and
 * Kevin's chips (All, New, Trending, Bestseller, Upcoming); in it, the category's book standing on the left and
 * its courses as Kevin's cards in one row, which moves a card at a time, each going into the book (its cover
 * opening for it and closing over it) or coming out of it.
 *
 * The search and dropdowns are kept in the address (#q=essay&mode=online), so a view can be shared.
 */
export default function CoursesExplorer() {
  const phone = usePhone();
  const header = phone ? HEADER_PHONE : HEADER;
  /** On a phone: the menu (the search, the filters and the categories), a panel from the left. */
  const menuRef = useRef<HTMLDialogElement>(null);
  const [sections] = useState<Section[]>(() => buildSections(new Date()));
  const [query, setQuery] = useState("");
  const [drops, setDrops] = useState<Drops>(NO_DROPS);
  const filters = useMemo<Filters>(() => ({ q: fold(query).split(/\s+/).filter(Boolean), ...drops }), [query, drops]);
  const [active, setActive] = useState<string>(sections[0]?.k ?? "");
  const [stuck, setStuck] = useState(false);
  const [barH, setBarH] = useState(80);
  const barRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  /** A category just chosen in the rail: it stays lit while the page glides past the others to it. */
  const holdRef = useRef<{ key: string; until: number } | null>(null);
  const [pill, setPill] = useState<{ top: number; h: number } | null>(null);

  // The search and dropdowns from the address on arrival, and back into it as they change.
  useEffect(() => {
    const read = new URLSearchParams(location.hash.replace(/^#/, ""));
    if (read.get("q")) setQuery(read.get("q")!);
    const d = { ...NO_DROPS };
    (Object.keys(NO_DROPS) as FilterKey[]).forEach((k) => {
      const v = read.get(k);
      if (v && DROPS.find((f) => f.key === k)?.opts.some(([o]) => o === v)) d[k] = v;
    });
    setDrops(d);
  }, []);
  useEffect(() => {
    const parts = new URLSearchParams();
    if (query.trim()) parts.set("q", query.trim());
    (Object.keys(drops) as FilterKey[]).forEach((k) => drops[k] && parts.set(k, drops[k]));
    const s = parts.toString();
    history.replaceState(null, "", location.pathname + (s ? `#${s}` : ""));
  }, [query, drops]);

  const oks = useMemo(() => sections.map((s) => s.cards.filter((k) => passes(k, filters))), [sections, filters]);
  const shown = sections.map((s, i) => ({ s, cards: oks[i] })).filter((x) => x.cards.length);

  // Each dropdown option's count, across the categories (each course once: Our Top Picks left out), as Kevin's.
  const counts = useMemo(() => {
    const cards = sections.filter((s) => !s.top).flatMap((s) => s.cards);
    return Object.fromEntries(DROPS.map((f) => [f.key, Object.fromEntries(f.opts.map(([v]) => [v, cards.filter((k) => f.test(k, v)).length]))])) as Record<
      FilterKey,
      Record<string, number>
    >;
  }, [sections]);

  /** Under the header and the bar, in canvas px: where a strip comes to rest when its category is chosen. */
  const under = () => header + (barRef.current?.offsetHeight ?? barH) + (phone ? 12 : 20);
  useEffect(() => {
    const measure = () => barRef.current && setBarH(barRef.current.offsetHeight);
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [phone]);

  // Whether the bar has reached the header, and which category is in view (lit down the left).
  useEffect(() => {
    const check = () => {
      const bar = barRef.current;
      if (bar) setStuck(bar.getBoundingClientRect().top <= header + 0.5);
      const line = under() + 120;
      let current = shown[0]?.s.k;
      for (const { s } of shown) {
        const el = document.getElementById(`cat-${s.k}`);
        if (el && el.getBoundingClientRect().top <= line) current = s.k;
      }
      const hold = holdRef.current;
      if (hold && performance.now() < hold.until && hold.key !== current) return;
      holdRef.current = null;
      if (current) setActive(current);
    };
    check();
    addEventListener("scroll", check, { passive: true });
    addEventListener("resize", check);
    return () => {
      removeEventListener("scroll", check);
      removeEventListener("resize", check);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown.map((x) => x.s.k).join(), phone]);

  // The cards lean toward the pointer, with the glare, as on Kevin's page (course-finder/CourseFinder).
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const k = (e.target as Element).closest<HTMLElement>(".cf-k");
      if (!k) return;
      const r = k.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      k.style.setProperty("--tx", (px - 0.5).toFixed(3));
      k.style.setProperty("--ty", (py - 0.5).toFixed(3));
      k.style.setProperty("--gx", `${(px * 100).toFixed(0)}%`);
      k.style.setProperty("--gy", `${(py * 100).toFixed(0)}%`);
    };
    const out = (e: PointerEvent) => {
      const k = (e.target as Element).closest<HTMLElement>(".cf-k");
      if (k && !k.contains(e.relatedTarget as Node | null)) {
        k.style.setProperty("--tx", "0");
        k.style.setProperty("--ty", "0");
      }
    };
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerout", out);
    return () => {
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerout", out);
    };
  }, []);

  const go = (key: string) => {
    const el = document.getElementById(`cat-${key}`);
    if (!el) return;
    setActive(key);
    holdRef.current = { key, until: performance.now() + 1800 };
    scrollToY(canvasY(el, under()));
  };

  // The rail's lit pill: one shape that slides to the category in view (rather than each row lighting in turn).
  useEffect(() => {
    const btn = railRef.current?.querySelector<HTMLElement>(`[data-chip="${active}"]:not(:disabled)`);
    // The buttons sit in the list, which is placed in the rail: the pill's top is the button's in the list plus the list's.
    const list = btn?.offsetParent as HTMLElement | null;
    setPill(btn ? { top: btn.offsetTop + (list && list !== railRef.current ? list.offsetTop : 0), h: btn.offsetHeight } : null);
  }, [active, oks]);
  const reset = () => {
    setQuery("");
    setDrops(NO_DROPS);
  };
  const total = sections.filter((s) => !s.top).reduce((n, s) => n + s.cards.length, 0);
  const set = (query.trim() ? 1 : 0) + DROPS.filter((f) => drops[f.key]).length;
  const activeSec = sections.find((s) => s.k === active);

  // The phone's menu: opened as a modal dialog (over everything, the page held still behind it).
  const openMenu = () => {
    const d = menuRef.current;
    if (!d || d.open) return;
    d.showModal();
    lockScroll(true);
    document.documentElement.style.overflow = "hidden";
  };
  const closeMenu = () => {
    if (menuRef.current?.open) menuRef.current.close();
  };
  const menuClosed = () => {
    lockScroll(false);
    document.documentElement.style.overflow = "";
  };
  // A category chosen in the menu: the menu goes, and the page glides to its strip.
  const pick = (key: string) => {
    closeMenu();
    menuClosed();
    requestAnimationFrame(() => go(key));
  };

  return (
    <div className="cf-page cb-page">
      {/* The head. */}
      <div className="mx-auto flex w-canvas flex-col items-center px-20 pt-10 text-center phone:w-full phone:px-5 phone:pt-6">
        <nav aria-label="Breadcrumb" className="text-[14px]/[20px] text-[#6e655c]">
          <a href="/" className="hover:text-[#c2410c]">
            Home
          </a>
          <span aria-hidden="true" className="mx-2">
            ›
          </span>
          <span aria-current="page" className="font-medium text-[#1a1714]">
            Courses
          </span>
        </nav>
        <p className="mt-5 bg-[#c2410c] px-4 py-1 text-[13px]/[18px] font-semibold text-white [clip-path:polygon(10px_0,calc(100%-10px)_0,100%_50%,calc(100%-10px)_100%,10px_100%,0_50%)]">All courses</p>
        <h1 className="mt-4 font-[family-name:var(--font-news)] text-[60px]/[1.04] font-normal tracking-[-0.03em] phone:mt-3 phone:text-[36px]/[1.08]">
          Every course, <em className="text-[#c2410c] italic">in one place.</em>
        </h1>
        <p className="mt-3 w-[680px] text-[17px]/[1.5] text-[#6e655c] phone:w-full phone:text-[15px]/[1.5]">
          {total} courses in {BOOKS.length} categories, from Prelims to Interview: dates, duration and timings, in the classroom and LIVE-Online, in English and हिंदी.
        </p>
      </div>

      <div className="mx-auto mt-8 flow-root w-canvas px-6 pb-24 phone:mt-5 phone:w-full phone:px-4 phone:pb-16">
        {/*
          Kevin's bar: the search, then Mode, Medium and Target year as outlined dropdowns (course-finder/FilterBar).
          It stays under the header, on a cream ground once there, the ground running the whole width of the window.
        */}
        {!phone && (
        <div ref={barRef} className="sticky top-[84px] z-[38] -mx-6 px-6 pt-1 pb-3">
          <div
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute -top-[84px] bottom-0 left-1/2 phone:hidden w-[calc(100vw/var(--canvas-zoom,1)+64px)] -translate-x-1/2 border-b border-[rgb(194_65_12/0.12)] bg-[#fffaf3]/95 shadow-[0_18px_30px_-24px_rgb(70_26_10/0.5)] backdrop-blur [transition:opacity_300ms_ease]",
              stuck ? "opacity-100" : "opacity-0",
            )}
          />
          <div className="relative">
            <FilterBar
              barRef={{ current: null }}
              query={query}
              onQuery={setQuery}
              drops={drops}
              onDrop={(key, value) => setDrops((d) => ({ ...d, [key]: value }))}
              onClearDrops={() => setDrops(NO_DROPS)}
              counts={counts}
            />
          </div>
        </div>
        )}

        {/*
          On a phone, one bar under the header in place of the search, the filters and the rail: a menu button with
          the category in view, and how many filters are set. It opens the menu (below).
        */}
        {phone && (
          <div ref={barRef} className="sticky top-[60px] z-[38] -mx-4 px-4 py-2">
            {/* Once it reaches the header, a cream ground runs from the top of the screen to under the bar, behind the
                header's pills too (as the desktop bar's does). */}
            <div
              aria-hidden="true"
              className={cx(
                "pointer-events-none absolute inset-x-0 -top-[60px] bottom-0 border-b border-[rgb(194_65_12/0.12)] bg-[#fffaf3]/95 shadow-[0_14px_24px_-20px_rgb(70_26_10/0.5)] backdrop-blur [transition:opacity_300ms_ease]",
                stuck ? "opacity-100" : "opacity-0",
              )}
            />
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Search, filters and course categories. In view: ${activeSec ? nameOf(activeSec) : ""}${set ? `. ${set} set` : ""}`}
              onClick={openMenu}
              className="relative flex h-[52px] w-full items-center gap-3 rounded-full border border-[rgb(43_18_6/0.1)] bg-white pr-1.5 pl-1.5 text-left shadow-[0_14px_28px_-22px_rgb(70_26_10/0.6)]"
            >
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#f06a2c_0%,#e85020_45%,#c2410c_100%)] text-white">
                <svg viewBox="0 0 18 18" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M3 5h12M3 9h12M3 13h8" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px]/[14px] font-bold tracking-[0.12em] text-[#c2410c] uppercase">Browse courses</span>
                <span className="flex items-center gap-1.5 text-[15px]/[20px] font-semibold text-[#1a1714]">
                  {activeSec && <Butta color={bookFor(activeSec).cover.base} />}
                  <span className="truncate">{activeSec ? nameOf(activeSec) : "All courses"}</span>
                </span>
              </span>
              <span aria-hidden="true" className="relative grid size-10 shrink-0 place-items-center rounded-full bg-[#fdf3ea] text-[#c2410c] [&_svg]:size-[18px]">
                <ISearch />
                {set > 0 && (
                  <span className="absolute -top-1 -right-1 grid size-[18px] place-items-center rounded-full bg-[#c2410c] text-[10.5px] font-bold text-white tabular-nums ring-2 ring-white">{set}</span>
                )}
              </span>
            </button>
          </div>
        )}

        {/*
          The phone's menu: a panel from the left, over the page. Kevin's search and his three dropdowns at its
          head, then every category with how many courses the filters leave in it (the one in view lit); a category
          chosen brings its strip up under the bar. At its foot, how many courses there are to see.
        */}
        {phone && (
          <dialog
            ref={menuRef}
            aria-label="Search, filters and course categories"
            onClose={menuClosed}
            onClick={(e) => e.target === e.currentTarget && closeMenu()}
            className="cb-menu fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(88vw,380px)] max-w-none overflow-hidden border-0 bg-[#fffaf3] p-0 text-[#1a1714] shadow-[24px_0_60px_-30px_rgb(43_18_6/0.7)]"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-[rgb(194_65_12/0.12)] py-3 pr-3 pl-5">
                <p className="font-[family-name:var(--font-news)] text-[24px]/[1.1]">Find a course</p>
                <button type="button" onClick={closeMenu} aria-label="Close" className="grid size-11 place-items-center rounded-full text-[#3a2a22] hover:bg-[#fdf3ea] [&_svg]:size-5">
                  <IClose />
                </button>
              </div>
              {/* data-lenis-prevent: the page's smooth scroll, held still while the menu is open, leaves this list's own scrolling alone */}
              <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-[max(24px,env(safe-area-inset-bottom))]">
                <FilterBar
                  barRef={{ current: null }}
                  query={query}
                  onQuery={setQuery}
                  drops={drops}
                  onDrop={(key, value) => setDrops((d) => ({ ...d, [key]: value }))}
                  onClearDrops={() => setDrops(NO_DROPS)}
                  counts={counts}
                />
                <p className="mt-6 mb-2 text-[11px]/[16px] font-bold tracking-[0.12em] text-[#c2410c] uppercase">Course categories</p>
                <ul className="flex flex-col gap-1.5">
                  {sections.map((s, i) => {
                    const n = oks[i].length;
                    const on = s.k === active && n > 0;
                    return (
                      <li key={s.k}>
                        <button
                          type="button"
                          disabled={n === 0}
                          aria-current={on ? "true" : undefined}
                          onClick={() => pick(s.k)}
                          className={cx(
                            "flex min-h-12 w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-left text-[15.5px]/[20px] font-semibold [transition:background-color_250ms_ease,color_250ms_ease] disabled:opacity-40",
                            on ? "bg-[#c2410c] text-white shadow-[0_8px_16px_-10px_rgb(194_65_12/0.9)]" : "bg-white text-[#3a2a22] shadow-[0_0_0_1px_rgb(43_18_6/0.08)]",
                          )}
                        >
                          <Butta color={on ? "#fff3dc" : bookFor(s).cover.base} />
                          <span className="min-w-0 flex-1">{nameOf(s)}</span>
                          <span className={cx("text-[13px] tabular-nums", on ? "text-white/85" : "text-[#a3958a]")}>{n}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {set > 0 && (
                <div className="border-t border-[rgb(194_65_12/0.12)] bg-white px-5 pt-1 pb-[max(4px,env(safe-area-inset-bottom))]">
                  <button type="button" onClick={reset} className="h-11 text-[15px] font-semibold text-[#c2410c] underline decoration-[#c2410c]/30 underline-offset-4">
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </dialog>
        )}

        <div className="mt-8 grid grid-cols-[58px_minmax(0,1fr)] items-start gap-4 phone:mt-5 phone:block">
          {/*
            The categories, down the left as a slim rail, staying in view under the bar: each category's flower in
            its colour, the one in view lit. Under the pointer or the keyboard it opens out over the strips into the
            full list (names and counts), as Kevin's rail does; a click brings that strip up under the bar. It
            stands in the page's flow (opening out past its column over the strips), so it stops with the strips and
            never runs over the footer.
          */}
          <div className="sticky z-[35] phone:hidden" style={{ top: header + barH + 16 }}>
            <nav
              aria-label="Course categories"
              ref={railRef}
              className="group/rail relative w-[58px] overflow-hidden rounded-[20px] border border-[rgb(43_18_6/0.1)] bg-white p-2 shadow-[0_24px_44px_-34px_rgb(70_26_10/0.5)] [transition:width_350ms_cubic-bezier(0.22,1,0.36,1),box-shadow_350ms_ease] focus-within:w-[264px] focus-within:shadow-[0_30px_60px_-30px_rgb(70_26_10/0.6)] hover:w-[264px] hover:shadow-[0_30px_60px_-30px_rgb(70_26_10/0.6)]"
            >
              <p className="w-[244px] px-3 pt-2 pb-2.5 text-[12px]/[16px] font-bold tracking-[0.12em] whitespace-nowrap text-[#c2410c] uppercase opacity-0 [transition:opacity_250ms_ease] group-focus-within/rail:opacity-100 group-hover/rail:opacity-100">
                Course categories
              </p>
              {pill && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 right-2 left-2 rounded-[10px] bg-[#c2410c] shadow-[0_8px_16px_-10px_rgb(194_65_12/0.9)] [transition:translate_500ms_cubic-bezier(0.22,1,0.36,1),height_300ms_ease] motion-reduce:transition-none"
                  style={{ height: pill.h, translate: `0 ${pill.top}px` }}
                />
              )}
              <ul className="relative flex flex-col gap-0.5">
                {sections.map((s, i) => {
                  const n = oks[i].length;
                  const on = s.k === active && n > 0;
                  return (
                    <li key={s.k}>
                      <button
                        type="button"
                        data-chip={s.k}
                        disabled={n === 0}
                        aria-current={on ? "true" : undefined}
                        aria-label={`${nameOf(s)}: ${n} ${n === 1 ? "course" : "courses"}`}
                        onClick={() => go(s.k)}
                        className={cx(
                          "flex w-[244px] cursor-pointer items-center gap-3 rounded-[10px] px-3 py-[8px] text-left text-[14.5px]/[19px] font-semibold whitespace-nowrap [transition:background-color_250ms_ease,color_250ms_ease] disabled:cursor-default disabled:opacity-40",
                          on ? "text-white" : "text-[#3a2a22] enabled:hover:bg-[#fdf3ea] enabled:hover:text-[#c2410c]",
                        )}
                      >
                        <Butta color={on ? "#fff3dc" : bookFor(s).cover.base} />
                        <span className="min-w-0 flex-1 truncate opacity-0 [transition:opacity_250ms_ease] group-focus-within/rail:opacity-100 group-hover/rail:opacity-100">{nameOf(s)}</span>
                        <span className={cx("text-[12.5px] font-semibold tabular-nums opacity-0 [transition:opacity_250ms_ease] group-focus-within/rail:opacity-100 group-hover/rail:opacity-100", on ? "text-white/85" : "text-[#a3958a]")}>{n}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {shown.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[rgb(194_65_12/0.35)] bg-white/70 px-8 py-14 text-center">
              <p className="font-[family-name:var(--font-news)] text-[28px]/[1.2]">No course matches that.</p>
              <p className="mt-2 text-[16px]/[1.5] text-[#6e655c]">Try another word, or show every mode, medium and target year.</p>
              <button type="button" onClick={reset} className="mt-6 cursor-pointer text-[15px] font-semibold text-[#c2410c] underline decoration-[#c2410c]/30 underline-offset-4 hover:decoration-[#c2410c]">
                Clear filters
              </button>
            </div>
          ) : (
            <div ref={listRef} className="flex min-w-0 flex-col gap-16 phone:gap-9">
              {shown.map(({ s, cards }) =>
                phone ? (
                  <PhoneStrip key={s.k} sec={s} book={bookFor(s)} name={nameOf(s)} cards={cards} />
                ) : (
                  <Strip key={s.k} sec={s} book={bookFor(s)} name={nameOf(s)} cards={cards} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── the categories' bullet ───────────────────────────── */

/** The homepage's block-print flower (public/images/ornaments/butta.svg), drawn in any colour. */
const BUTTA_D =
  "M7 0C10.64 2.352 9.184 5.32 7 5.88C4.816 5.32 3.36 2.352 7 0ZM7 14C10.64 11.648 9.184 8.68 7 8.12C4.816 8.68 3.36 11.648 7 14ZM0 7C2.352 3.36 5.32 4.816 5.88 7C5.32 9.184 2.352 10.64 0 7ZM14 7C11.648 3.36 8.68 4.816 8.12 7C8.68 9.184 11.648 10.64 14 7ZM6.02 7C6.02 6.45875 6.45875 6.02 7 6.02C7.54125 6.02 7.98 6.45875 7.98 7C7.98 7.54125 7.54125 7.98 7 7.98C6.45875 7.98 6.02 7.54125 6.02 7Z";

function Butta({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 14" width={14} height={14} className="size-3.5 shrink-0">
      <path d={BUTTA_D} fill={color} />
    </svg>
  );
}

/* ───────────────────────────── a category's strip ───────────────────────────── */

/**
 * A category's strip. Over it: how many courses the filters leave, and Kevin's chips (All, New, Trending,
 * Bestseller, Upcoming; one with nothing behind it greyed out; Upcoming soonest first). Then the band: white, or
 * for Our Top Picks, the one highlighted, Kevin's mahogany Top Picks ground (the Qutub Minar faint at its left
 * and a fine grain): its book standing on the left, and its courses beside it as Kevin's cards in one row. The row
 * moves a card at a time (the round arrows at its two edges, a sideways swipe or ← →): each time a card
 * goes in, the book's cover swings open, the card is laid on the pages, and the cover closes over it; going
 * back, the cover opens and the last one laid in comes out again. The first time the strip comes into view
 * the cover opens and the first cards come out of it, one after another.
 */
function Strip({ sec, book, name, cards }: { sec: Section; book: ShelfBook; name: string; cards: Card[] }) {
  const ref = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // "wait": the first cards still inside the book; "intro": coming out; "idle": in their places.
  const [phase, setPhase] = useState<"wait" | "intro" | "idle">("wait");
  // How many cards are in the book.
  const [k, setK] = useState(0);
  const kRef = useRef(0);
  const [lid, setLid] = useState(false);
  const lidRef = useRef(false);
  const [width, setWidth] = useState(996);
  const timers = useRef<number[]>([]);
  const closeTimer = useRef(0);
  const { base } = book.cover;
  const lit = sec.top;

  const { f, setChip, disabled, list } = useChips(cards);
  const illus = useMemo(() => illusRow(list), [list]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const lidTo = (open: boolean) => {
    lidRef.current = open;
    setLid(open);
  };
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => clearTimeout(t));
      clearTimeout(closeTimer.current);
    };
  }, []);

  // The first time the strip comes into view: the cover opens and the first cards come out.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => {
      if (prefersReducedMotion()) return setPhase("idle");
      lidTo(true);
      later(() => setPhase("intro"), LID_MS - 100);
      later(
        () => {
          setPhase("idle");
          lidTo(false);
        },
        LID_MS - 100 + (Math.min(list.length, 4) - 1) * 150 + MOVE_MS + 40,
      );
    };
    if (typeof IntersectionObserver === "undefined") return reveal();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        reveal();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The row's width, for whether the rest of the cards fit; and all of them out again when the filters change.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => setWidth(box.offsetWidth);
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);
  useEffect(() => {
    kRef.current = 0;
    setK(0);
  }, [list]);

  const maxK = Math.max(0, list.length - 1);
  const fits = (from: number) => FIRST + (list.length - from) * (CARD_W + CARD_GAP) - CARD_GAP <= width;
  const atStart = k === 0;
  const atEnd = k >= maxK || fits(k);

  /** One card into the book (1) or out of it (-1), the cover opening for it and closing after. */
  function step(dir: 1 | -1) {
    const cur = kRef.current;
    if (dir > 0 ? cur >= maxK || fits(cur) : cur <= 0) return;
    kRef.current = cur + dir;
    if (prefersReducedMotion() || phase !== "idle") return setK(kRef.current);
    const wait = lidRef.current ? 0 : LID_MS - 140;
    lidTo(true);
    later(() => setK(kRef.current), wait);
    clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => lidTo(false), wait + MOVE_MS + 60);
  }
  const stepRef = useRef(step);
  stepRef.current = step;

  // A sideways swipe on a trackpad (or a touch screen) moves the row a card at a time.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let acc = 0;
    let last = 0;
    let touchX: number | null = null;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      acc += e.deltaX;
      const now = performance.now();
      if (Math.abs(acc) > 60 && now - last > 260) {
        stepRef.current(acc > 0 ? 1 : -1);
        acc = 0;
        last = now;
      }
    };
    const onTouchStart = (e: TouchEvent) => (touchX = e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) stepRef.current(dx < 0 ? 1 : -1);
      touchX = null;
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    box.addEventListener("touchstart", onTouchStart, { passive: true });
    box.addEventListener("touchend", onTouchEnd);
    return () => {
      box.removeEventListener("wheel", onWheel);
      box.removeEventListener("touchstart", onTouchStart);
      box.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const inside = (i: number) => (phase === "wait" ? i < 4 : i < k);
  const place = (i: number) => (inside(i) ? INSIDE_X : FIRST + (i - (phase === "wait" ? 0 : k)) * (CARD_W + CARD_GAP));

  const id = `cat-${sec.k}`;

  return (
    <section ref={ref} id={id} aria-labelledby={`${id}-h`} className={cx("cs-strip", lid && "lid-open")}>
      {/*
        Over the row: what it holds (the category's name is on its book and in the list on the left; it stays
        here for assistive technology only, 21 Nov 2026: no "Category 01", heading or line over the strips).
      */}
      <header className="mb-4">
        <h2 id={`${id}-h`} className="sr-only">
          {name}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Chips name={name} f={f} setChip={setChip} disabled={disabled} />
        </div>
      </header>

      {/*
        The band: the book and the row, cut off at its right end (and over and under) but not at its left, where
        the open cover reaches out; its layers kept to itself (isolate), under the bar.
      */}
      <div
        ref={boxRef}
        tabIndex={0}
        aria-label={`${name}: ${list.length} ${list.length === 1 ? "course" : "courses"}. Use the arrow keys to move along them.`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          else if (e.key === "ArrowLeft") step(-1);
          else return;
          e.preventDefault();
        }}
        className={cx(
          "relative isolate rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c]/50 focus-visible:ring-inset",
          // While its book is open, the band rises over the categories' rail, so the open cover passes in front of it (under the bar).
          lid && "z-[36]",
          lit ? "cb-feat shadow-[0_30px_50px_-34px_rgb(43_18_6/0.8)]" : "border border-[rgb(194_65_12/0.14)] bg-white shadow-[0_24px_44px_-34px_rgb(70_26_10/0.5)]",
        )}
        style={{ height: BOOK_H + 80, clipPath: "inset(0 0 0 -160px round 0 28px 28px 0)" }}
      >
        {/* Our Top Picks' ground: Kevin's (.cf-feat): the Qutub Minar faint at its left, and a fine grain over it. */}
        {lit && (
          <>
            <span aria-hidden="true" className="cb-feat__qutub pointer-events-none absolute inset-y-0 left-0 rounded-l-[28px]" />
            <span aria-hidden="true" className="cb-feat__grain pointer-events-none absolute inset-0 rounded-[28px]" />
          </>
        )}

        {/* The book's back board and pages, under the cards laid in it. */}
        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2" style={{ left: BOOK_X, width: BOOK_W, height: BOOK_H }}>
          <div className="origin-top-left" style={{ scale: BOOK_SCALE }}>
            <BookBack book={book} />
          </div>
        </div>

        {/* The row, clipped at the band (adding nothing to the page's width); a card past its end cannot take focus. */}
        <ol className="absolute inset-0 z-20 overflow-clip rounded-[28px]">
          {list.map((c, i) => (
            <KCard key={c.id} k={c} illus={illus[i]} x={place(i)} inside={inside(i)} away={!inside(i) && place(i) >= width - 24} delay={phase === "intro" && i < 4 ? i * 150 : 0} />
          ))}
        </ol>

        {/* Its cover, over them: it swings open on the spine for a card going in or coming out. */}
        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 z-30 -translate-y-1/2" style={{ left: BOOK_X, width: BOOK_W, height: BOOK_H }}>
          <div className="origin-top-left" style={{ scale: BOOK_SCALE }}>
            <BookCover book={book} count={list.length} />
          </div>
        </div>

        {/* The round arrows, at the row's two edges. */}
        {([-1, 1] as const).map((dir) => {
          const off = dir < 0 ? atStart : atEnd;
          return (
            <button
              key={dir}
              type="button"
              tabIndex={-1}
              aria-hidden={off || undefined}
              onClick={() => step(dir)}
              aria-label={dir < 0 ? `Earlier ${name} courses` : `More ${name} courses`}
              className={cx(
                "absolute top-1/2 z-40 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[rgb(194_65_12/0.25)] bg-white text-[#c2410c] shadow-[0_12px_26px_-12px_rgb(43_18_6/0.7)] [transition:background-color_200ms_ease,color_200ms_ease,opacity_250ms_ease,scale_200ms_ease] hover:bg-[#c2410c] hover:text-white active:scale-95",
                off && "pointer-events-none opacity-0",
              )}
              style={dir < 0 ? { left: FIRST - 30 } : { right: 16 }}
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={dir < 0 ? "rotate-180" : undefined}>
                <path d="M2.5 8h11M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4" />
              </svg>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** The book's back: its shadow, the back board, and the block of pages the tickets are laid on. */
function BookBack({ book }: { book: ShelfBook }) {
  const { deep } = book.cover;
  return (
    <span className="relative block h-[214px] w-[148px]">
      <span className="absolute -right-[10px] -bottom-[8px] left-2 h-4 rounded-[50%] bg-[rgb(20_8_2/0.4)] blur-[7px]" />
      <span className="absolute top-0 -right-[6px] bottom-0 left-0 rounded-[3px_7px_7px_3px]" style={{ backgroundColor: deep, filter: "brightness(0.8)" }} />
      <span className="book-pages absolute top-[4px] right-[-4px] bottom-[4px] left-[8px] rounded-r-[3px] shadow-[inset_2px_0_3px_rgb(43_18_6/0.25)]" />
    </span>
  );
}

/**
 * The book's cover, bound like the homepage's programme books (cloth, gold foil, emblem): two faces, the
 * front and the endpaper inside, so it reads as a cover as it swings open on its spine.
 */
function BookCover({ book, count }: { book: ShelfBook; count: number }) {
  const { light, base, deep, emblem, art } = book.cover;
  return (
    <span className="relative block h-[214px] w-[148px] [perspective:1400px] [perspective-origin:60%_50%]">
      <span className="cs-lid absolute inset-0 block">
        <span className="cs-face absolute inset-0 block overflow-clip rounded-[3px_7px_7px_3px] text-center shadow-[6px_10px_22px_-10px_rgb(20_8_2/0.6)]" style={{ backgroundColor: base, backgroundImage: `linear-gradient(140deg, ${light} 0%, ${base} 48%, ${deep} 100%)` }}>
          <span className="absolute inset-0 opacity-[0.16]">
            <GeoArt kind={art} accent={FOIL} soft="#fff3dc" />
          </span>
          <span className="book-cloth pointer-events-none absolute inset-0" />
          {/* The spine and its groove. */}
          <span className="absolute inset-y-0 left-0 w-3.5" style={{ background: `linear-gradient(90deg, rgb(0 0 0 / 0.38), ${deep} 38%, ${base} 80%, rgb(0 0 0 / 0.2))` }} />
          <span className="absolute inset-y-0 left-3.5 w-[3px] bg-[linear-gradient(90deg,rgb(0_0_0/0.32),rgb(255_255_255/0.12))]" />
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.14),transparent_42%,rgb(0_0_0/0.16))]" />
          {/* The foil frame. */}
          <span className="absolute top-2.5 right-2.5 bottom-2.5 left-[25px] rounded-[2px] border opacity-60" style={{ borderColor: FOIL }}>
            <span className="absolute inset-[3px] rounded-[1px] border opacity-50" style={{ borderColor: FOIL }} />
          </span>
          <span className="absolute top-2.5 right-2.5 bottom-2.5 left-[25px] flex flex-col items-center px-2 pt-3.5 pb-3" style={{ color: FOIL }}>
            <span className="text-[12px]/[14px] tracking-[0.04em] opacity-85">Vajiram &amp; Ravi</span>
            <span className="mt-3 font-[family-name:var(--font-news)] text-[19px]/[1.12] text-balance">{book.title}</span>
            <span className="mt-auto">
              <CoverArt emblem={emblem} size={46} />
            </span>
            <span className="mt-auto text-[12px]/[14px] font-semibold tracking-[0.04em]">
              {count} {count === 1 ? "course" : "courses"}
            </span>
          </span>
        </span>
        {/* The inside of the cover: the board, and the endpaper pasted on it. */}
        <span className="cs-face cs-face-in absolute inset-0 block rounded-[7px_3px_3px_7px]" style={{ backgroundColor: deep }}>
          <span className="absolute inset-[5px] rounded-[2px] bg-[#f1e4cd]" />
        </span>
      </span>
    </span>
  );
}

/* ───────────────────────────── a course ───────────────────────────── */

/**
 * One course as Kevin's card (course-finder/CategorySection's CourseCard, his .cf-k): its illustration (ILLUS), the title,
 * its badges, the duration, the time with how often, the mode; then, below a divider, when the batch starts and
 * "View course" (its page on vajiramandravi.com). His stand-ins are kept and marked (data-dummy). Here it stands
 * in the strip's row at `x` (or laid in the book, drawn down to its pages): his 285 × 414, shown at CARD_ZOOM.
 */
function KCard({ k, illus, x, inside, away, delay }: { k: Card; illus: string; x: number; inside: boolean; away: boolean; delay: number }) {
  return (
    <li
      data-inside={inside || undefined}
      inert={inside || away}
      className="cs-card absolute top-1/2 left-0"
      style={{ width: CARD_W, height: CARD_H, marginTop: -CARD_H / 2, transform: `translateX(${x}px) scale(${inside ? INSIDE_S : 1})`, transitionDelay: `${delay}ms` }}
    >
      <CardBody k={k} illus={illus} zoom={CARD_ZOOM} />
    </li>
  );
}

/** The card itself (Kevin's .cf-k), drawn at his 285 × 414 and shown at `zoom`: the same on a desktop row and a phone's. */
function CardBody({ k, illus, zoom }: { k: Card; illus: string; zoom: number }) {
  const fact = (icon: ReactNode, txt: string) => (
    <span className={`cf-k__f${txt ? "" : " is-none"}`}>
      {icon}
      <span>{txt}</span>
    </span>
  );
  return (
    <div className="cf-k" data-key={k.id} data-dummy={k.dummy.length ? k.dummy.join(" ") : undefined} style={{ zoom, width: 285, height: 414 }}>
      <a className="cf-k__a" href={k.url} target="_blank" rel="noopener">
        <span className="cf-k__pic cb-illus">
          <img src={illus} alt="" loading="lazy" decoding="async" width={300} height={220} />
        </span>
        <span className="cf-k__b">
          <span className="cf-k__t">{k.title}</span>
          {k.badges.length ? (
            <span className="cf-k__tags">
              {k.badges.map((b) => (
                <span key={b} className={`cf-badge cf-badge--${b}`}>
                  {BADGE[b].label}
                </span>
              ))}
            </span>
          ) : null}
          <span className="cf-k__facts">
            {fact(<IDur />, k.dur)}
            {fact(<ITime />, k.time)}
            {fact(k.mode === "online" ? <ILive /> : <IRoom />, k.modeLabel)}
          </span>
        </span>
        <span className="cf-k__ft">
          <span className="cf-k__start">
            <ICal />
            <span>
              <small>{k.startLabel}</small>
              <b>{k.startValue}</b>
            </span>
          </span>
          <GoButton />
        </span>
      </a>
    </div>
  );
}

/* ───────────────────────────── a category on a phone ───────────────────────────── */

/** A card on a phone: Kevin's card at his full size (285 × 414), about 80% of the screen, the next peeking in. */
const PHONE_ZOOM = 1;
/** The book in a phone category's head: the homepage book at this scale (56 × 81). */
const PHONE_BOOK = 0.38;

/**
 * A category on a phone: one band (white, or Our Top Picks' mahogany). At its head, the category's book drawn small,
 * with the category's name and how many courses the filters leave beside it; then Kevin's chips (swiping sideways if
 * they do not fit); then its courses as Kevin's cards with their illustrations, in one row that swipes sideways and
 * snaps to each card, the next one peeking in at the edge. (The book does not take the cards in here: on a phone
 * the row is moved by the finger.)
 */
function PhoneStrip({ sec, book, name, cards }: { sec: Section; book: ShelfBook; name: string; cards: Card[] }) {
  const { f, setChip, disabled, list } = useChips(cards);
  const illus = useMemo(() => illusRow(list), [list]);
  const id = `cat-${sec.k}`;
  const dark = sec.top;
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="cs-strip">
      <div
        className={cx(
          "relative isolate overflow-hidden rounded-[22px]",
          dark ? "cb-feat shadow-[0_24px_40px_-30px_rgb(43_18_6/0.8)]" : "border border-[rgb(194_65_12/0.14)] bg-white shadow-[0_18px_34px_-28px_rgb(70_26_10/0.5)]",
        )}
      >
        {dark && <span aria-hidden="true" className="cb-feat__grain pointer-events-none absolute inset-0" />}

        {/* The head: the book, small, and the category's name and count. */}
        <header className="relative z-[2] flex items-center gap-3.5 px-4 pt-4">
          <span aria-hidden="true" className="relative block shrink-0" style={{ width: Math.round(148 * PHONE_BOOK), height: Math.round(214 * PHONE_BOOK) }}>
            <span className="absolute top-0 left-0 block origin-top-left" style={{ scale: PHONE_BOOK }}>
              <BookBack book={book} />
              <span className="absolute inset-0 block">
                <BookCover book={book} count={list.length} />
              </span>
            </span>
          </span>
          <div className="min-w-0">
            <h2 id={`${id}-h`} className={cx("font-[family-name:var(--font-news)] text-[24px]/[1.1] font-normal tracking-[-0.01em]", dark ? "text-white" : "text-[#1a1714]")}>
              {name}
            </h2>
            <p className={cx("mt-1 text-[13.5px]/[18px] font-semibold", dark ? "text-[#ffd48a]" : "text-[#9a3412]")}>
              {list.length} {list.length === 1 ? "course" : "courses"}
            </p>
          </div>
        </header>

        {/* Kevin's chips. */}
        <div className="relative z-[2] mt-3.5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chips name={name} f={f} setChip={setChip} disabled={disabled} className="w-max flex-nowrap" />
        </div>

        {/* The courses: a row that swipes sideways, snapping to each card. */}
        <ul
          aria-label={`${name}: ${list.length} ${list.length === 1 ? "course" : "courses"}, swipe for more`}
          className="relative z-[2] flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pt-3.5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {list.map((c, i) => (
            <li key={c.id} className="shrink-0 snap-start" style={{ width: Math.round(285 * PHONE_ZOOM), height: Math.round(414 * PHONE_ZOOM) }}>
              <CardBody k={c} illus={illus[i]} zoom={PHONE_ZOOM} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
