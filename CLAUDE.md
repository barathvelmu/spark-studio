# CLAUDE.md — Spark Studio Agent Instructions

## Project
Build **Spark Studio**, a remix-first AI coding playground for kids.

Spark Studio helps young creators turn ideas into playable mini-projects, inspect the code behind them, ask questions about the code, remix projects with credit, and learn the coding concepts behind every AI-assisted change.

For all UI work, follow design.md strictly. Use only the tokens, type scale, radii, shadows, and component patterns defined there. Never invent new colors, sizes, or radii — if something isn't covered, update design.md first, then code.

## Core Product Loop
**Idea → Build → Play → Inspect Code → Ask Code → Remix → Explain → Share**

Short demo loop:
**Build → Play → Code → Ask → Remix → Learn**

## Target User
Primary: kids ages 10–14.
Secondary: beginner teens, after-school clubs, libraries, community STEM programs, mentors, and students without access to advanced CS classes.

This is **general-purpose**, not classroom-only.

## Positioning
Use:
- “Scratch for the AI-native era”
- “A remix-first AI coding playground for kids”
- “A kid-friendly creative coding platform where every AI-generated change becomes a learning moment”

Avoid:
- “A better Scratch”
- “GitHub for kids”
- “AI tutor”
- “Full AI IDE”
- “Classroom management platform”

## Must-Have Features
1. Landing page
2. Idea Wall
3. Discover Projects page
4. Builder page
5. Project Detail page
6. Play tab
7. Code tab
8. Learn tab
9. Ask the Code panel
10. Remix flow
11. Fork/remix lineage
12. Structured positive reactions
13. Safety badge
14. Preloaded demo projects
15. Template-based generation

## Do Not Build
- Open comments
- Private messages / DMs
- Full GitHub version control
- Pull requests / branches
- Full Scratch clone
- Full visual block editor
- Full IDE
- Teacher dashboard
- Complex auth
- Real-time multiplayer
- Marketplace
- Arbitrary unbounded code generation

## Technical Direction
Use a frontend-first stack:
- Next.js
- React
- Tailwind CSS
- TypeScript
- Local mock data first
- localStorage optional
- Supabase optional only after core demo works
- LLM API optional for generation/remix/Ask the Code

Prefer **template-based generation**:
- React templates create stable playable mini-projects.
- AI returns project config, content, summaries, and explanations.
- Do not depend on arbitrary executable AI-generated JS for the demo.

## Core Templates
Minimum:
1. Collector Game
2. Quiz Game
3. Choose-Your-Own-Adventure Story

Optional:
4. Clicker Game

## Project Detail Tabs
Every project page must show:
- **Play**: live playable preview
- **Code**: beginner-friendly code snippets or simplified HTML/CSS/JS
- **Learn**: concepts, change summary, next challenge
- **Ask the Code**: project-specific Q&A grounded in the current project

## Ask the Code Rules
The code assistant should answer only about the current project.

Allowed:
- “What does this line do?”
- “How does the score work?”
- “Where does the player move?”
- “How does the game know I collected plastic?”
- “How do I add a timer?”
- “How can I make it harder?”

Avoid:
- General chatbot behavior
- Unrelated topics
- Unsafe content
- External links
- Private/personal advice
- Random full-app generation

## Safety Rules
Because this is for kids:
- No open comments
- No DMs
- No real names required
- No personal data collection inside generated projects
- No mature/violent/hateful content
- No external links in generated projects
- Structured reactions only
- Show “Safety checked” badge
- Redirect unsafe prompts into safe project ideas

## Demo Path Must Work
Hardcode/preload enough data so this path works even if the API fails:

1. Open Idea Wall
2. Choose “Ocean Cleanup Game”
3. Generate playable collector game
4. Open Code tab
5. Ask: “How does the score work?”
6. Remix: “Make it about space junk”
7. Show “Forked from Ocean Cleanup Game”
8. Show Learn tab: variables, events, conditionals, loops
9. Publish to Discover

## Judging Lines
If asked “Why not Scratch?”:
> Scratch made creative coding accessible through blocks. Spark Studio brings that same creative-learning spirit into the AI era, where students can build from ideas, inspect the code, ask questions, and remix with understanding.

If asked “Are kids actually learning?”:
> Spark Studio does not hide the code. Every project has a Play tab, Code tab, Ask the Code panel, and Learn tab, so students can understand what AI helped them build.

If asked “Why not ChatGPT?”:
> ChatGPT gives an answer. Spark Studio gives a full creative learning environment: project preview, codebase, code Q&A, remix lineage, safety, and learning summaries.

## Build Priority
1. Make the demo path work.
2. Make it visually polished.
3. Add code view and Ask the Code.
4. Add remix lineage.
5. Add AI calls only after the static/template flow is reliable.
6. Add backend/persistence only if everything else is done.

## Final Product Sentence
Spark Studio turns vibe coding into guided creative learning for the next generation.
