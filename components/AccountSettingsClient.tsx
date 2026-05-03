"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCcw, Trash2 } from "lucide-react";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { AVATAR_OPTIONS } from "@/lib/usernameGenerator";

export function AccountSettingsClient() {
  const router = useRouter();
  const toast = useToast();
  const { account, hydrated, signOut, regenerateHandle, setAvatar, deleteAccount } = useAuth();
  const [confirmRerollOpen, setConfirmRerollOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const redirectedRef = useRef(false);

  // If you're not signed in, bounce home (or to /).
  useEffect(() => {
    if (hydrated && !account && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/");
    }
  }, [hydrated, account, router]);

  if (!hydrated || !account) {
    return (
      <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
        <div className="bg-surface rounded-xl shadow-md p-9 animate-pulse h-[300px]" />
      </div>
    );
  }

  function doReroll() {
    const updated = regenerateHandle();
    setConfirmRerollOpen(false);
    if (updated) {
      toast.show({
        variant: "success",
        title: "New handle",
        body: `You're now @${updated.handle}.`,
      });
    }
  }

  function doSignOut() {
    signOut();
    toast.show({ variant: "info", title: "Signed out" });
    router.replace("/");
  }

  function doDelete() {
    deleteAccount();
    setConfirmDeleteOpen(false);
    toast.show({ variant: "info", title: "Account deleted" });
    router.replace("/");
  }

  const deleteConfirmPhrase = "delete my account";
  const canDelete = deleteText.trim().toLowerCase() === deleteConfirmPhrase;

  return (
    <div className="max-w-[720px] mx-auto px-7 lg:px-9 py-11">
      <header className="mb-8">
        <h1 className="font-display text-h1 text-text mb-2">Edit your profile</h1>
        <p className="text-body text-text-muted">
          Tweak your avatar or reroll your handle. Your email stays the same.
        </p>
      </header>

      {/* Identity card */}
      <section className="bg-surface rounded-xl shadow-md p-7 mb-7">
        <div className="flex items-center gap-5">
          <div
            aria-hidden="true"
            className="w-20 h-20 rounded-pill bg-primary-soft flex items-center justify-center text-5xl shadow-sm shrink-0"
          >
            {account.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-tiny text-text-muted uppercase tracking-wide font-semibold mb-1">
              Handle
            </div>
            <div className="font-display text-h2 text-text break-all">@{account.handle}</div>
            <div className="text-body-sm text-text-muted mt-1">{account.email}</div>
          </div>
          <ButtonLink href={`/u/${account.handle}`} variant="ghost" size="sm">
            View profile
          </ButtonLink>
        </div>
      </section>

      {/* Avatar */}
      <section className="bg-surface rounded-xl shadow-md p-7 mb-7">
        <h2 className="font-display text-h3 text-text mb-2">Avatar</h2>
        <p className="text-body-sm text-text-muted mb-5">Pick the emoji shown next to your handle.</p>
        <div className="flex flex-wrap gap-2">
          {AVATAR_OPTIONS.map((emoji) => {
            const active = emoji === account.emoji;
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                className={[
                  "w-12 h-12 rounded-pill text-2xl inline-flex items-center justify-center transition-all",
                  active
                    ? "bg-primary-soft ring-2 ring-primary scale-105"
                    : "bg-surface-muted hover:bg-primary-soft",
                ].join(" ")}
                aria-pressed={active}
                aria-label={`Choose ${emoji}`}
              >
                <span aria-hidden="true">{emoji}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Handle reroll */}
      <section className="bg-surface rounded-xl shadow-md p-7 mb-7">
        <h2 className="font-display text-h3 text-text mb-2">Handle</h2>
        <p className="text-body-sm text-text-muted mb-5">
          Each email is tied to one handle. If you reroll, the old one is freed up and links
          using it stop working.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          leadingIcon={<RefreshCcw size={16} strokeWidth={2} />}
          onClick={() => setConfirmRerollOpen(true)}
        >
          Reroll handle
        </Button>
      </section>

      {/* Sign out */}
      <section className="bg-surface rounded-xl shadow-md p-7 mb-7">
        <h2 className="font-display text-h3 text-text mb-2">Sign out</h2>
        <p className="text-body-sm text-text-muted mb-5">
          You can sign back in anytime with the same email.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          leadingIcon={<LogOut size={16} strokeWidth={2} />}
          onClick={doSignOut}
        >
          Sign out
        </Button>
      </section>

      {/* Danger zone */}
      <section className="bg-surface rounded-xl shadow-md p-7 border border-[rgba(239,68,68,0.20)]">
        <h2 className="font-display text-h3 text-danger mb-2">Delete account</h2>
        <p className="text-body-sm text-text-muted mb-5">
          This removes your account from this device. Your projects stay in this browser, but
          they'll no longer be linked to a handle.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          leadingIcon={<Trash2 size={16} strokeWidth={2} />}
          onClick={() => {
            setDeleteText("");
            setConfirmDeleteOpen(true);
          }}
          className="!border-danger !text-danger hover:!bg-[rgba(239,68,68,0.08)]"
        >
          Delete my account
        </Button>
      </section>

      {/* Reroll confirmation */}
      <Modal
        open={confirmRerollOpen}
        onClose={() => setConfirmRerollOpen(false)}
        title="Reroll your handle?"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setConfirmRerollOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="primary" size="md" onClick={doReroll}>
              Reroll
            </Button>
          </>
        }
      >
        <p className="text-body text-text">
          You're currently <strong>@{account.handle}</strong>. We'll pick a fresh adjective +
          animal + 3-digit number. Your projects stay attached to you.
        </p>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete your account?"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={doDelete}
              disabled={!canDelete}
              className="!bg-danger hover:!bg-[#DC2626]"
            >
              Delete account
            </Button>
          </>
        }
      >
        <p className="text-body text-text mb-4">
          This frees up your handle <strong>@{account.handle}</strong> and signs you out. To
          confirm, type <strong>{deleteConfirmPhrase}</strong> below.
        </p>
        <Input
          value={deleteText}
          onChange={(e) => setDeleteText(e.target.value)}
          placeholder={deleteConfirmPhrase}
          autoFocus
        />
      </Modal>
    </div>
  );
}

export default AccountSettingsClient;
