import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";
import RefFooter from "@/components/footer-ref/RefFooter";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "About us · Vajiram & Ravi",
  description:
    "Vajiram & Ravi has prepared aspirants for the UPSC Civil Services Examination since 1976: how it started, our values, the people who lead the institute, our educators and where we teach.",
};

/**
 * The About page (/about, Figma "About Us – 1441", 1008:38294), in the language of Kevin's homepage and course
 * finder (components/about/AboutPage), with the final site's footer (footer-ref/RefFooter) and the WhatsApp button, as /courses has.
 */
export default function AboutRoute() {
  return (
    <>
      <AboutPage />
      <RefFooter />
      <WhatsAppButton />
    </>
  );
}
