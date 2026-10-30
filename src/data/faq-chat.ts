import { contact } from "./site";

export type FaqEntry = { question: string; answer: string };

/**
 * The suggested questions of the FAQ, played into the counsellor chat. Only the first answer is in
 * the design; the others carry over from the previous homepage until the client supplies them.
 */
export const faqEntries: FaqEntry[] = [
  {
    question: "Which coaching is best for UPSC?",
    answer:
      "Vajiram & Ravi is renowned for its comprehensive and structured approach, making it one of the top choices for UPSC coaching in India.",
  },
  { question: "Which UPSC coaching is best in Delhi?", answer: "Answer to be added." },
  { question: "Which coaching is best for IAS in Delhi?", answer: "Answer to be added." },
  { question: "Which coaching institute has the most UPSC toppers?", answer: "Answer to be added." },
];

export const counsellorChat = {
  title: "Still have questions?",
  hours: contact.hours,
  avatar: "/images/faq/counsellor.webp",
  phoneHref: contact.phoneHref,
  /**
   * WhatsApp number in international form, digits only. This is the admissions line from the site
   * contact details; confirm it takes WhatsApp before launch.
   */
  whatsappNumber: "918062206330",
  note: "A counsellor will listen, answer your questions and help you choose. No pressure to enroll.",
  placeholder: "Ask your own question…",
  cta: "Talk to a counsellor",
  /** Section holding the enquiry form, where typed questions go on desktop. */
  enquirySectionId: "counsellor",
};
