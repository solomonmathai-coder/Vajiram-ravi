/** "Which programme is right for you?" (Figma 1958:3312): a three-step programme finder with a live match. */

export type StepId = "stage" | "mode" | "year";
export type Answers = Partial<Record<StepId, string>>;

export type FinderOption = {
  id: string;
  title: string;
  description: string;
  /** Short form shown as a tag on the match card once the answer is confirmed. */
  tag: string;
};

export type FinderStep = {
  id: StepId;
  /** Name and hint in the "Your answers" rail. */
  label: string;
  hint: string;
  question: string;
  options: FinderOption[];
};

export const finderIntro = {
  title: "Which programme is right for you?",
  lead: "Answer 3 quick questions — we’ll suggest a programme and its next batch.",
  counsellor: { prompt: "Not sure?", link: "Talk to a counsellor", href: "#counsellor", image: "/images/programme-finder/counsellor.webp" },
};

/*
 * Step 1 is the design's. Steps 2 and 3 follow the rail's hints ("Classroom or LIVE-Online", "Which UPSC
 * CSE you’re aiming for"); their tiles are written in the same voice and should be checked by the team.
 */
export const finderSteps: FinderStep[] = [
  {
    id: "stage",
    label: "Stage",
    hint: "Where are you in your preparation?",
    question: "Where are you in your preparation?",
    options: [
      { id: "college", title: "College student", description: "Start early with the 2-year Fledgling", tag: "College student" },
      { id: "graduate", title: "Graduate, starting GS", description: "1-year GS Prelims & Mains Programme", tag: "Graduate" },
      { id: "attempting", title: "Preparing for Prelims or Mains", description: "Test series, CSAT and optional subjects", tag: "Prelims or Mains" },
      { id: "interview", title: "Cleared Mains", description: "Interview Guidance Programme", tag: "Cleared Mains" },
    ],
  },
  {
    id: "mode",
    label: "Mode",
    hint: "Classroom or LIVE-Online",
    question: "How would you like to attend?",
    options: [
      { id: "classroom", title: "Classroom", description: "At our campus in Old Rajinder Nagar, Delhi", tag: "Classroom" },
      { id: "online", title: "LIVE-Online", description: "Live classes you can join from anywhere", tag: "LIVE-Online" },
    ],
  },
  {
    id: "year",
    label: "Target year",
    hint: "Which UPSC CSE you’re aiming for",
    question: "Which UPSC CSE are you aiming for?",
    options: [
      { id: "2027", title: "UPSC CSE 2027", description: "1-year programmes and test series", tag: "CSE 2027" },
      { id: "2028", title: "UPSC CSE 2028", description: "Room for the 2-year Fledgling", tag: "CSE 2028" },
      { id: "2029", title: "UPSC CSE 2029 or later", description: "Start with strong foundations", tag: "CSE 2029+" },
      { id: "undecided", title: "Not decided yet", description: "We’ll suggest a starting point", tag: "Year open" },
    ],
  },
];

/** The design opens with step 1 answered, so the match card already shows a programme. */
export const initialAnswers: Answers = { stage: "graduate" };

export type FinderMatch = {
  title: string;
  track: string;
  image: string;
  nextBatch: string;
  /** Shows the "Admission open" chip. */
  admissionOpen: boolean;
  enrolHref: string;
};

/*
 * Batch details come from the design (GS PCM 2027 starts 27 Nov 2026) and the featured banners
 * (Fledgling 2028: admission open). Programmes without a published date say so; fill them in from the
 * batch calendar.
 */
const matches = {
  oneYear: {
    title: "UPSC GS Foundation Course - PCM",
    track: "1-year GS Prelims & Mains Programme",
    image: "/images/courses/gs-foundation-pcm.webp",
    nextBatch: "Starts 27 Nov 2026",
    admissionOpen: true,
    enrolHref: "#",
  },
  fledgling: {
    title: "UPSC GS Foundation Course - PCM",
    track: "2-year Fledgling Programme",
    image: "/images/courses/gs-foundation-pcm.webp",
    nextBatch: "Dates on request",
    admissionOpen: true,
    enrolHref: "#",
  },
  testSeries: {
    title: "Prelims Test Series",
    track: "Test series, CSAT and optional subjects",
    image: "/images/courses/prelims-test-series.webp",
    nextBatch: "Dates on request",
    admissionOpen: false,
    enrolHref: "#",
  },
  interview: {
    title: "Interview Guidance Programme",
    track: "For candidates who have cleared Mains",
    image: "/images/courses/interview-guidance.webp",
    nextBatch: "After the Mains results",
    admissionOpen: false,
    enrolHref: "#",
  },
} satisfies Record<string, FinderMatch>;

/** Every illustration a match can show, so the card can cross-fade between them. */
export const matchImages = [...new Set(Object.values(matches).map((m) => m.image))];

/** The likeliest programme for the answers so far; the stage decides, the target year refines it. */
export function matchFor(answers: Answers): FinderMatch {
  switch (answers.stage) {
    case "college":
      return matches.fledgling;
    case "attempting":
      return matches.testSeries;
    case "interview":
      return matches.interview;
    default:
      // A graduate with two or more years to go has room for the 2-year track.
      return answers.year === "2028" || answers.year === "2029" ? matches.fledgling : matches.oneYear;
  }
}
