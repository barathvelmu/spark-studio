import { ideas } from "@/lib/mockData";
import { IdeaCard } from "@/components/IdeaCard";

export default function IdeasPage() {
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <header className="mb-10">
        <h1 className="font-display text-h1 text-text mb-2">Ideas</h1>
        <p className="text-body-lg text-text-muted">
          Pick one and we&apos;ll build it together.
        </p>
      </header>
      <ul
        className="grid gap-7 list-none p-0 m-0"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {ideas.map((idea) => (
          <li key={idea.id} className="contents">
            <IdeaCard idea={idea} />
          </li>
        ))}
      </ul>
    </div>
  );
}
