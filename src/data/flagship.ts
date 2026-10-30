/** One exam stage in the flagship section's score meters: how many of its marks General Studies carries. */
export type ScoreMeter = { stage: string; gsMarks: number; totalMarks: number };

/** The flagship GS Prelims & Mains Programme section (Figma "Flagship · GS Programme"). */
export const flagship = {
  chip: "Our flagship programme",
  title: "General Studies decides most of your UPSC score",
  body: "Our GS Prelims & Mains Programme covers the full syllabus with daily classes, printed study material, Prelims and Mains tests and mentoring, in Classroom or LIVE-Online. Graduates take the 1-year programme; college students start with the 2-year Fledgling.",
  cta: { label: "Enrol in the GS programme", href: "#batches" },
  photo: { src: "/images/gs-classroom.webp", alt: "A Vajiram & Ravi GS classroom in session" },
  meterCaption: "Marks come from General Studies",
  meters: [
    { stage: "Prelims", gsMarks: 200, totalMarks: 200 },
    { stage: "Mains", gsMarks: 1000, totalMarks: 1750 },
  ] satisfies ScoreMeter[],
};
