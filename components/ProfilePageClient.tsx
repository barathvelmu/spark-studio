"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/ProjectCard";
import { resolveUserByHandle } from "@/lib/mockData";
import { getAllProjects } from "@/lib/projectStore";
import { ideas as allIdeas } from "@/lib/mockData";
import { getSavedIdeasFor } from "@/lib/savedIdeas";
import { useAuth } from "@/lib/auth";
import type { Project, User, Idea } from "@/lib/types";

export type ProfilePageClientProps = { handle: string };

function formatJoinedDate(iso: string | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export function ProfilePageClient({ handle }: ProfilePageClientProps) {
  const { account: currentAccount, hydrated } = useAuth();
  const [user, setUser] = useState<User | undefined>(() => resolveUserByHandle(handle));
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    setUser(resolveUserByHandle(handle));
  }, [handle]);

  useEffect(() => {
    if (!user) return;
    const all = getAllProjects();
    setProjects(all.filter((p) => p.creatorId === user.id));
  }, [user]);

  useEffect(() => {
    if (!user || !currentAccount || currentAccount.id !== user.id) {
      setSavedIdeas([]);
      return;
    }
    const ids = getSavedIdeasFor(user.id);
    setSavedIdeas(allIdeas.filter((i) => ids.has(i.id)));
  }, [user, currentAccount]);

  if (hydrated && !user) {
    return (
      <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
        <EmptyState
          emoji="🤔"
          title="We couldn't find that profile."
          body="The link might be off, or this user doesn't exist yet."
          action={
            <ButtonLink href="/discover" variant="primary" size="md">
              Back to Discover
            </ButtonLink>
          }
        />
      </div>
    );
  }

  if (!user) return null;

  const isOwnProfile = !!currentAccount && currentAccount.id === user.id;
  const joined = formatJoinedDate(user.createdAt);
  const totalRemixes = projects.reduce((sum, p) => sum + p.remixCount, 0);

  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <header className="bg-surface rounded-xl shadow-md p-7 mb-9 flex flex-col md:flex-row items-start md:items-center gap-7">
        <div
          aria-hidden="true"
          className="w-24 h-24 rounded-pill bg-primary-soft flex items-center justify-center text-5xl shadow-sm shrink-0"
        >
          {user.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-h1 text-text mb-2 break-all">@{user.handle}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-text-muted">
            {joined ? (
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} strokeWidth={2} />
                Joined {joined}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Sparkles size={16} strokeWidth={2} />
                Spark Studio creator
              </span>
            )}
            <span>
              <strong className="text-text">{projects.length}</strong>{" "}
              {projects.length === 1 ? "project" : "projects"}
            </span>
            <span>
              <strong className="text-text">{totalRemixes}</strong>{" "}
              {totalRemixes === 1 ? "remix" : "remixes"} earned
            </span>
          </div>
        </div>
        {isOwnProfile ? (
          <ButtonLink href="/account" variant="secondary" size="md">
            Edit profile
          </ButtonLink>
        ) : null}
      </header>

      <section className="mb-11" aria-labelledby="user-projects">
        <div className="flex items-end justify-between mb-6 gap-4">
          <h2 id="user-projects" className="font-display text-h2 text-text">
            {isOwnProfile ? "Your projects" : "Projects"}
          </h2>
          {isOwnProfile ? (
            <ButtonLink href="/builder" variant="primary" size="sm">
              Build something new
            </ButtonLink>
          ) : null}
        </div>
        {projects.length > 0 ? (
          <ul
            className="grid gap-7 list-none p-0 m-0"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {projects.map((p) => (
              <li key={p.id} className="contents">
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            emoji="✨"
            title={isOwnProfile ? "Nothing here yet — let's make something!" : "No projects yet."}
            body={
              isOwnProfile
                ? "Tap the button above to start your first project."
                : "Once they build something, it'll show up here."
            }
            action={
              isOwnProfile ? (
                <ButtonLink href="/builder" variant="primary" size="md">
                  Start building
                </ButtonLink>
              ) : undefined
            }
          />
        )}
      </section>

      {isOwnProfile ? (
        <section aria-labelledby="user-saved">
          <h2 id="user-saved" className="font-display text-h2 text-text mb-6">
            Saved ideas
          </h2>
          {savedIdeas.length > 0 ? (
            <ul
              className="grid gap-5 list-none p-0 m-0"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
            >
              {savedIdeas.map((idea) => (
                <li key={idea.id} className="contents">
                  <Link
                    href={`/builder?ideaId=${idea.id}`}
                    className="bg-surface rounded-xl shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 block"
                  >
                    <div className="text-4xl mb-3" aria-hidden="true">
                      {idea.emoji}
                    </div>
                    <div className="font-display text-h4 text-text mb-1">{idea.title}</div>
                    <div className="text-body-sm text-text-muted line-clamp-2">
                      {idea.description}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              emoji="🔖"
              title="No saved ideas yet."
              body="Tap the bookmark on any idea to save it for later."
              action={
                <ButtonLink href="/ideas" variant="secondary" size="md">
                  Browse ideas
                </ButtonLink>
              }
            />
          )}
        </section>
      ) : null}
    </div>
  );
}

export default ProfilePageClient;
