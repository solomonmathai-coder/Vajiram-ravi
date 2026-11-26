import type { CSSProperties } from "react";
import { aboutLeaders } from "@/data/about-page";
import SectionLabel from "@/team/components/ui/SectionLabel";

/** A part that rises in as it comes into view, after `d` seconds (AboutReveal). */
const rv = (d = 0) => ({ className: "ab-rv", style: { "--d": `${d}s` } as CSSProperties });

function Head({ id, tag }: { id: string; tag: string }) {
  return (
    <div className="ab-head--c">
      <p className="ab-opt-tag">{tag}</p>
      <SectionLabel>{aboutLeaders.label}</SectionLabel>
      <h2 id={id} className="h2 h2--sec rv" style={{ "--d": ".12s" } as CSSProperties}>
        {aboutLeaders.heading}
      </h2>
    </div>
  );
}

/**
 * "The people who lead Vajiram & Ravi", two more layouts to compare with the three cards above (26 Nov 2026, Abhishek's
 * review: "any other explorations for this section?"). The same words and photographs (data/about-page, aboutLeaders).
 *
 * Option B, the founder first: Prof. P. Velayutham large, his photograph beside his role, name and story, and the two
 * directors after him as two smaller cards side by side, each its photograph beside its words, so the page reads from
 * the institute's founding to the people who run it now.
 */
export function LeadersFounderFirst() {
  const [founder, ...rest] = aboutLeaders.leaders;
  return (
    <section className="ab-sec ab-lf" aria-labelledby="abLeadersB">
      <Head id="abLeadersB" tag="Option B · the founder first" />
      <article {...rv(0.1)} className="ab-lf__main ab-rv">
        <div className="ab-lf__ph">
          <img src={founder.photo.src} alt={founder.photo.alt} width={founder.photo.width} height={founder.photo.height} loading="lazy" />
        </div>
        <div className="ab-lf__b">
          <span className="ab-leader__role">{founder.role}</span>
          <h3 className="ab-lf__n">{founder.name}</h3>
          <p className="ab-lf__d">{founder.bio}</p>
        </div>
      </article>
      <ul className="ab-lf__rest">
        {rest.map((l, i) => (
          <li key={l.name} {...rv(0.16 + i * 0.08)} className="ab-lf__card ab-rv">
            <div className="ab-lf__ph ab-lf__ph--s">
              <img src={l.photo.src} alt={l.photo.alt} width={l.photo.width} height={l.photo.height} loading="lazy" />
            </div>
            <div className="ab-lf__b">
              <span className="ab-leader__role">{l.role}</span>
              <h3 className="ab-lf__n ab-lf__n--s">{l.name}</h3>
              <p className="ab-lf__d ab-lf__d--s">{l.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Option C, portraits: three tall portraits side by side, each with its role and name over the foot of the photograph, in
 * the homepage faculty carousel's manner; under the pointer (or the keyboard) a cream panel rises over the photograph
 * with the person's story, the face staying in view above it.
 */
export function LeadersPortraits() {
  return (
    <section className="ab-sec ab-lp" aria-labelledby="abLeadersC">
      <Head id="abLeadersC" tag="Option C · portraits" />
      <ul className="ab-lp__row">
        {aboutLeaders.leaders.map((l, i) => (
          <li key={l.name} {...rv(0.08 + i * 0.08)} className="ab-lp__item ab-rv">
            <article className="ab-lp__card" tabIndex={0} aria-label={`${l.name}, ${l.role}`}>
              <img src={l.photo.src} alt={l.photo.alt} width={l.photo.width} height={l.photo.height} loading="lazy" />
              <div className="ab-lp__plate">
                <span className="ab-lp__role">{l.role}</span>
                <h3 className="ab-lp__n">{l.name}</h3>
                <p className="ab-lp__d">{l.bio}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
