"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import type { StoryGameConfig } from "@/lib/types";

const END_ID = "__end__";

function getStartId(config: StoryGameConfig): string {
  if (config.scenes.length === 0) return END_ID;
  const start = config.scenes.find((s) => s.id === "start");
  return start ? start.id : config.scenes[0].id;
}

export function StoryGame({ config }: { config: StoryGameConfig }): ReactElement {
  const [currentSceneId, setCurrentSceneId] = useState<string>(() => getStartId(config));
  const [visited, setVisited] = useState<string[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Reset when a different project's config is loaded.
  useEffect(() => {
    setCurrentSceneId(getStartId(config));
    setVisited([]);
  }, [config]);

  const transitionClass = reducedMotion ? "" : "transition-all";
  const scene = config.scenes.find((s) => s.id === currentSceneId);
  const isEnd = currentSceneId === END_ID || !scene || scene.choices.length === 0;

  function handleChoice(nextId: string | null) {
    setVisited((prev) => [...prev, currentSceneId]);
    if (nextId === null) {
      setCurrentSceneId(END_ID);
    } else {
      setCurrentSceneId(nextId);
    }
  }

  function handleStartOver() {
    setCurrentSceneId(getStartId(config));
    setVisited([]);
  }

  if (config.scenes.length === 0) {
    return (
      <div className="bg-surface rounded-xl shadow-md p-7 max-w-[700px] mx-auto text-center">
        <p className="text-body text-text-muted">No story yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-md p-7 max-w-[700px] mx-auto">
      <p className="text-tiny font-semibold text-text-muted uppercase tracking-wide mb-1">
        Story
      </p>
      <p className="text-tiny text-text-muted mb-1">🖱️ Click a choice to continue the story</p>
      <p className="text-tiny text-text-muted mb-3">
        📜 Choices made: {visited.length}
      </p>

      {isEnd ? (
        <div className="text-center">
          <div className="text-7xl mb-4" aria-hidden>
            🌟
          </div>
          {scene && scene.choices.length === 0 && (
            <p className="font-display text-h3 text-text mb-6">{scene.text}</p>
          )}
          <h2 className="font-display text-h2 mb-5">The End</h2>
          <button
            type="button"
            onClick={handleStartOver}
            className={`bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-12 px-6 shadow-md ${transitionClass}`}
          >
            Start Over
          </button>
        </div>
      ) : (
        <>
          <p className="font-display text-h3 text-text mb-6">{scene!.text}</p>
          <div className="space-y-3">
            {scene!.choices.map((choice, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChoice(choice.nextId)}
                className={`bg-surface-muted hover:bg-primary-soft text-text rounded-lg px-5 h-12 w-full text-body font-semibold text-left ${transitionClass}`}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default StoryGame;
