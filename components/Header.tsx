"use client";

import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { UserMenu } from "./auth/UserMenu";
import { useAuth } from "@/lib/auth";

type NavLink = {
  href: string;
  label: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/ideas", label: "Ideas" },
  { href: "/discover", label: "Discover" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { account, isSignedIn, hydrated, requireAuth } = useAuth();

  function openSignIn() {
    requireAuth({ reason: "sign_in" });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[rgba(250,250,255,0.85)] backdrop-blur-md border-b border-border">
      <div className="max-w-page mx-auto flex items-center justify-between h-16 px-7 lg:px-9">
        <Link
          href="/"
          className="font-display font-extrabold text-h3 text-text inline-flex items-center gap-2"
          aria-label="Spark Studio home"
        >
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary-soft text-primary"
          >
            <Sparkles size={18} strokeWidth={2.25} />
          </span>
          <span>Spark Studio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-label" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-pill px-4 h-9 inline-flex items-center transition-colors",
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-text-muted hover:text-text hover:bg-surface-muted",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}

          {hydrated && isSignedIn && account ? (
            <div className="ml-2">
              <UserMenu />
            </div>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={openSignIn}
                className="ml-2"
              >
                Sign in
              </Button>
              <ButtonLink href="/builder" variant="primary" size="sm">
                Start Building
              </ButtonLink>
            </>
          )}
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-text hover:bg-surface-muted transition-colors"
        >
          <Menu size={24} strokeWidth={1.75} />
        </button>
      </div>

      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu">
        <div className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-md px-4 h-12 inline-flex items-center text-body font-semibold transition-colors",
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-text hover:bg-surface-muted",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}

          {hydrated && isSignedIn && account ? (
            <>
              <Link
                href={`/u/${account.handle}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-4 h-12 inline-flex items-center text-body font-semibold text-text hover:bg-surface-muted transition-colors"
              >
                <span className="mr-3 text-xl" aria-hidden="true">
                  {account.emoji}
                </span>
                @{account.handle}
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-4 h-12 inline-flex items-center text-body font-semibold text-text hover:bg-surface-muted transition-colors"
              >
                Edit profile
              </Link>
            </>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              className="mt-3"
              onClick={() => {
                setMobileOpen(false);
                openSignIn();
              }}
            >
              Sign in
            </Button>
          )}

          <ButtonLink
            href="/builder"
            variant="primary"
            size="md"
            fullWidth
            className="mt-3"
            onClick={() => setMobileOpen(false)}
          >
            Start Building
          </ButtonLink>
        </div>
      </Modal>
    </header>
  );
}
