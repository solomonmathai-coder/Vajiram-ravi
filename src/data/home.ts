import type { ComponentType } from "react";
import {
  CounsellorIcon,
  GraduationCapIcon,
  LaptopIcon,
  LocationPinIcon,
  MailIcon,
  NotebookIcon,
  PersonIcon,
  PhoneLargeIcon,
  TrendIcon,
  type IconProps,
} from "@/components/icons";
import type { PeekSlide } from "@/components/ui/PeekCarousel";
import { contact } from "./site";

export type HeroStat = {
  value: number;
  /** Display template; "{n}" is replaced by the (animated) number. */
  format: string;
  label: string;
};

export const heroStats: HeroStat[] = [
  { value: 50, format: "{n}+", label: "Years of experience since 1976" },
  { value: 10, format: "{n}/10", label: "Top rankers from V&R courses" },
  { value: 59, format: "{n}", label: "Questions reflected in Prelims" },
  { value: 36, format: "{n}/50", label: "CSE 2025 rankers from V&R" },
];

export const features: { title: string; description: string; icon: ComponentType<IconProps> }[] = [
  { title: "Proven track record", description: "Five decades of experience and a steady record of producing UPSC toppers.", icon: TrendIcon },
  { title: "Expert faculty", description: "Learn from subject specialists for every GS paper, optional and the essay.", icon: GraduationCapIcon },
  { title: "Personal guidance", description: "A preparation plan shaped around your strengths and weak areas.", icon: PersonIcon },
  { title: "Complete study material", description: "Detailed notes, test series and interview prep for every stage of the exam.", icon: NotebookIcon },
  { title: "Prime location", description: "Study at our campus in Old Rajinder Nagar, the heart of UPSC preparation in Delhi.", icon: LocationPinIcon },
  { title: "Classroom or online", description: "Choose classroom or LIVE-Online for any course, and learn from anywhere.", icon: LaptopIcon },
];

export const campusGallery: PeekSlide[] = [
  { src: "/images/gallery/classroom.webp", alt: "Students in a Vajiram & Ravi classroom" },
  { src: "/images/gallery/library.webp", alt: "Students studying together in the library" },
  { src: "/images/gallery/campus.webp", alt: "The Vajiram & Ravi campus building" },
];

export const gsStats = [
  { stage: "Prelims", marks: "200", total: "/200" },
  { stage: "Mains", marks: "1,000", total: "/1,750" },
];

export type ContactOption = {
  title: string;
  /** Lines of body copy, rendered with line breaks between them. */
  lines: string[];
  cta: string;
  href: string;
  icon?: ComponentType<IconProps>;
  /** Raster icon used instead of an SVG one. */
  image?: { src: string; alt: string };
};

export const contactOptions: ContactOption[] = [
  {
    title: "Course counselling",
    lines: ["Not sure which programme fits? A counsellor can help you."],
    cta: "Book a free session",
    href: "#contact",
    icon: CounsellorIcon,
  },
  {
    title: "Chat on WhatsApp",
    lines: ["Quick answers on courses, batches and fees from our admissions team."],
    cta: "Chat on WhatsApp",
    href: "#",
    image: { src: "/images/icons/whatsapp.webp", alt: "WhatsApp" },
  },
  {
    title: "Email us",
    lines: ["Write to us on:", contact.email],
    cta: "Send an email",
    href: `mailto:${contact.email}`,
    icon: MailIcon,
  },
  {
    title: "Talk to us",
    lines: ["Contact us on:", contact.phone],
    cta: "Call now",
    href: contact.phoneHref,
    icon: PhoneLargeIcon,
  },
];

export const centre = {
  cities: ["New Delhi", "Chennai"],
  address: "1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi – 110060",
  landmark: "Landmark: Adjacent to Gate 5, Karol Bagh Metro Station & Pillar no. 103",
  mapImage: "/images/map-new-delhi.webp",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+1-B%2F7+Pusa+Road+Old+Rajinder+Nagar+New+Delhi+110060",
};
