import { SITE, courses, type Course, type CourseVersion } from "@/data/courses";
import type { CoverArtKind, CoverEmblem } from "@/data/programmes";

/**
 * The courses page's books: one for each course category of the client's design (its 14 families, GS
 * Foundation's two lengths in one book, as its category list shows them: 13), in the design's order. Each
 * is bound like a book of the homepage's programme shelf: cloth colours, a gold-foil emblem and the motif
 * pressed into its cloth. Its line is the homepage programme group's (data/programmes.ts) where there is one;
 * those of Module Courses, Optional Crash Course, Optional Enrichment, IFoS and Postal Course are drawn from
 * their courses and are to be confirmed.
 */
export type ShelfBook = {
  key: string;
  title: string;
  /** What the category is, in a line under its name. */
  line: string;
  families: string[];
  cover: { light: string; base: string; deep: string; emblem: CoverEmblem; art: CoverArtKind };
};

export const BOOKS: ShelfBook[] = [
  { key: "gs", title: "GS Foundation", line: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.", families: ["gs-11", "gs-2yr"], cover: { light: "#d9581c", base: "#c2410c", deep: "#8f3010", emblem: "books", art: "bars" } },
  { key: "optional", title: "Optional Subject", line: "Coaching in 13 optional subjects, from Anthropology to Sociology, in classroom and LIVE-Online.", families: ["optional"], cover: { light: "#c0362c", base: "#a3231c", deep: "#701510", emblem: "quill", art: "circles" } },
  { key: "csat", title: "CSAT", line: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.", families: ["csat"], cover: { light: "#2e6a80", base: "#1f4a5f", deep: "#14323f", emblem: "abacus", art: "grid" } },
  { key: "interview", title: "Interview Guidance", line: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.", families: ["interview"], cover: { light: "#5e5f63", base: "#4a4b4e", deep: "#303133", emblem: "mic", art: "arches" } },
  { key: "mentorship", title: "Mentorship", line: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.", families: ["mentorship"], cover: { light: "#b8673a", base: "#9b5029", deep: "#6e3519", emblem: "compass", art: "arcs" } },
  { key: "mains-ts", title: "Mains Test Series", line: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.", families: ["mains-ts"], cover: { light: "#a3545c", base: "#873f48", deep: "#5e2a31", emblem: "pen", art: "lines" } },
  { key: "prelims-ts", title: "Prelims Test Series", line: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.", families: ["prelims-ts"], cover: { light: "#7a3556", base: "#5e2742", deep: "#3f192c", emblem: "target", art: "target" } },
  { key: "optional-ts", title: "Optional Test Series", line: "Year-long and Mains test series to practise answer writing in your optional subject.", families: ["optional-ts"], cover: { light: "#336650", base: "#264f3e", deep: "#18352a", emblem: "layers", art: "quarters" } },
  { key: "module", title: "Module Courses", line: "Short courses on one part of the syllabus: SMART current affairs, Economics, Ethics and the Essay.", families: ["module"], cover: { light: "#3b5482", base: "#2c3f66", deep: "#1c2a46", emblem: "books", art: "grid" } },
  { key: "crash", title: "Optional Crash Course", line: "A quick run through your optional before Mains, with tests: History, PSIR, Mathematics, Commerce, Sociology and Medical Science.", families: ["crash"], cover: { light: "#9a3442", base: "#7a2733", deep: "#4f1820", emblem: "pen", art: "bars" } },
  { key: "enrichment", title: "Optional Enrichment", line: "Answer writing and advanced practice in an optional you have studied once: PSIR, Sociology, History, Anthropology and Public Administration.", families: ["enrichment"], cover: { light: "#c8902e", base: "#a8741f", deep: "#714c12", emblem: "quill", art: "arcs" } },
  { key: "ifos", title: "IFoS", line: "Courses and test series in Forestry and Geology, the optionals of the Indian Forest Service.", families: ["ifos"], cover: { light: "#47733f", base: "#355b30", deep: "#203a1f", emblem: "layers", art: "circles" } },
  { key: "postal", title: "Postal Course", line: "Vajiram & Ravi's study material sent to you by post, to prepare at your own pace.", families: ["postal"], cover: { light: "#76655a", base: "#5c4e44", deep: "#3b322b", emblem: "books", art: "lines" } },
];

export type Ticket = { course: Course; version: CourseVersion; href: string; start: Date | null };

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
export const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The first date in a page's "Date of Commencement" (e.g. "28th  October 2026 ( Batch XXII )"), or null. */
export function parseStart(text?: string): Date | null {
  if (!text) return null;
  const m = text.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s+(\d{4})/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2].toLowerCase());
  return month < 0 ? null : new Date(Number(m[3]), month, Number(m[1]));
}

/** Every course version, as one entry. */
export const tickets: Ticket[] = courses.flatMap((course) =>
  course.versions.map((version) => ({
    course,
    version,
    href: version.url.startsWith("/") ? SITE + version.url : version.url,
    start: parseStart(version.details.start),
  })),
);

export const bookOf = (family: string) => BOOKS.find((b) => b.families.includes(family))?.key ?? "postal";
