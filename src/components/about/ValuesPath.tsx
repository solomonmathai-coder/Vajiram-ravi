import type { CSSProperties } from "react";
import { aboutValues } from "@/data/about-page";

/** Where each value's stop sits along the line, as a share of the width (an even spread, half a step in from each end). */
const STOPS = [10, 30, 50, 70, 90];

/**
 * "Our values", a third layout (23 Nov 2026, shown under ValuesPanels and ValuesList for the client to compare and
 * choose): the five values as stops on one path. The same head as ValuesList (the label and heading on the left, the
 * introduction on the right); under it a dotted orange line runs across the width, each value's icon a stop on it
 * (white on an orange disc, as the Free Resources benefit cards), and the values' cards stand above and below the line
 * by turns, each joined to its stop by a short stem: the first, third and fifth above, the second and fourth below.
 * Taking turns gives each card more width than a row of five, so the sentences run to three short lines. The cards
 * are all one size, on the manila of the homepage's folder cards with the title and sentence in its warm dark type;
 * the outer two stand flush with the edges, the others centred on their stops. Still. Same words (data/about-page,
 * aboutValues), each with its line icon (public/images/about/values).
 */
export default function ValuesPath() {
  const { label, heading, intro, items } = aboutValues;
  return (
    <section className="ab-sec ab-vp" aria-labelledby="abValues3">
      <header className="ab-vb__hd">
        <div>
          <span className="ab-rv">
            <span className="ab-lbl">{label}</span>
          </span>
          <h2 id="abValues3" className="ab-h2 ab-rv" style={{ "--d": ".06s" } as CSSProperties}>
            {heading}
          </h2>
        </div>
        <p className="ab-vb__intro ab-rv" style={{ "--d": ".12s" } as CSSProperties}>
          {intro}
        </p>
      </header>
      <div className="ab-vp__track ab-rv" style={{ "--d": ".1s" } as CSSProperties}>
        <ol className="ab-vp__list">
          {items.map((item, i) => (
            <li
              key={item.title}
              className="ab-vp__item"
              data-side={i % 2 ? "below" : "above"}
              style={{ "--c": `${STOPS[i]}%`, "--ic": `url(${item.icon})` } as CSSProperties}
            >
              <span className="ab-vp__stop" aria-hidden="true">
                <i />
              </span>
              <span className="ab-vp__stem" aria-hidden="true" />
              <div className="ab-vp__card">
                <h3 className="ab-vp__t">{item.title}</h3>
                <p className="ab-vp__d">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
