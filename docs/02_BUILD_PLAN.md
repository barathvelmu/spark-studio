# 02_BUILD_PLAN.md — Build Plan

## Principle
Build the polished demo path first. Add sophistication only after the core loop works.

## Locked Decisions (pre-execution)
1. **Code tab is real code.** Hand-written, beginner-friendly `index.html`, `style.css`, `game.js` snippets for Ocean Cleanup (~40–60 lines total, with comments). This is the spine of Code → Ask → Learn — do not ship templated/pseudo-code.
2. **One must-ship template: CollectorGame.** QuizGame and StoryGame are stretch goals only.
3. **Lock `lib/types.ts` + `lib/mockData.ts` together first** (~15 min, both collaborators) before splitting work. Everything else builds on these shapes.
4. **Tinker Mode (stretch):** Claude proposes one safe edit (e.g. "increase speed"), kid taps Apply, code visibly changes in the viewer. Makes the AI feel agentic, not just config-swap.
5. **Pitch lead:** "Every AI-generated change becomes a learning moment." Lead with the learning angle, not the kids angle.

## Recommended Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Optional shadcn/ui
- Mock data/local state first
- Optional localStorage
- Optional Supabase only after core demo works
- Optional LLM API after template flow works

## Architecture
Use template-based generation.

AI should generate/configure:
- title
- description
- projectType
- theme
- player/character
- collectible/questions/story branches
- concepts
- changeSummary
- learningSummary
- nextChallenge

React templates should render:
- Collector Game
- Quiz Game
- Story Game

This avoids demo-breaking arbitrary generated JavaScript.

## File Structure

```txt
/app
  /page.tsx
  /ideas/page.tsx
  /discover/page.tsx
  /builder/page.tsx
  /project/[id]/page.tsx
  /api/generate-project/route.ts
  /api/remix-project/route.ts
  /api/ask-code/route.ts

/components
  Header.tsx
  Hero.tsx
  IdeaCard.tsx
  ProjectCard.tsx
  BuilderPanel.tsx
  ProjectPreview.tsx
  CodeView.tsx
  AskTheCodePanel.tsx
  LearningSummary.tsx
  RemixControls.tsx
  LineageView.tsx
  ReactionButtons.tsx
  SafetyBadge.tsx
  templates/
    CollectorGame.tsx
    QuizGame.tsx
    StoryGame.tsx

/lib
  mockData.ts
  types.ts
  projectTypes.ts
  templateGenerator.ts
  aiPrompts.ts
  safety.ts
```

## Data Types

```ts
type ProjectType = "collector_game" | "quiz_game" | "story" | "clicker";

type Project = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  projectType: ProjectType;
  forkedFromProjectId?: string;
  originalIdeaId?: string;
  config: any;
  tags: string[];
  concepts: string[];
  codeHtml?: string;
  codeCss?: string;
  codeJs?: string;
  learningSummary: string;
  changeSummary: string[];
  nextChallenge: string;
  safetyStatus: "checked" | "needs_review";
  remixCount: number;
  createdAt: string;
};
```

## Five-Hour Execution Plan

### Hour 0–0.5
- Create Next.js app
- Install Tailwind
- Create routes
- Create mock data
- Build header/layout

### Hour 0.5–1.5
- Landing page
- Discover page
- Project cards
- Project detail page

### Hour 1.5–2.5
- CollectorGame template
- QuizGame template if time
- StoryGame template if time
- Project preview renderer

### Hour 2.5–3.25
- Builder form
- Generate project from template/config
- Remix button
- Create child project in local state
- Show fork lineage

### Hour 3.25–4.0
- CodeView
- AskTheCodePanel
- Learn tab
- Concept chips
- Safety badge

### Hour 4.0–5.0
- Polish UI
- Add preloaded demo path
- Ensure API fallback
- Practice demo

## Build Priority
1. `types.ts` + `mockData.ts` locked
2. CollectorGame template + hand-written code snippets for Ocean Cleanup
3. Demo path works end-to-end with mock data
4. UI looks excellent (per design.md)
5. Play/Code/Learn tabs work
6. Ask the Code works with suggested Q&A
7. Remix lineage works
8. AI calls work if available
9. Tinker Mode (stretch)
10. QuizGame / StoryGame (stretch)
11. Persistence/backend (cut unless everything above is done)

## Cut First
- Auth
- Real database
- Direct code editing
- Comments
- Teacher dashboard
- Real-time collaboration
- Full AI code generation
