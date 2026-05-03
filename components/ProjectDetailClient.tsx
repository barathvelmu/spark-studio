"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CodeFile } from "@/components/CodeView";
import { CodeView } from "@/components/CodeView";
import { CollectorGame } from "@/components/templates/CollectorGame";
import { QuizGame } from "@/components/templates/QuizGame";
import { StoryGame } from "@/components/templates/StoryGame";
import { AskTheCodePanel } from "@/components/AskTheCodePanel";
import { TinkerMode } from "@/components/TinkerMode";
import type { TinkerFile } from "@/lib/tinker";
import { RemixModal } from "@/components/RemixModal";
import { SafetyBadge } from "@/components/SafetyBadge";
import { LineageView } from "@/components/LineageView";
import { LineageTree } from "@/components/LineageTree";
import { ConceptChip } from "@/components/ConceptChip";
import { ReactionButtons } from "@/components/ReactionButtons";
import { getProject, publishProject } from "@/lib/projectStore";
import { getProjectById, resolveCreator } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import type { CollectorGameConfig, Project, QuizGameConfig, StoryGameConfig } from "@/lib/types";

type Tab = "play" | "code" | "learn";

export function ProjectDetailClient({ projectId }: { projectId: string }) {
  // Initialize from seed (SSR-safe). useEffect then overrides with any localStorage version.
  const [project, setProject] = useState<Project | undefined>(() => getProjectById(projectId));
  const [tab, setTab] = useState<Tab>("play");
  const [activeFile, setActiveFile] = useState<CodeFile>("js");
  const [highlight, setHighlight] = useState<{ file: CodeFile; lines: number[] } | undefined>(undefined);
  const [remixOpen, setRemixOpen] = useState(false);
  const [tinkered, setTinkered] = useState<{ html?: string; css?: string; js?: string }>({});
  const { account, isSignedIn, requireAuth } = useAuth();
  const { show } = useToast();

  function handlePublish() {
    if (!project || project.published) return;
    const doPublish = () => {
      const updated = publishProject(project.id);
      if (updated) {
        setProject(updated);
        show({
          variant: "success",
          title: "Nice one! It's live on Discover.",
          body: "Other kids can now play and remix your project.",
        });
      }
    };
    if (!isSignedIn) {
      requireAuth({ reason: "publish", onSuccess: doPublish });
      return;
    }
    doPublish();
  }

  const canPublish =
    project !== undefined &&
    !project.published &&
    (!isSignedIn || (account !== undefined && account.id === project.creatorId));
  const showingPublishedPill =
    project !== undefined &&
    project.published &&
    isSignedIn &&
    account !== undefined &&
    account.id === project.creatorId;

  useEffect(() => {
    const stored = getProject(projectId);
    if (stored) setProject(stored);
  }, [projectId]);

  useEffect(() => {
    setTinkered({});
  }, [projectId]);

  if (!project) {
    return (
      <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
        <div className="bg-surface rounded-xl shadow-md p-9 text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="font-display text-h2 mb-2">We couldn't find that project.</h1>
          <p className="text-body text-text-muted mb-6">It might have been removed, or the link is off.</p>
          <Link
            href="/discover"
            className="inline-flex items-center bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-12 px-6 shadow-md transition-all"
          >
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const creator = resolveCreator(project.creatorId);

  const effectiveProject: Project = {
    ...project,
    codeHtml: tinkered.html ?? project.codeHtml,
    codeCss: tinkered.css ?? project.codeCss,
    codeJs: tinkered.js ?? project.codeJs,
  };

  function applyEdit(file: TinkerFile, before: string, after: string) {
    const current =
      file === "js"
        ? effectiveProject.codeJs
        : file === "css"
        ? effectiveProject.codeCss
        : effectiveProject.codeHtml;
    if (!current.includes(before)) return;
    const next = current.replace(before, after);
    setTinkered((prev) => ({ ...prev, [file]: next }));
  }

  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <SafetyBadge />
          <LineageView forkedFromProjectId={project.forkedFromProjectId} />
        </div>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-display text-h1 mb-2">{project.title}</h1>
            <p className="text-body text-text-muted max-w-2xl mb-3">{project.description}</p>
            {creator && (
              <p className="text-body-sm text-text-muted">
                <span className="mr-1">{creator.emoji}</span>
                by{" "}
                <Link
                  href={`/u/${creator.handle}`}
                  className="font-bold text-text hover:text-primary transition-colors"
                >
                  @{creator.handle}
                </Link>
                {" · "}
                <span>🌱 {project.remixCount} remixes</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {canPublish ? (
              <button
                type="button"
                onClick={handlePublish}
                className="bg-surface text-text border-[1.5px] border-border-strong hover:border-primary hover:bg-primary-soft font-bold rounded-lg h-12 px-6 transition-all"
              >
                🚀 Publish to Discover
              </button>
            ) : null}
            {showingPublishedPill ? (
              <span className="inline-flex items-center gap-2 rounded-pill bg-success-soft text-success px-4 h-10 text-label font-semibold">
                <span aria-hidden="true">✅</span>
                On Discover
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setRemixOpen(true)}
              className="bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-12 px-6 shadow-md transition-all"
            >
              🔁 Remix this
            </button>
          </div>
        </div>
      </header>

      <LineageTree projectId={project.id} />

      {/* Tabs */}
      <div className="bg-surface-muted rounded-pill p-1 inline-flex mb-6">
        {(["play", "code", "learn"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={
                "rounded-pill px-5 h-10 text-label font-semibold transition-all capitalize " +
                (active ? "bg-surface shadow-sm text-text" : "text-text-muted hover:text-text")
              }
            >
              {t}
            </button>
          );
        })}
      </div>

      {tab === "play" && <PlayTab project={effectiveProject} />}
      {tab === "code" && (
        <CodeTab
          project={effectiveProject}
          activeFile={activeFile}
          onActiveFile={setActiveFile}
          highlight={highlight}
          onHighlight={setHighlight}
          applyEdit={applyEdit}
        />
      )}
      {tab === "learn" && <LearnTab project={effectiveProject} />}

      <RemixModal parent={project} open={remixOpen} onClose={() => setRemixOpen(false)} />
    </div>
  );
}

function PlayTab({ project }: { project: Project }) {
  if (project.projectType === "collector_game") {
    return (
      <div className="bg-surface rounded-xl shadow-md p-7">
        <CollectorGame config={project.config as CollectorGameConfig} />
      </div>
    );
  }
  if (project.projectType === "quiz_game") {
    return (
      <div className="bg-surface rounded-xl shadow-md p-7">
        <QuizGame config={project.config as QuizGameConfig} />
      </div>
    );
  }
  if (project.projectType === "story") {
    return (
      <div className="bg-surface rounded-xl shadow-md p-7">
        <StoryGame config={project.config as StoryGameConfig} />
      </div>
    );
  }
  return (
    <div className="bg-surface rounded-xl shadow-md p-9 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <p className="text-body text-text-muted">This template is coming soon. For now check the Code and Learn tabs.</p>
    </div>
  );
}

function CodeTab({
  project,
  activeFile,
  onActiveFile,
  highlight,
  onHighlight,
  applyEdit,
}: {
  project: Project;
  activeFile: CodeFile;
  onActiveFile: (f: CodeFile) => void;
  highlight: { file: CodeFile; lines: number[] } | undefined;
  onHighlight: (h: { file: CodeFile; lines: number[] }) => void;
  applyEdit: (file: TinkerFile, before: string, after: string) => void;
}) {
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <div className="space-y-6">
        <div className="bg-surface rounded-xl shadow-md p-6">
          <CodeView
            codeHtml={project.codeHtml}
            codeCss={project.codeCss}
            codeJs={project.codeJs}
            activeFile={activeFile}
            onActiveFileChange={onActiveFile}
            highlightLines={highlight}
            onAskAboutLine={(file, line) => {
              onHighlight({ file, lines: [line] });
            }}
          />
        </div>
        <TinkerMode
          project={project}
          applyEdit={applyEdit}
          onLookHere={(file, lines) => {
            onActiveFile(file);
            onHighlight({ file, lines });
          }}
        />
      </div>
      <AskTheCodePanel
        project={project}
        onLookHere={(file, lines) => {
          onActiveFile(file);
          onHighlight({ file, lines });
        }}
      />
    </div>
  );
}

function LearnTab({ project }: { project: Project }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="bg-surface rounded-xl shadow-md p-7">
        <h2 className="font-display text-h3 mb-3">What changed</h2>
        <ul className="space-y-2 text-body">
          {project.changeSummary.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-success">✓</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface rounded-xl shadow-md p-7">
        <h2 className="font-display text-h3 mb-3">Concepts</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.concepts.map((c) => (
            <ConceptChip key={c} concept={c} />
          ))}
        </div>
        <p className="text-body text-text">{project.learningSummary}</p>
      </section>

      <section className="bg-primary-soft rounded-xl p-7 lg:col-span-2">
        <h2 className="font-display text-h3 mb-2">Next challenge</h2>
        <p className="text-body text-text mb-5">{project.nextChallenge}</p>
        <ReactionButtons projectId={project.id} />
      </section>
    </div>
  );
}

export default ProjectDetailClient;
