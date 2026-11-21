import "./intro.css";
import { INTRO_OUT } from "./introTiming";
import PreloaderCurtain from "./PreloaderCurtain";

/*
 * The intro: the opening of the page, after design S's (vajiram-ravi.vercel.app; the client chose its
 * opening for homepage v2). An orange iris opens on a dark cover, a faint mandala settles behind the logo,
 * the tagline "Understanding India. Shaping its Future." comes in, a saffron bar runs across the top, and
 * at 2.5s the panel slides up off the page with its kinari border under it. Skip intro, Esc or a scroll
 * ends it early. The look and the timings are CSS (./intro.css) from the first paint; PreloaderCurtain
 * only ends it.
 *
 * The head script (`introScript`) decides before anything is drawn and marks <html> with `intro`; only then
 * is the panel displayed, so it never flashes for anyone else, and without JavaScript there is none. On
 * every page load (a reload included); with reduced motion it is still and fades out after 1.5s. A page
 * restored from the back-forward cache does not replay it.
 */

/**
 * When the hero's entrance starts (`--intro`): 450ms into the slide, when the eased panel has cleared
 * most of the first screen, so the copy rises as it is uncovered.
 */
const HERO_AT = INTRO_OUT + 450;

/**
 * Inline <head> script: marks <html> with `intro` before the first paint (on every load of the homepage
 * only; the courses page has no intro) and sets
 * `--intro` to the hero's start time (none with reduced motion, where nothing waits).
 */
export const introScript = `(function(){try{var p=location.pathname;if(p!=="/"&&p!=="/index.html")return;var r=document.documentElement;r.classList.add("intro");if(!matchMedia("(prefers-reduced-motion: reduce)").matches)r.style.setProperty("--intro","${HERO_AT}ms")}catch(e){}})();`;

export default function Preloader() {
  return (
    <PreloaderCurtain>
      <div className="vrv__fin">
        <span className="vrv__ring" aria-hidden="true" />
        <div className="vrv__logo" role="img" aria-label="Vajiram & Ravi, Institute for IAS Examination">
          <img className="vrv__mark" src="/images/logo.webp" alt="" width={617} height={206} />
          <img className="vrv__name" src="/images/logo.webp" alt="" width={617} height={206} />
        </div>
        <p className="vrv__tag">
          <span>Understanding India.</span> <span>Shaping its Future.</span>
        </p>
      </div>
      <span className="vrv__bar" aria-hidden="true" />
      <span className="vrv__edge" aria-hidden="true" />
    </PreloaderCurtain>
  );
}
