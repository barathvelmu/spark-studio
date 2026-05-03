"use client";

import type { Project, ProjectConfig } from "./types";
import { projects as seedProjects, getProjectById as seedGet } from "./mockData";

const STORAGE_KEY = "spark.projects.v1";

const seedIds = new Set(seedProjects.map((p) => p.id));

// Older stored rows may pre-date the `published` field. Treat seed ids as
// published (since we ship them on Discover) and user-created rows as drafts
// until they explicitly publish.
function normalize(project: Project): Project {
  if (typeof project.published === "boolean") return project;
  return { ...project, published: seedIds.has(project.id) };
}

function loadFromStorage(): Project[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Project[];
    return parsed.map(normalize);
  } catch {
    return null;
  }
}

function saveToStorage(list: Project[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage full or unavailable — non-fatal
  }
}

export function getAllProjects(): Project[] {
  const stored = loadFromStorage();
  if (stored && stored.length > 0) return stored;
  return seedProjects;
}

export function getProject(id: string): Project | undefined {
  const stored = loadFromStorage();
  if (stored) {
    const hit = stored.find((p) => p.id === id);
    if (hit) return hit;
  }
  return seedGet(id);
}

export function saveProject(project: Project): void {
  const list = loadFromStorage() ?? [...seedProjects];
  const idx = list.findIndex((p) => p.id === project.id);
  if (idx >= 0) list[idx] = project;
  else list.unshift(project);
  saveToStorage(list);
}

export function createProject(input: Omit<Project, "id" | "createdAt" | "remixCount">): Project {
  const project: Project = {
    ...input,
    id: `p_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    remixCount: 0,
  };
  saveProject(project);
  return project;
}

export function remixProject(parentId: string, overrides: Partial<Project> & { config: ProjectConfig }): Project | undefined {
  const parent = getProject(parentId);
  if (!parent) return undefined;
  const child: Project = {
    ...parent,
    ...overrides,
    id: `p_${Math.random().toString(36).slice(2, 9)}`,
    forkedFromProjectId: parent.id,
    createdAt: new Date().toISOString(),
    remixCount: 0,
    published: false,
  };
  saveProject(child);
  // bump parent remix count
  const parentUpdated: Project = { ...parent, remixCount: parent.remixCount + 1 };
  saveProject(parentUpdated);
  return child;
}

export function publishProject(id: string): Project | undefined {
  const project = getProject(id);
  if (!project) return undefined;
  if (project.published) return project;
  const updated: Project = { ...project, published: true };
  saveProject(updated);
  return updated;
}

export function clearStore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
