export type Course = { title: string; courseCount: number; image: string };

export const courses: Course[] = [
  { title: "UPSC GS Foundation Course - PCM", courseCount: 4, image: "/images/courses/gs-foundation-pcm.webp" },
  { title: "Optional Subject Programme", courseCount: 26, image: "/images/courses/optional-subject.webp" },
  { title: "CSAT Course", courseCount: 26, image: "/images/courses/csat.webp" },
  { title: "Interview Guidance Programme", courseCount: 26, image: "/images/courses/interview-guidance.webp" },
  { title: "Mentorship Programme", courseCount: 26, image: "/images/courses/mentorship.webp" },
  { title: "Mains Test Series", courseCount: 26, image: "/images/courses/mains-test-series.webp" },
  { title: "Prelims Test Series", courseCount: 26, image: "/images/courses/prelims-test-series.webp" },
  { title: "Optional Test Series", courseCount: 26, image: "/images/courses/optional-test-series.webp" },
];

export type Batch = {
  month: string;
  day: number;
  title: string;
  meta: string;
  /** Position of the "Limited seats" tab along the card's top edge, in canvas pixels. */
  seats?: { left: number; width: number };
  /** The design's alternate card style: narrower date box and a smaller arrow. */
  compact?: boolean;
};

const CLASSROOM_2027 = "Classroom & LIVE-Online · Target: UPSC CSE 2027";

export const batches: Batch[] = [
  { month: "JAN", day: 3, title: "Prelims CAMP Batch 3", meta: CLASSROOM_2027, seats: { left: 567, width: 119 } },
  { month: "JAN", day: 17, title: "SMART Prelims Current Affairs Programme 2026", meta: CLASSROOM_2027 },
  {
    month: "JAN",
    day: 17,
    title: "SMART Current Affairs Program 2026",
    meta: "Target: UPSC CSE 2026",
    seats: { left: 569, width: 116 },
    compact: true,
  },
  { month: "JAN", day: 29, title: "11 Months Prelims cum Mains General Studies Comprehensive Programme", meta: CLASSROOM_2027 },
];

export const timePreferences = ["Morning (9 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 7 PM)"];
