"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "spark.saved_ideas.v1";

function readSaved(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function writeSaved(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // non-fatal
  }
}

export type SaveIdeaButtonProps = {
  ideaId: string;
  className?: string;
};

export function SaveIdeaButton({ ideaId, className = "" }: SaveIdeaButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved().has(ideaId));
  }, [ideaId]);

  function toggle() {
    const set = readSaved();
    if (set.has(ideaId)) set.delete(ideaId);
    else set.add(ideaId);
    writeSaved(set);
    setSaved(set.has(ideaId));
  }

  const Icon = saved ? BookmarkCheck : Bookmark;

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={toggle}
      className={[
        "inline-flex items-center justify-center gap-2 h-[36px] px-4 rounded-lg text-label font-semibold transition-colors",
        saved
          ? "bg-primary-soft text-primary"
          : "bg-transparent text-text-muted hover:bg-surface-muted hover:text-text",
        className,
      ].join(" ")}
    >
      <Icon size={16} strokeWidth={2} />
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
