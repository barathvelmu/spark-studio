# 04_AI_AND_API.md — AI/API Plan

> **Pre-build planning artifact.** The AI strategy and route shapes we drafted before writing any code. The actual implementation is in [`lib/anthropic.ts`](../lib/anthropic.ts) and [`app/api/`](../app/api). The Tinker Mode endpoint described below shipped as `app/api/tinker/route.ts`. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for how it all fits together.

## API Credit Strategy
$25 of API credits is enough for a hackathon prototype if calls are constrained.

Do not call the LLM on every keystroke.
Only call on:
1. Generate project
2. Remix project
3. Ask the Code

Cache or store outputs locally.

## Core AI Principle
AI should return structured data, not unbounded prose or arbitrary code.

## Recommended Endpoints

(Stretch endpoint: `POST /api/tinker` — see Tinker Mode below.)


### POST /api/generate-project
Input:
```json
{
  "idea": "A turtle collects plastic from the ocean",
  "projectType": "auto"
}
```

Output:
```json
{
  "title": "Ocean Cleanup Game",
  "description": "Move the turtle to collect plastic and protect the ocean.",
  "projectType": "collector_game",
  "config": {
    "player": "🐢",
    "collectible": "🧴",
    "background": "ocean",
    "goal": "Collect plastic and earn points"
  },
  "tags": ["Game", "Environment", "Beginner"],
  "concepts": ["variables", "events", "conditionals", "loops"],
  "changeSummary": [
    "Created a turtle player",
    "Added plastic as the collectible",
    "Added a score that increases when plastic is collected"
  ],
  "learningSummary": "This project uses a score variable, keyboard events, a game loop, and a condition that checks when the turtle touches plastic.",
  "nextChallenge": "Try adding a timer or a level-up when score reaches 10."
}
```

### POST /api/remix-project
Input:
```json
{
  "parentProject": { "...": "..." },
  "remixPrompt": "Make it about space junk instead of ocean plastic"
}
```

Output:
```json
{
  "title": "Space Junk Rescue",
  "description": "Move the astronaut to collect space junk.",
  "projectType": "collector_game",
  "config": {
    "player": "👩‍🚀",
    "collectible": "🛰️",
    "background": "space",
    "goal": "Collect space junk and earn points"
  },
  "changeSummary": [
    "Changed the player from turtle to astronaut",
    "Changed plastic into space junk",
    "Changed the background from ocean to space",
    "Kept the scoring and collision logic"
  ],
  "concepts": ["variables", "events", "conditionals", "loops"],
  "learningSummary": "You reused the same movement, score, and collision logic, but changed the theme and objects.",
  "nextChallenge": "Try adding a timer."
}
```

### POST /api/ask-code
Input:
```json
{
  "project": { "...": "..." },
  "codeContext": "let score = 0; ...",
  "question": "How does the score work?"
}
```

Output:
```json
{
  "answer": "The score starts at 0. When the player touches the collectible, the game adds 1 to score and updates the text on the screen.",
  "relatedConcepts": ["variables", "conditionals"],
  "suggestedNextQuestions": [
    "Where does the game check collision?",
    "How can I add a timer?"
  ]
}
```

## Tinker Mode (stretch)
Claude proposes a small, safe edit to the current project's code (e.g. "make the player faster," "add a second collectible"). The kid taps Apply and the code visibly changes in the viewer. Goal: the AI feels agentic, not just a config-swap.

### POST /api/tinker
Input:
```json
{ "project": { "...": "..." }, "codeContext": "...", "intent": "make it harder" }
```

Output:
```json
{
  "summary": "Speed up the player so the game is harder.",
  "filePath": "game.js",
  "lineRange": [12, 12],
  "before": "let speed = 4;",
  "after": "let speed = 7;",
  "concept": "variables",
  "explanation": "Changing the speed variable makes the player move faster each frame."
}
```

Constraints: single-file, single-hunk, ≤ ~5 lines changed, must map to one of the tracked concepts.

## Safety Prompt Rules
The model must:
- Keep content age-appropriate
- Reject sexual, hateful, violent, self-harm, or dangerous prompts
- Avoid external links
- Avoid collecting personal data
- Keep generated projects inside supported templates

## Fallbacks
If AI fails:
- Use preloaded Ocean Cleanup Game
- Use preloaded Space Junk Rescue remix
- Use prewritten code Q&A for “How does the score work?”
- Use prewritten learning summary

## Cost Control
- Use short prompts
- Return JSON only
- Use low/medium token outputs
- Do not generate huge code blocks
- Generate configs/summaries instead of full apps
- Cache successful generations
