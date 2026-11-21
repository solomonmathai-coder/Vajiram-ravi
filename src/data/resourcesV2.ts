import { links } from "@/data/links";
import { resourceColumns } from "@/data/study-materials";

/**
 * The free resources of homepage v2, after design S's section (the client's choice): its heading, its line
 * and its six cards, each now with a small preview of what is inside (the client found S's cards plain).
 */
export const resourcesV2Intro = {
  eyebrow: "Free resources",
  heading: { before: "Your preparation can ", em: "begin today." },
  lead: "Daily current affairs, a monthly magazine and the official papers, free, from the Vajiram & Ravi editorial desk.",
};

export type ResourceKind = "current" | "recitals" | "papers" | "syllabus" | "books" | "calendar";

export type ResourceCard = { kind: ResourceKind; title: string; text: string; cta: string; href: string; wide?: boolean };

export const resourceCards: ResourceCard[] = [
  { kind: "current", title: "Current affairs", text: "Prelims, Mains and Quest articles, written the way UPSC asks.", cta: "Read today's articles", href: links.currentAffairs, wide: true },
  { kind: "recitals", title: "The Recitals", text: "UPSC current affairs monthly material, free to download.", cta: "Download this month", href: links.theRecitals },
  { kind: "papers", title: "Previous year papers", text: "Prelims and Mains papers, with the UPSC answer key.", cta: "Browse papers", href: links.previousYearPapers },
  { kind: "syllabus", title: "Syllabus & exam pattern", text: "What is asked at each stage, and how it is marked.", cta: "Read the guide", href: links.syllabus },
  // TODO: the GS postal books' own page; the study materials page until then.
  { kind: "books", title: "GS postal books", text: "Printed General Studies material for UPSC preparation.", cta: "Buy now", href: links.studyMaterial },
  { kind: "calendar", title: "UPSC calendar 2027", text: "Every stage date, plus the age limit and eligibility rules.", cta: "See the calendar", href: links.calendar, wide: true },
];

/** The current affairs card's preview: today's first articles from the newspaper's columns. */
export const currentPreview = resourceColumns.slice(0, 2).map((column) => ({ tag: column.title.split(" ")[0], title: column.lead.title }));
