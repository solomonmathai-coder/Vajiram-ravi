/** Site footer (Figma 1938:3501 to 1938:3562): link columns, the giant wordmark and the legal bar. */

/** Links pointing at "#" lead to pages that are not part of this homepage yet; clicking one shows a toast. */
export type FooterLink = { label: string; href: string };

export const footerColumns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Vajiram & Ravi",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact Us", href: "#contact" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  {
    heading: "Courses",
    links: [
      { label: "UPSC GS Course 2027", href: "#" },
      { label: "UPSC GS Online Course 2027", href: "#" },
      { label: "UPSC 2 Year Course", href: "#" },
      { label: "UPSC 2 Year Online Course", href: "#" },
      { label: "UPSC Online Coaching", href: "#" },
      { label: "UPSC CSAT Course", href: "#" },
      { label: "Current Affairs Course", href: "#" },
      { label: "UPSC Study Material", href: "#" },
    ],
  },
  {
    heading: "Test series & mentorship",
    links: [
      { label: "UPSC Prelims Test Series 2027", href: "#" },
      { label: "UPSC Mains Test Series 2027", href: "#" },
      { label: "UPSC Mains Test Series Hindi Medium", href: "#" },
      { label: "UPSC Optional Test Series", href: "#" },
      { label: "UPSC Mentorship Program 2027", href: "#" },
      { label: "UPSC Mentorship Program Hindi Medium", href: "#" },
      { label: "UPSC Interview Guidance Program IGP", href: "#" },
    ],
  },
  {
    heading: "UPSC exam",
    links: [
      { label: "UPSC 2027", href: "#" },
      { label: "UPSC Exam Pattern", href: "#" },
      { label: "UPSC Syllabus", href: "#" },
      { label: "UPSC CSAT Syllabus", href: "#" },
      { label: "UPSC Optional Subjects List", href: "#" },
      { label: "UPSC Selection Process", href: "#" },
      { label: "UPSC Interview", href: "#" },
      { label: "UPSC Age Limit", href: "#" },
      { label: "IAS Salary", href: "#" },
    ],
  },
  {
    heading: "Exam updates",
    links: [
      { label: "UPSC Calendar 2027", href: "#" },
      { label: "UPSC Admit Card", href: "#" },
      { label: "UPSC Prelims Answer Key", href: "#" },
      { label: "UPSC Cut Off", href: "#" },
      { label: "UPSC Final Result 2025", href: "#" },
    ],
  },
  {
    heading: "Free resources",
    links: [
      { label: "UPSC Current Affairs", href: "#resources" },
      { label: "UPSC Previous Year Papers", href: "#" },
      { label: "UPSC Books", href: "#" },
      { label: "Model Answers for UPSC Mains 2026", href: "#" },
    ],
  },
];

export const footerWordmark = "VAJIRAM & RAVI";

export const footerCopyright = "© 2026 Vajiram & Ravi. All rights reserved";

export const footerLegal: FooterLink[] = [
  { label: "Terms and Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Grievance Redressal", href: "#" },
];
