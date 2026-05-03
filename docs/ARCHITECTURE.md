# ARCHITECTURE.md — How Spark Studio Works

A walkthrough of the data flows, key abstractions, and design decisions behind Spark Studio. Written after the build, reflecting what actually shipped.

---

## High-level shape

```
┌────────────────────────────────────────────────────────────────────┐
│  Browser                                                           │
│                                                                    │
│  ┌───────────────────────┐    ┌──────────────────────────────┐    │
│  │ Pages (App Router)    │    │ Local persistence             │    │
│  │ - /                   │    │ - localStorage                │    │
│  │ - /ideas              │◄──►│   spark.projects.v1           │    │
│  │ - /discover           │    │   spark.accounts.v1           │    │
│  │ - /builder            │    │   spark.session.v1            │    │
│  │ - /project/[id]       │    │   spark.reactions.v1          │    │
│  │ - /account            │    │   spark.savedIdeas.v1         │    │
│  │ - /u/[handle]         │    └──────────────────────────────┘    │
│  └─────────┬─────────────┘                                         │
│            │                                                       │
│            │ React state + lib/projectStore + lib/auth             │
│            ▼                                                       │
│  ┌───────────────────────┐                                         │
│  │ Templates (client)    │                                         │
│  │ - CollectorGame       │                                         │
│  │ - QuizGame            │                                         │
│  │ - StoryGame           │                                         │
│  └───────────────────────┘                                         │
│                                                                    │
└──────────────────────────────────┬─────────────────────────────────┘
                                   │ POST /api/*
                                   ▼
┌────────────────────────────────────────────────────────────────────┐
│  Server (Next.js Route Handlers)                                   │
│                                                                    │
│  /api/generate-project ┐                                           │
│  /api/remix-project    ├─► lib/anthropic.ts ──► Anthropic SDK     │
│  /api/ask-code         │      (Claude Opus 4.7, effort: low)       │
│  /api/tinker           ┘                                           │
│                                                                    │
│  Each route falls back to deterministic mocks if Claude is         │
│  unavailable (no API key, network error, parse failure, refusal).  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## The four data flows

### 1. Build flow (Idea → playable project)

```
/ideas (IdeaCard click)
  → /builder?ideaId=idea_ocean
    → BuilderPage useEffect auto-fires when hydrated
      → requireAuth({ reason: "build", onSuccess: buildWithCreator })
        → if signed in: buildWithCreator runs immediately
          if signed out: AuthModal opens → email → 6-digit demo code → handle/avatar → onSuccess fires
            → POST /api/generate-project { prompt, projectType, ideaId, creatorId }
              → server: askClaudeJson<ClaudeShape>(SYSTEM_HINT, userMessage)
                → Claude returns theme/title/description/changeSummary
                → makeCollectorCode(player, collectible, background, noun)
                  → returns runnable kid-friendly { html, css, js }
                → return ProjectDraft
              → fallback if Claude fails: generateProjectDraft (keyword theme picker)
            → client: projectStore.createProject(draft)
              → assigns id + createdAt + remixCount=0 + published=false
              → writes to localStorage spark.projects.v1
            → router.push(`/project/${project.id}`)
              → ProjectDetailClient hydrates from seed first (SSR-safe), then localStorage in useEffect
                → Play tab renders the matching template with project.config
```

The split is deliberate: **Claude shapes config (theme, copy)** and **`makeCollectorCode` deterministically produces the code strings**. This means a malformed Claude response can't break the live preview — the worst case is that the fallback `generateProjectDraft` runs instead, and the kid still gets a playable game.

### 2. Ask the code flow

```
ProjectDetailClient (Code tab)
  → user types question / clicks suggested chip
    → AskTheCodePanel.ask(question)
      → POST /api/ask-code { projectId, question, project: {id, codeHtml, codeCss, codeJs} }
        → server: fast-path lookup if projectId === "p_ocean" and question matches a prewritten key
          → returns canned answer + line highlights (lib/mockData.oceanCleanupAskAnswers)
        → otherwise askClaudeJson<ClaudeShape>(SYSTEM_HINT including project source)
          → Claude returns answer + relatedConcepts + suggestedNextQuestions + highlightLines
        → fallback if Claude fails: generic "I only know about this project" message + suggested chips
      → client: append assistant bubble + maybe call onLookHere(file, lines)
        → ProjectDetailClient setActiveFile + setHighlight
          → CodeView renders the highlighted row with a primary left border
```

The fast-path matters for the demo because Claude latency on a slow connection can break flow. The Ocean project's three demo questions ("How does the score work?", "Where does the player move?", "How can I make it harder?") return in ~10ms regardless of network, while other projects fall through to the live model with the project's actual code as grounding.

### 3. Tinker Mode flow

```
ProjectDetailClient (Code tab)
  → user clicks "✨ Suggest a tinker"
    → TinkerMode fetches POST /api/tinker { projectId }
      → server: askClaudeJson<TinkerSuggestion>(SYSTEM_HINT, project source)
        → Claude returns { summary, file, before, after, concept, explanation, highlightLines? }
        → server validates: source.includes(before) — required, otherwise the apply would be a no-op
      → fallback: pickTinkerSuggestion(project) walks lib/tinker rules and returns the first whose `before` substring matches
    → client: TinkerMode shows suggestion card with diff preview (red strikethrough → green)
      → user clicks Apply
        → ProjectDetailClient.applyEdit(file, before, after)
          → finds current source for that file (effectiveProject)
          → if !current.includes(before): no-op (defends against stale suggestions)
          → setTinkered({ ...prev, [file]: current.replace(before, after) })
          → effectiveProject derives codeHtml/Css/Js from { ...project, ...tinkered }
          → CodeView re-renders the new code; AskTheCodePanel and the Play tab also see effectiveProject
        → onLookHere(file, suggestion.highlightLines) auto-switches CodeView to the right tab + highlights the changed line
```

Tinker edits are intentionally **session-only**: the tinkered state lives in component state, not localStorage. Reload and you start from the original. This keeps the demo predictable and gives the kid an obvious "reset" via refresh.

### 4. Remix flow

```
ProjectDetailClient header → "🔁 Remix this" → RemixModal opens
  → user picks a preset chip (Change theme / Add timer / Make it harder / ...) OR types free-text
  → click Remix
    → requireAuth({ reason: "remix", onSuccess: doRemix })
      → if signed in: doRemix runs immediately
      → otherwise auth flow as in Build
    → POST /api/remix-project { parentProjectId, remixPrompt, creatorId }
      → server resolves parent project, calls Claude with parent context + remix prompt
      → returns child ProjectDraft with forkedFromProjectId set
      → fallback: generateRemixDraft (keyword-based theme swap)
    → client: projectStore.remixProject(parentId, draft)
      → creates child with new id + parent.remixCount++
    → router.push(`/project/${child.id}`)
      → LineageTree on the child page walks forkedFromProjectId chain up to root + scans for direct children
        → renders vertical chain: ancestors → "You are here" → children
```

---

## Key design decisions

**Template-based generation, not free-form code generation.** The model returns a structured `config` (player emoji, collectible, background, theme); deterministic React templates render it. A malformed Claude response degrades gracefully to the keyword-based fallback — the live preview is rock-solid.

**Hand-written code in the Code tab, not the React source.** What the kid sees in the Code tab is real, runnable HTML/CSS/JS that mirrors what the React template does. They could copy-paste it into three files and open it in any browser. This gives Ask the Code real line numbers to point at and makes Tinker Mode's edits visible and meaningful.

**Mock fallback on every Claude route.** Each `/api/*` route catches every failure mode (no key, network blip, malformed JSON, refusal, timeout) and returns deterministic mock output. Real Claude is the upgrade, not the dependency. `bash scripts/e2e.sh` exercises this end-to-end.

**Sync localStorage data layer.** No DB. `lib/projectStore.ts` is the single read/write boundary; swap the implementation and everything else keeps working. Anonymous projects + reactions + saved ideas migrate atomically into the user's account on first sign-in via `lib/anonymousMigration.ts`.

**Passwordless email auth with auto-generated handles.** The 6-digit demo code is shown directly in the modal (no email actually sent — clearly labeled as demo mode). On verification, `lib/usernameGenerator.ts` mints a kid-friendly handle (`@pluckynewt619`); the user can reroll or skip to the avatar grid. **No real names, no DMs, no open comments — kid-safe by construction.**

**SSR-safe hydration.** `ProjectDetailClient`, `LineageTree`, and `Header.UserMenu` all initialize from seed data on the server, then refine from localStorage in `useEffect`. The seed-included projects (Ocean / Space Junk / Climate Quiz / Kindness Quest / Dragon Star) render fully on first paint — no flash of "not found", no hydration mismatch warnings.

**Deferred onSuccess for new-account auth gates.** When a fresh user signs up via the Build or Remix gate, the `onSuccess` callback (which navigates to the new project) is held until the AuthModal's profile step is confirmed. Otherwise the modal would float over the next page.

**Claude config: `claude-opus-4-7` with adaptive thinking off, `effort: low`.** Latency-sensitive interactive endpoints (Ask, Tinker) need to feel snappy; `effort: low` plus no thinking keeps p50 under ~2s in practice. `lib/anthropic.ts` has a 20-second wall-clock timeout via AbortController so a stuck request can't strand the UI.

---

## Where to extend

| Want to add… | Touch these files |
|---|---|
| Real DB (Supabase) instead of localStorage | `lib/projectStore.ts`, `lib/accountStore.ts`, `lib/savedIdeas.ts` — these are the only async/await boundaries needed |
| Real email delivery for the auth code | `lib/accountStore.ts` `issueEmailCode`; the modal already labels itself "demo mode" today |
| A 4th template (e.g., ClickerGame) | Add `components/templates/ClickerGame.tsx`, extend `ProjectType` in `lib/types.ts`, add a branch to `PlayTab` in `ProjectDetailClient`, seed an example in `mockData.ts` |
| New tinker rule | Append to the `RULES` array in `lib/tinker.ts` — each rule checks for a substring in source and returns a `TinkerSuggestion` |
| New theme keyword for the builder | Append to `collectorThemes` in `lib/templateGenerator.ts` |
| Search/filter on Discover | `app/discover/page.tsx` + new client wrapper around `DiscoverGrid` |
| Animated branching lineage | `components/LineageTree.tsx` — the data layer in `lib/lineage.ts` already returns a tree; the component renders it as a vertical chain |

---

## Production verification

```bash
npm run typecheck    # strict mode, no errors
npm run build        # all 12 routes compile (4 dynamic API + 8 pages)
bash scripts/e2e.sh  # 25+ checks: routes, demo-string presence in HTML, all 4 API shapes
```

The dev server has a known Next 15.0.4 HMR/CSS-manifest race that occasionally serves a 404 for `/_next/static/css/app/layout.css` after concurrent requests. Production mode (`npm run start`) bypasses HMR entirely and is the right way to view + record the demo.
