import type { CSSProperties } from "react";
import { aboutValues } from "@/data/about-page";

/** Where each value's stop sits along the line, as a share of the width (an even spread, half a step in from each end). */
const STOPS = [10, 30, 50, 70, 90];

/**
 * Our values' cards as stops on one path (brought back 26 Nov 2026, the user: "we can use this style for our values, the
 * heading is fine"; first made 23 Nov 2026, e160912): a dotted orange line runs across the width, each value's icon a stop
 * on it (white on an orange disc), and the five cards stand above and below the line by turns, each joined to its stop by
 * a short stem: the first, third and fifth above, the second and fourth below. The cards are all one size, on the manila
 * of the homepage's folder cards. Only the path: the section's head is the team site's (AboutPage). Same words
 * (data/about-page aboutValues), each with its line icon (public/images/about/values). Styles: about.css (.ab-vp).
 */
export default function ValuesPath() {
  return (
    <div className="ab-vp__track ab-rv" style={{ "--d": ".1s" } as CSSProperties}>
      <ol className="ab-vp__list">
        {aboutValues.items.map((item, i) => (
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
  );
}
