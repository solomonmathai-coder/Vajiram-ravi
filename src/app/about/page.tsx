import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";
import Footer from "@/team/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import "@/team/team-globals.css";

export const metadata: Metadata = {
  title: "About us · Vajiram & Ravi",
  description:
    "Vajiram & Ravi has prepared aspirants for the UPSC Civil Services Examination since 1976: how it started, our values, the people who lead the institute, our educators and where we teach.",
};

/**
 * The About page (/about, Figma "About Us – 1441", 1008:38294), in the language of Kevin's homepage and course
 * finder: built from the team site's own components (src/team, copied from abhishekps-web/vajiram-ravi, 26 Nov 2026;
 * components/about/AboutPage), its footer included, all inside .team-scope (the wrapper its global rules are scoped to),
 * and the WhatsApp button.
 */
export default function AboutRoute() {
  return (
    <>
      <div className="team-scope">
        <AboutPage />
        <Footer />
      </div>
      <WhatsAppButton />
    </>
  );
}
