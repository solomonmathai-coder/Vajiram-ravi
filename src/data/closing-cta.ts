/** The closing call to action: the orange banner above the footer (Figma 1950:3361). */

import { contact } from "@/data/site";
import { toppers } from "@/data/toppers";

export const closingCta = {
  proof: "36/50 CSE 2025 rankers from V&R",
  /** The avatar stack: the CSE 2025 toppers, AIR 1 to 5. */
  rankers: toppers.filter((topper) => topper.rank <= 5).map(({ name, image }) => ({ name, src: image })),
  title: "Ready to start your UPSC preparation?",
  text: "Find the programme that fits your stage, or talk to a counsellor who will help you choose. No pressure to enrol.",
  primary: { label: "Find your course", href: "#courses" },
  secondary: { label: "Talk to a counsellor", href: "#counsellor" },
  call: { lead: "Prefer to call?", phone: contact.phone, phoneHref: contact.phoneHref, hours: contact.hours },
};
