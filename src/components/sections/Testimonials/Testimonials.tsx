import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { testimonials } from "@/data/home";
import ReviewRibbon from "./ReviewRibbon";

/**
 * Testimonials: review cards that travel along a curved ribbon as you scroll (ReviewRibbon), under
 * a centred heading that stays at the top until every card has gone by.
 */
export default function Testimonials() {
  return (
    <section className="bg-white" aria-labelledby="reviews-title">
      <ReviewRibbon reviews={testimonials.reviews}>
        <div className="mx-auto flex w-canvas flex-col items-center gap-5 px-10 text-center">
          <Eyebrow tone="green" tagged tag="green">
            {testimonials.eyebrow}
          </Eyebrow>
          <div className="flex flex-col items-center gap-2">
            <SectionTitle id="reviews-title" className="w-[530px] text-balance">
              {testimonials.heading}
            </SectionTitle>
            <Lead className="w-[720px]">{testimonials.intro}</Lead>
          </div>
        </div>
      </ReviewRibbon>
    </section>
  );
}
