"use client";

import { useEffect, useState, useCallback } from "react";
import type { Reaction } from "@/lib/types";
import { useAuth } from "@/lib/auth";

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
const ANON_BUCKET = "__anon__";

type CountMap = Record<string, number>;
type MineMap = Record<string, true>;
type MineByAccount = Record<string, MineMap>;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function loadCounts(): CountMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(COUNTS_KEY);
    return raw ? (JSON.parse(raw) as CountMap) : {};
  } catch {
    return {};
  }
}

function isLegacyMine(v: unknown): v is MineMap {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  return Object.values(v as Record<string, unknown>).every((x) => x === true);
}

function loadMineMap(): MineByAccount {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(MINE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (isLegacyMine(parsed)) {
      return { [ANON_BUCKET]: parsed };
    }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as MineByAccount;
    }
    return {};
  } catch {
    return {};
  }
}

function persist<T>(key: string, value: T) {
  if (!isBrowser()) return;
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
  const { account, hydrated, requireAuth } = useAuth();
  const [counts, setCounts] = useState<CountMap>({});
  const [mine, setMine] = useState<MineMap>({});
  const [bumping, setBumping] = useState<string | null>(null);

  const bucket = account?.id ?? ANON_BUCKET;

  useEffect(() => {
    if (!hydrated) return;
    setCounts(loadCounts());
    const map = loadMineMap();
    setMine(map[bucket] ?? {});
  }, [hydrated, bucket]);

  const keyFor = useCallback(
    (reactionId: Reaction) => `${projectId}:${reactionId}`,
    [projectId]
  );

  function applyToggle(reactionId: Reaction, accountId: string) {
    const k = keyFor(reactionId);
    const map = loadMineMap();
    const myMap: MineMap = { ...(map[accountId] ?? {}) };
    const isOn = !!myMap[k];
    if (isOn) delete myMap[k];
    else myMap[k] = true;
    map[accountId] = myMap;
    persist(MINE_KEY, map);
    setMine(myMap);

    const nextCounts: CountMap = { ...loadCounts() };
    const cur = nextCounts[k] ?? 0;
    nextCounts[k] = Math.max(0, cur + (isOn ? -1 : 1));
    persist(COUNTS_KEY, nextCounts);
    setCounts(nextCounts);

    setBumping(reactionId);
    window.setTimeout(() => setBumping((c) => (c === reactionId ? null : c)), 220);
  }

  function toggle(reactionId: Reaction) {
    if (!account) {
      requireAuth({
        reason: "sign_in",
        onSuccess: (acct) => applyToggle(reactionId, acct.id),
      });
      return;
    }
    applyToggle(reactionId, account.id);
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
              "inline-flex items-center gap-2 h-[36px] px-4 rounded-pill text-label font-semibold transition-all duration-200 ease-spring",
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
                className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-pill text-tiny ${
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
