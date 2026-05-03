import Link from "next/link";
import { projects } from "@/lib/mockData";

export default function DiscoverPage() {
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <h1 className="font-display text-h1 mb-6">Discover</h1>
      <ul className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {projects.map((p) => (
          <li key={p.id} className="bg-surface rounded-xl shadow-md p-5">
            <h3 className="font-display text-h3 mb-2">
              <Link href={`/project/${p.id}`}>{p.title}</Link>
            </h3>
            <p className="text-body-sm text-text-muted">{p.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
