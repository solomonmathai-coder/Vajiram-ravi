/** "Featured UPSC CSE programmes" (Figma 1934:3312): the stage filter and the programme bento. */

export type Stage = "learn" | "practise" | "guidance";

export const stages: { id: Stage; label: string }[] = [
  { id: "learn", label: "Learn" },
  { id: "practise", label: "Practise" },
  { id: "guidance", label: "Guidance" },
];

export type BentoProgramme = {
  title: string;
  stage: Stage;
  image: string;
  /** "wide" is the dark double-width card with a large illustration; "small" the light single card. */
  size: "wide" | "small";
  modes: string;
  courseCount: number;
  href: string;
};

const MODES = "Classroom · LIVE-Online";

/** In bento order: each row of the design fills four columns (a wide card takes two). */
export const bentoProgrammes: BentoProgramme[] = [
  { title: "UPSC GS Foundation Course - PCM", stage: "learn", image: "/images/courses/gs-foundation-pcm.webp", size: "wide", modes: MODES, courseCount: 4, href: "#" },
  { title: "Optional Subject Programme", stage: "learn", image: "/images/courses/optional-subject.webp", size: "small", modes: MODES, courseCount: 26, href: "#" },
  { title: "CSAT Course", stage: "learn", image: "/images/courses/csat.webp", size: "small", modes: MODES, courseCount: 26, href: "#" },
  { title: "Prelims Test Series", stage: "practise", image: "/images/courses/prelims-test-series.webp", size: "small", modes: MODES, courseCount: 26, href: "#" },
  { title: "Mains Test Series", stage: "practise", image: "/images/courses/mains-test-series.webp", size: "small", modes: MODES, courseCount: 26, href: "#" },
  { title: "Optional Test Series", stage: "practise", image: "/images/courses/optional-test-series.webp", size: "small", modes: MODES, courseCount: 26, href: "#" },
  { title: "Mentorship Programme", stage: "guidance", image: "/images/courses/mentorship.webp", size: "small", modes: MODES, courseCount: 26, href: "#" },
  { title: "Interview Guidance Programme", stage: "guidance", image: "/images/courses/interview-guidance.webp", size: "wide", modes: MODES, courseCount: 26, href: "#" },
];

export const coursesIntro = {
  title: "Featured UPSC CSE programmes",
  lead: "From your first GS class to the interview — pick the stage you’re at, then the programme.",
  viewAll: { label: "View all", href: "#" },
};

/** The orange tile that closes the bento, shown with every filter. */
export const counsellingTile = {
  title: "Not sure which programme fits?",
  text: "A counsellor can help you.",
  cta: { label: "Book a free session", href: "#counsellor" },
};
