import { QuoteIcon } from "@/components/icons";
import Photo from "@/components/ui/Photo";
import RankBadge from "@/components/ui/RankBadge";
import TrackCarousel from "@/components/ui/TrackCarousel";
import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { stories, type Story } from "@/data/toppers";

/** The design pages through three sets of cards; sets after the first repeat the stories. */
const PAGES = 3;

function StoryCard({ story, duplicate }: { story: Story; duplicate: boolean }) {
  const { topper } = story;
  return (
    <article
      aria-hidden={duplicate ? "true" : undefined}
      className="flex w-[628px] flex-none items-start gap-7 overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-50 py-5 pr-7 pl-5"
    >
      <div className="relative h-[270px] w-60 flex-none overflow-hidden rounded-[14px] bg-brand-100">
        <Photo className="absolute inset-0" src={topper.image} alt={topper.name} sizes="240px" />
        <RankBadge rank={topper.rank} narrow />
        <div className="absolute bottom-0 left-0 z-1 flex w-60 justify-center bg-neutral-300 px-2 py-1.5 font-sans text-[14px]/[21px] font-medium text-neutral-950">
          {story.exam}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch overflow-hidden py-2">
        <div className="flex flex-col gap-3">
          <QuoteIcon />
          <p className="font-sans text-[16px]/[23px] font-medium text-brown-950">{story.quote}</p>
        </div>
        <div className="flex flex-col overflow-hidden">
          <p className="font-sans text-[16px]/[23px] font-medium text-neutral-700">{topper.name}</p>
          <p className="font-display text-[14px]/[21px] font-medium text-neutral-500">{topper.programme}</p>
        </div>
      </div>
    </article>
  );
}

export default function SuccessStories() {
  return (
    <section className="relative overflow-x-clip" aria-labelledby="st-h">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-12 pt-16 pb-24">
        <div data-reveal className="flex w-full flex-col items-center gap-5">
          <Eyebrow>SUCCESS STORIES</Eyebrow>
          <div className="flex flex-col items-center gap-2 text-center">
            <SectionTitle id="st-h" className="w-[530px]">
              Hear it from our students
            </SectionTitle>
            <Lead className="w-[720px]">Honest words from students who prepared with us, in the classroom and LIVE-Online.</Lead>
          </div>
        </div>
        <TrackCarousel
          reveal
          className="relative flex w-full flex-col items-center gap-6"
          viewClassName="ml-20 w-full self-stretch touch-pan-y [clip-path:inset(-60px_-100vw_-60px_-1px)]"
          trackClassName="flex w-max items-center gap-6 transition-transform duration-700 ease-smooth"
          arrows={{ prev: "top-[156px] left-20", next: "top-[156px] right-20" }}
          step={652}
          pages={PAGES}
          dotsLabel="Choose story page"
          prevLabel="Previous stories"
          nextLabel="Next stories"
        >
          {Array.from({ length: PAGES }, (_, page) =>
            stories.map((story) => (
              <StoryCard key={`${page}-${story.topper.rank}`} story={story} duplicate={page > 0} />
            )),
          )}
        </TrackCarousel>
      </div>
      {/* Soft white fade on the right edge of the stories row. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[calc(50%+38.43px)] right-0 z-2 h-[397px] w-[109px] -translate-y-1/2 bg-[linear-gradient(to_left,#fff,rgba(255,255,255,0))]"
      />
    </section>
  );
}
