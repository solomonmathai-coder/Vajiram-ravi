"use client";

import { useRef, useState } from "react";
import { finderSteps, initialAnswers, matchFor, type Answers } from "@/data/finder";
import AnswersRail from "./AnswersRail";
import MatchCard from "./MatchCard";
import QuestionCard from "./QuestionCard";

/**
 * The finder's three cards and their shared state: the answers so far, the step on show, and whether
 * the last step has been confirmed. The match is worked out afresh from the answers on every change.
 */
export default function Finder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [complete, setComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // When the last step was confirmed; the same button then reads "Start over", so a double click must not reset.
  const completedAt = useRef(0);

  const current = finderSteps[step];
  const confirmed = (i: number) => complete || i < step;

  const select = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
    setShowHint(false);
  };

  const primary = () => {
    if (complete) {
      if (performance.now() - completedAt.current < 600) return;
      // Start over.
      setAnswers({});
      setStep(0);
      setComplete(false);
      return;
    }
    if (answers[current.id] === undefined) {
      setShowHint(true);
      return;
    }
    setShowHint(false);
    if (step < finderSteps.length - 1) setStep(step + 1);
    else {
      completedAt.current = performance.now();
      setComplete(true);
    }
  };

  const back = () => {
    setShowHint(false);
    setComplete(false);
    setStep((s) => Math.max(0, s - 1));
  };

  const tags = finderSteps
    .filter((_, i) => confirmed(i))
    .map((s) => s.options.find((o) => o.id === answers[s.id])?.tag)
    .filter((tag): tag is string => !!tag);
  const answered = finderSteps.filter((s) => answers[s.id] !== undefined).length;

  return (
    <div data-reveal-group className="relative flex h-[560px] w-full items-start gap-4">
      <AnswersRail steps={finderSteps} answers={answers} step={step} complete={complete} />
      <QuestionCard
        steps={finderSteps}
        step={step}
        answers={answers}
        complete={complete}
        showHint={showHint}
        onSelect={select}
        onPrimary={primary}
        onBack={back}
      />
      <MatchCard match={matchFor(answers)} tags={tags} answered={answered} total={finderSteps.length} complete={complete} />
    </div>
  );
}
