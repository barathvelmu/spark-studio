# tasks.md — Spark Studio Hackathon

> **Hackathon execution plan, frozen at kickoff.** Split work between Barath (Spine: Builder, Project Detail, templates, Code/Ask/Tinker, API routes) and Ashrit (Surrounds: design system, Landing, Discover, cards, auth, publish). Most must-ship items shipped; many stretch items did too. For the final state, see [`README.md`](./README.md).


> **Pitch lead:** Every AI-generated change becomes a learning moment.
> **Demo path:** Idea Wall → click Ocean Cleanup → generate → Play → Code → Ask "how does score work?" → Remix to Space Junk → show "Forked from" → Learn tab → Publish.
> **Must-ship:** demo path works end-to-end with mock data + CollectorGame.
> **Stretch:** Tinker Mode, QuizGame, StoryGame, real Claude API calls, persistence.

---

## Conventions

- **Branches:** `feat/<short-name>` per task, merge to `main` often (every ~45 min). No long-lived branches.
- **Shared files** (`lib/types.ts`, `lib/mockData.ts`, `tailwind.config.ts`, `tokens.css`): coordinate before editing. Owner listed under each file.
- **design.md is law.** No new colors, radii, fonts, shadows. If you need one, edit `docs/03_design.md` first.
- **Mock first.** No Claude API calls until the static demo path is fully working.
- **Components live in `/components`** (Ashrit owns most). **Pages live in `/app`** (split per task).
- **Update this file** as you complete items — check the boxes, leave a short note if blocked.

---

## Phase 0 — Together (first ~15 min, both at the same machine or on a call)

- [ ] `npx create-next-app@latest` (TypeScript, Tailwind, App Router, no src dir, import alias `@/*`)
- [ ] `lib/types.ts` — lock the `Project`, `Idea`, `User`, `ProjectType`, `Concept` types (per `02_BUILD_PLAN.md`)
- [ ] `lib/mockData.ts` — seed 5 users, 5 ideas, 5 projects (per `05_CONTENT_AND_DEMO.md`); Ocean Cleanup must include the hand-written `codeHtml`/`codeCss`/`codeJs` strings
- [ ] Stub all routes so neither dev hits 404s:
  - `app/page.tsx` (Landing)
  - `app/ideas/page.tsx` (Idea Wall)
  - `app/discover/page.tsx` (Discover)
  - `app/builder/page.tsx` (Builder)
  - `app/project/[id]/page.tsx` (Project Detail)
- [ ] `tokens.css` + `tailwind.config.ts` scaffolded with all tokens from `docs/03_design.md` (Ashrit drives, Barath reviews)
- [ ] `lib/projectStore.ts` skeleton — `getProject(id)`, `createProject(...)`, `remixProject(parentId, prompt)`, persisted to `localStorage` (Barath drives, Ashrit reviews)
- [ ] First commit + push so Ashrit can pull

---

## Barath — Spine (Build/Inspect logic, the demo path runs through your code)

### Builder + generation flow
- [ ] `/components/BuilderPanel.tsx` — three-panel layout per `design.md` §6 (left controls, center preview, right learning summary)
- [ ] Prompt input (textarea, project type selector: Auto/Game/Quiz/Story)
- [ ] "Generate" button → calls `lib/templateGenerator.ts` (mock for now: keyword match → CollectorGame config)
- [ ] On generate: write project to store, navigate to `/project/[id]`
- [ ] "Building your project…" loading state per `design.md` §7.7
- [ ] Idea Wall → Builder handoff: clicking an idea preloads the prompt + auto-generates

### CollectorGame template (the only must-ship template)
- [ ] `/components/templates/CollectorGame.tsx` — playable in a `<canvas>` or DOM, keyboard arrows, score, collision, win condition
- [ ] Reads `config.player`, `config.collectible`, `config.background` so remix works just by swapping config
- [ ] Verify: turtle → astronaut, plastic → space junk works without touching the template

### Hand-written Ocean Cleanup code (the spine of Code/Ask/Learn)
- [ ] `index.html` — ~15 lines, includes canvas + score div
- [ ] `style.css` — ~15 lines, kid-friendly comments
- [ ] `game.js` — ~30 lines: `let score = 0`, keyboard listener, collision check, score update. Heavy comments.
- [ ] Stored as strings on the Ocean Cleanup project in `mockData.ts`

### Project Detail page
- [ ] `app/project/[id]/page.tsx` — header (title, creator, forked-from, safety badge, remix button), then tab strip
- [ ] Tab: **Play** — renders the matching template with project's config
- [ ] Tab: **Code** — `<CodeView>` showing the three files (tabs within tab: HTML / CSS / JS)
- [ ] Tab: **Learn** — `learningSummary`, `changeSummary` list, concept chips, `nextChallenge` callout
- [ ] `<AskTheCodePanel>` slot inside Code tab (right side desktop, sheet on mobile)

### CodeView
- [ ] `/components/CodeView.tsx` — monospace, line numbers, syntax highlight (use `prismjs` or `shiki`)
- [ ] Per-line "Ask about this" hover affordance per `design.md` §7.9
- [ ] "Look here" highlight: line bg + 3px primary left border, controlled by prop

### Ask the Code
- [ ] `/components/AskTheCodePanel.tsx` — chat bubbles per `design.md` §7.10
- [ ] Suggested-question chips: "How does the score work?", "How can I make it harder?", "Where does the player move?"
- [ ] `lib/askCodeMock.ts` — prewritten answers keyed by question text (must include the demo question)
- [ ] Clicking an inline code reference scrolls + highlights that line in `CodeView`

### Remix flow
- [ ] Remix button on Project Detail → modal with prompt input ("Make it about space junk instead of ocean plastic")
- [ ] On submit: `remixProject(parentId, prompt)` — creates new project with `forkedFromProjectId` set, swaps config via mock generator
- [ ] Navigate to new project; show "Forked from Ocean Cleanup Game" in header (`<LineageView>` component owned by Ashrit)
- [ ] Verify demo: Ocean Cleanup → "Make it about space junk" → Space Junk Rescue plays correctly

### API routes (mock now, real Claude later if time)
- [ ] `app/api/generate-project/route.ts` — returns mock JSON for now
- [ ] `app/api/remix-project/route.ts` — returns mock JSON for now
- [ ] `app/api/ask-code/route.ts` — returns mock JSON for now
- [ ] If time: swap mocks for real Anthropic SDK calls (use `claude-haiku-4-5-20251001` for Ask, `claude-sonnet-4-6` for generate/remix)

### Stretch (only after must-ship is green)
- [ ] **Tinker Mode** — `app/api/tinker/route.ts` per `04_AI_AND_API.md`; "Suggest a tinker" button in Code tab; Apply button replaces the line range and re-renders Play
- [ ] QuizGame template
- [ ] StoryGame template

---

## Ashrit — Surrounds (chrome, browse surfaces, design system)

### Design system
- [ ] `tokens.css` — every CSS variable from `docs/03_design.md` §2–4 (colors, code palette, spacing, radii, shadows, easings)
- [ ] `tailwind.config.ts` — extend `colors`, `borderRadius`, `boxShadow`, `fontFamily`, `fontSize`, `spacing` to the tokens. Don't use Tailwind defaults for these.
- [ ] `next/font` setup: Nunito (display), Inter (body), JetBrains Mono (code)
- [ ] `app/layout.tsx` — apply font CSS vars, set `--color-bg` background, render `<Header>`
- [ ] `prefers-reduced-motion` global handling

### Primitives (`/components/ui/*`)
- [ ] `Button.tsx` — primary / secondary / ghost, sizes sm/md/lg per `design.md` §7.1
- [ ] `Input.tsx` + `Textarea.tsx` per §7.2
- [ ] `Modal.tsx` per §7.6
- [ ] `Toast.tsx` + provider per §7.8
- [ ] `Tabs.tsx` (pill-on-rail) per §7.4 — Barath uses this on Project Detail
- [ ] `Chip.tsx` (concept chips with stable color pairing per §7.5)
- [ ] `EmptyState.tsx` per §7.7

### Header + Landing
- [ ] `<Header>` — logo wordmark, links (Ideas, Discover, Build), CTA, sticky on scroll
- [ ] `app/page.tsx` Landing per `01_PRODUCT_SPEC.md` §1: hero, subheadline, two CTAs ("Start Building", "Explore Projects"), how-it-works strip, featured projects row, safety note
- [ ] Hero copy: "Make something only you would think of." Lead subheadline with "Every AI-generated change becomes a learning moment."

### Idea Wall
- [ ] `app/ideas/page.tsx` — grid `repeat(auto-fill, minmax(280px, 1fr))`, gap 32px
- [ ] `<IdeaCard>` — emoji thumbnail with stable gradient (per `design.md` §9), title, description, tags, "Build this" primary button, "Save" ghost button
- [ ] No comment input. No social inputs.

### Discover
- [ ] `app/discover/page.tsx` — same grid pattern
- [ ] `<ProjectCard>` per `design.md` §7.3: thumbnail (emoji-on-gradient for unbuilt, screenshot/canvas for built), title, description, concept chips, meta row (creator, remix count), footer (safety badge + Remix button)
- [ ] Hover lift: shadow + Y(-2px), 200ms

### Reusable components Barath imports
- [ ] `<SafetyBadge>` per `design.md` §7.5 — pill, success-soft bg, ShieldCheck icon, "Safety checked"
- [ ] `<ReactionButtons>` — six structured reactions per `design.md` §7.5 (💡 Inspired me, 🔁 I remixed this, ✨ Cool idea, 🎨 Great design, 🧠 Smart logic, 📚 I learned from this), localStorage-backed counts
- [ ] `<LineageView>` — "Forked from [parent title]" with avatar dot + link to parent project
- [ ] `<ConceptChip>` — pulls stable color from the concept→color table in `design.md` §7.5

### Polish pass (final 30 min, with Barath)
- [ ] Empty states everywhere (no projects yet, no ideas saved, etc.)
- [ ] Loading skeletons on Discover and Idea Wall
- [ ] Error state for failed generation
- [ ] Walk the demo path together, fix anything ugly

---

## Cut list (don't build unless everything above is done)
- Auth / accounts
- Real database / Supabase
- Direct code editing in the Code tab
- Open comments / DMs
- Teacher dashboard
- Real-time collaboration
- Full AI code generation (we use template-based)

---

## Demo rehearsal checklist (last 15 min)
- [ ] Hard refresh, run through demo path twice
- [ ] Verify Ocean Cleanup is playable
- [ ] Verify Ask the Code answers "How does the score work?" correctly
- [ ] Verify remix produces Space Junk Rescue and shows "Forked from"
- [ ] Verify Learn tab shows variables / events / conditionals / loops chips
- [ ] Verify safety badge visible everywhere
- [ ] Have screenshot/screen-record backup in case live demo flakes
