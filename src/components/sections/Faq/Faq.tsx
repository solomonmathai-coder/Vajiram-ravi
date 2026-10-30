import RevealWords from "@/components/ui/RevealWords";
import Sheet from "@/components/ui/Sheet";
import { faqEntries } from "@/data/faq-chat";
import FaqChat from "./FaqChat";

/**
 * FAQPage structured data, so search engines read the questions however the chat presents them.
 * Questions still waiting for their answer are left out.
 */
const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqEntries
    .filter(({ answer }) => !answer.startsWith("Answer to be added"))
    .map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
};

/** Frequently asked questions, answered as a short chat with a counsellor. */
export default function Faq() {
  return (
    <Sheet
      id="faq"
      labelledBy="faq-h"
      tone="sand"
      after={
        // The FAQ is the last card of the stack and fills the screen, so a nudge shows there is more below.
        <a
          href="#contact"
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full text-[13px]/[1.5] font-medium whitespace-nowrap text-stone transition-colors duration-300 hover:text-char"
        >
          Scroll down
          <span aria-hidden="true" className="inline-block animate-nudge-down">
            ↓
          </span>
        </a>
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <FaqChat
        entries={faqEntries}
        heading={
          <h2 id="faq-h" data-reveal-words className="w-[440px] text-[56px]/none font-medium tracking-[-2.24px] text-char">
            <RevealWords text="Frequently asked questions" />
          </h2>
        }
      />
    </Sheet>
  );
}
