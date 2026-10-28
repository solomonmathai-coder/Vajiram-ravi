import { ArrowRightIcon, TinyArrowIcon } from "@/components/icons";
import { KnobButton, NUDGE, textLink } from "@/components/ui/Buttons";
import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { batches, type Batch } from "@/data/programmes";
import { contact } from "@/data/site";
import { cx } from "@/lib/cx";

function BatchCard({ batch }: { batch: Batch }) {
  const { compact } = batch;
  return (
    <a
      href="#contact"
      className={cx(
        "group/card relative flex items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-5 [transition:border-color_.3s,box-shadow_.3s_var(--ease-smooth),translate_.3s_var(--ease-smooth)] hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_16px_30px_-18px_rgba(43,20,5,.25)]",
        compact && "overflow-hidden",
      )}
    >
      <div
        className={cx(
          "flex flex-none flex-col items-center gap-1 overflow-hidden rounded-xl border border-neutral-200 bg-white pb-2.5",
          compact ? "w-[72px]" : "w-20",
        )}
      >
        <p className="w-full bg-sun-200 py-1.25 text-center font-display text-[12px]/[19px] font-semibold text-brown-800 uppercase">
          {batch.month}
        </p>
        <p
          className={cx(
            "text-center font-display text-neutral-900",
            compact ? "text-[24px]/[39px] font-bold" : "text-[32px]/[39px] font-semibold",
          )}
        >
          {batch.day}
        </p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="max-w-[700px] font-display text-[18px]/[25px] font-semibold text-neutral-900">{batch.title}</p>
        <p
          className={cx(
            "font-sans",
            compact
              ? "text-[14px]/[21px] font-medium whitespace-nowrap text-neutral-500"
              : "text-[14px]/[20px] font-normal text-neutral-600",
          )}
        >
          {batch.meta}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {compact ? (
          <span className={textLink(true)}>
            Register now
            <TinyArrowIcon className={cx(NUDGE, "ml-[10.5px] inline-block align-[1px] group-hover/card:translate-x-[3px]")} />
          </span>
        ) : (
          <span className={textLink()}>
            Register now
            <ArrowRightIcon className={cx(NUDGE, "group-hover/card:translate-x-[3px]")} />
          </span>
        )}
      </div>
      {batch.seats && (
        <span
          className="absolute -top-px z-1 flex justify-center rounded-b-[10px] bg-brand-100 py-1 font-sans text-[12px]/[16px] font-medium whitespace-nowrap text-brand-700"
          style={{ left: batch.seats.left, width: batch.seats.width }}
        >
          Limited seats
        </span>
      )}
    </a>
  );
}

export default function Batches() {
  return (
    <section className="bg-brand-50" id="batches" aria-labelledby="bat-h">
      <div className="relative mx-auto flex w-canvas items-start gap-24 px-20 py-24">
        <div data-reveal className="flex min-w-0 flex-1 flex-col items-start gap-8">
          <div className="flex w-full flex-col gap-5">
            <Eyebrow>UPCOMING BATCHES</Eyebrow>
            <div className="flex flex-col gap-2">
              <SectionTitle id="bat-h">Next batches starting soon.</SectionTitle>
              <Lead tone="body">Register online, or call {contact.phone} for registration or seat allotment.</Lead>
            </div>
          </div>
          <KnobButton href="#">View all batches</KnobButton>
        </div>
        <div data-reveal className="relative flex w-[707px] flex-none flex-col gap-3">
          {batches.map((batch) => (
            <BatchCard key={`${batch.day}-${batch.title}`} batch={batch} />
          ))}
        </div>
      </div>
    </section>
  );
}
