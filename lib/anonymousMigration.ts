// One-shot migration that runs immediately after a brand-new account is created.
// Reattributes legacy anonymous local-only data (created before sign-up) to the
// new account so the user doesn't lose their work.

import type { Project } from "./types";

const PROJECTS_KEY = "spark.projects.v1";
const SAVED_IDEAS_KEY = "spark.saved_ideas.v1";
const REACTIONS_MINE_KEY = "spark.reactions.mine.v1";

const ANON_SENTINEL = "__anon__";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // non-fatal
  }
}

// Reattribute legacy projects whose creatorId was the anonymous sentinel.
function migrateProjects(accountId: string): void {
  const projects = readJson<Project[]>(PROJECTS_KEY);
  if (!projects || !Array.isArray(projects)) return;
  let changed = false;
  const next = projects.map((p) => {
    if (p.creatorId === ANON_SENTINEL) {
      changed = true;
      return { ...p, creatorId: accountId };
    }
    return p;
  });
  if (changed) writeJson(PROJECTS_KEY, next);
}

// Saved ideas pre-auth were stored as a flat string[] under spark.saved_ideas.v1.
// New format is per-account: { [accountId]: string[] }.
// On migration: if the legacy flat array exists, move it into the namespaced map
// for this account.
type SavedIdeasShape = string[] | Record<string, string[]>;

function isLegacySavedIdeas(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function migrateSavedIdeas(accountId: string): void {
  const cur = readJson<SavedIdeasShape>(SAVED_IDEAS_KEY);
  if (!cur) return;
  if (isLegacySavedIdeas(cur)) {
    const next: Record<string, string[]> = { [accountId]: cur };
    writeJson(SAVED_IDEAS_KEY, next);
    return;
  }
  // Already namespaced — see if there's an anonymous bucket to merge.
  if (typeof cur === "object" && !Array.isArray(cur)) {
    const map = cur as Record<string, string[]>;
    const anon = map[ANON_SENTINEL];
    if (anon && anon.length > 0) {
      const merged = Array.from(new Set([...(map[accountId] ?? []), ...anon]));
      map[accountId] = merged;
      delete map[ANON_SENTINEL];
      writeJson(SAVED_IDEAS_KEY, map);
    }
  }
}

// Reactions pre-auth were stored as a flat { [projectId:reactionId]: true }.
// New format is per-account: { [accountId]: { [projectId:reactionId]: true } }.
type ReactionsShape = Record<string, true> | Record<string, Record<string, true>>;

function isLegacyReactions(v: unknown): v is Record<string, true> {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  return Object.values(v as Record<string, unknown>).every((x) => x === true);
}

function migrateReactions(accountId: string): void {
  const cur = readJson<ReactionsShape>(REACTIONS_MINE_KEY);
  if (!cur) return;
  if (isLegacyReactions(cur)) {
    const next: Record<string, Record<string, true>> = { [accountId]: cur };
    writeJson(REACTIONS_MINE_KEY, next);
    return;
  }
  if (typeof cur === "object" && !Array.isArray(cur)) {
    const map = cur as Record<string, Record<string, true>>;
    const anon = map[ANON_SENTINEL];
    if (anon && Object.keys(anon).length > 0) {
      const merged: Record<string, true> = { ...(map[accountId] ?? {}), ...anon };
      map[accountId] = merged;
      delete map[ANON_SENTINEL];
      writeJson(REACTIONS_MINE_KEY, map);
    }
  }
}

export function migrateAnonymousData(accountId: string): void {
  if (!isBrowser()) return;
  migrateProjects(accountId);
  migrateSavedIdeas(accountId);
  migrateReactions(accountId);
}
