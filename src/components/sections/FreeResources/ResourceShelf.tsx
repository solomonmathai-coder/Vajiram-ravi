import type { FreeResource, ResourceArt } from "@/data/study-materials";

/*
 * "Other free resources" as a shelf of small tiles, each with a little cover or page stack drawn in
 * CSS. On hover the stack fans out and lifts, and the arrow fills dark.
 */

/** Hover motion shared by every piece of the art. */
const MOVE = "absolute transition-[rotate,translate] duration-[220ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover/tile:-translate-y-1";
const PAGE = "rounded-[6px] border border-sand-line bg-shell";
const LINE = "absolute h-[3px] rounded-[2px]";
/** The light title strip printed on a cover. */
const TITLE = "absolute h-1 rounded-[2px] bg-paper/85";

function Art({ art }: { art: ResourceArt }) {
  switch (art) {
    case "magazine":
      return (
        <>
          <span className={`${MOVE} top-[21.66px] left-[24.82px] h-[58px] w-11 -rotate-8 rounded-[6px] bg-char group-hover/tile:-rotate-14`} />
          <span className={`${MOVE} top-[19.14px] left-[39.85px] h-[58px] w-11 rotate-6 rounded-[6px] bg-orange group-hover/tile:rotate-12`}>
            {/* Counter-turned so the strip sits level on the tilted cover, as drawn. */}
            <span className={`${TITLE} top-[9.73px] left-[9.35px] w-[26px] -rotate-6`} />
          </span>
        </>
      );
    case "yojana":
      return (
        <>
          <span className={`${MOVE} top-[19px] left-[19px] h-[54px] w-9 origin-bottom rounded-[6px] bg-orange group-hover/tile:-rotate-6`}>
            <span className={`${TITLE} top-2.5 left-2 w-5`} />
          </span>
          <span className={`${MOVE} top-[19px] left-[61px] h-[54px] w-9 origin-bottom rounded-[6px] bg-char group-hover/tile:rotate-6`}>
            <span className={`${TITLE} top-2.5 left-2 w-5`} />
          </span>
        </>
      );
    case "papers":
      return (
        <>
          <span className={`${MOVE} ${PAGE} top-[13px] left-[29px] h-[62px] w-14 origin-bottom-left group-hover/tile:rotate-6`} />
          <span className={`${MOVE} ${PAGE} top-[19px] left-[23px] h-[62px] w-14 origin-bottom-left group-hover/tile:rotate-3`} />
          <span className={`${MOVE} ${PAGE} top-[25px] left-[17px] h-[62px] w-14 origin-bottom-left`}>
            <span className={`${LINE} top-[11px] left-[7px] w-6 bg-orange`} />
            <span className={`${LINE} top-[20px] left-[7px] w-9 bg-char/25`} />
            <span className={`${LINE} top-[29px] left-[7px] w-9 bg-char/25`} />
            <span className={`${LINE} top-[38px] left-[7px] w-9 bg-char/25`} />
          </span>
        </>
      );
    case "answer-sheet":
      return (
        <span className={`${MOVE} ${PAGE} top-[17px] left-[19px] h-[66px] w-14 origin-bottom-left group-hover/tile:-rotate-6`}>
          {[11, 19, 27, 35, 43].map((top) => (
            <span key={top} className={`${LINE} left-[7px] w-[38px] bg-char/22`} style={{ top }} />
          ))}
          <span className="absolute top-[27px] left-[41px] text-[26px]/none font-semibold tracking-[-0.52px] text-orange">✓</span>
        </span>
      );
    case "essay":
      return (
        <>
          <span className={`${MOVE} ${PAGE} top-[17px] left-[19px] h-[66px] w-14 origin-bottom-left group-hover/tile:-rotate-6`}>
            {[11, 18, 25, 32, 39].map((top) => (
              <span key={top} className={`${LINE} left-[7px] w-[38px] bg-char/22`} style={{ top }} />
            ))}
            <span className={`${LINE} top-[46px] left-[7px] w-5 bg-char/22`} />
          </span>
          <span className={`${MOVE} top-[30.56px] left-[49.27px] h-[46px] w-1.5 rotate-35 rounded-[3px] bg-orange group-hover/tile:rotate-41`} />
        </>
      );
  }
}

export default function ResourceShelf({ resources }: { resources: FreeResource[] }) {
  return (
    <div className="flex w-full flex-col items-start gap-4 border-t border-sand-line pt-6">
      <h3 data-reveal className="text-[15px]/[1.5] font-medium text-stone">
        Other free resources
      </h3>
      <ul data-reveal-group className="flex w-full items-start gap-3">
        {resources.map((resource) => (
          <li key={resource.label} className="min-w-0 flex-1">
            <a
              href={resource.href}
              className="group/tile relative block h-[124px] overflow-clip rounded-[20px] border border-sand-line bg-sand"
            >
              <span aria-hidden="true">
                <Art art={resource.art} />
              </span>
              <span
                aria-hidden="true"
                className="absolute top-[15px] left-[193px] flex size-9 items-center justify-center rounded-full border border-sand-line bg-shell text-[14px]/none font-medium text-char transition-colors duration-[220ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover/tile:border-char group-hover/tile:bg-char group-hover/tile:text-paper group-focus-visible/tile:border-char group-focus-visible/tile:bg-char group-focus-visible/tile:text-paper"
              >
                ↗
              </span>
              <span className="absolute top-[84px] left-[19px] w-[200px] text-[16px]/[1.5] font-medium tracking-[-0.08px] text-char">
                {resource.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
