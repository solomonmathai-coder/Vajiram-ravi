import { ClockIcon, MapIcon, MapPinSmIcon, PhoneSmIcon } from "@/components/icons";
import { Lead, SectionTitle } from "@/components/ui/Typography";
import { centre } from "@/data/home";
import { contact } from "@/data/site";
import LocationMap from "./LocationMap";

const DETAIL_TEXT = "font-sans text-[16px]/[23px] font-medium text-neutral-500";

export default function Locations() {
  return (
    <section className="bg-white" id="location" aria-labelledby="loc-h">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-10 px-20 pt-23 pb-16">
        <div data-reveal className="flex w-full flex-col items-center gap-2 text-center">
          <SectionTitle id="loc-h" className="w-full">
            Our locations
          </SectionTitle>
          <Lead tone="body" className="w-full">
            Meet a counsellor, see the classrooms and pick up the brochure — in New Delhi and Chennai.
          </Lead>
        </div>
        <LocationMap cities={centre.cities} mapImage={centre.mapImage}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-[20px]/[27px] font-semibold whitespace-nowrap text-neutral-900">
                Location &amp; Timing
              </h3>
              <div className="flex gap-2 overflow-hidden">
                <span className="shrink-0 pt-1">
                  <MapPinSmIcon />
                </span>
                <div className={`flex min-w-0 flex-1 flex-col gap-1 ${DETAIL_TEXT}`}>
                  <p>{centre.address}</p>
                  <p>{centre.landmark}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-hidden">
              <ClockIcon />
              <p className={DETAIL_TEXT}>{contact.hours}</p>
            </div>
            <div className="flex h-[23px] items-center gap-2 overflow-hidden">
              <PhoneSmIcon />
              <p className={DETAIL_TEXT}>{contact.phone}</p>
            </div>
          </div>
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-4.5 py-2.5 font-display text-[16px]/[23px] font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-control)] [transition:background-color_.2s,box-shadow_.2s] hover:bg-neutral-50 hover:shadow-[inset_0_0_0_1px_var(--color-neutral-400)]"
            href={centre.mapsUrl}
            target="_blank"
            rel="noopener"
          >
            <MapIcon />
            <span>View on maps</span>
          </a>
        </LocationMap>
      </div>
    </section>
  );
}
