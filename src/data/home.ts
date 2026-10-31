import type { ComponentType } from "react";
import { GraduationCapIcon, LaptopIcon, NotebookIcon, PersonIcon, type IconProps } from "@/components/icons";

export type HeroContent = {
  /** The heading, one string per line. */
  heading: string[];
  /**
   * Muted, looping background video. Put the file in public/videos/ and set its path here,
   * e.g. "/videos/hero.mp4". Until then the poster shows, and "Watch video" explains that it is coming.
   */
  video?: string;
  /** Shown while the video loads, and instead of it when there is no video. */
  poster: { src: string; alt: string; position: string };
};

export const hero: HeroContent = {
  heading: ["Best IAS Coaching", "in Delhi, India"],
  poster: {
    src: "/images/hero/campus.webp",
    alt: "Students walking outside the Vajiram & Ravi campus building",
    position: "50% 62%",
  },
};

export const toppers = {
  eyebrow: "Results",
  heading: "Toppers who prepared with Vajiram & Ravi",
  /** Blank cards shown until the toppers' photos and details are added. */
  placeholders: 20,
};

export const whyChoose = {
  eyebrow: "Why choose Vajiram & Ravi",
  heading: "Your UPSC CSE success story starts here",
  /** Shown in white on the large gradient card, under the illustration. */
  intro:
    "From expert-led classes to personalised mentorship, get the guidance, resources, and structured preparation you need to move closer to your dream of becoming a civil servant.",
  illustration: "/images/why-choose/proven-track-record.jpg",
  record: {
    title: "Proven track record",
    description: "Five decades of experience and a steady record of producing UPSC toppers.",
  },
  /** The four results on the "Proven track record" card. Each value counts up from zero as it appears. */
  stats: [
    { value: 50, suffix: "+", label: "Years of experience since 1976" },
    { value: 10, suffix: "/10", label: "Top rankers from V&R courses" },
    { value: 59, suffix: "", label: "Questions reflected in Prelims" },
    { value: 36, suffix: "/50", label: "CSE 2025 rankers from V&R" },
  ],
  features: [
    {
      title: "Expert faculty",
      description: "Learn from subject specialists for every GS paper, optional and the essay.",
      icon: GraduationCapIcon,
    },
    {
      title: "Complete study material",
      description: "Detailed notes, test series and interview prep for every stage of the exam.",
      icon: NotebookIcon,
    },
    {
      title: "Personal guidance",
      description: "A preparation plan shaped around your strengths and weak areas.",
      icon: PersonIcon,
    },
    {
      title: "Classroom or online",
      description: "Choose classroom or LIVE-Online for any course, and learn from anywhere.",
      icon: LaptopIcon,
    },
  ] satisfies { title: string; description: string; icon: ComponentType<IconProps> }[],
};

export const gsProgramme = {
  eyebrow: "Our flagship programme",
  heading: "General Studies decides most of your UPSC score",
  intro:
    "Our GS Prelims & Mains Programme covers the full syllabus with daily classes, printed study material, Prelims and Mains tests and mentoring, in Classroom or LIVE-Online. Graduates take the 1-year programme; college students start with the 2-year Fledgling.",
  /** The orange arrow link in the card's top right corner; the label is its accessible name. */
  cta: { label: "Enrol in the GS programme", href: "#" },
  statsLabel: "Marks that come from General Studies",
  stats: [
    { stage: "Prelims", marks: "200", total: "/200" },
    { stage: "Mains", marks: "1,000", total: "/1,750" },
  ],
  /** The looping highlights in the card's window. Dummy photos from the old site for now. */
  reel: [
    { src: "/images/gs-programme/classroom.jpg", alt: "Students in a packed Vajiram & Ravi GS classroom", caption: "Daily classes" },
    { src: "/images/gs-programme/library.webp", alt: "Students studying together in the library", caption: "Printed study material" },
    { src: "/images/gs-programme/mentoring.webp", alt: "A Vajiram & Ravi mentor", caption: "Mentoring" },
    { src: "/images/hero/campus.webp", alt: "The Vajiram & Ravi campus building", caption: "Classroom or LIVE-Online" },
  ],
};

export type Review = {
  quote: string;
  name: string;
  /** Rank, year and programme, e.g. "AIR 14 · CSE 2025 · GS Foundation, Classroom". */
  line: string;
  photo: string;
  /** Background colour class for the card. */
  tint: string;
};

/** Dummy testimonials with fictional, AI-generated photos, until real ones are added. */
export const testimonials = {
  eyebrow: "Success stories",
  heading: "Hear it from our students",
  intro: "Honest words from students who prepared with us, in the classroom and LIVE-Online.",
  reviews: [
    {
      quote:
        "“Daily answer writing felt like a chore in the first month. By month six, it was the habit that got me through Mains.”",
      name: "Aditi Rao",
      line: "AIR 14 · CSE 2025 · GS Foundation, Classroom",
      photo: "/images/testimonials/aditi-rao.jpg",
      tint: "bg-brand-300",
    },
    {
      quote: "“The mock interviews were tougher than the real board. That is exactly why I walked in calm.”",
      name: "Karan Mehta",
      line: "AIR 37 · CSE 2025 · Interview Guidance Programme",
      photo: "/images/testimonials/karan-mehta.jpg",
      tint: "bg-green-300",
    },
    {
      quote: "“I worked full time and studied at night. LIVE-Online meant I never had to choose between the two.”",
      name: "Sneha Iyer",
      line: "AIR 52 · CSE 2024 · LIVE-Online GS Programme",
      photo: "/images/testimonials/sneha-iyer.jpg",
      tint: "bg-yellow-300",
    },
    {
      quote: "“After two failed attempts, the test series finally showed me where my marks were going.”",
      name: "Rohit Verma",
      line: "AIR 89 · CSE 2024 · PowerUp Prelims Test Series",
      photo: "/images/testimonials/rohit-verma.jpg",
      tint: "bg-brand-200",
    },
  ] satisfies Review[],
};

export type Course = {
  title: string;
  /** How many courses the programme groups, shown on the card's tag as "4 COURSES". */
  count: number;
  description: string;
  image: string;
  href: string;
};

export const courses = {
  heading: "Featured UPSC CSE programmes",
  intro: "From your first GS class to the interview — pick the stage you’re at, then the programme.",
  viewAll: { label: "View all", href: "#" },
  items: [
    {
      title: "UPSC GS Foundation Course - PCM",
      count: 4,
      description: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.",
      image: "/images/courses/gs-foundation.jpg",
      href: "#",
    },
    {
      title: "Optional Subject Programme",
      count: 26,
      description: "Coaching in 13 optional subjects, from Anthropology to Sociology, in Classroom and LIVE-Online.",
      image: "/images/courses/optional-subject.jpg",
      href: "#",
    },
    {
      title: "CSAT Course",
      count: 2,
      description: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.",
      image: "/images/courses/csat.jpg",
      href: "#",
    },
    {
      title: "Interview Guidance Programme",
      count: 2,
      description: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.",
      image: "/images/courses/interview-guidance.jpg",
      href: "#",
    },
    {
      title: "Mentorship Programme",
      count: 6,
      description: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.",
      image: "/images/courses/mentorship.jpg",
      href: "#",
    },
    {
      title: "Mains Test Series",
      count: 11,
      description: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.",
      image: "/images/courses/mains-test-series.jpg",
      href: "#",
    },
    {
      title: "Prelims Test Series",
      count: 7,
      description: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.",
      image: "/images/courses/prelims-test-series.jpg",
      href: "#",
    },
    {
      title: "Optional Test Series",
      count: 16,
      description: "Year-long and Mains test series to practise answer writing in your optional subject.",
      image: "/images/courses/optional-test-series.jpg",
      href: "#",
    },
  ] satisfies Course[],
};

/** The closing banner after the courses. The phone number and hours come from `contact` in site.ts. */
export const startBanner = {
  heading: "Ready to start your UPSC preparation?",
  intro: "Find the programme that fits your stage, or talk to a counsellor who will help you choose. No pressure to enrol.",
  primary: { label: "Find your course", href: "#courses" },
  secondary: { label: "Talk to a counsellor", href: "#contact" },
};

export const about = {
  title: "About us",
  intro:
    "For five decades, aspirants have trusted us to take them from their first class to the interview with experienced faculty, a structured method and honest guidance.",
};
