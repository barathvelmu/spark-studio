# Spark Studio — 10-Minute Hackathon Demo Script

Below is a beat-by-beat script. It's structured as **TIMESTAMP → ON-SCREEN ACTION → SAY EXACTLY THIS**, with director notes for each segment so you (or your editor) know what to capture.

**Total runtime: ~10:00**
**Tone:** confident, curious, kid-friendly. Slow down on the "learning moment" lines — those are your judging hooks.

---

## 0:00 – 0:45  |  Cold Open + Pitch Hook

**On screen:** Spark Studio landing page (`/`), animated emoji orbs floating, hero headline visible: *"Make something only you would think of."*

**Say:**
> "What if, instead of giving kids an answer, AI gave them a creative learning environment?
>
> This is Spark Studio — a remix-first AI coding playground for kids. We built it on one idea: **every AI-generated change should become a learning moment.**
>
> Scratch made coding creative through blocks. Spark Studio brings that same spirit into the AI-native era — kids describe an idea, watch it become a real playable project, inspect the actual code, ask questions about how it works, and remix anyone else's project with credit."

**Director note:** Keep it on the landing page during this whole intro. Let the floating background animation sell the vibe. Don't click anything yet.

---

## 0:45 – 1:30  |  The Core Loop (Landing Page Walkthrough)

**On screen:** Scroll slowly to the **"How it works"** section. Click each step icon (💡 Idea → 🛠️ Build → 🎮 Play → 📜 Code → 🔁 Remix → 📚 Learn) so the detail panel expands for each.

**Say:**
> "The whole product is one loop: **Idea → Build → Play → Code → Remix → Learn.**
>
> You start from an idea — yours or one from the wall. AI turns it into a real project. You play it in the browser. You open the code, which is written for beginners with comments on every line. You remix anything you find. And the Learn tab explains every concept the AI just used.
>
> Six steps. We're going to walk through all of them in the next eight minutes."

**Director note:** Click each of the six step icons and pause ~2 seconds on each detail card. This visually previews the rest of the demo.

---

## 1:30 – 2:15  |  Step 1 — The Idea Wall

**On screen:** Click **"Ideas"** in the top nav. Land on `/ideas`. Hover over a few cards. Pause on **"Ocean Cleanup Game 🐢"**.

**Say:**
> "First — the Idea Wall. Kids who don't know what to make hit the biggest wall in creative tools: the blank page. So we preload curated, kid-safe ideas across games, quizzes, and stories — Ocean Cleanup, Space Math Quest, Kindness Adventure, Healthy Habits, Recycling Sorter.
>
> Each one is tagged by template type and difficulty. Every card is a one-click start.
>
> Let's pick the classic: **Ocean Cleanup Game** — a turtle that collects plastic to protect the ocean."

**Director note:** Make the click on the Ocean card deliberate and visible.

---

## 2:15 – 3:15  |  Step 2 — Build (Template-Based Generation)

**On screen:** You're now on `/builder?ideaId=idea_ocean`. The prompt is pre-filled. The "Building your project…" dots animate, then the screen routes to `/project/[id]`.

**Say:**
> "When I tap an idea, Spark Studio sends it to the builder with the prompt already filled in.
>
> Here's a key product decision: **we don't generate arbitrary executable code from a model.** That's unsafe and unreliable for kids. Instead, the AI fills in a *template config* — player emoji, collectible, background, theme, goal — and we render that config through a hand-built React template. The result is always playable, always safe, and always works offline if the API ever fails.
>
> So in a few seconds we get a real, playable mini-project."

**Director note:** Let the loading dots play for their full ~2 seconds. Don't cut. The wait sells the "AI is working" feeling. When it lands on the project page, pause.

---

## 3:15 – 4:00  |  Step 3 — Play

**On screen:** You're on the project detail page, on the **Play** tab. The 🐢 turtle and 🧴 plastic are visible in the blue ocean play area. Use arrow keys. Collect plastic 2–3 times. The score ticks up: 1 → 2 → 3.

**Say:**
> "And there it is. Real game, in the browser, no downloads, no setup.
>
> Arrow keys move the turtle. Touch the plastic, the score goes up, the plastic respawns somewhere new. This is what 'AI built me a project' should actually mean — not a wall of text, a thing you can play in three seconds."

**Director note:** Make sure the score visibly increments on screen. That's the "it really works" beat.

---

## 4:00 – 5:15  |  Step 4 — Code (No Black Boxes)

**On screen:** Click the **Code** tab. Switch to the **JS** file. Scroll slowly through `oceanCleanupJs`. Hover over line 2 (`let score = 0;`) and line 25 (`function checkCollision()`).

**Say:**
> "This is the part that makes Spark Studio different from a chatbot. Hit the **Code** tab and you see the *real* HTML, CSS, and JavaScript behind the project. Not a hidden black box.
>
> Look at how it's written: short lines, plain-English comments above every block. *'Keep track of how many pieces of plastic we collected.' 'When the player presses an arrow key, move the turtle.'*
>
> The AI didn't just write code — it wrote code that **teaches as you read it.** Every line has an 'Ask about this line' button. Hover any row, tap it, and you get a kid-friendly explanation."

**Director note:** Pause on the JS file long enough that judges can read 1–2 commented blocks. The comments are the proof.

---

## 5:15 – 6:30  |  Step 5 — Ask the Code (Project-Grounded Q&A)

**On screen:** On the right side panel, the **Ask the code** chat is visible. Click the suggested chip **"How does the score work?"**. Wait for the answer to render. Then type and send: **"How can I add a timer?"**

**Say:**
> "Now the magic. This panel on the right is **Ask the Code.** It's not a general chatbot — it only knows about *this* project. Look — the header literally says *'I only know about this project.'*
>
> I'll click 'How does the score work?' …
>
> *(answer renders)*
>
> See that? Plain language: *'The score starts at 0. Each time the turtle touches the plastic, the game adds 1.'* And it can highlight the exact lines in the code that do it.
>
> Let me try one more — *(types)* 'How can I add a timer?' …
>
> Notice it stays scoped to this project — variables, events, conditionals from *this* code. That's deliberate. Kids ask coding questions inside the context of something they made. **Curiosity becomes learning.**"

**Director note:** Speak through the question while the answer streams in — don't have dead air. If the AI response is slow, click a suggested chip first as a safety net.

---

## 6:30 – 7:45  |  Step 6 — Remix (with Lineage)

**On screen:** Click the **🔁 Remix this** button (top right). Modal opens. In the prompt box type: **"Make it about space junk instead of ocean plastic."** Hit Remix. Loading dots. Land on the new project page. Pause on the **"🔁 Forked from Ocean Cleanup Game"** lineage pill at the top.

**Say:**
> "Sixth piece of the loop — remix.
>
> I love this Ocean Cleanup Game, but I want to make it about space junk. I hit Remix… *(types)* 'Make it about space junk instead of ocean plastic.'
>
> *(loading)*
>
> A new project. Astronaut instead of turtle, satellites instead of plastic, deep-space background instead of ocean. **Same logic, new theme.**
>
> And — this is important — look at the top of the page: **'Forked from Ocean Cleanup Game.'** Every remix preserves lineage. Click that pill, you go back to the original. Maya, who made the first version, gets credit forever. This is GitHub-style attribution, designed to feel kid-friendly instead of intimidating."

**Director note:** Hover the "Forked from" pill so judges see it's a real link. Optionally play the new game for 2 seconds to show the astronaut moves and the score works — proof the remix is real, not cosmetic.

---

## 7:45 – 8:45  |  Step 7 — Learn (The Anthropic Hook)

**On screen:** Click the **Learn** tab on the remixed Space Junk project. Show the three sections: **What changed**, **Concepts** (with chips: variables, events, conditionals, loops), **Next challenge**. Hover one of the concept chips.

**Say:**
> "And here's the closing move — the **Learn** tab. This is where every AI-generated change becomes a learning moment.
>
> 'What changed': *'Changed the player from turtle to astronaut. Changed plastic into space junk. Kept the scoring and collision logic.'* The AI explains its own remix in plain English.
>
> 'Concepts': **variables, events, conditionals, loops** — the actual computer science concepts the AI used, displayed as friendly chips. Tap any one and you get a kid-friendly definition.
>
> And finally — 'Next challenge': *'Try adding a timer.'* We don't just hand kids a finished thing. We hand them the next step.
>
> This is the answer to the question every educator asks about AI: *'Are kids actually learning anything?'* On Spark Studio, yes — because we **never hide the code, we always explain the change, and we always hand them the next challenge.**"

**Director note:** This is your money beat. Slow down. The Learn tab is the difference between Spark Studio and ChatGPT.

---

## 8:45 – 9:15  |  Safety + Publish

**On screen:** Scroll up on the same page. Click the **🚀 Publish to Discover** button. Toast appears: *"Nice one! It's live on Discover."* Click into **Discover** in the nav. Show the new project card on the grid.

**Say:**
> "One more thing — every project is safety-checked. Look for the **green safety badge** on every page. No open comments. No DMs. No personal data collection. Just structured positive reactions.
>
> When I'm proud of my project, I hit **Publish**, and it appears on the Discover page where other kids can play and remix it. The loop closes."

**Director note:** Quick segment, but the safety badge needs to be clearly visible — it's a hackathon judging criterion at Anthropic.

---

## 9:15 – 10:00  |  Closing Pitch

**On screen:** Cut back to the landing page hero. Hold on the headline: *"Make something only you would think of."*

**Say:**
> "So that's Spark Studio. **Idea, Build, Play, Code, Ask, Remix, Learn** — the whole creative-coding loop, designed for the AI-native generation.
>
> Scratch lowered the barrier from syntax to blocks. **Spark Studio lowers the barrier from blank page to creative software** — while preserving learning through code inspection, project-grounded Q&A, remix lineage, and kid-friendly concept explanations.
>
> ChatGPT gives an answer. Spark Studio gives a full creative learning environment.
>
> **Spark Studio turns vibe coding into guided creative learning for the next generation.**
>
> Thanks."

**Director note:** End on the hero. Let the orbs animate for 2 seconds of silence before cutting. Cinematic close.

---

## Pre-Recording Checklist

Before you hit record, do this in order to guarantee a clean take:

| # | Action | Why |
|---|---|---|
| 1 | Open the dev server: `npm run dev`. | App needs to be live. |
| 2 | Sign in once first as **Maya** (or your demo account) so the auth modal doesn't pop mid-demo. | Avoid auth gate interrupting the flow at Build/Remix. |
| 3 | Visit `/` and `/project/p_ocean` once to warm Next.js route compilation. | First page load is slow in dev. |
| 4 | Have these tabs pre-pinned in order: `/`, `/ideas`, `/project/p_ocean` (don't click into them — just have history ready). | Smooth nav. |
| 5 | Set browser zoom to 110–125% so code and chat text reads clearly on video. | Readability. |
| 6 | Close every other tab and disable notifications. | No bubble pop-ups. |
| 7 | Test the **Ask the Code** API once with "How does the score work?" before recording. | If the LLM is slow/down, you fall back to a suggested chip. |
| 8 | Practice the remix prompt typing once: *"Make it about space junk instead of ocean plastic."* | Don't fumble the headline moment. |

---

## Time-Budget Cheat Sheet

| Segment | Length | Cumulative |
|---|---|---|
| Cold open + pitch hook | 0:45 | 0:45 |
| Core loop walkthrough | 0:45 | 1:30 |
| Idea Wall | 0:45 | 2:15 |
| Build | 1:00 | 3:15 |
| Play | 0:45 | 4:00 |
| Code | 1:15 | 5:15 |
| Ask the Code | 1:15 | 6:30 |
| Remix + lineage | 1:15 | 7:45 |
| Learn tab | 1:00 | 8:45 |
| Safety + Publish | 0:30 | 9:15 |
| Closing pitch | 0:45 | 10:00 |

---

## Three Backup Lines (if something breaks live)

- **If the build/remix API fails:** *"Spark Studio is built to keep working offline — the same template renders even if the API drops. That reliability is part of why we picked template-based generation."* (This is actually true — `lib/templateGenerator.ts` is the fallback.)
- **If Ask the Code is slow:** Click a suggested chip; the prewritten Q&A in `oceanCleanupAskAnswers` (`lib/mockData.ts`) answers instantly.
- **If a viewer asks "Why not just use ChatGPT?"** *"ChatGPT gives an answer. Spark Studio gives a full creative learning environment: preview, codebase, code Q&A, remix lineage, safety, and learning summaries."*

---

This script lands the **"every AI-generated change becomes a learning moment"** hook three times (intro, Ask the Code, Learn tab), which is the line `CLAUDE.md` and `docs/05_CONTENT_AND_DEMO.md` both flag as the judging-strongest framing.
