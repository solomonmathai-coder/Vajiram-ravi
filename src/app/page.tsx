import About from "@/components/sections/About/About";
import Courses from "@/components/sections/Courses/Courses";
import GsProgramme from "@/components/sections/GsProgramme/GsProgramme";
import Hero from "@/components/sections/Hero/Hero";
import StartBanner from "@/components/sections/StartBanner/StartBanner";
import Testimonials from "@/components/sections/Testimonials/Testimonials";
import Toppers from "@/components/sections/Toppers/Toppers";
import WhyChoose from "@/components/sections/WhyChoose/WhyChoose";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <Hero />
      <About />
      <Toppers />
      <WhyChoose />
      <GsProgramme />
      <Testimonials />
      <Courses />
      <StartBanner />
      <ScrollReveal />
    </main>
  );
}
