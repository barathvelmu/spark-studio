"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getIdeaById } from "@/lib/mockData";
import { generateProjectDraft } from "@/lib/templateGenerator";
import { createProject } from "@/lib/projectStore";
import type { ProjectType } from "@/lib/types";

type SelectableType = "auto" | "collector_game" | "quiz_game" | "story";

const typeOptions: Array<{ value: SelectableType; label: string; emoji: string }> = [
  { value: "auto", label: "Auto", emoji: "✨" },
  { value: "collector_game", label: "Game", emoji: "🎮" },
  { value: "quiz_game", label: "Quiz", emoji: "❓" },
  { value: "story", label: "Story", emoji: "📖" },
];

export default function BuilderPage() {
  return (
    <Suspense fallback={<BuilderSkeleton />}>
      <BuilderInner />
    </Suspense>
  );
}

function BuilderSkeleton() {
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <div className="h-10 w-72 bg-surface-muted rounded-md mb-2 animate-pulse" />
      <div className="h-5 w-96 bg-surface-muted rounded-md mb-8 animate-pulse" />
      <div className="grid lg:grid-cols-[360px_1fr] gap-7">
        <div className="bg-surface rounded-xl shadow-md p-7 h-[360px] animate-pulse" />
        <div className="bg-surface rounded-xl shadow-md p-7 h-[400px] animate-pulse" />
      </div>
    </div>
  );
}

function BuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("ideaId");
  const idea = useMemo(() => (ideaId ? getIdeaById(ideaId) : undefined), [ideaId]);

  const [prompt, setPrompt] = useState(idea?.description ?? "");
  const initialType: SelectableType =
    idea && idea.suggestedProjectType !== "clicker" ? idea.suggestedProjectType : "auto";
  const [projectType, setProjectType] = useState<SelectableType>(initialType);
  const [isBuilding, setIsBuilding] = useState(false);
  const autoBuildRef = useRef(false);

  function handleGenerate() {
    if (isBuilding || !prompt.trim()) return;
    setIsBuilding(true);
    const resolvedType: ProjectType | "auto" = projectType;
    setTimeout(() => {
      const draft = generateProjectDraft({
        prompt,
        projectType: resolvedType,
        originalIdeaId: idea?.id,
      });
      const project = createProject(draft);
      router.push(`/project/${project.id}`);
    }, 600);
  }

  useEffect(() => {
    if (idea && !autoBuildRef.current) {
      autoBuildRef.current = true;
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea]);

  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <h1 className="font-display text-h1 mb-2">What do you want to make?</h1>
      <p className="text-body text-text-muted mb-8">
        Describe an idea and we'll turn it into a playable mini-project.
      </p>

      <div className="grid lg:grid-cols-[360px_1fr] gap-7">
        <section className="bg-surface rounded-xl shadow-md p-7">
          <label className="block text-body-sm font-semibold mb-2" htmlFor="builder-prompt">
            Your idea
          </label>
          <textarea
            id="builder-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A turtle collects plastic from the ocean…"
            className="w-full min-h-[120px] bg-surface-muted rounded-md p-4 text-body resize-y focus:bg-surface focus:outline-none border-[1.5px] border-transparent focus:border-primary transition-colors"
            disabled={isBuilding}
          />

          <label className="block text-body-sm font-semibold mt-6 mb-2">Project type</label>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((opt) => {
              const active = projectType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setProjectType(opt.value)}
                  disabled={isBuilding}
                  className={
                    "rounded-pill px-5 h-9 text-label font-semibold transition-all " +
                    (active
                      ? "bg-primary-soft text-primary"
                      : "bg-surface-muted text-text-muted hover:text-text")
                  }
                >
                  <span className="mr-1">{opt.emoji}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isBuilding || !prompt.trim()}
            className="mt-7 w-full bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-12 shadow-md disabled:bg-text-subtle disabled:shadow-none transition-all"
          >
            {isBuilding ? "Building your project…" : "Generate"}
          </button>
        </section>

        <section className="bg-surface rounded-xl shadow-md p-7 min-h-[400px] flex items-center justify-center">
          {isBuilding ? (
            <BuildingDots />
          ) : (
            <div className="text-center">
              <div className="text-7xl mb-6">{idea?.emoji ?? "✨"}</div>
              <p className="text-body text-text-muted max-w-md">
                {idea
                  ? `Building "${idea.title}"…`
                  : "Your project preview will show up here once you tap Generate."}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function BuildingDots() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <span className="w-3 h-3 rounded-pill bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-3 h-3 rounded-pill bg-primary animate-bounce" style={{ animationDelay: "120ms" }} />
        <span className="w-3 h-3 rounded-pill bg-primary animate-bounce" style={{ animationDelay: "240ms" }} />
      </div>
      <p className="text-body text-text-muted">Building your project…</p>
    </div>
  );
}
