import { Fragment } from "react";

type WordRiseProps = {
  /** The text in runs, each with its own classes, e.g. a coloured accent phrase. */
  parts: { text: string; className?: string }[];
  /** Delay between words, in milliseconds. */
  stagger?: number;
  /** Delay before the first word. */
  delay?: number;
};

/**
 * Headline reveal: each word rises 24px and fades in, one after another (the `word-rise` animation in
 * globals.css). It plays once, on load. Use it inside the heading element.
 */
export default function WordRise({ parts, stagger = 60, delay = 0 }: WordRiseProps) {
  let index = 0;
  return (
    <>
      {parts.map((part, p) => (
        <span key={p} className={part.className}>
          {part.text
            .split(/(\s+)/)
            .filter(Boolean)
            .map((word, w) =>
              /^\s+$/.test(word) ? (
                <Fragment key={w}>{word}</Fragment>
              ) : (
                <span
                  key={w}
                  className="inline-block animate-word-rise"
                  style={{ animationDelay: `${delay + index++ * stagger}ms` }}
                >
                  {word}
                </span>
              ),
            )}
        </span>
      ))}
    </>
  );
}
