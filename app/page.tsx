import { getProjectById } from "@/lib/mockData";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ProjectCard";
import { SafetyBadge } from "@/components/SafetyBadge";

const HOW_IT_WORKS = [
  { emoji: "💡", label: "Idea" },
  { emoji: "🛠️", label: "Build" },
  { emoji: "🎮", label: "Play" },
  { emoji: "📜", label: "Code" },
  { emoji: "🔁", label: "Remix" },
  { emoji: "📚", label: "Learn" },
];

const FEATURED_IDS = ["p_ocean", "p_space_junk", "p_climate_quiz"];

export default function LandingPage() {
  const featured = FEATURED_IDS.map((id) => getProjectById(id)).filter(
    (p): p is NonNullable<typeof p> => !!p
  );

  return (
    <div className="max-w-page mx-auto px-7 lg:px-9">
      <section className="text-center pt-11 pb-9">
        <h1 className="font-display text-display text-text mb-6 tracking-tight">
          Make something only you would think of.
        </h1>
        <p className="text-body-lg text-text-muted max-w-2xl mx-auto mb-8">
          Every AI-generated change becomes a learning moment. Build, play, inspect the code,
          ask questions, and remix.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/builder" variant="primary" size="lg">
            Start Building
          </ButtonLink>
          <ButtonLink href="/discover" variant="secondary" size="lg">
            Explore Projects
          </ButtonLink>
        </div>
      </section>

      <section className="py-9" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="font-display text-h2 text-text text-center mb-6">
          How it works
        </h2>
        <ol
          className="flex items-center justify-between gap-3 max-w-3xl mx-auto overflow-x-auto md:overflow-visible pb-2"
          role="list"
        >
          {HOW_IT_WORKS.map((step, idx) => (
            <li
              key={step.label}
              className="flex flex-col items-center gap-2 min-w-[88px]"
            >
              <span
                className="inline-flex items-center justify-center w-14 h-14 rounded-pill bg-surface shadow-sm text-3xl"
                aria-hidden="true"
              >
                {step.emoji}
              </span>
              <span className="text-label font-semibold text-text">{step.label}</span>
              {idx < HOW_IT_WORKS.length - 1 ? (
                <span aria-hidden="true" className="hidden md:block absolute" />
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {featured.length > 0 ? (
        <section className="py-9" aria-labelledby="featured">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <h2 id="featured" className="font-display text-h2 text-text mb-1">
                Featured projects
              </h2>
              <p className="text-body text-text-muted">
                Play, peek at the code, or remix to make it yours.
              </p>
            </div>
            <ButtonLink href="/discover" variant="ghost" size="sm">
              See all
            </ButtonLink>
          </div>
          <ul
            className="grid gap-7 list-none p-0 m-0"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {featured.map((project) => (
              <li key={project.id} className="contents">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="py-9 mb-11" aria-labelledby="safety">
        <div className="bg-surface rounded-xl shadow-sm p-7 flex flex-col md:flex-row items-start md:items-center gap-5">
          <SafetyBadge />
          <div className="flex-1">
            <h2 id="safety" className="font-display text-h3 text-text mb-1">
              Made for kid creators
            </h2>
            <p className="text-body text-text-muted">
              Every project is safety-checked. No open chat. No personal data. Just making.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
