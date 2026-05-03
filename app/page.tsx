import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="max-w-page mx-auto px-7 lg:px-9 py-11">
      <section className="text-center py-10">
        <h1 className="font-display text-display text-text mb-6">
          Make something only you would think of.
        </h1>
        <p className="text-body-lg text-text-muted max-w-2xl mx-auto mb-8">
          Every AI-generated change becomes a learning moment. Build, play, inspect the code,
          ask questions, and remix.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/builder"
            className="bg-primary hover:bg-primary-hover text-white font-bold rounded-lg px-7 h-13 inline-flex items-center text-body-lg shadow-md transition-all"
          >
            Start Building
          </Link>
          <Link
            href="/discover"
            className="bg-surface border-2 border-border-strong hover:border-primary hover:bg-primary-soft text-text font-bold rounded-lg px-7 h-13 inline-flex items-center text-body-lg transition-all"
          >
            Explore Projects
          </Link>
        </div>
      </section>
    </div>
  );
}
