export type BatchMode = "Classroom" | "LIVE-Online";

export type Batch = {
  id: string;
  title: string;
  /** Start date as YYYY-MM-DD. The calendar, the featured card and the "past" dimming all follow it. */
  starts: string;
  /** The card's second line, as written. */
  meta: string;
  /** Which modes the batch runs in, for the All / Classroom / LIVE-Online filter. */
  modes: BatchMode[];
  limitedSeats: boolean;
};

const BOTH_MODES: BatchMode[] = ["Classroom", "LIVE-Online"];
const BOTH_2027 = "Classroom & LIVE-Online · Target: UPSC CSE 2027";

/** Upcoming batches, earliest first. */
export const batches: Batch[] = [
  {
    id: "prelims-camp-3",
    title: "Prelims CAMP Batch 3",
    starts: "2027-01-03",
    meta: BOTH_2027,
    modes: BOTH_MODES,
    limitedSeats: true,
  },
  {
    id: "smart-prelims-ca-2026",
    title: "SMART Prelims Current Affairs Programme 2026",
    starts: "2027-01-17",
    meta: BOTH_2027,
    modes: BOTH_MODES,
    limitedSeats: true,
  },
  {
    id: "smart-ca-2026",
    title: "SMART Current Affairs Program 2026",
    starts: "2027-01-17",
    meta: "Target: UPSC CSE 2026",
    // The design does not name a mode for this batch; LIVE-Online until admissions confirm.
    modes: ["LIVE-Online"],
    limitedSeats: true,
  },
  {
    id: "gs-comprehensive-11m",
    title: "11 Months Prelims cum Mains General Studies Comprehensive Programme",
    starts: "2027-01-29",
    meta: BOTH_2027,
    modes: BOTH_MODES,
    limitedSeats: false,
  },
];

export const batchFilters = ["All", "Classroom", "LIVE-Online"] as const;
export type BatchFilter = (typeof batchFilters)[number];

/** Choices for "Select Programmes" in the enquiry form: the batches above, then the main courses. */
export const enquiryProgrammes: string[] = [
  ...batches.map((batch) => batch.title),
  "UPSC GS Foundation Course - PCM",
  "Optional Subject Programme",
  "CSAT Course",
  "Interview Guidance Programme",
  "Mentorship Programme",
  "Mains Test Series",
  "Prelims Test Series",
  "Optional Test Series",
];

export const timePreferences = ["Morning (9 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 7 PM)"];
