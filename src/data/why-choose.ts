/** "Why choose V&R" (Figma 1933:3403): a statement that lights up word by word, then six reasons beside a pinned photo. */

export type Reason = {
  title: string;
  description: string;
  photo: {
    src: string;
    alt: string;
    /** object-position of the photo in its 560 x 600 frame. */
    position?: string;
    /** Zooms into part of the photo, e.g. the books on the table; the zoom grows from `position`. */
    zoom?: number;
  };
};

export const whyChoose = {
  eyebrow: "Your UPSC CSE success story starts here",
  statement:
    "From expert-led classes to personalised mentorship, get the guidance, resources, and structured preparation you need to move closer to your dream of becoming a civil servant.",
};

/*
 * The design supplies only the students photo. The others are the closest photos the site already has,
 * in the order the design asks for (students, faculty, mentoring, material, campus, LIVE class); swap in
 * dedicated shots when they are available.
 */
export const reasons: Reason[] = [
  {
    title: "Proven track record",
    description: "Five decades of experience and a steady record of producing UPSC toppers.",
    photo: { src: "/images/gallery/library.webp", alt: "Students studying together in the library" },
  },
  {
    title: "Expert faculty",
    description: "Learn from subject specialists for every GS paper, optional and the essay.",
    photo: { src: "/images/faculty/sk-manocha.webp", alt: "SK Manocha, General Studies faculty", position: "50% 20%" },
  },
  {
    title: "Personal guidance",
    description: "A preparation plan shaped around your strengths and weak areas.",
    photo: { src: "/images/why-choose/mentoring.webp", alt: "A Vajiram & Ravi mentor", position: "50% 20%" },
  },
  {
    title: "Complete study material",
    description: "Detailed notes, test series and interview prep for every stage of the exam.",
    photo: {
      src: "/images/gallery/library.webp",
      alt: "Open books and notes on a study table",
      position: "40% 100%",
      zoom: 1.45,
    },
  },
  {
    title: "Prime location",
    description: "Study at our campus in Old Rajinder Nagar, the heart of UPSC preparation in Delhi.",
    photo: { src: "/images/gallery/campus.webp", alt: "The Vajiram & Ravi campus building" },
  },
  {
    title: "Classroom or online",
    description: "Choose classroom or LIVE-Online for any course, and learn from anywhere.",
    photo: { src: "/images/gs-classroom.webp", alt: "A faculty member teaching a full classroom", position: "20% 50%" },
  },
];
