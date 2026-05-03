import type { Project } from "./types";

export type Lineage = {
  ancestors: Project[]; // root first, immediate parent last (excludes current)
  current: Project;
  children: Project[]; // direct children only (one generation down)
};

/**
 * Build a single chain of ancestors + a flat list of direct children for a project.
 * Cycle-safe via a visited set. Stops if a parent is missing.
 */
export function buildLineage(currentId: string, allProjects: Project[]): Lineage | undefined {
  const byId = new Map(allProjects.map((p) => [p.id, p]));
  const current = byId.get(currentId);
  if (!current) return undefined;

  const ancestors: Project[] = [];
  let cursor = current.forkedFromProjectId;
  const seen = new Set<string>([currentId]);
  while (cursor) {
    if (seen.has(cursor)) break;
    seen.add(cursor);
    const parent = byId.get(cursor);
    if (!parent) break;
    ancestors.unshift(parent);
    cursor = parent.forkedFromProjectId;
  }

  const children = allProjects.filter((p) => p.forkedFromProjectId === currentId);

  return { ancestors, current, children };
}

export function lineageHasChain(lineage: Lineage): boolean {
  return lineage.ancestors.length > 0 || lineage.children.length > 0;
}
