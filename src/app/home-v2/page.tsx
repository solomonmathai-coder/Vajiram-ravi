import About from "@/components/sections/About/About";
import Admissions from "@/components/sections/Admissions/Admissions";
import Counselling from "@/components/sections/Admissions/Counselling";
import ClosingCta from "@/components/sections/ClosingCta/ClosingCta";
import Locations from "@/components/sections/Contact/Locations";
import Faculty from "@/components/sections/Faculty/Faculty";
import Faq from "@/components/sections/Faq/Faq";
import Resources from "@/components/sections/FreeResources/Resources";
import Hero from "@/components/sections/Hero/Hero";
import Programmes from "@/components/sections/Programmes/Programmes";
import Toppers from "@/components/sections/Toppers/Toppers";
import SuccessStories from "@/components/sections/SuccessStories/SuccessStories";
import CoverSheet from "@/components/ui/CoverSheet";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TextMotion from "@/components/ui/TextMotion";

/**
 * The homepage, v2 (the client's choice of 12 Nov 2026 between designs J, this site's v1, and S): in the
 * client's proposed order.
 *   1. the hero (#hero), pinned while
 *   2. the programmes (#programmes) slide over it (ui/CoverSheet)
 *   3. the toppers (#toppers)           4. the testimonials (#stories)
 *   5. the educators (#educators)        6. about Vajiram & Ravi (#about)
 *   7. upcoming batches (#batches)       8. talk to us (#counselling)
 *   9. the resources (#resources)       10. contact us (#locations)
 *  11. FAQs (#faq)                      12. the final call to action (#closing)
 * The header and the footer (13) come from the root layout. Version 1 is kept at the git tag homepage-v1.
 */
export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <div className="relative">
        <Hero />
        <Programmes />
      </div>
      <CoverSheet />
      <Toppers />
      <SuccessStories />
      <Faculty />
      <About />
      <Admissions />
      <Counselling />
      <Resources />
      <Locations />
      <Faq />
      <ClosingCta />
      <ScrollReveal />
      <TextMotion />
    </main>
  );
}
