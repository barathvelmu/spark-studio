"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";

export function UserMenu() {
  const { account, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!account) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={[
          "inline-flex items-center gap-2 h-10 pl-1 pr-3 rounded-pill transition-all",
          open
            ? "bg-primary-soft"
            : "bg-surface hover:bg-surface-muted",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-8 h-8 rounded-pill bg-primary-soft text-xl"
        >
          {account.emoji}
        </span>
        <span className="text-label font-semibold text-text max-w-[140px] truncate">
          @{account.handle}
        </span>
        <ChevronDown size={14} strokeWidth={2} className="text-text-muted" />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-12 z-50 w-64 bg-surface rounded-xl shadow-lg p-2 border border-border"
        >
          <div className="px-3 py-3 mb-1 border-b border-border">
            <div className="text-body-sm font-semibold text-text truncate">
              @{account.handle}
            </div>
            <div className="text-tiny text-text-muted truncate">{account.email}</div>
          </div>
          <Link
            href={`/u/${account.handle}`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 h-10 rounded-md text-body-sm text-text hover:bg-surface-muted transition-colors"
          >
            <UserIcon size={16} strokeWidth={2} className="text-text-muted" />
            My profile
          </Link>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 h-10 rounded-md text-body-sm text-text hover:bg-surface-muted transition-colors"
          >
            <Settings size={16} strokeWidth={2} className="text-text-muted" />
            Edit profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full text-left flex items-center gap-3 px-3 h-10 rounded-md text-body-sm text-text hover:bg-surface-muted transition-colors"
          >
            <LogOut size={16} strokeWidth={2} className="text-text-muted" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
