/**
 * The About page (/about), in the words of the Figma workfile's "About Us – 1441" (1008:38294, 20 Nov 2026):
 * the head and its figures, how it started, our values, the people who lead the institute, the educators,
 * where we teach and the note on branches. Set in the language of Kevin's homepage (the `kevin` branch,
 * 3e288bc): each section has its small cartouche label over a Newsreader heading ending in a full stop, as his
 * do; the labels are short names for the sections.
 *
 * To confirm with the client: the leaders' bios are marked "placeholder" in the design, and their photos and
 * the story's slides are the design's stand-ins until the institute's own are supplied. The design's "Where we
 * teach" names centres in New Delhi and Chennai; the client said on 11 Nov 2026 there is one, in New Delhi
 * (data/contact), so its line here names New Delhi only.
 */

export type AboutPhoto = { src: string; width: number; height: number; alt: string };

/** Figma "About hero – layout 3 · editorial header" (1130:32087). */
export const aboutHero = {
  tag: "Est. 1976 · New Delhi",
  title: "Preparing India’s civil servants since 1976.",
  intro:
    "Vajiram & Ravi is a coaching institute for the UPSC Civil Services Examination, founded in New Delhi by Prof. P. Velayutham. We prepare aspirants for all three stages — Prelims, Mains and the Personality Test — through classroom and LIVE-Online programmes.",
  photo: {
    src: "/images/about-page/institute.webp",
    width: 1584,
    height: 672,
    alt: "The Vajiram & Ravi institute in New Delhi, students walking out past the plants at its entrance",
  } satisfies AboutPhoto,
  /** Figma "02 Stats" (1130:32096), as written there. */
  stats: [
    { figure: "50+", text: "Years since 1976" },
    { figure: "10/10", text: "Top ten ranks in CSE 2025" },
    { figure: "36/50", text: "Of the top 50 in CSE 2025" },
    { figure: "30", text: "GS educators and mentors" },
  ],
};

/** Figma "03 How it started" (1008:38333). */
export const aboutStory = {
  label: "Since 1976",
  heading: "How it started.",
  /**
   * The section's carousel (StoryCarousel, 21 Nov 2026): the design's two paragraphs told a sentence at a time,
   * each with its photograph, so the words and the pictures can be changed together. The words are the design's
   * own; the short labels name each part.
   */
  chapters: [
    {
      label: "1976",
      text: "Since its establishment in 1976 by the distinguished Professor P. Velayutham, Vajiram & Ravi has been synonymous with excellence in Civil Services Examination coaching.",
      photo: { src: "/images/about-page/slide-building.webp", width: 1200, height: 903, alt: "The Vajiram & Ravi building" },
    },
    {
      label: "The founder",
      text: "Professor Velayutham’s impressive academic background, including a diploma in International Law from the International Court of Justice, The Hague, laid the foundation for an institute dedicated to preparing aspirants for all three levels of the UPSC exam — Preliminary Test, Main Examination and Personality Test.",
      photo: { src: "/images/about-page/slide-lecture.webp", width: 1024, height: 461, alt: "A classroom lecture" },
    },
    {
      label: "Five decades",
      text: "With nearly five decades of experience, Vajiram & Ravi has shaped the careers of countless IAS, IFS, IPS and other Central Services officers.",
      photo: { src: "/images/about-page/slide-library.webp", width: 1200, height: 805, alt: "Students in the library" },
    },
    {
      label: "The record",
      text: "The institute boasts a remarkable track record, with many students consistently securing top ranks, often within the first ten positions.",
      photo: { src: "/images/about-page/slide-felicitation.webp", width: 900, height: 900, alt: "A topper’s felicitation" },
    },
  ] satisfies { label: string; text: string; photo: AboutPhoto }[],
};

/** Figma "03b Our values" (1008:38345). */
export const aboutValues = {
  label: "Our values",
  heading: "A holistic approach to education.",
  intro:
    "We focus not only on imparting knowledge, but on inspiring students to reach their highest potential — so they are ready for the exam, and for careers as administrators who shape the future of India’s public administration.",
  photo: {
    src: "/images/about-page/classroom.webp",
    width: 1024,
    height: 461,
    alt: "A full classroom of aspirants listening to a lecture",
  } satisfies AboutPhoto,
  /** Each value with a photograph from the site's "why" set (public/images/about/why), as the final site's panels have. */
  items: [
    { title: "Knowledge, taught in depth", text: "Every subject is taught by specialists, so aspirants build a clear understanding of the syllabus for every stage of the exam.", photo: { src: "/images/about/why/why-2-faculty.webp", width: 1100, height: 733, alt: "An educator teaching at the board" } },
    { title: "Inspiration and motivation", text: "We inspire and motivate students to reach their highest potential, through a preparation that can run for months and years.", photo: { src: "/images/about/why/why-3-guidance.webp", width: 1100, height: 733, alt: "An aspirant in a guidance session" } },
    { title: "Engaging study material", text: "Our faculty write study material that keeps students engaged with the syllabus, rather than buried in it.", photo: { src: "/images/about/why/why-4-study-material.webp", width: 1100, height: 733, alt: "Vajiram & Ravi study material and notes" } },
    { title: "A stimulating learning environment", text: "Classrooms and mentoring built so students stay focused, ask questions and keep improving.", photo: { src: "/images/about/why/why-6-classroom-online.webp", width: 1100, height: 733, alt: "A classroom of aspirants in a lecture" } },
    { title: "Excellence and innovation", text: "An unwavering commitment to quality that has guided aspirants towards the civil services for nearly five decades.", photo: { src: "/images/about/why/why-1-track-record.webp", width: 1100, height: 733, alt: "The Vajiram & Ravi building" } },
  ],
};

/** Figma "05 Leadership" (1008:38379), its three cards (1146:34010). */
export const aboutLeaders = {
  label: "Leadership",
  heading: "The people who lead Vajiram & Ravi.",
  leaders: [
    {
      name: "Prof. P. Velayutham",
      role: "Founding Director",
      bio: "Founded Vajiram & Ravi in New Delhi in 1976 to prepare aspirants for all three stages of the Civil Services Examination. He studied history, economics and law in Madras, economics in London, and international law at The Hague.",
      photo: { src: "/images/about-page/leader-velayutham.webp", width: 1152, height: 928, alt: "Prof. P. Velayutham" },
    },
    {
      name: "P.S. Ravindran",
      role: "Director",
      bio: "Leads the institute’s academic programmes, from General Studies to the optionals and the interview, across its classroom and LIVE-Online batches. He holds an M.A. and an LL.B.",
      photo: { src: "/images/about-page/leader-ps-ravindran.webp", width: 1152, height: 928, alt: "P.S. Ravindran" },
    },
    {
      name: "Arjun Ravindran",
      role: "Additional Director",
      bio: "Works with faculty and the student services team on how courses are planned, scheduled and supported for aspirants at every stage. He holds an M.Sc. and an LL.B.",
      photo: { src: "/images/about-page/leader-arjun-ravindran.webp", width: 1152, height: 928, alt: "Arjun Ravindran" },
    },
  ] satisfies { name: string; role: string; bio: string; photo: AboutPhoto }[],
};

/** Figma "05b Our team" (1008:38386): the educators, in the homepage's carousel (data/faculty). */
export const aboutEducators = {
  label: "Faculty",
  heading: "Meet our top educators.",
  intro: "Subject specialists for every GS paper, the essay, the optionals and the interview.",
};

/** Figma "07 Where we teach" (1008:38387), with the one centre (data/contact). */
export const aboutPlaces = {
  label: "Visit us",
  heading: "Where we teach.",
  intro: "Classroom programmes run from our centre in New Delhi. Visit to meet a counsellor, see the classrooms and pick up the brochure.",
  centreLabel: "New Delhi centre",
  mapsCta: "View on maps",
  /**
   * The card's lines as the final site's homepage "Contact us" card sets them (21 Nov 2026), broken where it breaks
   * them (the client's reference): each entry is one line, kept whole, so the card reads the same on every screen.
   */
  card: {
    address: ["1-B/7, Pusa Road, Old Rajinder", "Nagar, New Delhi 110060"],
    landmark: ["Next to Gate 5 of Karol Bagh Metro Station, near pillar", "103"],
    hours: "Mon – Sat, 9 am – 7 pm",
  },
  photo: {
    src: "/images/about-page/campus-sunlit.webp",
    width: 864,
    height: 486,
    alt: "Students outside the Vajiram & Ravi institute entrance, its sign reading “Institute for IAS Examination, since 1976”",
  } satisfies AboutPhoto,
};

/** Figma "07b Notice · no other branches" (1008:38388). */
export const aboutNotice =
  "Vajiram & Ravi — also known as Vajiram & Rao or Vajiram — teaches only at its own centres listed above, and has no other branches.";
