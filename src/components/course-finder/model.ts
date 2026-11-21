/*
 * The course finder's model: Kevin's js/course-finder.js (commit 39e7bc9) up to the point where it writes the
 * page, as pure functions. It reads src/data/course-finder.ts and gives the categories, their cards (with
 * every fact as the card shows it, real or DUMMY) and the head's figures. The cards depend on today's date
 * (a batch "Starts" or has "Started"), so the page builds it with the build's date on the server and again
 * with the visitor's on the client.
 */
import { cfData, cfDummy, cfTopPickIds, type CfCourse, type CfVariant } from "@/data/course-finder";

export type Badge = "new" | "bestseller" | "trending";
export type Category = { k: string; label: string; kids: string[] };

/** One course card (a course version in a category's row): Kevin's <li class="cf-k"> and its data-* attributes. */
export type Card = {
  /** The version's id. */
  id: string;
  /** Its place in its row, so a chip can put the row back after Upcoming has sorted it (data-i). */
  i: number;
  mode: CfVariant["k"];
  lang: CfVariant["l"];
  sub: string;
  badges: Badge[];
  /** 1 while its next batch is yet to start (data-up). */
  up: 0 | 1;
  /** The start as a number (20261127), for the Upcoming order (data-start). */
  start: number;
  /** The target years in its name (data-yr). */
  yr: string[];
  /** The facts that are DUMMY stand-ins (data-dummy): start, dur, time, freq, badge. */
  dummy: string[];
  /** What the search looks through, folded (data-q). */
  q: string;
  url: string;
  img: string;
  title: string;
  dur: string;
  time: string;
  modeLabel: string;
  startLabel: string;
  startValue: string;
};

export type Section = {
  k: string;
  label: string;
  top: boolean;
  cards: Card[];
};

export const fold = (s: string) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

const D = cfData;

/** GS Foundation's two lengths as one category, then every other family. */
export const TREE: Category[] = [{ k: "gs", label: "GS Foundation", kids: ["gs-11", "gs-2yr"] }].concat(
  D.families.filter((f) => f.k !== "gs-11" && f.k !== "gs-2yr").map((f) => ({ k: f.k, label: f.label, kids: [f.k] })),
);
const TOP_T: Category = { k: "top", label: "Our Top Picks", kids: [] };

const subLabel: Record<string, string> = Object.fromEntries(D.subjects.map((s) => [s.k, s.label]));
const famLabel: Record<string, string> = Object.fromEntries(D.families.map((f) => [f.k, f.label]));

export const modeTxt = (v: CfVariant) => (v.k === "classroom" ? "Classroom" : v.k === "online" ? "LIVE-Online" : "Classroom & LIVE-Online");

const MON: Record<string, string> = {
  january: "Jan", february: "Feb", march: "Mar", april: "Apr", may: "May", june: "Jun",
  july: "Jul", august: "Aug", september: "Sep", october: "Oct", november: "Nov", december: "Dec",
};
/** The course's length as its page gives it, tidied: "02 Months" to "2 Months", date ranges shortened. */
const durTxt = (d: string) =>
  String(d || "")
    .trim()
    .replace(/\b0(\d)\b/g, "$1")
    .replace(/(\d)(?:st|nd|rd|th)\b/g, "$1")
    .replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, (m) => MON[m.toLowerCase()])
    .replace(/\s+to\s+/gi, " – ")
    .replace(/^(\d+) (\w{3}) (\d{4}) – (\d+) (\w{3}) \3$/, "$1 $2 – $4 $5 $3")
    .replace(/\b(days?|weeks?|months?|years?)\b/gi, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

/** The target exam year, for the Target year filter: the year in the course's name (its page's title). */
const yearsOf = (v: CfVariant) => [...new Set([...`${v.h1} ${v.t}`.matchAll(/\b(202[6-9])\b/g)].map((m) => m[1]))];

const MON3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/** The date of commencement: the next one the page gives, or the last if every one has passed ("Started …"). */
const startTxt = (v: CfVariant, today: Date) => {
  const ds = [...String(v.start || "").matchAll(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s+(\d{4})/g)]
    .map((m) => {
      const mo = MONTHS.indexOf(m[2].toLowerCase());
      return mo < 0 ? null : new Date(+m[3], mo, +m[1]);
    })
    .filter((d): d is Date => !!d);
  if (!ds.length) return /announc/i.test(v.start || "") ? "Start date to be announced" : "";
  const next = ds.filter((d) => d >= today).sort((a, b) => +a - +b)[0];
  const d = next || ds[ds.length - 1];
  return `${next ? "Starts" : "Started"} ${d.getDate()} ${MON3[d.getMonth()]} ${d.getFullYear()}`;
};

/** How often the classes meet, read from the course's page; "" where it says nothing (DUMMY.freq stands in). */
const freqOf = (v: CfVariant) => {
  const s = [v.time, v.intro, JSON.stringify(v.feat || ""), JSON.stringify(v.stats || "")].join(" ").toLowerCase();
  if (/6 days a week|six days a week/.test(s)) return "Mon–Sat";
  if (/weekend|saturday and sunday|saturdays and sundays/.test(s)) return "Weekends";
  if (/every ?day|per class, daily|daily classes/.test(s)) return "Daily";
  if (/weekly|once a week|every week/.test(s)) return "Weekly";
  return "";
};

/** "2:30 PM to 5:00 PM" to "2:30–5:00 PM"; "11:00 AM to 1:30 PM" to "11:00 AM–1:30 PM". */
const compactTime = (s: string) => {
  const m = s.match(/^(\d{1,2}:\d{2})\s*(AM|PM)\s*(?:to|-|–)\s*(\d{1,2}:\d{2})\s*(AM|PM)$/i);
  if (!m) return s;
  return m[2].toUpperCase() === m[4].toUpperCase()
    ? `${m[1]}–${m[3]} ${m[4].toUpperCase()}`
    : `${m[1]} ${m[2].toUpperCase()}–${m[3]} ${m[4].toUpperCase()}`;
};

/** The course time, tidied ("02:30 PM to 05:00 PM" to "2:30 PM to 5:00 PM"); anything in brackets left to its page. */
const timeTxt = (v: CfVariant) => {
  const s = String(v.time || "").replace(/\(.*$/, "").trim();
  if (!s) return "";
  if (/announc/i.test(s)) return "Timing to be announced";
  return s.replace(/\b0(\d):/g, "$1:").replace(/\s+/g, " ");
};

/** The start as a number (20261127) to put the Upcoming chip's courses in date order; a date to be announced goes last. */
const startKey = (s: string) => {
  const m = String(s).match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  return m ? +m[3] * 10000 + (MON3.indexOf(m[2]) + 1) * 100 + +m[1] : 99999999;
};

/**
 * The badges. New: Interview Guidance (Kevin's, 2026-11-17). Trending: the two courses in the homepage's "What's
 * trending" carousel (the 11-month GS Comprehensive and PowerUp Prelims Test Series 2027). Bestseller: none yet;
 * to be given by the client (never guessed). One badge a card: new, then bestseller, then trending.
 */
export const BADGE: Record<Badge, { label: string; test: (c: CfCourse, v: CfVariant) => boolean }> = {
  new: { label: "New", test: (c) => c.f === "interview" },
  bestseller: { label: "Bestseller", test: () => false },
  trending: { label: "Trending", test: (c, v) => c.f === "gs-11" || /^powerup prelims test series/i.test(v.t) },
};
const KINDS: Badge[] = ["new", "bestseller", "trending"];
const badgeOf = (c: CfCourse, v: CfVariant) => KINDS.find((k) => BADGE[k].test(c, v));

/** The course families of each category, and the courses' variants in data order. */
const itemsOf = (t: Category) => D.courses.filter((c) => t.kids.includes(c.f)).flatMap((c) => c.v.map((v) => [c, v] as const));
const famOf = (f: string) => TREE.find((x) => x.kids.includes(f));
const TESTS = new Set(["mains-ts", "prelims-ts", "optional-ts"]);

/** The categories and their cards for a given day (Kevin's card(), secHTML and TOP_HTML, in his order). */
export function buildSections(today: Date): Section[] {
  // EVERY CATEGORY HAS ALL THREE BADGES AND AN UPCOMING BATCH (Kevin, 2026-11-18). The real badges come first;
  // where a category still lacks New, Trending or Bestseller, a DUMMY one goes to a course in it with no badge
  // yet, spread along its row (or, in a category with fewer courses than badges, a second badge on a course).
  // A category whose every batch has started gets a DUMMY next batch on its first course. NOT real: replace
  // them with the real ones before launch.
  const BADGES = new Map<string, Badge[]>();
  const FORCE_START = new Set<string>();
  const DUM_BADGE = new Set<string>();
  for (const c of D.courses) for (const v of c.v) {
    const b = badgeOf(c, v);
    BADGES.set(v.id, b ? [b] : []);
  }
  const topUp = (vs: CfVariant[]) => {
    const missing = KINDS.filter((k) => !vs.some((v) => BADGES.get(v.id)!.includes(k)));
    missing.forEach((k, i) => {
      const free = vs.filter((v) => !BADGES.get(v.id)!.length);
      const pick = free.length
        ? free[Math.floor((i * free.length) / missing.length) % free.length]
        : [...vs].sort((a, b) => BADGES.get(a.id)!.length - BADGES.get(b.id)!.length)[0];
      BADGES.get(pick.id)!.push(k);
      DUM_BADGE.add(pick.id);
    });
  };
  for (const tr of TREE) {
    const vs = D.courses.filter((c) => tr.kids.includes(c.f)).flatMap((c) => c.v);
    if (!vs.length) continue;
    topUp(vs);
    if (!vs.some((v) => { const s = startTxt(v, today); return !s || /^Starts/.test(s); })) FORCE_START.add(vs[0].id);
  }
  const allV = D.courses.flatMap((c) => c.v);
  topUp(cfTopPickIds.map((id) => allV.find((v) => v.id === id)).filter((v): v is CfVariant => !!v));
  for (const v of BADGES.values()) v.sort((a, b) => KINDS.indexOf(a) - KINDS.indexOf(b));

  let dummyN = 0; // turns through the stand-in dates and class times, so neighbouring cards differ
  const card = (c: CfCourse, v: CfVariant, t: Category, i: number): Card => {
    const dur = durTxt(v.dur);
    const q = fold([v.t, t.label, famLabel[c.f], subLabel[c.s], modeTxt(v), v.l === "hi" ? "hindi हिंदी" : "english", dur].join(" "));
    const bs = BADGES.get(v.id) || [];
    const fam = t.k === "top" ? famOf(c.f)?.k : t.k;
    const dum: string[] = [];
    const n = dummyN++;
    let st = FORCE_START.has(v.id) ? "" : startTxt(v, today);
    if (!st) { st = cfDummy.start[n % cfDummy.start.length]; dum.push("start"); }
    const sm = st.match(/^(Starts|Started)\s+(.+)$/);
    const sLbl = sm ? (sm[1] === "Started" ? "Batch started" : "Batch starts") : "Batch starts";
    const sVal = sm ? sm[2] : "To be announced";
    let du = dur;
    if (!du) { du = cfDummy.dur[fam ?? ""] || "3 Months"; dum.push("dur"); }
    let tm = timeTxt(v);
    if (!tm) { tm = TESTS.has(fam ?? "") ? cfDummy.time.tests : cfDummy.time.classes[n % cfDummy.time.classes.length]; dum.push("time"); }
    let fq = freqOf(v);
    if (!fq) {
      fq = TESTS.has(fam ?? "") ? cfDummy.freq.tests : fam === "mentorship" || fam === "interview" ? cfDummy.freq.guided : cfDummy.freq.classes;
      dum.push("freq");
    }
    if (!/announc/i.test(tm)) tm = `${fq} · ${compactTime(tm)}`;
    if (DUM_BADGE.has(v.id)) dum.push("badge");
    return {
      id: v.id, i, mode: v.k, lang: v.l, sub: c.s || "", badges: [...bs], up: sm && sm[1] === "Starts" ? 1 : 0, start: startKey(sVal),
      yr: yearsOf(v), dummy: dum, q, url: v.u, img: v.i, title: v.t, dur: du, time: tm, modeLabel: modeTxt(v), startLabel: sLbl, startValue: sVal,
    };
  };

  const secs: Section[] = [];
  for (const t of TREE) {
    const items = itemsOf(t);
    if (!items.length) continue;
    secs.push({ k: t.k, label: t.label, top: false, cards: items.map(([c, v], i) => card(c, v, t, i)) });
  }
  const tops = cfTopPickIds
    .map((id) => {
      for (const c of D.courses) {
        const v = c.v.find((x) => x.id === id);
        if (v) return [c, v] as const;
      }
      return null;
    })
    .filter((x): x is readonly [CfCourse, CfVariant] => !!x);
  // Our Top Picks comes first on the page, but its cards are made after the categories', as on his page
  if (tops.length) secs.unshift({ k: "top", label: TOP_T.label, top: true, cards: tops.map(([c, v], i) => card(c, v, famOf(c.f) || TOP_T, i)) });
  return secs;
}

/** The head's figures, counted from the data: every version, the categories (GS's two lengths as one) and the optional subjects. */
export const STATS: [number, string][] = [
  [D.courses.reduce((n, c) => n + c.v.length, 0), "Courses to choose from"],
  [D.families.filter((f) => f.k !== "gs-2yr").length, "Categories, Prelims to Interview"],
  [D.subjects.length, "Optional subjects taught"],
];

/** The bar's dropdowns (Mode, Medium, Target year), each option's test on a card. */
export type FilterKey = "mode" | "lang" | "yr";
export const DROPS: { key: FilterKey; label: string; opts: [string, string][]; test: (k: Card, v: string) => boolean }[] = [
  { key: "mode", label: "Mode", opts: [["classroom", "Classroom"], ["online", "LIVE-Online"]], test: (k, v) => k.mode === v || k.mode === "both" },
  { key: "lang", label: "Medium", opts: [["en", "English"], ["hi", "हिंदी"]], test: (k, v) => k.lang === v },
  { key: "yr", label: "Target year", opts: [["2026", "CSE 2026"], ["2027", "CSE 2027"], ["2028", "CSE 2028"]], test: (k, v) => k.yr.includes(v) },
];

export type Filters = { q: string[]; mode: string; lang: string; yr: string };
export const NO_FILTERS: Filters = { q: [], mode: "", lang: "", yr: "" };

/** Whether a card passes the bar's search and dropdowns. */
export const passes = (k: Card, f: Filters) =>
  (!f.mode || k.mode === f.mode || k.mode === "both") &&
  (!f.lang || k.lang === f.lang) &&
  f.q.every((w) => k.q.includes(w)) &&
  (!f.yr || k.yr.includes(f.yr));

/** The chips, the same five in every category: All, then the badges and Upcoming ("" is All). */
export const CHIPS: [string, string][] = [["badge:new", "New"], ["badge:trending", "Trending"], ["badge:bestseller", "Bestseller"], ["up:1", "Upcoming"]];
export const hasChip = (k: Card, chip: string) => {
  const [key, val] = chip.split(":");
  return key === "badge" ? k.badges.includes(val as Badge) : key === "up" ? String(k.up) === val : false;
};

/** Courses in each category, for the nav's menu (GS Foundation counts both its lengths). */
export const countIn = (k: string) => D.courses.filter((c) => (k === "gs" ? ["gs-11", "gs-2yr"] : [k]).includes(c.f)).reduce((n, c) => n + c.v.length, 0);
export const TOTAL = STATS[0][0];
