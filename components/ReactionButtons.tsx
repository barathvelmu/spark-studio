"use client";

import { useEffect, useState, useCallback } from "react";
import type { Reaction } from "@/lib/types";

type ReactionDef = {
  id: Reaction;
  emoji: string;
  label: string;
};

const REACTIONS: ReactionDef[] = [
  { id: "inspired_me", emoji: "💡", label: "Inspired me" },
  { id: "i_remixed_this", emoji: "🔁", label: "I remixed this" },
  { id: "cool_idea", emoji: "✨", label: "Cool idea" },
  { id: "great_design", emoji: "🎨", label: "Great design" },
  { id: "smart_logic", emoji: "🧠", label: "Smart logic" },
  { id: "i_learned_from_this", emoji: "📚", label: "I learned from this" },
];

const COUNTS_KEY = "spark.reactions.counts.v1";
const MINE_KEY = "spark.reactions.mine.v1";

type CountMap = Record<string, number>;
type MineMap = Record<string, true>;

function loadCounts(): CountMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COUNTS_KEY);
    return raw ? (JSON.parse(raw) as CountMap) : {};
  } catch {
    return {};
  }
}

function loadMine(): MineMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(MINE_KEY);
    return raw ? (JSON.parse(raw) as MineMap) : {};
  } catch {
    return {};
  }
}

function persist<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // non-fatal
  }
}

export type ReactionButtonsProps = {
  projectId: string;
  className?: string;
};

export function ReactionButtons({ projectId, className = "" }: ReactionButtonsProps) {
  const [counts, setCounts] = useState<CountMap>({});
  const [mine, setMine] = useState<MineMap>({});
  const [bumping, setBumping] = useState<string | null>(null);

  useEffect(() => {
    setCounts(loadCounts());
    setMine(loadMine());
  }, []);

  const keyFor = useCallback(
    (reactionId: Reaction) => `${projectId}:${reactionId}`,
    [projectId]
  );

  function toggle(reactionId: Reaction) {
    const k = keyFor(reactionId);
    setMine((prevMine) => {
      const isOn = !!prevMine[k];
      const nextMine: MineMap = { ...prevMine };
      if (isOn) delete nextMine[k];
      else nextMine[k] = true;
      persist(MINE_KEY, nextMine);

      setCounts((prevCounts) => {
        const nextCounts: CountMap = { ...prevCounts };
        const cur = nextCounts[k] ?? 0;
        nextCounts[k] = Math.max(0, cur + (isOn ? -1 : 1));
        persist(COUNTS_KEY, nextCounts);
        return nextCounts;
      });

      return nextMine;
    });

    setBumping(reactionId);
    window.setTimeout(() => setBumping((cur) => (cur === reactionId ? null : cur)), 220);
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="Reactions">
      {REACTIONS.map((r) => {
        const k = keyFor(r.id);
        const isActive = !!mine[k];
        const count = counts[k] ?? 0;
        const isBumping = bumping === r.id;
        return (
          <button
            key={r.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => toggle(r.id)}
            className={[
              "inline-flex items-center gap-2 h-9 px-4 rounded-pill text-label font-semibold transition-all duration-200 ease-spring",
              isActive
                ? "bg-primary-soft text-primary"
                : "bg-transparent text-text-muted hover:bg-surface-muted hover:text-text",
              isBumping ? "scale-110" : "scale-100",
            ].join(" ")}
          >
            <span aria-hidden="true">{r.emoji}</span>
            <span>{r.label}</span>
            {count > 0 ? (
              <span
                className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-pill text-tiny ${
                  isActive ? "bg-primary text-white" : "bg-surface-muted text-text-muted"
                }`}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
