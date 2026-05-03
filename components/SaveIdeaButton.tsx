"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { isIdeaSaved, setIdeaSaved } from "@/lib/savedIdeas";

export type SaveIdeaButtonProps = {
  ideaId: string;
  className?: string;
};

export function SaveIdeaButton({ ideaId, className = "" }: SaveIdeaButtonProps) {
  const { account, hydrated, requireAuth } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setSaved(isIdeaSaved(account?.id, ideaId));
  }, [hydrated, account?.id, ideaId]);

  function applyToggle(accountId: string) {
    const cur = isIdeaSaved(accountId, ideaId);
    setIdeaSaved(accountId, ideaId, !cur);
    setSaved(!cur);
  }

  function toggle() {
    if (!account) {
      requireAuth({
        reason: "sign_in",
        onSuccess: (acct) => applyToggle(acct.id),
      });
      return;
    }
    applyToggle(account.id);
  }

  const Icon = saved ? BookmarkCheck : Bookmark;

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={toggle}
      className={[
        "inline-flex items-center justify-center gap-2 h-[36px] px-4 rounded-lg text-label font-semibold transition-colors",
        saved
          ? "bg-primary-soft text-primary"
          : "bg-transparent text-text-muted hover:bg-surface-muted hover:text-text",
        className,
      ].join(" ")}
    >
      <Icon size={16} strokeWidth={2} />
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
