import { Fragment } from "react";

/**
 * A heading's words, each in its own mask, for the word-by-word reveal: put `data-reveal-words` on the
 * heading and ScrollReveal lifts the words out of their masks, one after another, as it scrolls into view.
 */
export default function RevealWords({ text }: { text: string }) {
  return (
    <>
      {text.split(/\s+/).map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="rw">
            <span style={{ ["--i" as string]: i }}>{word}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}
