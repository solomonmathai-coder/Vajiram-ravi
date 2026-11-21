import type { Metadata } from "next";
import FreeResourcesPage from "@/components/free-resources/FreeResourcesPage";
import RefFooter from "@/components/footer-ref/RefFooter";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "Free UPSC study material · Vajiram & Ravi",
  description:
    "Free UPSC study material from Vajiram & Ravi: The Recitals, infographics, one-pagers, Quest notes, Yojana and Kurukshetra summaries, Prelims quick revision, GS Mains probables, the Economic Survey and previous year papers.",
};

/**
 * The Free Resources page (/free-resources, Figma 1361:38711), in the About page's language
 * (components/free-resources/FreeResourcesPage), with the final site's footer and the WhatsApp button. The nav's
 * Study materials menu opens it ("Explore free resources").
 */
export default function FreeResourcesRoute() {
  return (
    <>
      <FreeResourcesPage />
      <RefFooter />
      <WhatsAppButton />
    </>
  );
}
