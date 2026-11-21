/**
 * "About Vajiram & Ravi" (the client's homepage content of 10 Nov 2026, section 03): the heading, the lead,
 * then the six cards about the institution in the About coverflow.
 */

export const aboutIntro = {
  /**
   * The heading, one sentence, in the client's words of 11 Nov 2026 (with a full stop, as every section heading has). The emphasis, its last beat, is set in the emphasis colour.
   */
  heading: {
    lead: "Five decades of experience and",
    emphasis: "a legacy in civil services preparation.",
  },
  lead: "Established in 1976, Vajiram & Ravi has guided generations of aspirants through experienced educators, subject-focused teaching and structured academic programmes.",
};

/** The line icons in the cards' medallions (About). */
export type InstitutionIcon = "trophy" | "faculty" | "mentor" | "books" | "location" | "modes";

/**
 * A card of the coverflow: its number (for order), icon, title and sentence, and its paper (the light
 * gradient it rests on while it is to the side, from Figma 2397:6766).
 */
export type InstitutionCard = { number: string; icon: InstitutionIcon; title: string; text: string; paper: [string, string] };

/**
 * The six cards, in the client's order and words (homepage copy of 14 Nov 2026).
 */
export const institutionCards: InstitutionCard[] = [
  {
    number: "01",
    icon: "trophy",
    title: "Proven track record",
    text: "With over five decades of experience, Vajiram & Ravi has consistently produced UPSC toppers, reflecting its commitment to academic excellence.",
    paper: ["#fff1d6", "#eeae68"],
  },
  {
    number: "02",
    icon: "faculty",
    title: "Distinguished faculty",
    text: "Learn from experienced subject specialists across General Studies, optional subjects and essay preparation.",
    paper: ["#fff6e6", "#f6c391"],
  },
  {
    number: "03",
    icon: "mentor",
    title: "Personalised learning",
    text: "Receive personalised mentorship from your first class through to your final interview.",
    paper: ["#ffefc9", "#f2b45a"],
  },
  {
    number: "04",
    icon: "books",
    title: "Comprehensive resources",
    text: "Access extensive study materials and current affairs resources to support your preparation across the UPSC syllabus.",
    paper: ["#fff3e3", "#f0a86c"],
  },
  {
    number: "05",
    icon: "location",
    title: "Our centre in New Delhi",
    text: "Study at the Vajiram & Ravi centre in New Delhi, with dedicated spaces for Civil Services preparation.",
    paper: ["#fff3dd", "#f1b764"],
  },
  {
    number: "06",
    icon: "modes",
    title: "Flexible learning modes",
    text: "Choose between classroom programmes and LIVE-Online classes, with flexible learning options to suit your preparation needs.",
    paper: ["#f8ebd2", "#d6a15e"],
  },
];

/**
 * Homepage v2: the six points as design S's chapters (the client chose its "Why Vajiram & Ravi" style and
 * scroll): each card's photograph (design S's, public/images/about/why) and the button that follows it.
 * The titles and sentences stay the cards' own (institutionCards).
 */
export const whyChapters: Record<InstitutionIcon, { photo: string; width: number; height: number; cta: { label: string; href: string } }> = {
  trophy: { photo: "/images/about/why/why-1-track-record.webp", width: 1100, height: 733, cta: { label: "Meet the toppers", href: "#toppers" } },
  faculty: { photo: "/images/about/why/why-2-faculty.webp", width: 1100, height: 733, cta: { label: "Meet our educators", href: "#educators" } },
  mentor: { photo: "/images/about/why/why-3-guidance.webp", width: 1100, height: 733, cta: { label: "Let's talk", href: "#counselling" } },
  books: { photo: "/images/about/why/why-4-study-material.webp", width: 1100, height: 733, cta: { label: "Explore study materials", href: "#resources" } },
  location: { photo: "/images/about/why/why-5-location.webp", width: 1100, height: 876, cta: { label: "Visit the campus", href: "#locations" } },
  modes: { photo: "/images/about/why/why-6-classroom-online.webp", width: 1100, height: 733, cta: { label: "Find your programme", href: "#programmes" } },
};
