import type { CSSProperties } from "react";
import { aboutValues } from "@/data/about-page";

/**
 * "Our values", the alternative layout (21 Nov 2026, shown under ValuesPanels for the client to compare and choose):
 * everything up front, still. On the page's cream ground, the label and heading on the left and the introduction on
 * the right; then the five values side by side, one row of five identical cards of one height. Each card is on the
 * manila of the homepage's folder cards, its icon white on an orange disc (as the Free Resources benefit cards), then
 * the title and sentence in warm dark type. Same words as ValuesPanels (data/about-page, aboutValues), each with its
 * line icon (public/images/about/values).
 */
export default function ValuesList() {
  const { label, heading, intro, items } = aboutValues;
  return (
    <section className="ab-sec ab-vb" aria-labelledby="abValues2">
      <header className="ab-vb__hd">
        <div>
          <span className="ab-rv">
            <span className="ab-lbl">{label}</span>
          </span>
          <h2 id="abValues2" className="ab-h2 ab-rv" style={{ "--d": ".06s" } as CSSProperties}>
            {heading}
          </h2>
        </div>
        <p className="ab-vb__intro ab-rv" style={{ "--d": ".12s" } as CSSProperties}>
          {intro}
        </p>
      </header>
      <ol className="ab-vb__grid ab-rv" style={{ "--d": ".1s" } as CSSProperties}>
        {items.map((item) => (
          <li key={item.title} className="ab-vb__tile" style={{ "--ic": `url(${item.icon})` } as CSSProperties}>
            <span className="ab-vb__ic" aria-hidden="true">
              <i />
            </span>
            <div className="ab-vb__tx">
              <h3 className="ab-vb__t">{item.title}</h3>
              <p className="ab-vb__d">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
