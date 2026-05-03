"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import { buildLineage, lineageHasChain, type Lineage } from "@/lib/lineage";
import { getAllProjects } from "@/lib/projectStore";
import { getUserById, projects as seedProjects } from "@/lib/mockData";

type Variant = "ancestor" | "current" | "child";

export function LineageTree({ projectId }: { projectId: string }) {
  // SSR-safe: start from seed; useEffect overrides with localStorage view.
  const [lineage, setLineage] = useState<Lineage | undefined>(() => buildLineage(projectId, seedProjects));

  useEffect(() => {
    const all = getAllProjects();
    setLineage(buildLineage(projectId, all));
  }, [projectId]);

  if (!lineage || !lineageHasChain(lineage)) return null;

  const totalRemixes = lineage.ancestors.length + lineage.children.length;

  return (
    <section className="bg-surface rounded-xl shadow-md p-7 mb-6">
      <div className="flex items-baseline justify-between mb-1 gap-3 flex-wrap">
        <h2 className="font-display text-h3">Remix lineage</h2>
        <span className="text-tiny font-semibold text-text-muted">
          🌱 {totalRemixes} {totalRemixes === 1 ? "connection" : "connections"} in this chain
        </span>
      </div>
      <p className="text-body-sm text-text-muted mb-6">
        How this project connects to the community of remixers.
      </p>

      <div className="flex flex-col items-center gap-3">
        {lineage.ancestors.map((p) => (
          <Fragment key={p.id}>
            <Node project={p} variant="ancestor" />
            <Arrow />
          </Fragment>
        ))}

        <Node project={lineage.current} variant="current" />

        {lineage.children.length > 0 && (
          <>
            <Arrow />
            <div className="flex flex-wrap justify-center gap-3">
              {lineage.children.map((c) => (
                <Node key={c.id} project={c} variant="child" />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <span aria-hidden="true" className="text-text-subtle text-2xl leading-none select-none">
      ↓
    </span>
  );
}

function Node({ project, variant }: { project: Project; variant: Variant }) {
  const creator = getUserById(project.creatorId);
  const isCurrent = variant === "current";

  const cardClass =
    "rounded-xl px-5 py-4 flex items-center gap-4 transition-all min-w-[260px] max-w-[420px] " +
    (isCurrent
      ? "bg-primary-soft border-2 border-primary shadow-sm"
      : "bg-surface-muted border-2 border-transparent hover:bg-primary-soft hover:border-primary cursor-pointer");

  const inner = (
    <div className={cardClass}>
      <div className="text-3xl flex-shrink-0">{getProjectEmoji(project)}</div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-body text-text truncate">{project.title}</div>
        {creator && (
          <div className="text-tiny text-text-muted truncate">
            <span className="mr-1" aria-hidden="true">
              {creator.emoji}
            </span>
            by @{creator.handle}
            {project.remixCount > 0 ? ` · 🌱 ${project.remixCount}` : ""}
          </div>
        )}
      </div>
      {isCurrent && (
        <span className="text-tiny font-semibold text-primary uppercase tracking-wide whitespace-nowrap">
          You are here
        </span>
      )}
    </div>
  );

  if (isCurrent) return inner;
  return (
    <Link href={`/project/${project.id}`} className="block">
      {inner}
    </Link>
  );
}

function getProjectEmoji(p: Project): string {
  if (p.projectType === "collector_game" && "player" in p.config) return p.config.player;
  if (p.projectType === "quiz_game") return "❓";
  if (p.projectType === "story") return "📖";
  return "✨";
}

export default LineageTree;
