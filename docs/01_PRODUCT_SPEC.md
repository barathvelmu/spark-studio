# 01_PRODUCT_SPEC.md — Product Specification

> **Pre-build planning artifact.** The spec we wrote before the build started. Some MVP items below were cut, several stretch items shipped. For what actually shipped, see [`README.md`](../README.md).

## One-Liner
Spark Studio helps young creators turn ideas into playable mini-projects, inspect the code, ask questions, remix other projects, and learn the coding concepts behind every AI-assisted change.

## Main User Flow
1. User opens landing page.
2. User explores ideas or projects.
3. User chooses an idea or writes a prompt.
4. Builder creates a mini-project from a supported template.
5. User plays the project.
6. User opens Code tab.
7. User asks questions about the code.
8. User remixes project.
9. New project shows “Forked from ___.”
10. Learn tab explains what changed and what concepts were used.
11. User publishes/shares project.

## MVP Pages

### 1. Landing Page
Goal: Explain product fast.

Must include:
- Hero: “Create, remix, and learn with AI.”
- Subheadline
- CTA: Start Building
- CTA: Explore Projects
- How it works: Idea → Build → Play → Code → Remix → Learn
- Featured projects
- Safety note

### 2. Idea Wall
Goal: Let users start from ideas.

Must include:
- Idea cards
- Tags
- Build this idea button
- Save idea button
- No comments

### 3. Discover Projects
Goal: Browse playable remixable projects.

Must include:
- Project grid
- Project cards
- Play button
- Remix button
- Concept chips
- Remix count
- Forked-from badge

### 4. Builder Page
Goal: Create a mini-project from prompt.

Layout:
- Left: prompt/project type/remix controls
- Center: live preview
- Right: learning summary

Must include:
- Prompt input
- Project type selector: Auto, Game, Quiz, Story
- Generate button
- Remix controls
- Publish/save button

### 5. Project Detail Page
Goal: Show the project, code, learning, lineage, and remix options.

Must include:
- Project title
- Creator
- Forked/remixed from
- Tabs: Play, Code, Learn
- Ask the Code panel
- Remix button
- Lineage
- Structured reactions
- Safety badge

## Core Feature: Remix
A remix creates a new project that points to the parent project.

User-facing language:
- Remixed from
- Built on
- Inspired by
- Optional: Forked from

## Core Feature: Code View
Every project exposes kid-friendly **real** code.

Format (locked): three files — `index.html`, `style.css`, `game.js` — hand-written for Ocean Cleanup as the gold standard (~40–60 lines total). Other templates match this shape.

Code must include kid-friendly comments. No pseudo-code, no abstract "Structure / Design / Logic" sections — Ask the Code and Learn both depend on real, line-addressable code.

## Core Feature: Ask the Code
A project-specific assistant for code questions.

It should answer only using the current project context.

## Core Feature: Learn Tab
Must explain:
- What changed
- What was reused
- Coding concepts
- Next challenge
