import Image from "next/image";
import Photo from "@/components/ui/Photo";
import { Eyebrow } from "@/components/ui/Typography";
import { whyChoose } from "@/data/home";
import UploadStage from "./UploadStage";

/**
 * Blurred colour blobs behind the large card, from the design. Each SVG carries a margin around its
 * ellipse for the blur, so it sits that far up and to the left of the ellipse itself.
 */
const BLOBS = [
  { colour: "8d8fc9", left: -403.93, top: -220, margin: 110, width: 1633.77, height: 740 },
  { colour: "b47a9c", left: 525.11, top: -200, margin: 110, width: 1431.8, height: 690 },
  { colour: "f7943f", left: -484.72, top: 190, margin: 90, width: 1149.44, height: 510 },
  { colour: "c2382a", left: -201.97, top: 372, margin: 80, width: 1816.13, height: 400 },
  { colour: "3a1636", left: -121.18, top: 486, margin: 70, width: 1755.74, height: 380 },
];

const CARD = "overflow-clip rounded-2xl border border-sand-200 bg-sand-100";
const TITLE = "font-display text-[18px]/[24px] text-neutral-600";
const TEXT = "font-sans text-[16px]/[24px] text-neutral-900";

/**
 * Why choose Vajiram & Ravi: a bento of six cards under the header. A large gradient card with the
 * illustration and the intro, a card of four results, and four smaller reasons with icons.
 * The cards assemble as you scroll (UploadStage).
 */
export default function WhyChoose() {
  return (
    <section className="bg-white" aria-labelledby="why-title">
      <UploadStage>
        <div className="flex flex-col items-start gap-6 pt-24 pb-20">
          <Eyebrow tone="neutral" tagged tag="amber">
            {whyChoose.eyebrow}
          </Eyebrow>
          <h2 id="why-title" className="w-[560px] font-display text-[44px]/[53px] font-medium text-neutral-900">
            {whyChoose.heading}
          </h2>
        </div>

        <div data-card-grid className="flex flex-col gap-3 pt-3 pb-16">
          {/* Two equal halves, so the gap between them lines up with the middle gap of the row below.
              (The design's 599/621 split leaves them 11px apart.) */}
          <div className="grid h-[560px] grid-cols-2 gap-3">
            <div data-card className="relative flex flex-col justify-between overflow-clip rounded-2xl bg-[#3b1f3a] pb-7 pl-5">
              <div aria-hidden="true" className="absolute inset-0">
                {BLOBS.map((blob) => (
                  <Image
                    key={blob.colour}
                    className="absolute max-w-none"
                    src={`/images/why-choose/blob-${blob.colour}.svg`}
                    alt=""
                    width={blob.width}
                    height={blob.height}
                    style={{ left: blob.left - blob.margin, top: blob.top - blob.margin }}
                  />
                ))}
              </div>
              <div className="relative flex h-[420px] flex-col rounded-bl-[14px] bg-sand-100 py-3 pl-3">
                <Photo
                  className="relative flex-1 overflow-hidden rounded-l-lg"
                  src={whyChoose.illustration}
                  alt=""
                  sizes="642px"
                />
              </div>
              <p className="relative pr-7 font-sans text-[16px]/[24px] font-medium text-white">
                {whyChoose.intro}
              </p>
            </div>

            <div data-card className={`${CARD} flex flex-col gap-5 px-5 pt-5 pb-7`}>
              <div className="flex flex-1 flex-col justify-center">
                <ul className="grid grid-cols-2 gap-3">
                  {whyChoose.stats.map((stat) => (
                    <li
                      key={stat.label}
                      className="flex h-[148px] flex-col justify-between rounded-[14px] bg-white p-5 font-medium"
                    >
                      <p className="font-display text-[48px]/[56px] tracking-[-0.02em] whitespace-nowrap">
                        <span data-count={stat.value} className="text-neutral-900">
                          {stat.value}
                        </span>
                        <span className="text-neutral-500">{stat.suffix}</span>
                      </p>
                      <p className="font-sans text-[14px]/[20px] text-neutral-600">{stat.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2 pr-10 font-medium">
                <h3 className={TITLE}>{whyChoose.record.title}</h3>
                <p className={TEXT}>{whyChoose.record.description}</p>
              </div>
            </div>
          </div>

          <ul className="grid h-[280px] grid-cols-4 gap-3">
            {whyChoose.features.map(({ title, description, icon: Icon }) => (
              <li key={title} data-card className={`${CARD} flex flex-col justify-between px-5 pt-5 pb-6`}>
                <span className="flex size-10 items-center justify-center rounded-[10px] border border-sand-200 bg-sand-50 text-neutral-900">
                  <Icon width={20} height={20} />
                </span>
                <div className="flex flex-col gap-2 pr-1 font-medium">
                  <h3 className={TITLE}>{title}</h3>
                  <p className={TEXT}>{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </UploadStage>
    </section>
  );
}
