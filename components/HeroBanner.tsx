import { ButtonLink } from "@/components/ui/Button";

export function HeroBanner() {
  return (
    <section className="text-center pt-11 pb-9">
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-pill bg-surface/80 backdrop-blur-sm border border-border px-4 h-8 text-label text-text-muted shadow-sm mb-6">
          <span aria-hidden="true">✨</span>
          An AI coding playground for kids
        </span>

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
      </div>
    </section>
  );
}
