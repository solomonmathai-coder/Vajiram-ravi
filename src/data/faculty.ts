export type Educator = {
  name: string;
  subject: string;
  image: string;
  /** Whether the card shows a LinkedIn link. */
  linkedIn: boolean;
};

export const faculty: Educator[] = [
  { name: "SK Manocha", subject: "General Studies · Polity & Governance", image: "/images/faculty/sk-manocha.webp", linkedIn: true },
  { name: "Brijender Singh", subject: "Essay", image: "/images/faculty/brijender-singh.webp", linkedIn: true },
  { name: "Md. Rizwan", subject: "Geography optional", image: "/images/faculty/md-rizwan.webp", linkedIn: true },
  { name: "Md. Tarique", subject: "History optional", image: "/images/faculty/md-tarique.webp", linkedIn: true },
  { name: "Mukul Pathak", subject: "Psychology optional", image: "/images/faculty/mukul-pathak.webp", linkedIn: false },
  { name: "Shyam Sundar", subject: "Economics optional", image: "/images/faculty/shyam-sundar.webp", linkedIn: false },
];
