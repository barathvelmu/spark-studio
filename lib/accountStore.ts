import type { Account } from "./types";

const ACCOUNTS_KEY = "spark.accounts.v1";
const SESSION_KEY = "spark.session.v1";
const CODES_KEY = "spark.email_codes.v1";

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type Session = { accountId: string };

type PendingCode = { code: string; expiresAt: number };

type CodeMap = Record<string, PendingCode>;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ---------- Accounts ----------

export function loadAccounts(): Account[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Account[]) : [];
  } catch {
    return [];
  }
}

function saveAccounts(list: Account[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    // localStorage full or unavailable — non-fatal
  }
}

export function findAccountByEmail(email: string): Account | undefined {
  const norm = normalizeEmail(email);
  return loadAccounts().find((a) => a.email === norm);
}

export function findAccountById(id: string): Account | undefined {
  return loadAccounts().find((a) => a.id === id);
}

export function findAccountByHandle(handle: string): Account | undefined {
  const norm = handle.trim().toLowerCase();
  return loadAccounts().find((a) => a.handle === norm);
}

export function getTakenHandles(): Set<string> {
  return new Set(loadAccounts().map((a) => a.handle));
}

export type CreateAccountInput = {
  email: string;
  handle: string;
  emoji: string;
};

export function createAccount(input: CreateAccountInput): Account {
  const list = loadAccounts();
  const account: Account = {
    id: `a_${Math.random().toString(36).slice(2, 10)}`,
    handle: input.handle.trim().toLowerCase(),
    emoji: input.emoji,
    email: normalizeEmail(input.email),
    createdAt: new Date().toISOString(),
  };
  list.unshift(account);
  saveAccounts(list);
  return account;
}

export function updateAccount(id: string, patch: Partial<Pick<Account, "handle" | "emoji">>): Account | undefined {
  const list = loadAccounts();
  const idx = list.findIndex((a) => a.id === id);
  if (idx < 0) return undefined;
  const next: Account = {
    ...list[idx],
    ...(patch.handle ? { handle: patch.handle.trim().toLowerCase() } : {}),
    ...(patch.emoji ? { emoji: patch.emoji } : {}),
  };
  list[idx] = next;
  saveAccounts(list);
  return next;
}

export function deleteAccountById(id: string): void {
  const list = loadAccounts().filter((a) => a.id !== id);
  saveAccounts(list);
}

// ---------- Session ----------

export function loadSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // non-fatal
  }
}

export function clearSession(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // non-fatal
  }
}

// ---------- OTP store ----------

function loadCodes(): CodeMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(CODES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as CodeMap) : {};
  } catch {
    return {};
  }
}

function saveCodes(map: CodeMap): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(CODES_KEY, JSON.stringify(map));
  } catch {
    // non-fatal
  }
}

function pruneExpired(map: CodeMap): CodeMap {
  const now = Date.now();
  const next: CodeMap = {};
  for (const [email, entry] of Object.entries(map)) {
    if (entry.expiresAt > now) next[email] = entry;
  }
  return next;
}

function generate6DigitCode(): string {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
}

// Issues (or re-issues) a 6-digit code for the email and returns it.
// In this demo build, the code is exposed to the UI so it can be displayed.
export function issueEmailCode(email: string): { code: string; expiresAt: number } {
  const norm = normalizeEmail(email);
  const code = generate6DigitCode();
  const expiresAt = Date.now() + CODE_TTL_MS;
  const map = pruneExpired(loadCodes());
  map[norm] = { code, expiresAt };
  saveCodes(map);
  return { code, expiresAt };
}

export function peekEmailCode(email: string): PendingCode | undefined {
  const norm = normalizeEmail(email);
  const map = pruneExpired(loadCodes());
  saveCodes(map);
  return map[norm];
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "no_code" | "mismatch" };

export function verifyEmailCode(email: string, code: string): VerifyResult {
  const norm = normalizeEmail(email);
  const trimmed = code.trim();
  const map = pruneExpired(loadCodes());
  const entry = map[norm];
  if (!entry) {
    saveCodes(map);
    return { ok: false, reason: "no_code" };
  }
  if (entry.expiresAt <= Date.now()) {
    delete map[norm];
    saveCodes(map);
    return { ok: false, reason: "expired" };
  }
  if (entry.code !== trimmed) {
    saveCodes(map);
    return { ok: false, reason: "mismatch" };
  }
  delete map[norm];
  saveCodes(map);
  return { ok: true };
}
