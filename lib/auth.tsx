"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  createAccount,
  deleteAccountById,
  findAccountByEmail,
  findAccountById,
  getTakenHandles,
  issueEmailCode,
  loadSession,
  normalizeEmail,
  saveSession,
  updateAccount,
  verifyEmailCode,
  type VerifyResult,
} from "./accountStore";
import { generateNewProfile, generateUniqueHandle, pickAvatarEmoji } from "./usernameGenerator";
import { migrateAnonymousData } from "./anonymousMigration";
import type { Account } from "./types";

// ---------- Types ----------

export type AuthGateReason = "build" | "remix" | "publish" | "sign_in";

export type RequireAuthOptions = {
  reason?: AuthGateReason;
  onSuccess?: (account: Account) => void;
  onCancel?: () => void;
};

type ProposedProfile = { handle: string; emoji: string };

export type IssueCodeResult = {
  code: string;
  expiresAt: number;
  isReturning: boolean;
};

type VerifyFailReason = Extract<VerifyResult, { ok: false }>["reason"];

export type VerifyAndContinueResult =
  | { ok: true; account: Account; isNew: boolean }
  | { ok: false; reason: VerifyFailReason };

type AuthContextValue = {
  account: Account | undefined;
  isSignedIn: boolean;
  hydrated: boolean;
  // gate
  isGateOpen: boolean;
  gateReason: AuthGateReason | undefined;
  requireAuth: (opts?: RequireAuthOptions) => void;
  closeGate: (didSucceed: boolean) => void;
  // sign-up / sign-in
  proposedProfile: ProposedProfile;
  regenerateProposedProfile: () => ProposedProfile;
  setProposedAvatar: (emoji: string) => void;
  requestCode: (email: string) => IssueCodeResult;
  verifyAndContinue: (
    email: string,
    code: string,
    opts?: { handle?: string; emoji?: string }
  ) => VerifyAndContinueResult;
  // post-signin
  signOut: () => void;
  regenerateHandle: () => Account | undefined;
  setAvatar: (emoji: string) => Account | undefined;
  deleteAccount: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------- Provider ----------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateReason, setGateReason] = useState<AuthGateReason | undefined>(undefined);
  const [proposedProfile, setProposedProfile] = useState<ProposedProfile>({
    handle: "",
    emoji: pickAvatarEmoji(),
  });
  const onSuccessRef = useRef<((account: Account) => void) | undefined>(undefined);
  const onCancelRef = useRef<(() => void) | undefined>(undefined);

  // Hydrate session on mount.
  useEffect(() => {
    const session = loadSession();
    if (session) {
      const acct = findAccountById(session.accountId);
      if (acct) {
        setAccount(acct);
      } else {
        clearSession();
      }
    }
    setProposedProfile(generateNewProfile(getTakenHandles()));
    setHydrated(true);
  }, []);

  const refreshProposed = useCallback((): ProposedProfile => {
    const next = generateNewProfile(getTakenHandles());
    setProposedProfile(next);
    return next;
  }, []);

  const requireAuth = useCallback(
    (opts: RequireAuthOptions = {}) => {
      onSuccessRef.current = opts.onSuccess;
      onCancelRef.current = opts.onCancel;
      if (account) {
        opts.onSuccess?.(account);
        return;
      }
      setGateReason(opts.reason);
      setProposedProfile(generateNewProfile(getTakenHandles()));
      setIsGateOpen(true);
    },
    [account]
  );

  const closeGate = useCallback((didSucceed: boolean) => {
    setIsGateOpen(false);
    setGateReason(undefined);
    if (!didSucceed) {
      onCancelRef.current?.();
    }
    onSuccessRef.current = undefined;
    onCancelRef.current = undefined;
  }, []);

  const requestCode = useCallback((email: string): IssueCodeResult => {
    const existing = findAccountByEmail(email);
    const { code, expiresAt } = issueEmailCode(email);
    return { code, expiresAt, isReturning: !!existing };
  }, []);

  const verifyAndContinue = useCallback(
    (
      email: string,
      code: string,
      opts?: { handle?: string; emoji?: string }
    ): VerifyAndContinueResult => {
      const result = verifyEmailCode(email, code);
      if (!result.ok) return { ok: false, reason: result.reason };

      const norm = normalizeEmail(email);
      const existing = findAccountByEmail(norm);
      if (existing) {
        saveSession({ accountId: existing.id });
        setAccount(existing);
        // fire onSuccess if a gate is waiting
        const cb = onSuccessRef.current;
        onSuccessRef.current = undefined;
        cb?.(existing);
        return { ok: true, account: existing, isNew: false };
      }

      // New account: create using the confirmed (or proposed) profile.
      const taken = getTakenHandles();
      const handleCandidate = opts?.handle?.trim().toLowerCase() ?? proposedProfile.handle;
      const handle =
        handleCandidate && !taken.has(handleCandidate)
          ? handleCandidate
          : generateUniqueHandle(taken);
      const emoji = opts?.emoji ?? proposedProfile.emoji;

      const created = createAccount({ email: norm, handle, emoji });
      saveSession({ accountId: created.id });
      setAccount(created);
      // Migrate any legacy anonymous local data into this new account.
      migrateAnonymousData(created.id);
      const cb = onSuccessRef.current;
      onSuccessRef.current = undefined;
      cb?.(created);
      return { ok: true, account: created, isNew: true };
    },
    [proposedProfile]
  );

  const signOut = useCallback(() => {
    clearSession();
    setAccount(undefined);
  }, []);

  const regenerateHandle = useCallback((): Account | undefined => {
    if (!account) return undefined;
    const taken = getTakenHandles();
    // Exclude this account's current handle from "taken" so we don't fail trivially.
    taken.delete(account.handle);
    const next = generateUniqueHandle(taken);
    const updated = updateAccount(account.id, { handle: next });
    if (updated) setAccount(updated);
    return updated;
  }, [account]);

  const setAvatar = useCallback(
    (emoji: string): Account | undefined => {
      if (!account) return undefined;
      const updated = updateAccount(account.id, { emoji });
      if (updated) setAccount(updated);
      return updated;
    },
    [account]
  );

  const handleDeleteAccount = useCallback(() => {
    if (!account) return;
    deleteAccountById(account.id);
    clearSession();
    setAccount(undefined);
  }, [account]);

  const setProposedAvatar = useCallback((emoji: string) => {
    setProposedProfile((cur) => ({ ...cur, emoji }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      account,
      isSignedIn: !!account,
      hydrated,
      isGateOpen,
      gateReason,
      requireAuth,
      closeGate,
      proposedProfile,
      regenerateProposedProfile: refreshProposed,
      setProposedAvatar,
      requestCode,
      verifyAndContinue,
      signOut,
      regenerateHandle,
      setAvatar,
      deleteAccount: handleDeleteAccount,
    }),
    [
      account,
      hydrated,
      isGateOpen,
      gateReason,
      requireAuth,
      closeGate,
      proposedProfile,
      refreshProposed,
      setProposedAvatar,
      requestCode,
      verifyAndContinue,
      signOut,
      regenerateHandle,
      setAvatar,
      handleDeleteAccount,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
