import type { ReactNode } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Preloader from "@/components/layout/Preloader";
import SectionJump from "@/components/layout/SectionJump";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import GradualBlur from "@/components/ui/GradualBlur";

/**
 * The homepage's frame (it was the root layout's until the courses page came, 17 Nov 2026): the intro, the
 * page transition, this site's header and footer, the WhatsApp button, the soft blur along the foot of the
 * screen and the section jump. The courses page (/courses) has its own.
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Preloader />
      <PageTransition />
      <SiteHeader />
      {children}
      <SiteFooter />
      <WhatsAppButton />
      {/*
        A soft, stepped blur along the very foot of the screen (40px, ui/GradualBlur), under the header,
        the cursor label and the dialogs. Hidden until TextMotion shows it (data-on), once the page has left
        its first screen, and gone again near the end of the page; never with reduced motion (globals.css).
      */}
      <div data-gb-viewport aria-hidden="true" className="gb-viewport pointer-events-none fixed inset-x-0 bottom-0 z-[35] h-10">
        <GradualBlur side="bottom" strength={3} layers={3} className="inset-0" />
      </div>
      <SectionJump />
    </>
  );
}
