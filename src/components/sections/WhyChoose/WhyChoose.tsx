import PeekCarousel from "@/components/ui/PeekCarousel";
import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { campusGallery, features } from "@/data/home";

export default function WhyChoose() {
  return (
    <section className="overflow-x-clip" aria-labelledby="why-h">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-12 px-20 pt-16 pb-8">
        <div data-reveal className="flex w-full flex-col items-center gap-5">
          <Eyebrow>WHY CHOOSE VAJIRAM &amp; RAVI</Eyebrow>
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <SectionTitle id="why-h" className="w-full">
              Your UPSC CSE success story starts here
            </SectionTitle>
            <Lead className="w-[838px]">
              From expert-led classes to personalised mentorship, get the guidance, resources, and structured preparation
              you need to move closer to your dream of becoming a civil servant.
            </Lead>
          </div>
        </div>
        <div data-reveal-group className="grid w-full grid-cols-3 gap-6">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="relative flex flex-col gap-6 overflow-hidden rounded-[20px] border border-line bg-white p-8">
              <span className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-brand-100 text-brown-800">
                <Icon />
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-[20px]/[27px] font-semibold text-neutral-900">{title}</h3>
                <p className="font-sans text-[16px]/[23px] font-medium text-neutral-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-8 pb-12">
        <PeekCarousel
          label="Campus gallery"
          slideLabel="Photo"
          dotsLabel="Choose photo"
          prevLabel="Previous photo"
          nextLabel="Next photo"
          count={campusGallery.length}
          slides={campusGallery}
          slidesSizes="792px"
          slideWidth={588}
          activeWidth={792}
          gap={12}
          start={1}
          dotOffset={1}
          nearDot
          interval={4500}
        />
      </div>
    </section>
  );
}
