import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Admissions from "@/components/sections/Admissions/Admissions";
import ClosingCta from "@/components/sections/ClosingCta/ClosingCta";
import Contact from "@/components/sections/Contact/Contact";
import Courses from "@/components/sections/Courses/Courses";
import Faculty from "@/components/sections/Faculty/Faculty";
import Faq from "@/components/sections/Faq/Faq";
import FreeResources from "@/components/sections/FreeResources/FreeResources";
import GsProgramme from "@/components/sections/GsProgramme/GsProgramme";
import Hero from "@/components/sections/Hero/Hero";
import ProgrammeFinder from "@/components/sections/ProgrammeFinder/ProgrammeFinder";
import SuccessStories from "@/components/sections/SuccessStories/SuccessStories";
import Toppers from "@/components/sections/Toppers/Toppers";
import WhyChoose from "@/components/sections/WhyChoose/WhyChoose";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StackedSections from "@/components/ui/StackedSections";

/** The homepage, in the order of the Figma frame "new modern design". */
export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <AnnouncementBar />
      <Hero />
      <Toppers />
      <WhyChoose />
      <Courses />
      <ProgrammeFinder />
      <GsProgramme />
      <Faculty />
      <Admissions />
      {/* Stories, study materials and the FAQ stack like cards as you scroll. */}
      <StackedSections>
        <SuccessStories />
        <FreeResources />
        <Faq />
      </StackedSections>
      <Contact />
      {/* Last in <main>: the footer's top spacing continues from the end of this banner. */}
      <ClosingCta />
      <ScrollReveal />
    </main>
  );
}
