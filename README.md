# Spark Studio 🌟

A remix-first AI coding playground for kids. Describe an idea, watch it become a playable mini-project, look at the real code behind it, ask questions about how it works, remix it into something new, and learn the coding concepts behind every change the AI makes.

> Every AI-generated change becomes a learning moment.

Built at Claude Builders @ MIT's *Machines of Loving Grace* Spring Sprint Hackathon (May 3, 2026). Presenting sponsor was Anthropic; supporting sponsors were Jane Street and HRT. We came 3rd ($250 + $250 in Anthropic credits).

---

## What it does

You give it an idea ("a turtle that collects plastic from the ocean") and it builds you a working mini-game in a few seconds. The important part: it doesn't hide the code. Every project has four tabs.

- **Play.** The actual interactive thing. A collector game, a quiz, or a branching choose-your-own-adventure story.
- **Code.** Real, hand-written `index.html`, `style.css`, and `game.js` you can read, copy, and run anywhere.
- **Ask the code.** A chat that's grounded in *that specific project's source*. "How does the score work?" "What does Math.abs do?" Claude answers in plain English and highlights the exact lines it's talking about.
- **Learn.** What changed, what concepts the code teaches (variables, events, conditionals, loops, branching, state), and what to try next.

Other kids can remix any project, with credit preserved through a visible lineage tree. There's also a Tinker Mode where the model proposes one small, safe code edit at a time, and the kid taps Apply to watch the code change in front of them.

The whole thing sits behind passwordless auth (auto-generated kid-friendly handles, no real names) and a publish-to-Discover flow, so kids can share what they made without ever needing open comments or DMs.

## Why it exists

Scratch made coding accessible by making it creative, visual, and remixable. Spark Studio asks: what would Scratch look like if it were designed for the AI-native generation?

Most AI coding tools are built for adults who already know what a repository or a deploy is. Spark Studio is built for an 11-year-old with an idea and no prior coding experience. The whole point is that AI shouldn't just generate code for kids; it should help them create, look at it, ask about it, remix it, and understand it. Spark Studio teaches them as they build, instead of hiding the syntax behind a black box.

## Demo path

1. Open the Idea Wall and click "Build this" on Ocean Cleanup Game.
2. Spark Studio auto-generates a playable turtle-collects-plastic game. (Claude shapes the title, theme, and copy. The React template renders it.)
3. Hit Play. Click anywhere or use arrow keys. Collect 10 plastic bottles to win.
4. Open the Code tab. Read the actual hand-written HTML, CSS, and JS that the game runs on.
5. Open Ask the code. Ask "How does the score work?" Get a kid-friendly answer with the relevant lines highlighted.
6. Try Tinker Mode. Click "Suggest a tinker." Claude proposes something safe like "Make the turtle faster." Click Apply and watch the line change.
7. Hit Remix. Type "Make it about space junk instead." A new project appears with a "Forked from Ocean Cleanup Game" lineage chip and a branching tree.
8. Open the Learn tab. See the change summary, concept chips, next challenge, and structured reactions.
9. Publish to Discover so other kids can play and remix it.

## Tech stack

- Next.js 15 with the App Router, React 19, and TypeScript.
- Tailwind 3 with a custom design system (warm Claude-inspired terracotta and cream palette; details in `docs/03_design.md`).
- Anthropic SDK (`@anthropic-ai/sdk`). Claude Opus 4.7, with `effort: low` on the latency-sensitive interactive endpoints.
- Client-side persistence only. `localStorage` holds projects, accounts, reactions, and saved ideas. There's no backend database.
- Template-based generation. Claude returns a structured config and the React templates (`CollectorGame.tsx`, `QuizGame.tsx`, `StoryGame.tsx`) render it. The model never produces arbitrary executable JS for the live preview, which makes the demo deterministic.

## Running locally

```bash
git clone https://github.com/barathvelmu/spark-studio.git
cd spark-studio
npm install
cp .env.example .env.local           # then paste your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

All four `/api/*` routes (`generate-project`, `remix-project`, `ask-code`, `tinker`) fall back to deterministic mocks if `ANTHROPIC_API_KEY` is missing, so the demo path runs end-to-end without a key. With a key, you get real Claude responses for everything.

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
    generate-project/       Claude returns a ProjectDraft (theme, copy, code via makeCollectorCode)
    remix-project/          Claude returns a forked ProjectDraft with forkedFromProjectId set
    ask-code/               Claude returns a grounded answer plus line highlights
    tinker/                 Claude returns one safe substring edit; route validates the `before` actually exists in source
components/
  templates/                CollectorGame, QuizGame, StoryGame
  auth/                     AuthModal (passwordless email + auto handle), UserMenu
  ui/                       Button, Modal, Toast, Textarea, Input, Tabs, Chip, EmptyState
  CodeView.tsx              3-tab HTML/CSS/JS viewer with line numbers, regex syntax highlight, line highlight, "Ask about this" hover
  AskTheCodePanel.tsx       Chat UI with a prewritten Q&A fast-path for the demo project
  TinkerMode.tsx            Suggest → Apply → re-render flow
  RemixModal.tsx            Free-text input plus 6 preset chips (Change theme, Add timer, etc.)
  LineageTree.tsx           Walks forkedFromProjectId up to root, scans for direct children, cycle-safe
lib/
  types.ts                  Project, Idea, User, Concept, ProjectConfig union
  mockData.ts               5 seeded projects with hand-written code strings
  templateGenerator.ts      Keyword theme picker + parameterized makeCollectorCode
  projectStore.ts           localStorage CRUD with seed fallback and the publish flow
  auth.tsx                  Auth context, with deferred onSuccess callbacks for the new-user gate
  accountStore.ts           Email-to-account lookup, code issuance + verify, idempotent migration of anonymous localStorage
  anthropic.ts              Client singleton plus askClaudeJson<T>() helper with safety prefix and a 20s timeout
  tinker.ts                 Rule-based fallback for when Claude is unavailable
  lineage.ts                Cycle-safe ancestor walk and descendant scan
docs/
  ARCHITECTURE.md           System diagram, the 4 data flows, key design decisions
  03_design.md              Visual contract: colors, type scale, spacing, components
  04_AI_AND_API.md          AI prompt strategy and endpoint shapes
  05_CONTENT_AND_DEMO.md    Preloaded content and demo path
  06_DEMO_SCRIPT.md         10-minute beat-by-beat demo script
scripts/
  e2e.sh                    Smoke test against the running dev server (25+ checks)
```

## Key design decisions

**Template-based generation, not free-form code generation.** Claude shapes config (player emoji, collectible, theme, copy) and a deterministic React template renders the game. That way the live preview stays rock-solid even when the model occasionally returns malformed JSON or refuses a prompt.

**Hand-written code in the Code tab, not the React source.** The HTML, CSS, and JS displayed in the Code tab is real, runnable code that mirrors what the React template does. Kids can copy it into a folder and open it in any browser. It also gives Ask the Code real line numbers to point at, instead of pseudo-code.

**Mock fallback on every Claude route.** Network blip, missing API key, malformed model output, refusal: every route silently falls back to deterministic mocks. The demo path never breaks. Real Claude is the upgrade, not the dependency.

**Synchronous localStorage data layer.** No backend DB. The auth flow is passwordless email plus a 6-digit demo code shown directly in the modal (clearly labeled as demo mode). Anonymous projects migrate cleanly into the user's account on first sign-in. The whole thing is designed so that swapping in a real DB later is a one-file change to `projectStore.ts`.

**Structured reactions, no open comments.** Six emoji reactions (Inspired me, I remixed this, Cool idea, Great design, Smart logic, I learned from this) and remix lineage are the only social surfaces. Kid-safe by construction.

## Status

We built this in about 4 hours of hacking time on May 3, 2026, in Stata 32-141, for Claude Builders @ MIT's *Machines of Loving Grace* Spring Sprint Hackathon. The theme came from Dario Amodei's [essay](https://www.darioamodei.com/essay/machines-of-loving-grace) of the same name, which challenged teams to build something that moves the needle toward a more humane world. Our angle: getting kids who don't have access to advanced CS classes, mentors, or expensive tools to participate as creators of AI-assisted software, not just consumers, and to actually learn the underlying concepts as they go.

There's a small bit of MIT lineage threaded through the project too. Scratch was born at the MIT Media Lab's Lifelong Kindergarten group, so asking "what would Scratch look like for the AI-native generation?" feels right when the question is asked at the place where Scratch began.

The full demo path works end-to-end on a fresh clone with an Anthropic key. The production build is clean (`npm run build`), typecheck is clean (`npm run typecheck`), and a scripted smoke test (`bash scripts/e2e.sh`) covers all 5 page routes, all 4 API routes, and the rendered demo strings.

Things that would be the next features in a hosted version: a real database (Supabase or similar), real email delivery for the auth code, Tinker Mode history, search and filter on Discover, and an animated branching lineage view.

## Credits

Built by [@barathvelmu](https://github.com/barathvelmu) and [@AshritVerma](https://github.com/AshritVerma).

**Hackathon:** Claude Builders @ MIT, *Machines of Loving Grace* Spring Sprint Hackathon, May 3, 2026, Stata 32-141.

**Sponsors:** Presenting sponsor [Anthropic](https://www.anthropic.com); supporting sponsors [Jane Street](https://www.janestreet.com) and [HRT](https://www.hudsonrivertrading.com).

---

*Spark Studio turns vibe coding into guided creative learning for the next generation.*
