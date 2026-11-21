/**
 * Site footer, with the contents of Figma "Footer – v5 (minimal)" (2567:4286): the logo row, six link
 * columns, the social links and the legal bar; under the columns, the giant wordmark, pressed into the paper
 * (feedback item 43). All labels in sentence case (feedback item 9).
 */

import { links, type Href } from "./links";

/** A footer link. Its address comes from data/links; one whose page does not exist yet renders as text. */
export type FooterLink = { label: string; href: Href };

/**
 * Homepage v2: the footer's content is design S's (the client: "keep the design of footer same like
 * design J, but use the same content in footer design of the design S"): four columns, the Online and
 * Hindi-medium variants folded into one entry each, the column heading carrying the context so the links
 * drop the repeated "UPSC". In sentence case, as the site's labels.
 */
export const footerColumns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Vajiram & Ravi",
    links: [
      { label: "About us", href: links.aboutUs },
      { label: "Careers", href: links.careers },
      // The campus section holds the addresses, the phone and the map.
      { label: "Contact us", href: "#locations" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  {
    heading: "Courses & test series",
    links: [
      { label: "GS course 2027", href: links.gsCourse },
      { label: "2-year course", href: links.twoYearCourse },
      { label: "Online coaching", href: links.onlineCoaching },
      { label: "CSAT course", href: links.csat },
      { label: "Current affairs course", href: links.currentAffairsCourse },
      { label: "Prelims test series 2027", href: links.prelimsTestSeries },
      { label: "Mains test series 2027", href: links.mainsTestSeries },
      { label: "Optional test series", href: links.optionalTestSeries },
      { label: "Mentorship programme 2027", href: links.mentorship },
      { label: "Interview guidance programme", href: links.interviewGuidance },
    ],
  },
  {
    heading: "UPSC exam",
    links: [
      { label: "Syllabus & exam pattern", href: links.syllabus },
      { label: "Optional subjects list", href: links.optionalSubjectsList },
      { label: "Eligibility & age limit", href: links.ageLimit },
      { label: "Exam calendar 2027", href: links.calendar },
      { label: "Admit card & answer key", href: links.admitCard },
      { label: "Cut-off & results", href: links.cutOff },
      { label: "IAS salary", href: links.iasSalary },
    ],
  },
  {
    heading: "Free resources",
    links: [
      { label: "Current affairs", href: links.currentAffairs },
      { label: "Previous year papers", href: links.previousYearPapers },
      { label: "Books & study material", href: links.studyMaterial },
      { label: "Model answers for Mains 2026", href: links.modelAnswers },
    ],
  },
];

/** Design S's line under the logo. */
export const footerTagline = "Best IAS coaching in Delhi, India. Preparing UPSC aspirants in Old Rajinder Nagar since 1976.";

/** Design S's "Latest current affairs" in the footer: the newest three, each with its paper. */
export const footerNews = {
  heading: "Latest current affairs",
  note: "Updated daily",
  items: [
    { tag: "Mains", title: "Supreme Court redefines the meaning of ‘industry’", href: links.currentAffairsMains },
    { tag: "Mains", title: "NITI Aayog flags gap between education and employment", href: links.currentAffairsMains },
    { tag: "Prelims", title: "Thiksey Monastery", href: links.currentAffairsPrelims },
  ],
};

export type SocialName = "youtube" | "facebook" | "instagram" | "telegram" | "quora" | "whatsapp";

/**
 * The social links, in the Figma's order. Each icon is the Figma's brand mark
 * (`/images/footer/social-<name>.svg`), painted in the link colour.
 * TODO: the client has not given the channels' addresses yet; until then each shows as a plain icon.
 */
export const footerSocial: { name: SocialName; label: string; href: Href }[] = [
  { name: "youtube", label: "YouTube", href: null },
  { name: "facebook", label: "Facebook", href: null },
  { name: "instagram", label: "Instagram", href: null },
  { name: "telegram", label: "Telegram", href: null },
];

export const footerWordmark = "Vajiram & Ravi";

export const footerCopyright = "© 2026 Vajiram & Ravi. All rights reserved";

export const footerLegal: FooterLink[] = [
  { label: "Terms and conditions", href: links.termsAndConditions },
  { label: "Privacy policy", href: links.privacyPolicy },
  { label: "Grievance redressal", href: links.grievanceRedressal },
];
