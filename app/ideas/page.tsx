import Link from "next/link";
import { ideas } from "@/lib/mockData";

const gradientStyles: Record<string, string> = {
  indigo: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
  sky: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
  mint: "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)",
  peach: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
  lavender: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)",
};

export default function IdeasPage() {
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <h1 className="font-display text-h1 mb-2">Ideas</h1>
      <p className="text-body text-text-muted mb-8">Pick one and we'll build it together.</p>
      <ul className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {ideas.map((idea) => (
          <li key={idea.id} className="bg-surface rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
            <div
              className="aspect-[16/9] flex items-center justify-center text-7xl"
              style={{ background: gradientStyles[idea.gradient] }}
            >
              <span>{idea.emoji}</span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-h3 mb-2">{idea.title}</h3>
              <p className="text-body-sm text-text-muted mb-4 line-clamp-2">{idea.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {idea.tags.map((tag) => (
                  <span key={tag} className="rounded-pill bg-surface-muted text-text-muted text-tiny font-semibold px-3 h-6 inline-flex items-center">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/builder?ideaId=${idea.id}`}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-10 px-5 text-label transition-colors"
              >
                Build this
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
