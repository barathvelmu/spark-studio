import { NextResponse } from "next/server";
import { askClaudeJson, isAnthropicConfigured } from "@/lib/gemini";
import { getProjectById } from "@/lib/mockData";
import { pickTinkerSuggestion, type TinkerSuggestion } from "@/lib/tinker";
import type { Project } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  project?: { id: string; title: string; codeHtml: string; codeCss: string; codeJs: string };
};

const SYSTEM_HINT = `Task: suggest ONE tiny, kid-safe tinker to a kid's game code. The kid will tap "Apply" to swap a substring.
Constraints:
- Single substring replacement, ≤ 30 characters changed.
- The "before" string MUST appear verbatim in the project source you're given.
- Keep the change safe and easy to understand — examples: tweak a number, add one comment, rename a variable to something more descriptive.
- Concept must be one of: variables, events, conditionals, loops, score, collision.

Return JSON:
{
  "summary": string (≤ 60 chars, kid-friendly, no period at end),
  "file": "html" | "css" | "js",
  "before": exact substring currently in the chosen file,
  "after": replacement substring,
  "concept": one of the allowed concepts above,
  "explanation": one short sentence,
  "highlightLines": optional array of 1-based line numbers in the chosen file (after the change)
}`;

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore
  }
  const project = (body.projectId ? getProjectById(body.projectId) : undefined) ?? body.project as Project | undefined;
  if (!project) {
    return NextResponse.json({ error: "no suggestion available" }, { status: 404 });
  }

  if (isAnthropicConfigured()) {
    const ai = await askClaudeJson<TinkerSuggestion>({
      systemHint: SYSTEM_HINT,
      userMessage: `Project: ${project.title}\n\n--- index.html ---\n${project.codeHtml}\n--- style.css ---\n${project.codeCss}\n--- game.js ---\n${project.codeJs}\n\nReturn JSON only.`,
      maxTokens: 400,
      effort: "low",
    });

    if (ai && ai.before && ai.after !== undefined) {
      const source =
        ai.file === "js" ? project.codeJs : ai.file === "css" ? project.codeCss : project.codeHtml;
      if (typeof source === "string" && source.includes(ai.before)) {
        // Always compute highlight lines so the client can show them even when Claude omits them.
        if (!ai.highlightLines || ai.highlightLines.length === 0) {
          const modified = source.replace(ai.before, ai.after);
          const idx = modified.indexOf(ai.after);
          const line = idx === -1 ? 0 : modified.slice(0, idx).split("\n").length;
          if (line > 0) ai.highlightLines = [line];
        }
        return NextResponse.json(ai);
      }
    }
  }

  const fallback = pickTinkerSuggestion(project);
  if (!fallback) {
    return NextResponse.json({ error: "no suggestion available" }, { status: 404 });
  }
  return NextResponse.json(fallback);
}
