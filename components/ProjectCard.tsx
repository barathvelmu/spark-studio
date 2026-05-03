import Link from "next/link";
import type { Project, GradientPreset } from "@/lib/types";
import { resolveCreator } from "@/lib/mockData";
import { ConceptChip } from "./ConceptChip";
import { SafetyBadge } from "./SafetyBadge";
import { Chip } from "./ui/Chip";

const GRADIENTS: Record<GradientPreset, string> = {
  indigo: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
  sky: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
  mint: "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)",
  peach: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
  lavender: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)",
};

function thumbnailEmojiFor(project: Project): string {
  if (project.projectType === "collector_game") {
    const cfg = project.config as { player?: string };
    return cfg.player ?? "🎮";
  }
  if (project.projectType === "quiz_game") return "🧠";
  if (project.projectType === "story") return "📖";
  return "✨";
}

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

const MAX_VISIBLE_CONCEPTS = 3;

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const creator = resolveCreator(project.creatorId);
  const visibleConcepts = project.concepts.slice(0, MAX_VISIBLE_CONCEPTS);
  const overflowCount = project.concepts.length - visibleConcepts.length;

  return (
    <article
      className={[
        "group relative bg-surface rounded-xl shadow-md overflow-hidden",
        "transition-all duration-200 ease-smooth",
        "hover:shadow-lg hover:-translate-y-0.5",
        className,
      ].join(" ")}
    >
      <Link
        href={`/project/${project.id}`}
        className="block focus:outline-none focus-visible:ring-0"
        aria-label={`Open ${project.title}`}
      >
        <div
          className="aspect-[16/9] flex items-center justify-center"
          style={{ background: GRADIENTS[project.gradient] }}
        >
          <span className="text-[96px] leading-none" aria-hidden="true">
            {thumbnailEmojiFor(project)}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/project/${project.id}`} className="block">
          <h3 className="font-display text-h3 text-text mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-body-sm text-text-muted mb-4 line-clamp-2">{project.description}</p>
        </Link>

        {project.concepts.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {visibleConcepts.map((c) => (
              <ConceptChip key={c} concept={c} />
            ))}
            {overflowCount > 0 ? <Chip variant="neutral">{`+${overflowCount}`}</Chip> : null}
          </div>
        ) : null}

        <div className="flex items-center gap-3 text-tiny text-text-muted">
          {creator ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-flex items-center justify-center w-5 h-5 rounded-pill bg-surface-muted text-tiny"
              >
                {creator.emoji}
              </span>
              <span>@{creator.handle}</span>
            </span>
          ) : null}
          <span aria-hidden="true">·</span>
          <span>
            <span aria-hidden="true">🌱</span>{" "}
            {project.remixCount === 1 ? "1 remix" : `${project.remixCount} remixes`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border">
        <SafetyBadge />
        <Link
          href={`/project/${project.id}`}
          className="inline-flex items-center justify-center h-[36px] px-5 rounded-lg text-label font-bold bg-surface border-[1.5px] border-border-strong hover:border-primary hover:bg-primary-soft text-text transition-all"
        >
          Remix
        </Link>
      </div>
    </article>
  );
}
