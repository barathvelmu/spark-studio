# Spark Studio

**A remix-first AI coding playground for kids.** Describe an idea, watch it become a playable mini-project, inspect the real code behind it, ask questions about how it works, remix it into something new, and learn the coding concepts behind every AI-assisted change.

> **Every AI-generated change becomes a learning moment.**

Built at **Claude Builders @ MIT — *Machines of Loving Grace* Spring Sprint Hackathon** (May 3, 2026, sponsored by Anthropic). **3rd place** — $250 + $250 in Anthropic credits.

---

## What it does

Spark Studio takes a kid's idea ("a turtle collects plastic from the ocean") and turns it into a working mini-game in seconds. Crucially, it doesn't hide the code. Every project has four surfaces:

- **Play** — the live, interactive mini-project (collector game / quiz / branching story).
- **Code** — kid-friendly hand-written `index.html` / `style.css` / `game.js` they can read, copy, and run anywhere.
- **Ask the code** — a chat grounded in *that specific project's source*. "How does the score work?" "What does Math.abs do?" Claude answers in plain English, highlighting the exact lines.
- **Learn** — what changed, what concepts the code teaches (variables, events, conditionals, loops, branching, state), and what to try next.

Other kids can remix any project — preserving credit through a visible lineage tree — and Spark Studio's **Tinker Mode** lets the model suggest one small, safe code edit at a time, which the kid taps to apply and watch the code change in front of them.

The whole thing is wrapped in passwordless auth (auto-generated kid-friendly handles, no real names) and a publish-to-Discover flow so kids can share what they made without ever needing open comments or DMs.

## Why it exists

Scratch made coding accessible by making it creative, visual, and remixable. Spark Studio asks: *what would Scratch look like if it were designed for the AI-native generation?*

The thesis: AI shouldn't just generate code for kids. It should help them **create, inspect, ask, remix, and understand**. Most AI coding tools are built for adults who already know what a repository or a deploy is. Spark Studio is built for an 11-year-old with an idea and no prior coding experience — and it *teaches* them as they build, instead of hiding the syntax behind a black box.

## Demo path

1. **Idea Wall** → click "Build this" on Ocean Cleanup Game
2. Auto-generates a playable turtle-collects-plastic game (real Anthropic Claude shapes the title/theme; React templates render it)
3. **Play** the game — click anywhere or use arrow keys; collect 10 plastic bottles to win
4. **Code** tab — read the actual hand-written HTML/CSS/JS the game runs on
5. **Ask the code** — "How does the score work?" → kid-friendly answer + highlighted lines
6. **Tinker** — "✨ Suggest a tinker" → Claude proposes a safe edit ("Make the turtle faster") → tap Apply → code visibly updates
7. **Remix** → "Make it about space junk instead" → new project with `Forked from Ocean Cleanup Game` lineage chip + branching tree
8. **Learn** tab — change summary, concept chips, next challenge, structured reactions
9. **Publish to Discover** so other kids can play and remix

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind 3** with a custom design system (warm Claude-inspired terracotta + cream palette, see `docs/03_design.md`)
- **Anthropic SDK** (`@anthropic-ai/sdk`) — Claude Opus 4.7 with adaptive thinking, `effort: low` for latency-sensitive interactive endpoints
- **Client-side persistence** — `localStorage` for projects, accounts, reactions, saved ideas (no backend DB)
- **Template-based generation** — Claude returns a structured config; React templates (`CollectorGame.tsx`, `QuizGame.tsx`, `StoryGame.tsx`) render it. The model never produces arbitrary executable JS for the live preview, which makes the demo deterministic.

## Running locally

```bash
git clone https://github.com/barathvelmu/spark-studio.git
cd spark-studio
npm install
cp .env.example .env.local           # then paste your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

The four `/api/*` routes (`generate-project`, `remix-project`, `ask-code`, `tinker`) all fall back to deterministic mocks if `ANTHROPIC_API_KEY` is missing, so the demo path runs end-to-end without a key.

## Repo map

```
app/
  page.tsx                  Landing
  ideas/                    Idea Wall
  discover/                 Discover (published projects)
  builder/                  Prompt-first builder with auto-build from ?ideaId
  project/[id]/             Play / Code / Learn / Ask / Tinker / Remix
  account/                  Account settings (signed-in only)
  u/[handle]/               Public creator profile
  api/
    generate-project/       Claude → ProjectDraft (theme, copy, code via makeCollectorCode)
    remix-project/          Claude → forked ProjectDraft with forkedFromProjectId
    ask-code/               Claude → grounded answer + line highlights
    tinker/                 Claude → one safe substring edit; route validates `before` actually exists
components/
  templates/                CollectorGame, QuizGame, StoryGame
  auth/                     AuthModal (passwordless email + auto handle), UserMenu
  ui/                       Button, Modal, Toast, Textarea, Input, Tabs, Chip, EmptyState
  CodeView.tsx              3-tab HTML/CSS/JS viewer with line numbers, regex syntax highlight, line highlight, "Ask about this" hover
  AskTheCodePanel.tsx       Chat UI with prewritten Q&A fast-path for the demo project
  TinkerMode.tsx            Suggest → Apply → re-render flow
  RemixModal.tsx            Free-text + 6 preset chips ("Change theme", "Add timer", etc.)
  LineageTree.tsx           Walks forkedFromProjectId chain + scans for direct children, cycle-safe
lib/
  types.ts                  Project, Idea, User, Concept, ProjectConfig union
  mockData.ts               5 seeded projects with hand-written code strings
  templateGenerator.ts      Keyword theme picker + parameterized makeCollectorCode
  projectStore.ts           localStorage CRUD with seed fallback + publish flow
  auth.tsx                  Auth context, deferred onSuccess callbacks for new-user gate
  accountStore.ts           Email→account, code issuance + verify, idempotent migration of anon localStorage
  anthropic.ts              Client singleton + askClaudeJson<T>() helper with safety prefix and 20s timeout
  tinker.ts                 Rule-based fallback when Claude is unavailable
  lineage.ts                Cycle-safe ancestor walk + descendant scan
docs/
  03_design.md              Visual contract — colors, type scale, spacing, components
  04_AI_AND_API.md          AI prompt strategy + endpoint shapes
  05_CONTENT_AND_DEMO.md    Preloaded content + demo path
  06_DEMO_SCRIPT.md         10-minute beat-by-beat demo script
scripts/
  e2e.sh                    Smoke test against running dev server (25+ checks)
```

## Key design decisions

**Template-based generation, not free-form code generation.** Claude shapes config (player emoji, collectible, theme, copy) and the deterministic React template renders the game. This keeps the live preview rock-solid even when the model occasionally returns malformed JSON or refuses a prompt.

**Hand-written code in the Code tab.** The HTML/CSS/JS displayed is real, runnable code that mirrors what the React template does — not the React source. Kids see code they can copy into a folder and open in any browser. This makes Ask the Code answer about *real* code (with real line numbers) instead of theoretical pseudo-code.

**Mock fallback on every Claude route.** Network blip, missing API key, malformed model output, refusal — every route silently falls back to deterministic mocks so the demo path never breaks. Real Claude is the upgrade, not the dependency.

**Sync localStorage data layer.** No backend DB. The auth flow is passwordless email + a 6-digit demo code shown in the modal. Anonymous projects migrate cleanly into the user's account on first sign-in. Designed so swapping in a real DB later is a one-file change to `projectStore.ts`.

**Structured reactions, no open comments.** Six emoji reactions ("Inspired me", "I remixed this", "Cool idea", "Great design", "Smart logic", "I learned from this") and remix lineage are the only social affordances. Kid-safe by construction.

## Status

Built in ~4 hours of hacking time (Stata 32-141, May 3, 2026, 1–5pm) for Claude Builders @ MIT's *Machines of Loving Grace* Spring Sprint Hackathon. The theme — adapted from Dario Amodei's [essay](https://www.darioamodei.com/essay/machines-of-loving-grace) of the same name — challenged teams to build something that moves the needle toward a more humane world. Spark Studio's wedge: getting kids who don't have access to advanced CS classes, mentors, or expensive tools to participate as **creators** of AI-assisted software, not just consumers — and learning the underlying concepts as they go.

There's also a quiet bit of MIT lineage threaded through the project: Scratch was born at the MIT Media Lab's Lifelong Kindergarten group, and Spark Studio is consciously the "what would Scratch look like for the AI-native generation" question, asked at the place where Scratch began.

The full demo path works end-to-end on a fresh clone with an Anthropic key. Production build is clean (`npm run build`); typecheck is clean (`npm run typecheck`); a scripted smoke test (`bash scripts/e2e.sh`) covers all 5 page routes, all 4 API routes, and the rendered demo strings.

Architectural cuts that would be the next features in a hosted version: real DB (Supabase or similar), email delivery for the auth code, Tinker Mode history, search/filter on Discover, and an animated branching lineage view.

## Credits

Built by [@barathvelmu](https://github.com/barathvelmu) and [@AshritVerma](https://github.com/AshritVerma).

---

*Spark Studio turns vibe coding into guided creative learning for the next generation.*
