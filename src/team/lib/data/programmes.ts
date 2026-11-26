// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/programmes.ts. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
const SITE = "https://vajiramandravi.com";

export type Href = string | null;

export const links = {

  allCourses: `${SITE}/all-courses/`,
  currentAffairs: `${SITE}/current-affairs/`,
  upscExam: `${SITE}/upsc-exam/`,
  upcomingBatches: `${SITE}/new-upcoming-batches/`,
  toppers: `${SITE}/ias-selections-from-vajiram/`,
  topperStory: null,

  gsCourse: `${SITE}/courses/upsc-general-studies/`,
  gsClassroom: `${SITE}/courses/upsc-gs-course/`,
  gsOnline: `${SITE}/courses/upsc-gs-online-course/`,
  twoYearCourse: `${SITE}/courses/2-year-upsc-course/`,
  twoYearOnline: `${SITE}/courses/2-year-upsc-online-course/`,
  onlineCoaching: `${SITE}/upsc-online-coaching/`,
  optionalSubject: `${SITE}/courses/upsc-optional-subject-courses/`,
  csat: `${SITE}/courses/upsc-csat-course/`,
  currentAffairsCourse: `${SITE}/courses/upsc-module-courses/current-affairs-course/`,
  prelimsTestSeries: `${SITE}/courses/prelims-test-series/`,
  mainsTestSeries: `${SITE}/courses/upsc-mains-test-series/`,
  mainsTestSeriesHindi: `${SITE}/courses/upsc-mains-test-series-hindi-medium/`,
  optionalTestSeries: `${SITE}/courses/upsc-mains-optional-subject-test-series/`,
  mentorship: `${SITE}/courses/upsc-mentorship-program/`,
  mentorshipHindi: `${SITE}/courses/upsc-mentorship-program-hindi-medium/`,
  interviewGuidance: `${SITE}/courses/interview-guidance-program/`,

  mentorshipPrograms: `${SITE}/courses/mentorship-programs/`,
  moduleCourses: `${SITE}/courses/upsc-module-courses/`,
  csatCourses: `${SITE}/courses/upsc-csat/`,
  mainsTestSeriesAll: `${SITE}/courses/mains-test-series/`,
  crashCourses: `${SITE}/courses/upsc-crash-courses/`,
  ifos: `${SITE}/courses/upsc-indian-forest-service-ifos-coaching/`,

  currentAffairsPrelims: `${SITE}/current-affairs/upsc-prelims-current-affairs/`,
  currentAffairsMains: `${SITE}/current-affairs/upsc-mains-current-affairs/`,
  studyMaterial: `${SITE}/upsc-exam/free-upsc-study-material-notes/`,
  questArticles: null,
  article: null,
  monthlyMagazine: `${SITE}/upsc-study-materials/monthly-current-affairs-magazine/`,

  yojanaKurukshetra: `${SITE}/upsc-study-materials/yojana-magazine-pdf/`,
  previousYearPapers: `${SITE}/upsc-previous-year-papers/`,
  toppersAnswerSheets: `${SITE}/upsc-ias-toppers-copy-and-answer-sheets/`,
  essayPractice: `${SITE}/upsc-study-materials/weekly-essay/`,
  upscBooks: `${SITE}/upsc-exam/upsc-book-list/`,
  modelAnswers: `${SITE}/upsc-exam/model-answers-for-upsc-mains/`,

  theRecitals: `${SITE}/upsc-study-materials/monthly-current-affairs-magazine/`,
  dailyCurrentAffairs: `${SITE}/current-affairs/`,

  prelimsPointers: `${SITE}/current-affairs/upsc-prelims-current-affairs/`,
  mainsArticles: `${SITE}/current-affairs/upsc-mains-current-affairs/`,

  upsc2027: `${SITE}/upsc-exam/upsc-2027/`,
  examPattern: `${SITE}/upsc-exam/upsc-exam-pattern/`,
  syllabus: `${SITE}/upsc-syllabus/`,
  csatSyllabus: `${SITE}/upsc-exam/csat-syllabus/`,
  optionalSubjectsList: `${SITE}/upsc-exam/optional-subjects-for-upsc/`,
  selectionProcess: `${SITE}/upsc-exam/upsc-selection-process/`,
  interview: `${SITE}/upsc-exam/upsc-interview/`,
  ageLimit: `${SITE}/upsc-exam/upsc-age-limit/`,
  iasSalary: `${SITE}/upsc-exam/ias-salary/`,
  calendar: `${SITE}/upsc-exam/upsc-calendar/`,
  admitCard: `${SITE}/upsc-exam/upsc-admit-card/`,
  prelimsAnswerKey: `${SITE}/upsc-exam/upsc-prelims-answer-key-2026/`,
  cutOff: `${SITE}/upsc-exam/upsc-cut-off/`,
  finalResult: `${SITE}/upsc-exam/upsc-result-2025/`,

  aboutUs: `${SITE}/about-us/`,
  faculty: null,
  studentStories: null,

  testSeries: `${SITE}/courses/prelims-test-series/`,
  careers: `${SITE}/careers/`,
  termsAndConditions: `${SITE}/terms-and-conditions/`,
  privacyPolicy: `${SITE}/privacy-policy/`,
  grievanceRedressal: null,
  whatsapp: "https://wa.me/918062206330",
} satisfies Record<string, Href>;

export type HeadingParts = { before: string; em: string; after: string };

export const programmesIntro = {
  title: { before: "Find the right", em: "UPSC programme", after: "for your preparation." } satisfies HeadingParts,
};

export type ProgrammeLink = { label: string; href: Href };

export const featuredProgramme = {
  tag: "Flagship programme",
  name: "General Studies Prelims & Mains programme",

  benefits: [
    "300+ class lectures and 900+ teaching hours by experienced subject specialists.",
    "18 Yellow Books covering the General Studies syllabus, alongside The Recitals, the monthly current affairs magazine.",
    "30 Prelims tests and an additional six-month Mains support programme with evaluation and feedback.",
  ],

  modes: "Classroom and LIVE-Online",

  primary: { label: "Enrol for the programme" },
  secondary: { label: "View programme details", href: links.gsCourse } satisfies ProgrammeLink,

  photos: [
    { src: "/assets/img/programmes/flagship-lecture.webp", width: 1000, height: 1506, position: "40% 30%" },
    { src: "/assets/img/programmes/featured-library.webp", width: 1264, height: 848, position: "45% 50%" },
  ],
};

export type CoverEmblem = "books" | "abacus" | "quill" | "layers" | "target" | "pen" | "compass" | "mic";

export type CoverArtKind = "bars" | "circles" | "grid" | "arches" | "arcs" | "lines" | "target" | "quarters";

export const programmeCategories = ["Foundation", "Optional", "Tests", "Guidance"] as const;
export type ProgrammeCategory = (typeof programmeCategories)[number];

export type Programme = {
  name: string;
  category: ProgrammeCategory;
  count: number;
  courses: string[];
  line: string;
  href: Href;

  cover: { light: string; base: string; deep: string; emblem: CoverEmblem; art: CoverArtKind };
};

export const shelfIntro = {
  title: { before: "All our ", em: "UPSC programmes", after: ", side by side.", line2: "Choose one to take a closer look." },
};

export const programmes: Programme[] = [
  {
    name: "UPSC GS foundation course – PCM",
    category: "Foundation",
    count: 4,
    courses: ["1-year GS foundation course", "2-year GS foundation course"],
    line: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.",
    href: links.gsCourse,
    cover: { light: "#d9581c", base: "#c2410c", deep: "#8f3010", emblem: "books", art: "bars" },
  },
  {
    name: "CSAT course",
    category: "Foundation",
    count: 2,
    courses: ["CSAT course"],
    line: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.",
    href: links.csatCourses,
    cover: { light: "#2e6a80", base: "#1f4a5f", deep: "#14323f", emblem: "abacus", art: "grid" },
  },
  {
    name: "Optional subject programme",
    category: "Optional",
    count: 26,
    courses: ["Anthropology", "Sociology"],
    line: "Coaching in 13 optional subjects, from Anthropology to Sociology, in classroom and LIVE-Online.",
    href: links.optionalSubject,
    cover: { light: "#c0362c", base: "#a3231c", deep: "#701510", emblem: "quill", art: "circles" },
  },
  {
    name: "Optional test series",
    category: "Optional",
    count: 16,
    courses: ["Year-long optional test series", "Optional Mains test series"],
    line: "Year-long and Mains test series to practise answer writing in your optional subject.",
    href: links.optionalTestSeries,
    cover: { light: "#336650", base: "#264f3e", deep: "#18352a", emblem: "layers", art: "quarters" },
  },
  {
    name: "Prelims test series",
    category: "Tests",
    count: 7,
    courses: ["PowerUp test series", "Prelims CAMP", "Current affairs tests"],
    line: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.",
    href: links.prelimsTestSeries,
    cover: { light: "#7a3556", base: "#5e2742", deep: "#3f192c", emblem: "target", art: "target" },
  },
  {
    name: "Mains test series",
    category: "Tests",
    count: 11,
    courses: ["Sure Shot test series", "Mains CAMP", "Essay tests"],
    line: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.",
    href: links.mainsTestSeriesAll,
    cover: { light: "#a3545c", base: "#873f48", deep: "#5e2a31", emblem: "pen", art: "lines" },
  },
  {
    name: "Mentorship programme",
    category: "Guidance",
    count: 6,
    courses: ["StepUp mentorship"],
    line: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.",
    href: links.mentorshipPrograms,
    cover: { light: "#b8673a", base: "#9b5029", deep: "#6e3519", emblem: "compass", art: "arcs" },
  },
  {
    name: "Interview guidance programme",
    category: "Guidance",
    count: 2,
    courses: ["UPSC CSE interview guidance", "IFoS interview guidance"],
    line: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.",
    href: links.interviewGuidance,
    cover: { light: "#5e5f63", base: "#4a4b4e", deep: "#303133", emblem: "mic", art: "arches" },
  },
];

export const programmesClosing = {
  question: "Not sure which programme is right for you?",
  text: "Speak with our academic counsellors.",
  cta: { label: "Get expert guidance", href: "#contact" } satisfies ProgrammeLink,
};

export const programmeChoices: string[] = [featuredProgramme.name, ...programmes.map((programme) => programme.name)];

export const programmeSlug = (name: string) =>
  name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const FINDER_KEY: Record<string, string> = {
  "UPSC GS foundation course – PCM": "gs",
  "CSAT course": "csat",
  "Optional subject programme": "optional",
  "Optional test series": "optional-ts",
  "Prelims test series": "prelims-ts",
  "Mains test series": "mains-ts",
  "Mentorship programme": "mentorship",
  "Interview guidance programme": "interview",
};
export const coursePageHref = (programme: Pick<Programme, "name">) => {
  const key = FINDER_KEY[programme.name];
  return key ? `/courses#cat=${key}` : "/courses";
};

// The contact line on an open programme page (Programmes.tsx).
export const contact = {
  phone: "080-6220-6330",
  phoneHref: "tel:+918062206330",
  hours: "Mon – Sat, 9 AM – 7 PM",
  email: "admissions@vajiramandravi.com",
};
