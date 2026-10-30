/** Links pointing at "#" lead to pages that are not part of this homepage yet; clicking one shows a toast. */
export type LinkItem = { label: string; href: string };

export const contact = {
  phone: "080-6220-6330",
  phoneHref: "tel:+918062206330",
  hours: "Mon – Sat, 9 AM – 7 PM",
  email: "admissions@vajiramandravi.com",
};

export const mainNav: LinkItem[] = [
  { label: "All Courses", href: "#courses" },
  { label: "Toppers", href: "#toppers" },
  { label: "Study Materials", href: "#resources" },
  { label: "Current Affairs", href: "#" },
  { label: "UPSC Exam", href: "#" },
  { label: "Upcoming Batches", href: "#batches" },
  { label: "FAQs", href: "#faq" },
];

export type Announcement = {
  text: string;
  href: string;
  /** Shown brighter than the rest, as the lead item. */
  lead?: boolean;
};

export const announcements: Announcement[] = [
  { text: "59 questions in UPSC Prelims 2025 reflected from V&R Prelims Test Series", href: "#", lead: true },
  { text: "Ranker’s Programme · Admission open", href: "#courses" },
  { text: "Classroom GS PCM 2027 · Admission open", href: "#courses" },
  { text: "Online GS PCM 2027 · Admission open", href: "#courses" },
  { text: "StepUp Mentorship 2027 · Admission open", href: "#courses" },
];
