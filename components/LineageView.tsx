import Link from "next/link";
import { getProjectById, getUserById } from "@/lib/mockData";

export type LineageViewProps = {
  forkedFromProjectId?: string;
  className?: string;
};

export function LineageView({ forkedFromProjectId, className = "" }: LineageViewProps) {
  if (!forkedFromProjectId) return null;
  const parent = getProjectById(forkedFromProjectId);
  if (!parent) return null;
  const creator = getUserById(parent.creatorId);

  return (
    <Link
      href={`/project/${parent.id}`}
      className={`inline-flex items-center gap-2 rounded-pill bg-surface-muted hover:bg-primary-soft text-text-muted hover:text-primary transition-colors px-3 h-8 text-tiny font-semibold ${className}`}
    >
      <span aria-hidden="true">🔁</span>
      <span>Forked from</span>
      {creator ? (
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-pill bg-surface text-tiny"
          aria-hidden="true"
          title={`@${creator.handle}`}
        >
          {creator.emoji}
        </span>
      ) : null}
      <span className="text-text font-bold">{parent.title}</span>
    </Link>
  );
}
