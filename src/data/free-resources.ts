import { links } from "./links";

/**
 * The Free Resources page (/free-resources), in the words of the Figma workfile's "UPSC Study Materials –
 * consistent – 22 Oct" (1361:38711, 21 Nov 2026): the head, all study materials, the sources, the benefits, the
 * role of study material in preparation and the FAQs. Laid out in the language of the About page.
 *
 * Each material's card is Kevin's homepage folder (FreeResourcesPage): `tag` is its small label (its kind or how
 * often it comes), `photo` the picture standing in the folder, from his homepage's own (public/assets/img/resources)
 * where he has one, else none (the design's icon is drawn on a sheet of paper instead); `cta` is the design's "Explore".
 *
 * To confirm with the client:
 *   - the design lists "One Pagers – UPSC Mains Notes" twice (its third and tenth cards); it appears once here.
 *   - the live site has pages for some materials only. The others (Infographics, One Pagers, Quest Notes,
 *     Kurukshetra, Prelims Quick Revision, GS Mains Probable, Economic Survey) open its free study material page
 *     until each has its own; Kurukshetra shares the Yojana page there (links.yojanaKurukshetra).
 *   - "Current Affairs of June 2024" is the design's example month.
 */

const IMG = "/images/free-resources";

export const frHero = {
  label: "Free resources",
  title: "Current Affairs 2026 Study Material",
  intro:
    "The availability of UPSC study material has revolutionized the way aspirants prepare for one of India’s most prestigious examinations — covering current affairs, polity, governance, history, geography, economics, environment, and science & technology.",
};

/** Figma "02 All study materials" (1789:47599). */
export const frMaterials = {
  label: "All study materials",
  heading: "Free collections, all in one place",
  intro: "Monthly magazines, notes, revision booklets and model answers — read online or download the PDF. No sign-in, no email.",
  items: [
    {
      title: "The Recitals – Monthly Magazine for UPSC",
      tag: "Monthly",
      cta: "Explore",
      photo: "/assets/img/resources/the-recitals.webp",
      text: "Monthly current affairs magazine covering polity, economy, environment and IR — with Mains Q&A and Prelims MCQs in every issue.",
      icon: `${IMG}/icon-magazine.svg`,
      href: links.theRecitals,
    },
    {
      title: "Infographics",
      tag: "Visual",
      cta: "Explore",
      photo: "/assets/img/resources/infographics.webp",
      text: "One-page visual summaries of schemes, reports and concepts — built for quick recall before Prelims.",
      icon: `${IMG}/icon-infographics.svg`,
      href: links.studyMaterial,
    },
    {
      title: "One Pagers – UPSC Mains Notes",
      tag: "Mains",
      cta: "Explore",
      photo: null,
      text: "Single-page notes on high-frequency Mains topics, built for last-mile revision.",
      icon: `${IMG}/icon-one-pager.svg`,
      href: links.studyMaterial,
    },
    {
      title: "Quest UPSC Notes",
      tag: "Notes",
      cta: "Explore",
      photo: null,
      text: "Concise, comprehensive notes covering every subject in the UPSC syllabus, topic by topic.",
      icon: `${IMG}/icon-notebooks.svg`,
      href: links.studyMaterial,
    },
    {
      title: "Kurukshetra Summary",
      tag: "Monthly",
      cta: "Explore",
      photo: "/assets/img/resources/kurukshetra.webp",
      text: "Rural development, agriculture and the panchayat system, summarised each month from the government’s magazine.",
      icon: `${IMG}/icon-rural.svg`,
      href: links.yojanaKurukshetra,
    },
    {
      title: "Yojana Summary",
      tag: "Monthly",
      cta: "Explore",
      photo: null,
      text: "Month-by-month summaries of the government’s development magazine — the official framing of every scheme.",
      icon: `${IMG}/icon-policy.svg`,
      href: links.yojanaKurukshetra,
    },
    {
      title: "Prelims Quick Revision",
      tag: "Revise",
      cta: "Explore",
      photo: "/assets/img/resources/quick-revision.webp",
      text: "Condensed revision booklets for the last six weeks before Prelims, when you need compression, not fresh reading.",
      icon: `${IMG}/icon-quick-revision.svg`,
      href: links.studyMaterial,
    },
    {
      title: "GS Mains Probable",
      tag: "Mains",
      cta: "Explore",
      photo: null,
      text: "Probable Mains questions on the year’s themes, with structure hints to test your notes against.",
      icon: `${IMG}/icon-answer-writing.svg`,
      href: links.studyMaterial,
    },
    {
      title: "Economic Survey",
      tag: "Annual",
      cta: "Explore",
      photo: null,
      text: "Chapter-wise summary of the Economic Survey, with the data points that matter for GS-3 and the essay.",
      icon: `${IMG}/icon-economy.svg`,
      href: links.studyMaterial,
    },
  ],
};

/** Figma "03 Sources" (1361:38749). */
export const frSources = {
  label: "Sources",
  heading: "UPSC Study Material Sources",
  paragraphs: [
    "In the preparation for the UPSC Civil Services Examination, access to high-quality UPSC study material is crucial. At Vajiram & Ravi, aspirants have access to a wide range of resources designed to support their preparation journey. This includes Daily Current Affairs like Prelims Pointers, Mains Pointers, editorial analyses of newspapers, along with UPSC Quest Notes.",
    "These notes are structured to cover every aspect of the UPSC syllabus comprehensively, ensuring that aspirants develop a strong foundation in all relevant subjects. The material also includes in-depth coverage of Indian Polity, Indian Economy, Modern and Ancient History, Geography, Environment, Ethics, Science & Technology, and International Relations, along with case studies and practice questions for analytical and conceptual clarity.",
    "The resources not only provide factual information but also help aspirants in applying knowledge to answer Prelims, Mains, and Interview-level questions effectively.",
  ],
  items: [
    {
      title: "Current Affairs Questions",
      text: "Practice questions with answers built from the month’s news, so you can test what you have read before the exam does.",
      cta: "Practise questions",
      href: links.dailyCurrentAffairs,
      photo: { src: `${IMG}/src-questions.webp`, width: 420, height: 563, alt: "An aspirant working through printed practice questions with a pen" },
    },
    {
      title: "Current Affairs Course for UPSC",
      text: "A structured course that turns daily news into exam-ready preparation for both Prelims and Mains.",
      cta: "View the course",
      href: links.currentAffairsCourse,
      photo: { src: `${IMG}/src-course.webp`, width: 420, height: 563, alt: "An aspirant studying at a library table" },
    },
    {
      title: "Current Affairs of June 2024",
      text: "Every important event of the month compiled in one place, so the whole month can be revised in one sitting.",
      cta: "Read June 2024",
      href: links.monthlyMagazine,
      photo: { src: `${IMG}/src-monthly.webp`, width: 420, height: 563, alt: "Newspapers and reading glasses on a desk" },
    },
    {
      title: "UPSC Previous Year Question Paper",
      text: "Prelims, Mains, Essay and Optional papers as downloadable PDFs — the most reliable guide to what the exam actually asks.",
      cta: "Download papers",
      href: links.previousYearPapers,
      photo: { src: `${IMG}/src-papers.webp`, width: 420, height: 563, alt: "Stacked question papers and an open notebook" },
    },
  ],
};

/** Figma "04 Benefits" (1361:38762). */
export const frBenefits = {
  label: "UPSC study material benefits",
  heading: "Why free study material changes who gets to prepare",
  intro: "Six reasons aspirants rely on free, structured notes alongside the standard textbooks.",
  items: [
    { title: "Accessibility for All", text: "Free notes lower the financial barrier, so candidates from any income level get the same quality of resources.", icon: `${IMG}/ben-access.svg` },
    { title: "Remote Accessibility", text: "Aspirants in rural and remote areas, or those who cannot attend coaching, get the same material as city-based aspirants.", icon: `${IMG}/ben-remote.svg` },
    { title: "Comprehensive Coverage", text: "The materials span every major subject, matching the broad scope of the examination.", icon: `${IMG}/ben-coverage.svg` },
    { title: "Real-Time Updates", text: "Online and print notes keep pace with current affairs, government schemes, policies and global developments.", icon: `${IMG}/ben-updates.svg` },
    { title: "Self-Paced Learning", text: "Move at your own speed, revisit hard topics and plan around your strengths and weaknesses.", icon: `${IMG}/ben-self-paced.svg` },
    { title: "Complementary Resource", text: "Notes work alongside the standard textbooks, building understanding and retention rather than replacing them.", icon: `${IMG}/ben-complement.svg` },
  ],
};

/** Figma "05 Role in preparation" (1361:38775). Each point with a photograph from the site's "why" set, as the About page's story list shows them (StoryChapters). */
export const frRole = {
  label: "Role in preparation",
  heading: "Role of UPSC Study Material in Preparation",
  cta: "Browse all study materials",
  points: [
    {
      title: "Keeps your preparation current and relevant.",
      photo: { src: "/images/about/why/why-2-faculty.webp", width: 1100, height: 733, alt: "An educator teaching at the board" },
      text: "Quality study material keeps content up to date with what the exam asks, and helps aspirants organise their study instead of reading everything that comes their way.",
    },
    {
      title: "Connects current affairs to the syllabus.",
      photo: { src: "/images/about/why/why-3-guidance.webp", width: 1100, height: 733, alt: "An aspirant in a guidance session" },
      text: "Structured notes let you link the news to syllabus topics, spot recurring trends and critically assess policies — the skills that Mains answers and the interview reward.",
    },
    {
      title: "Makes revision systematic.",
      photo: { src: "/images/about/why/why-4-study-material.webp", width: 1100, height: 733, alt: "Vajiram & Ravi study material and notes" },
      text: "Topic-wise and subject-wise notes support systematic revision and let you track your progress subject by subject.",
    },
  ],
};

/** Figma "06 FAQ" (1361:38790). */
export const frFaq = {
  label: "FAQs",
  heading: "Frequently Asked Questions",
  intro: "Quick answers on what’s free to read, what the Quest Notes and Prelims Pointers cover, and how to keep up with current affairs.",
  items: [
    {
      q: "Does Vajiram & Ravi offer free UPSC Study Material?",
      a: "Yes. Vajiram & Ravi provides free study material and resources on this site — monthly magazines, notes, revision booklets and model answers — that can be read online or downloaded without signing in.",
    },
    {
      q: "What are Vajiram & Ravi UPSC Quest Notes?",
      a: "Quest Notes are concise, comprehensive notes that cover every subject in the UPSC syllabus, so the static portion can be read once and revised many times.",
    },
    {
      q: "How to prepare for UPSC Current Affairs?",
      a: "Read the daily news and government reports, and use the Prelims Pointers, Mains Pointers and editorial analyses to turn what you read into exam-ready notes.",
    },
    {
      q: "What are Vajiram & Ravi Prelims Pointers?",
      a: "Prelims Pointers are focused daily current affairs compilations aimed at the Prelims — short, factual entries built for recall.",
    },
  ],
};
