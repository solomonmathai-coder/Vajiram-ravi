import Batches from "@/components/sections/Batches/Batches";
import ClosingCta from "@/components/sections/ClosingCta/ClosingCta";
import ContactOptions from "@/components/sections/ContactOptions/ContactOptions";
import Counselling from "@/components/sections/Counselling/Counselling";
import Courses from "@/components/sections/Courses/Courses";
import Faculty from "@/components/sections/Faculty/Faculty";
import Faq from "@/components/sections/Faq/Faq";
import FreeResources from "@/components/sections/FreeResources/FreeResources";
import GsProgramme from "@/components/sections/GsProgramme/GsProgramme";
import Hero from "@/components/sections/Hero/Hero";
import Locations from "@/components/sections/Locations/Locations";
import SuccessStories from "@/components/sections/SuccessStories/SuccessStories";
import Toppers from "@/components/sections/Toppers/Toppers";
import WhyChoose from "@/components/sections/WhyChoose/WhyChoose";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <Hero />
      <Toppers />
      <WhyChoose />
      <Courses />
      <GsProgramme />
      <Faculty />
      <Batches />
      <Counselling />
      <SuccessStories />
      <FreeResources />
      <Faq />
      <ContactOptions />
      <Locations />
      <ClosingCta />
      <ScrollReveal />
    </main>
  );
}
