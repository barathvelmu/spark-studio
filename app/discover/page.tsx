import { projects } from "@/lib/mockData";
import { ProjectCard } from "@/components/ProjectCard";

export default function DiscoverPage() {
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <header className="mb-10">
        <h1 className="font-display text-h1 text-text mb-2">Discover</h1>
        <p className="text-body-lg text-text-muted">
          Play projects, peek at the code, and remix anything you like.
        </p>
      </header>
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
    </div>
  );
}
