import { ideas } from "@/lib/mockData";

export default function IdeasPage() {
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <h1 className="font-display text-h1 mb-6">Ideas</h1>
      <p className="text-body text-text-muted mb-8">What do you want to make?</p>
      <ul className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {ideas.map((idea) => (
          <li key={idea.id} className="bg-surface rounded-xl shadow-md p-5">
            <div className="text-5xl mb-4">{idea.emoji}</div>
            <h3 className="font-display text-h3 mb-2">{idea.title}</h3>
            <p className="text-body-sm text-text-muted">{idea.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
