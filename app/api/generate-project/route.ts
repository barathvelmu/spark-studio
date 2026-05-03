import { NextResponse } from "next/server";
import { generateProjectDraft, makeCollectorCode, type ProjectDraft } from "@/lib/templateGenerator";
import { askClaudeJson, isAnthropicConfigured } from "@/lib/anthropic";
import type { CollectorGameConfig, GradientPreset, ProjectType } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  prompt?: string;
  projectType?: ProjectType | "auto";
  ideaId?: string;
};

// What we ask Claude for. We only let it pick the *theme/config*; we still
// generate the actual code strings deterministically via makeCollectorCode so
// the gameplay stays guaranteed-to-run. Claude shapes the title, description,
// emojis, learning copy.
type ClaudeShape = {
  title: string;
  description: string;
  player: string;
  collectible: string;
  noun: string;
  background: "ocean" | "space" | "forest" | "city";
  goal: string;
  tags: string[];
  gradient: GradientPreset;
  changeSummary: string[];
  learningSummary: string;
  nextChallenge: string;
};

const SYSTEM_HINT = `Task: turn a kid's idea into a CollectorGame configuration.
Return JSON with exactly this shape:
{
  "title": string (≤ 40 chars, kid-friendly),
  "description": string (1 short sentence),
  "player": single emoji,
  "collectible": single emoji,
  "noun": short noun for the collectible (e.g. "Plastic", "Star"),
  "background": one of "ocean" | "space" | "forest" | "city",
  "goal": string (1 short sentence ending with "and earn points"),
  "tags": array of 2-3 short tag strings,
  "gradient": one of "indigo" | "sky" | "mint" | "peach" | "lavender",
  "changeSummary": array of 3 short bullets describing what was made,
  "learningSummary": one sentence naming the coding concepts used (variables, events, conditionals, loops),
  "nextChallenge": one sentence suggesting a small extension
}
No fields besides those above.`;

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore
  }
  const prompt = body.prompt ?? "";
  const projectType = body.projectType ?? "auto";

  let draft: ProjectDraft;

  if (isAnthropicConfigured() && prompt.trim().length > 0) {
    const ai = await askClaudeJson<ClaudeShape>({
      systemHint: SYSTEM_HINT,
      userMessage: `Idea: ${prompt}\nProject type: ${projectType}\nReturn JSON only.`,
      maxTokens: 800,
      effort: "low",
    });

    if (ai && ai.player && ai.collectible && ai.background) {
      const code = makeCollectorCode(ai.player, ai.collectible, ai.background, ai.noun || "Item");
      draft = {
        title: ai.title || "New Collector Game",
        description: ai.description || `Move the player to collect ${(ai.noun || "items").toLowerCase()}.`,
        creatorId: "u_maya",
        projectType: "collector_game",
        originalIdeaId: body.ideaId,
        config: {
          player: ai.player,
          collectible: ai.collectible,
          background: ai.background,
          goal: ai.goal || "Collect items and earn points",
        } as CollectorGameConfig,
        tags: Array.isArray(ai.tags) && ai.tags.length > 0 ? ai.tags.slice(0, 3) : ["Game", "Beginner"],
        concepts: ["variables", "events", "conditionals", "loops"],
        codeHtml: code.html,
        codeCss: code.css,
        codeJs: code.js,
        learningSummary:
          ai.learningSummary ||
          "This project uses a score variable, keyboard events, a game loop, and a condition.",
        changeSummary:
          Array.isArray(ai.changeSummary) && ai.changeSummary.length > 0
            ? ai.changeSummary.slice(0, 5)
            : ["Created a player", "Added a collectible", "Added a score"],
        nextChallenge: ai.nextChallenge || "Try adding a timer.",
        safetyStatus: "checked",
        gradient: ai.gradient || "sky",
      };
    } else {
      draft = generateProjectDraft({ prompt, projectType, originalIdeaId: body.ideaId });
    }
  } else {
    draft = generateProjectDraft({ prompt, projectType, originalIdeaId: body.ideaId });
  }

  return NextResponse.json(draft);
}
