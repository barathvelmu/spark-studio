// Per-account saved-idea storage.
// Pre-account legacy data was a flat string[]; on first sign-up the migration
// in lib/anonymousMigration.ts moves it under the new account's bucket.

const STORAGE_KEY = "spark.saved_ideas.v1";
const ANON_BUCKET = "__anon__";

type Map = Record<string, string[]>;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readMap(): Map {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Legacy: flat string[] — treat as the anonymous bucket.
    if (Array.isArray(parsed)) {
      return { [ANON_BUCKET]: parsed.filter((x) => typeof x === "string") };
    }
    if (parsed && typeof parsed === "object") {
      const m = parsed as Record<string, unknown>;
      const out: Map = {};
      for (const [k, v] of Object.entries(m)) {
        if (Array.isArray(v)) out[k] = v.filter((x) => typeof x === "string") as string[];
      }
      return out;
    }
    return {};
  } catch {
    return {};
  }
}

function writeMap(map: Map): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // non-fatal
  }
}

function bucketFor(accountId: string | undefined): string {
  return accountId ?? ANON_BUCKET;
}

export function getSavedIdeasFor(accountId: string | undefined): Set<string> {
  const map = readMap();
  return new Set(map[bucketFor(accountId)] ?? []);
}

export function isIdeaSaved(accountId: string | undefined, ideaId: string): boolean {
  return getSavedIdeasFor(accountId).has(ideaId);
}

export function setIdeaSaved(
  accountId: string | undefined,
  ideaId: string,
  saved: boolean
): void {
  const map = readMap();
  const bucket = bucketFor(accountId);
  const cur = new Set(map[bucket] ?? []);
  if (saved) cur.add(ideaId);
  else cur.delete(ideaId);
  map[bucket] = Array.from(cur);
  writeMap(map);
}
