"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import type { TinkerFile, TinkerSuggestion } from "@/lib/tinker";

export type TinkerModeProps = {
  project: Project;
  applyEdit: (file: TinkerFile, before: string, after: string) => void;
  onLookHere?: (file: TinkerFile, lines: number[]) => void;
};

type Mode = "idle" | "loading" | "suggestion" | "applied" | "none";

export function TinkerMode({ project, applyEdit, onLookHere }: TinkerModeProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [suggestion, setSuggestion] = useState<TinkerSuggestion | undefined>(undefined);

  async function suggest() {
    setMode("loading");
    setSuggestion(undefined);
    try {
      const res = await fetch("/api/tinker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          project: {
            id: project.id,
            title: project.title,
            codeHtml: project.codeHtml,
            codeCss: project.codeCss,
            codeJs: project.codeJs,
          },
        }),
      });
      if (res.status === 404) {
        setMode("none");
        return;
      }
      if (!res.ok) {
        setMode("none");
        return;
      }
      const data = (await res.json()) as TinkerSuggestion;
      setSuggestion(data);
      setMode("suggestion");
    } catch {
      setMode("none");
    }
  }

  function onApply() {
    if (!suggestion) return;
    applyEdit(suggestion.file, suggestion.before, suggestion.after);
    onLookHere?.(suggestion.file, suggestion.highlightLines ?? []);
    setMode("applied");
  }

  function onSkip() {
    setSuggestion(undefined);
    setMode("idle");
  }

  return (
    <div className="bg-surface rounded-xl shadow-md p-6">
      <div className="mb-4">
        <h3 className="font-display text-h3">Tinker mode</h3>
        <p className="text-body-sm text-text-muted">
          Get a tiny suggested change you can try.
        </p>
      </div>

      {mode === "idle" && <SuggestButton onClick={suggest} />}

      {mode === "loading" && (
        <div className="flex items-center gap-3 py-4">
          <div className="flex gap-2">
            <span
              className="w-2 h-2 rounded-pill bg-primary animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 rounded-pill bg-primary animate-bounce"
              style={{ animationDelay: "120ms" }}
            />
            <span
              className="w-2 h-2 rounded-pill bg-primary animate-bounce"
              style={{ animationDelay: "240ms" }}
            />
          </div>
          <p className="text-body-sm text-text-muted">Thinking…</p>
        </div>
      )}

      {mode === "suggestion" && suggestion && (
        <div>
          <div className="text-tiny font-semibold text-text-muted uppercase tracking-wide mb-2">
            Suggested change
          </div>
          <div className="text-h4 mb-3">{suggestion.summary}</div>
          <div className="mb-4">
            <span className="bg-primary-soft text-primary rounded-pill px-3 h-6 text-tiny font-semibold inline-flex items-center">
              {suggestion.concept}
            </span>
          </div>
          <div className="bg-surface-muted rounded-md p-3 mb-3 font-mono text-body-sm space-y-1">
            <div className="text-danger line-through break-all">- {suggestion.before}</div>
            <div className="text-success break-all">+ {suggestion.after}</div>
          </div>
          <p className="text-body-sm text-text-muted mb-5">{suggestion.explanation}</p>
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={onApply}
              className="bg-primary hover:bg-primary-hover text-white rounded-lg h-10 px-5 font-bold shadow-md transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="text-text-muted hover:text-text font-semibold"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {mode === "applied" && (
        <div>
          <div className="text-success text-body-sm font-semibold mb-4">
            ✓ Applied! Check the highlighted line.
          </div>
          <SuggestButton onClick={suggest} label="✨ Suggest another tinker" />
        </div>
      )}

      {mode === "none" && (
        <div>
          <p className="text-body-sm text-text-muted mb-4">
            🤔 Nothing to tinker with right now.
          </p>
          <SuggestButton onClick={suggest} />
        </div>
      )}
    </div>
  );
}

function SuggestButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-primary hover:bg-primary-hover text-white rounded-lg h-10 px-5 font-bold shadow-md transition-colors"
    >
      {label ?? "✨ Suggest a tinker"}
    </button>
  );
}

export default TinkerMode;
