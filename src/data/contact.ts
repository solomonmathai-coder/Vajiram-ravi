/** "Contact & locations" (Figma 1938:3418): the ways to reach V&R, and the campus card with its city switch. */

import { contact } from "@/data/site";

export const contactIntro = {
  title: "What are you looking for?",
  lead: "We’re here to help you anytime, any way",
};

export type ContactWay = {
  title: string;
  text: string;
  /** The orange link line; the card adds the → after it. */
  cta: string;
  href: string;
  /** Opens in a new tab (WhatsApp). */
  external?: boolean;
  /** Small mark before the title. */
  icon?: string;
};

export const contactWays: ContactWay[] = [
  {
    title: "Course counselling",
    text: "Not sure which programme fits? A counsellor can help you.",
    cta: "Book a free session",
    // The free-session form sits in the admissions section, under the batches.
    href: "#counsellor",
  },
  {
    title: "Chat on WhatsApp",
    text: "Quick answers on courses, batches and fees from our admissions team.",
    cta: "Chat on WhatsApp",
    // Assumes the admissions line takes WhatsApp; confirm the number with the client.
    href: "https://wa.me/918062206330",
    external: true,
    icon: "/images/icons/whatsapp.webp",
  },
  {
    title: "Email us",
    text: `Write to us on: ${contact.email}`,
    cta: "Send an email",
    href: `mailto:${contact.email}`,
  },
  {
    title: "Talk to us",
    text: `Contact us on: ${contact.phone}`,
    cta: "Call now",
    href: contact.phoneHref,
  },
];

/**
 * Where the map frames a campus: the point to zoom into, as fractions of the map image (0 to 1), and how
 * far to zoom. Zoom 1 shows the whole map, as in the design.
 */
export type MapView = { x: number; y: number; zoom: number };

export type Campus = {
  city: string;
  address: string;
  landmark: string;
  hours: string;
  phone: string;
  phoneHref: string;
  mapsUrl: string;
  map: { src: string; alt: string; view: MapView };
};

export const locationsIntro = {
  title: "Our locations",
  text: "Meet a counsellor, see the classrooms and pick up the brochure — in New Delhi and Chennai.",
};

/** Campus details come from the CMS on the live site. */
export const campuses: Campus[] = [
  {
    city: "New Delhi",
    address: "1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi – 110060",
    landmark: "Adjacent to Gate 5, Karol Bagh Metro Station & Pillar no. 103",
    hours: contact.hours,
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+1-B%2F7+Pusa+Road+Old+Rajinder+Nagar+New+Delhi+110060",
    map: { src: "/images/map-new-delhi.webp", alt: "Map showing the New Delhi centre", view: { x: 0.5, y: 0.5, zoom: 1 } },
  },
  {
    /*
     * Placeholder until the CMS supplies the Chennai centre: the design has no Chennai address or map.
     * The map pans away from the New Delhi pin to another part of the same illustration; swap in a
     * Chennai map (1584 x 672, pin included) and its view when one exists.
     */
    city: "Chennai",
    address: "Chennai centre address to be announced",
    landmark: "To be announced",
    hours: contact.hours,
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+Chennai",
    map: { src: "/images/map-new-delhi.webp", alt: "Map of the Chennai centre", view: { x: 0.24, y: 0.42, zoom: 1.6 } },
  },
];
