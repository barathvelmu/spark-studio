"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CollectorGameConfig } from "@/lib/types";

const PLAY_WIDTH = 600;
const PLAY_HEIGHT = 360;
const STEP = 16;
const EMOJI_SIZE = 32;
const COLLECT_RADIUS = 32;
const WIN_SCORE = 10;

const BACKGROUNDS: Record<CollectorGameConfig["background"], string> = {
  ocean: "#38BDF8",
  space: "#312E81",
  forest: "#4ADE80",
  city: "#94A3B8",
};

type Position = { x: number; y: number };

function randomPosition(): Position {
  return {
    x: Math.floor(Math.random() * (PLAY_WIDTH - EMOJI_SIZE)),
    y: Math.floor(Math.random() * (PLAY_HEIGHT - EMOJI_SIZE)),
  };
}

function centerCenterDistance(a: Position, b: Position): number {
  const ax = a.x + EMOJI_SIZE / 2;
  const ay = a.y + EMOJI_SIZE / 2;
  const bx = b.x + EMOJI_SIZE / 2;
  const by = b.y + EMOJI_SIZE / 2;
  return Math.hypot(ax - bx, ay - by);
}

export function CollectorGame({ config }: { config: CollectorGameConfig }) {
  const playAreaRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<Position>({
    x: PLAY_WIDTH / 2 - EMOJI_SIZE / 2,
    y: PLAY_HEIGHT / 2 - EMOJI_SIZE / 2,
  });
  const [collectible, setCollectible] = useState<Position>(() => randomPosition());
  const [score, setScore] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-focus on mount so kid can play immediately.
  useEffect(() => {
    playAreaRef.current?.focus();
  }, []);

  // Detect collisions and respawn collectible.
  useEffect(() => {
    if (centerCenterDistance(player, collectible) <= COLLECT_RADIUS) {
      setScore((s) => Math.min(s + 1, WIN_SCORE));
      setCollectible(randomPosition());
    }
  }, [player, collectible]);

  // Global keyboard listener so the game works regardless of focus.
  // The kid can just press arrow keys without clicking the play area first.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (score >= WIN_SCORE) return;
      const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (!keys.includes(e.key)) return;
      // Only intercept arrows when not typing in an input/textarea.
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      e.preventDefault();
      setPlayer((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowLeft") x -= STEP;
        if (e.key === "ArrowRight") x += STEP;
        if (e.key === "ArrowUp") y -= STEP;
        if (e.key === "ArrowDown") y += STEP;
        x = Math.max(0, Math.min(PLAY_WIDTH - EMOJI_SIZE, x));
        y = Math.max(0, Math.min(PLAY_HEIGHT - EMOJI_SIZE, y));
        return { x, y };
      });
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [score]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Local keydown still attached for focus-ring + a11y; movement handled globally above.
      const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (keys.includes(e.key)) e.preventDefault();
    },
    [],
  );

  const reset = useCallback(() => {
    setScore(0);
    setPlayer({
      x: PLAY_WIDTH / 2 - EMOJI_SIZE / 2,
      y: PLAY_HEIGHT / 2 - EMOJI_SIZE / 2,
    });
    setCollectible(randomPosition());
    playAreaRef.current?.focus();
  }, []);

  const hasWon = score >= WIN_SCORE;
  const transitionClass = reducedMotion ? "" : "transition-[left,top] duration-75 ease-out";

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-body-sm text-text-muted text-center">{config.goal}</p>
      <p className="font-display text-h3 text-text">Score: {score}</p>

      <div
        ref={playAreaRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="relative w-full max-w-[600px] rounded-xl overflow-hidden outline-none focus:ring-4 focus:ring-primary/40"
        style={{
          height: PLAY_HEIGHT,
          aspectRatio: `${PLAY_WIDTH} / ${PLAY_HEIGHT}`,
          backgroundColor: BACKGROUNDS[config.background],
        }}
        role="application"
        aria-label="Collector game play area"
      >
        <div
          className={`absolute select-none ${transitionClass}`}
          style={{
            left: player.x,
            top: player.y,
            fontSize: EMOJI_SIZE,
            lineHeight: `${EMOJI_SIZE}px`,
            width: EMOJI_SIZE,
            height: EMOJI_SIZE,
          }}
          aria-label="Player"
        >
          {config.player}
        </div>

        <div
          className="absolute select-none"
          style={{
            left: collectible.x,
            top: collectible.y,
            fontSize: EMOJI_SIZE,
            lineHeight: `${EMOJI_SIZE}px`,
            width: EMOJI_SIZE,
            height: EMOJI_SIZE,
          }}
          aria-label="Collectible"
        >
          {config.collectible}
        </div>

        {!isFocused && !hasWon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="rounded-lg bg-surface/90 px-3 py-1 text-label text-text">
              Click here to play
            </span>
          </div>
        )}

        {hasWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/90">
            <span style={{ fontSize: 48 }} aria-hidden>
              ✨
            </span>
            <p className="font-display text-h3 text-text">Nice work!</p>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-primary px-4 py-2 text-label text-white shadow-md min-h-[32px]"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={reset}
        className="text-label text-text-muted hover:text-text min-h-[32px] px-3"
      >
        Restart
      </button>
    </div>
  );
}

export default CollectorGame;
