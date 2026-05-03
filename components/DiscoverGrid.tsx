"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProjects } from "@/lib/projectStore";
import { projects as seedProjects } from "@/lib/mockData";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function DiscoverGrid() {
  // SSR-safe: start from seeds (all published), then refresh from localStorage after mount.
  const [projects, setProjects] = useState<Project[]>(() => seedProjects);

  useEffect(() => {
    setProjects(getAllProjects());
    function onStorage(e: StorageEvent) {
      if (e.key === "spark.projects.v1") {
        setProjects(getAllProjects());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const published = useMemo(
    () =>
      projects
        .filter((p) => p.published)
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0)),
    [projects],
  );

  if (published.length === 0) {
    return (
      <div className="bg-surface rounded-xl shadow-md p-9 text-center">
        <div className="text-5xl mb-4">✨</div>
        <p className="text-body text-text-muted">
          Nothing here yet. Build a project and hit Publish to see it on Discover.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="grid gap-7 list-none p-0 m-0"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
    >
      {published.map((p) => (
        <li key={p.id} className="contents">
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}

export default DiscoverGrid;
