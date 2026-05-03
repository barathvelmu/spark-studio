import { NextResponse } from "next/server";
import { generateRemixDraft, makeCollectorCode, type ProjectDraft } from "@/lib/templateGenerator";
import { askClaudeJson, isAnthropicConfigured } from "@/lib/anthropic";
import { getProjectById } from "@/lib/mockData";
import type { CollectorGameConfig, GradientPreset, Project } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  parentProjectId?: string;
  remixPrompt?: string;
  creatorId?: string;
  // Optional parent snapshot so we can remix projects that only live in the
  // client's localStorage (not in seed data).
  parent?: Project;
};

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

const SYSTEM_HINT = `Task: take a parent CollectorGame project and a kid's remix idea, and return a remixed config.
Keep the same gameplay shape (player + collectible + background) but swap the theme to match the remix prompt.
Return JSON with exactly this shape:
{
  "title": string,
  "description": string,
  "player": single emoji,
  "collectible": single emoji,
  "noun": short noun for the new collectible,
  "background": "ocean" | "space" | "forest" | "city",
  "goal": string ending with "and earn points",
  "tags": array of 2-3 strings,
  "gradient": "indigo" | "sky" | "mint" | "peach" | "lavender",
  "changeSummary": array of 3-4 bullets explaining what changed and what stayed the same,
  "learningSummary": one sentence about reusing logic but changing the theme,
  "nextChallenge": one sentence suggesting a small extension
}`;

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore
  }
  // Prefer the client snapshot (covers user-created projects in localStorage),
  // fall back to seed data.
  const parent: Project | undefined =
    body.parent ?? (body.parentProjectId ? getProjectById(body.parentProjectId) : undefined);
  if (!parent) {
    return NextResponse.json({ error: "parent project not found" }, { status: 404 });
  }
  const remixPrompt = body.remixPrompt ?? "";
  const creatorId = body.creatorId?.trim() || parent.creatorId;

  let draft: ProjectDraft;

  if (isAnthropicConfigured() && remixPrompt.trim().length > 0) {
    const ai = await askClaudeJson<ClaudeShape>({
      systemHint: SYSTEM_HINT,
      userMessage: `Parent project: ${parent.title} — ${parent.description}\nParent player: ${"player" in parent.config ? parent.config.player : ""}\nParent collectible: ${"collectible" in parent.config ? parent.config.collectible : ""}\nRemix idea: ${remixPrompt}\nReturn JSON only.`,
      maxTokens: 700,
      effort: "low",
    });

    if (ai && ai.player && ai.collectible && ai.background) {
      const code = makeCollectorCode(ai.player, ai.collectible, ai.background, ai.noun || "Item");
      draft = {
        title: ai.title || "Remix",
        description: ai.description || `Remix of ${parent.title}.`,
        creatorId,
        projectType: "collector_game",
        forkedFromProjectId: parent.id,
        originalIdeaId: parent.originalIdeaId,
        config: {
          player: ai.player,
          collectible: ai.collectible,
          background: ai.background,
          goal: ai.goal || "Collect items and earn points",
        } as CollectorGameConfig,
        tags: Array.isArray(ai.tags) && ai.tags.length > 0 ? ai.tags.slice(0, 3) : ["Game", "Remix"],
        concepts: ["variables", "events", "conditionals", "loops"],
        codeHtml: code.html,
        codeCss: code.css,
        codeJs: code.js,
        learningSummary:
          ai.learningSummary || "You reused the same movement, score, and collision logic, but changed the theme.",
        changeSummary:
          Array.isArray(ai.changeSummary) && ai.changeSummary.length > 0
            ? ai.changeSummary.slice(0, 5)
            : [
                `Changed the player to ${ai.player}`,
                `Changed the collectible to ${ai.collectible}`,
                "Kept the scoring and collision logic",
              ],
        nextChallenge: ai.nextChallenge || "Try adding a timer.",
        safetyStatus: "checked",
        gradient: ai.gradient || "indigo",
        published: false,
      };
    } else {
      draft = generateRemixDraft({ parent, remixPrompt, creatorId });
    }
  } else {
    draft = generateRemixDraft({ parent, remixPrompt, creatorId });
  }

  return NextResponse.json(draft);
}
