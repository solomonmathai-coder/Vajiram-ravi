import { KnobButton } from "@/components/ui/Buttons";
import { SectionTitle } from "@/components/ui/Typography";
import { faqs } from "@/data/faqs";
import FaqList from "./FaqList";

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-h">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-12 px-60 py-24">
        <div data-reveal className="flex w-[960px] justify-center">
          <SectionTitle id="faq-h" className="whitespace-nowrap">
            Frequently asked questions
          </SectionTitle>
        </div>
        <FaqList items={faqs} />
        <div
          data-reveal
          className="flex w-full items-center gap-12 overflow-hidden rounded-[20px] border border-sun-200 bg-sun-100 p-14"
        >
          <div className="flex flex-1 items-center justify-between">
            <div className="flex w-[545px] flex-col gap-2 overflow-hidden">
              <h3 className="font-display text-[32px]/[39px] font-semibold text-brown-950">Still have questions?</h3>
              <p className="font-sans text-[18px]/[25px] font-medium text-brown-900">
                A counsellor will listen, answer your questions and help you choose. No pressure to enroll.
              </p>
            </div>
            <KnobButton href="#contact" icon="phone">
              Talk to a counsellor
            </KnobButton>
          </div>
        </div>
      </div>
    </section>
  );
}
