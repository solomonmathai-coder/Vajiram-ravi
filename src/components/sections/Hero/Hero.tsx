import { hero } from "@/data/home";
import HeroVideo from "./HeroVideo";
import WatchVideoButton from "./WatchVideoButton";

/** Full-width video hero with the heading and "Watch video" at the bottom left. */
export default function Hero() {
  return (
    <section aria-label="Welcome">
      <HeroVideo video={hero.video} poster={hero.poster}>
        <h1 className="font-display text-[72px]/[76px] font-medium tracking-[-0.02em] text-white">
          {hero.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <WatchVideoButton video={hero.video} />
      </HeroVideo>
    </section>
  );
}
