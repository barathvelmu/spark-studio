# AGENTS.md — Coding Agent Guide for Spark Studio

## Mission
Build Spark Studio: a kid-safe, AI-native creative coding playground inspired by Scratch and remix/fork culture.

Core loop:
**Idea → Build → Play → Inspect Code → Ask Code → Remix → Explain → Share**

## Agent Rules
- Prioritize a polished working demo over backend complexity.
- Keep scope tight.
- Use mock data first.
- Use template-based generation for reliability.
- Do not build open comments, DMs, auth-heavy flows, full GitHub features, or a full IDE.
- Every generated/remixed project must include Play, Code, and Learn experiences.
- Every remix must preserve parent lineage.
- Every code explanation must be kid-friendly.

## Recommended Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Optional shadcn/ui
- Mock data/local state first
- Optional localStorage
- Optional Supabase only after MVP works
- Optional LLM API for config generation, remix summaries, and Ask the Code

## Required Pages
- `/` Landing
- `/ideas` Idea Wall
- `/discover` Discover Projects
- `/builder` Builder
- `/project/[id]` Project Detail

## Required Components
- Header
- Hero
- IdeaCard
- ProjectCard
- BuilderPanel
- ProjectPreview
- CodeView
- AskTheCodePanel
- LearningSummary
- RemixControls
- LineageView
- ReactionButtons
- SafetyBadge
- Template components:
  - CollectorGame
  - QuizGame
  - StoryGame

## Demo Must Work Offline
Preload enough mock data so the final demo works without API:
Ocean Cleanup Game → Code Q&A → Space Junk Rescue remix → lineage → learning summary.

## Quality Bar
The product should feel like:
- Scratch creativity
- Canva simplicity
- GitHub-style lineage, but kid-friendly
- Duolingo-like friendliness
- Modern, playful, safe, polished

Avoid:
- Dark enterprise SaaS
- Dense IDE
- Overly childish clutter
- Social media feed vibes
