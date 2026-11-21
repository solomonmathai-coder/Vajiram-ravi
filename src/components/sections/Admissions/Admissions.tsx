import { batchesCopy } from "@/data/admissions";
import AdmissionsBoard from "./AdmissionsBoard";
import FeaturedBatch from "./FeaturedBatch";

/**
 * Upcoming Batches & Admissions (IA 5; Figma "04 · Upcoming Batches", 2377:4662): a cream band.
 * The heading (homepage v2: no lead box beside it), the featured batch on its wide ticket
 * (FeaturedBatch), then the mode and month tabs with the round arrows, the railway-ticket track of the other
 * batches, and "View all upcoming batches" (AdmissionsBoard). The postcard form that a ticket's "Register
 * now" opens is the next section (Counselling).
 */
export default function Admissions() {
  const { title } = batchesCopy;
  return (
    <section id="batches" aria-labelledby="batches-h" className="relative bg-cream">
      <div className="relative mx-auto flex w-canvas flex-col items-start gap-10 px-20 pt-20 pb-16">

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col items-start gap-4">
            <h2 id="batches-h" data-split className="w-[760px] font-heading text-[52px]/[1.08] font-semibold tracking-[-0.02em] text-ink">
              {title.before}{" "}
              <em data-reveal-em className="text-orange italic">
                {title.em}
              </em>{" "}
              {title.after}
            </h2>
          </div>
        </div>

        <FeaturedBatch />

        <AdmissionsBoard />
      </div>
    </section>
  );
}
