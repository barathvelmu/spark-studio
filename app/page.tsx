"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { getProjectById } from "@/lib/mockData";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ProjectCard";
import { SafetyBadge } from "@/components/SafetyBadge";

type StepId = "idea" | "build" | "play" | "code" | "remix" | "learn";

type Step = {
  id: StepId;
  emoji: string;
  label: string;
  headline: string;
  description: string;
  detail: string;
  linkLabel?: string;
  linkHref?: string;
};

const HOW_IT_WORKS: Step[] = [
  {
    id: "idea",
    emoji: "💡",
    label: "Idea",
    headline: "Start from an idea — or make one up",
    description: "Browse the Idea Wall for inspiration, or just describe what you want to build.",
    detail:
      "Every project on Spark Studio started as a single sentence. No coding experience needed. Just say what you want — 'a turtle that collects trash' or 'a quiz about planets' — and we'll take it from there.",
    linkLabel: "Browse ideas",
    linkHref: "/ideas",
  },
  {
    id: "build",
    emoji: "🛠️",
    label: "Build",
    headline: "AI turns your idea into a real project",
    description: "Type your idea and hit Generate. Spark Studio builds a playable mini-project in seconds.",
    detail:
      "Under the hood the AI picks the right template (Game, Quiz, or Story), fills in the details, and writes beginner-friendly code with comments explaining every line. You didn't write a single line — but the code is 100% yours.",
    linkLabel: "Try the builder",
    linkHref: "/builder",
  },
  {
    id: "play",
    emoji: "🎮",
    label: "Play",
    headline: "Play your project right in the browser",
    description: "Hit the Play tab and your mini-game or quiz comes to life instantly.",
    detail:
      "No downloads, no setup. Move your turtle with the arrow keys, answer a quiz question, or follow a story. It just works — and seeing it run makes the code click.",
    linkLabel: "See an example",
    linkHref: "/project/p_ocean",
  },
  {
    id: "code",
    emoji: "📜",
    label: "Code",
    headline: "See the real code — no black boxes",
    description: "Open the Code tab and read the actual HTML, CSS, and JS behind your project.",
    detail:
      "The code is written for beginners: short lines, plain English comments, and an 'Ask about this line' button on every row. Hover any line and ask what it does — the AI explains in kid-friendly language.",
    linkLabel: "See the code",
    linkHref: "/project/p_ocean",
  },
  {
    id: "remix",
    emoji: "🔁",
    label: "Remix",
    headline: "Remix anything and make it your own",
    description: "Found a project you love? Hit Remix and change it however you want.",
    detail:
      "Type 'make it about space junk instead of ocean plastic' and the project gets remixed — same logic, new theme. Your version always says 'Forked from [original]' so the original creator gets credit.",
    linkLabel: "See a remixed project",
    linkHref: "/project/p_space_junk",
  },
  {
    id: "learn",
    emoji: "📚",
    label: "Learn",
    headline: "Understand what you built",
    description: "The Learn tab explains every coding concept used in your project.",
    detail:
      "See chips for Variables, Loops, Events, and more — each one links to a plain-English explanation. The 'Next challenge' box gives you a concrete thing to try next so you keep growing.",
    linkLabel: "See the Learn tab",
    linkHref: "/project/p_ocean",
  },
];

const FEATURED_IDS = ["p_ocean", "p_space_junk", "p_climate_quiz"];

export default function LandingPage() {
  const featured = FEATURED_IDS.map((id) => getProjectById(id)).filter(
    (p): p is NonNullable<typeof p> => !!p
  );

  const [activeStep, setActiveStep] = useState<StepId | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  function toggleStep(id: StepId) {
    setActiveStep((cur) => (cur === id ? null : id));
  }

  useEffect(() => {
    if (activeStep) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeStep]);

  const activeData = HOW_IT_WORKS.find((s) => s.id === activeStep);

  return (
    <div className="max-w-page mx-auto px-7 lg:px-9">
      {/* Hero */}
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

      {/* How it works */}
      <section className="py-9" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="font-display text-h2 text-text text-center mb-6">
          How it works
        </h2>

        <ol
          className="flex items-start justify-between gap-3 max-w-3xl mx-auto overflow-x-auto md:overflow-visible pb-2 list-none"
          role="list"
        >
          {HOW_IT_WORKS.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <li key={step.id} className="flex flex-col items-center gap-2 min-w-[88px]">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-expanded={isActive}
                  aria-controls="step-detail"
                  onClick={() => toggleStep(step.id)}
                  className={[
                    "inline-flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 ease-spring",
                    "hover:bg-primary-soft hover:scale-105",
                    isActive
                      ? "bg-primary-soft ring-2 ring-primary scale-105"
                      : "bg-surface shadow-sm",
                  ].join(" ")}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {step.emoji}
                  </span>
                  <span
                    className={`text-label font-semibold ${isActive ? "text-primary" : "text-text"}`}
                  >
                    {step.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Step detail panel */}
        <div
          id="step-detail"
          ref={detailRef}
          role="region"
          aria-live="polite"
          aria-label="Step detail"
          className={[
            "max-w-3xl mx-auto mt-6 overflow-hidden transition-all duration-300 ease-smooth",
            activeData
              ? "max-h-[400px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none",
          ].join(" ")}
        >
          {activeData ? (
            <div className="bg-surface rounded-xl shadow-md p-7">
              <div className="text-5xl mb-3" aria-hidden="true">
                {activeData.emoji}
              </div>
              <h3 className="font-display text-h3 text-text mb-2">{activeData.headline}</h3>
              <p className="text-body-lg text-text-muted mb-3">{activeData.description}</p>
              <p className="text-body text-text mb-5">{activeData.detail}</p>
              {activeData.linkLabel && activeData.linkHref ? (
                <Link
                  href={activeData.linkHref}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-body hover:underline"
                >
                  {activeData.linkLabel} →
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* Featured projects */}
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

      {/* Safety note */}
      <section className="py-9" aria-labelledby="safety">
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

      {/* Ready to build CTA */}
      <section className="py-11 mb-11 text-center" aria-labelledby="cta-ready">
        <div className="bg-primary-soft rounded-xl p-10">
          <div className="text-5xl mb-4" aria-hidden="true">✨</div>
          <h2 id="cta-ready" className="font-display text-h1 text-text mb-3">
            Ready to build?
          </h2>
          <p className="text-body-lg text-text-muted max-w-lg mx-auto mb-8">
            Your idea is one prompt away from becoming a playable project.
          </p>
          <ButtonLink href="/builder" variant="primary" size="lg">
            Start Building
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
