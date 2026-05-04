"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getIdeaById } from "@/lib/mockData";
import { generateProjectDraft } from "@/lib/templateGenerator";
import { createProject } from "@/lib/projectStore";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/lib/auth";
import type { Project, ProjectType } from "@/lib/types";

type ProjectDraft = Omit<Project, "id" | "createdAt" | "remixCount">;

type SelectableType = "auto" | "collector_game" | "quiz_game" | "story";

const typeOptions: Array<{ value: SelectableType; label: string; emoji: string }> = [
  { value: "auto", label: "Auto", emoji: "✨" },
  { value: "collector_game", label: "Game", emoji: "🎮" },
  { value: "quiz_game", label: "Quiz", emoji: "❓" },
  { value: "story", label: "Story", emoji: "📖" },
];

const EXAMPLE_PROMPTS: Array<{ label: string; emoji: string; type: SelectableType }> = [
  { label: "Ocean cleanup game", emoji: "🌊", type: "collector_game" },
  { label: "Space junk collector", emoji: "🚀", type: "collector_game" },
  { label: "Climate science quiz", emoji: "🧠", type: "quiz_game" },
  { label: "Fantasy adventure story", emoji: "🧙", type: "story" },
  { label: "Recycling hero game", emoji: "♻️", type: "collector_game" },
];

const UNSUPPORTED_PATTERNS = [
  /\bstack(ing)?\b/i, /\bplatform(er)?\b/i, /\bjump(ing)?\b/i,
  /\bshoot(er|ing)?\b/i, /\bfight(ing|er)?\b/i, /\brac(e|ing)\b/i,
  /\bgta\b/i, /\bminecraft\b/i, /\broblox\b/i, /\bfps\b/i,
  /\brpg\b/i, /\bbattle\b/i, /\bwar\b/i, /\bpuzzle\b/i,
];

function detectUnsupported(prompt: string): boolean {
  return UNSUPPORTED_PATTERNS.some((re) => re.test(prompt));
}

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
  const { account, isSignedIn, hydrated, requireAuth } = useAuth();

  const [prompt, setPrompt] = useState(idea?.description ?? "");
  const initialType: SelectableType =
    idea && idea.suggestedProjectType !== "clicker" ? idea.suggestedProjectType : "auto";
  const [projectType, setProjectType] = useState<SelectableType>(initialType);
  const [isBuilding, setIsBuilding] = useState(false);
  const autoBuildRef = useRef(false);

  async function buildWithCreator(creatorId: string, currentPrompt: string, type: SelectableType) {
    setIsBuilding(true);
    const resolvedType: ProjectType | "auto" = type;
    let draft: ProjectDraft | undefined;

    const [fetchResult] = await Promise.all([
      (async () => {
        try {
          const res = await fetch("/api/generate-project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: currentPrompt,
              projectType: resolvedType,
              ideaId: idea?.id,
              creatorId,
            }),
          });
          if (res.ok) return (await res.json()) as ProjectDraft;
        } catch {
          // fall through
        }
        return undefined;
      })(),
      // Always show the building animation for at least 1.5s so it feels like something happened.
      new Promise<void>((resolve) => setTimeout(resolve, 1500)),
    ]);

    draft = fetchResult;

    if (!draft) {
      // Offline / API failure — fall back to the deterministic template so
      // the demo keeps working without a server round-trip.
      draft = generateProjectDraft({
        prompt: currentPrompt,
        projectType: resolvedType,
        creatorId,
        originalIdeaId: idea?.id,
      });
    }

    // Always enforce the client's creatorId + a safe published default.
    const project = createProject({ ...draft, creatorId, published: false });
    router.push(`/project/${project.id}`);
  }

  function handleGenerate() {
    if (isBuilding || !prompt.trim()) return;
    const currentPrompt = prompt;
    const currentType = projectType;

    if (!isSignedIn) {
      requireAuth({
        reason: "build",
        onSuccess: (acct) => buildWithCreator(acct.id, currentPrompt, currentType),
      });
      return;
    }
    if (!account) return;
    buildWithCreator(account.id, currentPrompt, currentType);
  }

  useEffect(() => {
    // Auto-build only after auth state is hydrated, so the auth gate can fire
    // for new users coming in from the Idea Wall.
    if (idea && hydrated && !autoBuildRef.current) {
      autoBuildRef.current = true;
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea, hydrated]);

  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <h1 className="font-display text-h1 mb-2">What do you want to make?</h1>
      <p className="text-body text-text-muted mb-8">
        Describe an idea and we'll turn it into a playable mini-project.
      </p>

      <div className="grid lg:grid-cols-[360px_1fr] gap-7">
        <section className="bg-surface rounded-xl shadow-md p-7">
          <Textarea
            label="Your idea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A turtle collects plastic from the ocean…"
            disabled={isBuilding}
          />

          {/* Unsupported idea warning */}
          {detectUnsupported(prompt) && (
            <div className="mt-3 flex items-start gap-2 bg-surface-muted border border-warning rounded-lg px-4 py-3">
              <span className="text-base leading-none mt-px">🚧</span>
              <div>
                <p className="text-body-sm font-semibold text-text">That type isn't supported yet.</p>
                <p className="text-tiny text-text-muted mt-0.5">Right now we can build collector games, quizzes, and stories. More game types coming soon — try one of the examples below!</p>
              </div>
            </div>
          )}

          {/* Example prompt chips */}
          {!isBuilding && (
            <div className="mt-4">
              <p className="text-tiny text-text-muted font-semibold uppercase tracking-wide mb-2">Try one of these</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => { setPrompt(ex.label); setProjectType(ex.type); }}
                    className="rounded-pill bg-surface-muted hover:bg-primary-soft hover:text-primary text-text-muted text-tiny font-semibold px-3 h-7 transition-colors"
                  >
                    {ex.emoji} {ex.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            isLoading={isBuilding}
            variant="primary"
            size="lg"
            fullWidth
            className="mt-7"
          >
            {isBuilding ? "Building your project…" : "Generate"}
          </Button>
          {!isSignedIn && hydrated ? (
            <p className="text-tiny text-text-muted mt-3 text-center">
              We'll set up a quick account when you tap Generate. No password needed.
            </p>
          ) : null}
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
