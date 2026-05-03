"use client";

import { useEffect, useState } from "react";
import type { QuizGameConfig } from "@/lib/types";

type ChoiceState = "idle" | "correct" | "wrong" | "reveal";

function choiceClasses(state: ChoiceState): string {
  const base =
    "rounded-lg px-5 h-12 w-full text-body font-semibold text-left transition-all";
  if (state === "correct") return `${base} bg-success-soft text-success`;
  if (state === "wrong") return `${base} bg-danger/20 text-danger`;
  if (state === "reveal") return `${base} bg-success-soft text-success`;
  return `${base} bg-surface-muted hover:bg-primary-soft text-text`;
}

export function QuizGame({ config }: { config: QuizGameConfig }) {
  const total = config.questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (total === 0) {
    return (
      <div className="bg-surface rounded-xl shadow-md p-7 max-w-[700px] mx-auto text-center">
        <p className="text-body text-text-muted">No questions yet.</p>
      </div>
    );
  }

  const question = config.questions[currentIndex];
  const transitionClass = reducedMotion ? "" : "transition-all";

  function handleChoice(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.answerIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= total) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function handlePlayAgain() {
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  }

  if (done) {
    return (
      <div className="bg-surface rounded-xl shadow-md p-7 max-w-[700px] mx-auto text-center">
        <div className="text-7xl mb-4" aria-hidden>
          🎉
        </div>
        <h2 className="font-display text-h3 mb-2">
          You scored {score} of {total}
        </h2>
        <button
          type="button"
          onClick={handlePlayAgain}
          className={`bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-12 px-6 shadow-md mt-4 ${transitionClass}`}
        >
          Play Again
        </button>
      </div>
    );
  }

  const progress = (currentIndex / total) * 100;

  return (
    <div className="bg-surface rounded-xl shadow-md p-7 max-w-[700px] mx-auto">
      <div
        className="h-2 rounded-pill bg-surface-muted mb-5 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={currentIndex}
      >
        <div
          className={`h-full bg-primary rounded-pill ${transitionClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-tiny font-semibold text-text-muted uppercase tracking-wide mb-2">
        Question {currentIndex + 1} of {total}
      </p>
      <h2 className="font-display text-h3 mb-5">{question.q}</h2>

      <div className="space-y-3">
        {question.choices.map((choice, i) => {
          let state: ChoiceState = "idle";
          if (selected !== null) {
            if (i === selected) {
              state = i === question.answerIndex ? "correct" : "wrong";
            } else if (
              selected !== question.answerIndex &&
              i === question.answerIndex
            ) {
              state = "reveal";
            }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleChoice(i)}
              disabled={selected !== null}
              className={choiceClasses(state)}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className={`bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-12 px-6 shadow-md ${transitionClass}`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizGame;
