/** Hero copy, the record bento and the programme banners (Figma "Hero", 1931:3322). */

export const heroIntro = {
  chip: "Admissions for 2027 are open",
  headline: "Best IAS Coaching in ",
  accent: "Delhi, India",
  lead: "For five decades, aspirants have trusted us to take them from their first class to the interview with experienced faculty, a structured method and honest guidance.",
  newToUpsc: { text: "New to UPSC? ", link: "See how the preparation works →", href: "#gs-programme" },
};

export type RecordCard = {
  value: string;
  label: string;
  /** The card's look: the brand gradient, the light card, the dark card, or a photo under a scrim. */
  look: "gradient" | "light" | "dark" | "photo";
  image?: string;
};

export const records: RecordCard[] = [
  { value: "50+", label: "Years of experience since 1976", look: "gradient" },
  { value: "10/10", label: "Top rankers from V&R courses", look: "light" },
  { value: "59", label: "Questions reflected in Prelims", look: "dark" },
  { value: "36/50", label: "CSE 2025 rankers from V&R", look: "photo", image: "/images/hero/record-classroom.webp" },
];

export type ProgrammeBanner = {
  src: string;
  alt: string;
  /**
   * "cover" for artwork made for the 1136 × 400 slot; "contain" for the slimmer strip banners, shown
   * whole over a soft blurred copy of themselves.
   */
  fit: "cover" | "contain";
};

/** Banners the client uploads. The first is the design's; the others are the earlier strip banners. */
export const programmeBanners: ProgrammeBanner[] = [
  {
    src: "/images/hero/banner-active.webp",
    alt: "General Studies Prelims cum Mains Programme for UPSC 2027, Classroom and LIVE-Online. Your Civil Services journey starts with a trusted legacy. Starts 27th November 2026. Admission open.",
    fit: "cover",
  },
  {
    src: "/images/banners/fledgling-pcm-2028.webp",
    alt: "2-year General Studies PCM: 2 Years Fledgling Programme 2028, from basics to advanced. Admission open, in Classroom and Live-Online.",
    fit: "contain",
  },
  {
    src: "/images/banners/stepup-prodigy-super-100.webp",
    alt: "Step Up Mentorship Prodigy Super 100. Starts 1st November 2026, offline and online. Admission open.",
    fit: "contain",
  },
];
