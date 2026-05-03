import { NextResponse } from "next/server";
import { askClaudeJson, isAnthropicConfigured } from "@/lib/anthropic";
import { getProjectById, oceanCleanupAskAnswers, suggestedAskQuestions } from "@/lib/mockData";

export const runtime = "nodejs";

type ProjectSnapshot = {
  id?: string;
  title?: string;
  description?: string;
  codeHtml?: string;
  codeCss?: string;
  codeJs?: string;
};

type Body = {
  projectId?: string;
  question?: string;
  // The client may send a snapshot of the current project so we can answer
  // for projects that only live in the user's localStorage (not seed data).
  project?: ProjectSnapshot;
};

type ClaudeShape = {
  answer: string;
  relatedConcepts: string[];
  suggestedNextQuestions: string[];
  highlightLines?: { file: "html" | "css" | "js"; lines: number[] };
};

const SYSTEM_HINT = `Task: answer a kid's question about ONE specific project's code. You only know about THIS project — never invent files or features that aren't in the source provided.

Tone: warm, plain language for ages 10-14. Short sentences. No jargon. No external links.

Return JSON with exactly this shape:
{
  "answer": string (2-4 short sentences),
  "relatedConcepts": array of strings from this set: variables, events, conditionals, loops, score, collision, branching, state, arrays,
  "suggestedNextQuestions": array of 2-3 short follow-up questions about THIS project,
  "highlightLines": optional object { "file": "html" | "css" | "js", "lines": array of 1-based line numbers in that file }
}`;

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore
  }
  const question = (body.question ?? "").trim();
  const seed = body.projectId ? getProjectById(body.projectId) : undefined;
  // Merge: prefer the client snapshot so Tinker-Mode edits and user-created
  // projects are seen by Claude. Fall back to seed data when missing.
  const resolved = {
    id: body.project?.id ?? body.projectId ?? seed?.id,
    title: body.project?.title ?? seed?.title ?? "",
    description: body.project?.description ?? seed?.description ?? "",
    codeHtml: body.project?.codeHtml ?? seed?.codeHtml ?? "",
    codeCss: body.project?.codeCss ?? seed?.codeCss ?? "",
    codeJs: body.project?.codeJs ?? seed?.codeJs ?? "",
  };

  // Fast-path: prewritten answers, but ONLY for the Ocean Cleanup demo project.
  // Other projects share question phrasing but the answers would name the wrong
  // player/collectible. Strip trailing punctuation so "How does the score work?!" matches.
  if (resolved.id === "p_ocean") {
    const key = question.replace(/[?!.]+$/g, "").trim().toLowerCase();
    const exact = oceanCleanupAskAnswers[key];
    if (exact) {
      return NextResponse.json({
        answer: exact.answer,
        relatedConcepts: exact.relatedConcepts,
        suggestedNextQuestions: exact.suggestedNext,
        highlightLines: exact.highlightJsLines ? { file: "js", lines: exact.highlightJsLines } : undefined,
      });
    }
  }

  if (isAnthropicConfigured() && question.length > 0 && resolved.title) {
    const ai = await askClaudeJson<ClaudeShape>({
      systemHint: SYSTEM_HINT,
      userMessage: `Project: ${resolved.title}\nDescription: ${resolved.description}\n\n--- index.html ---\n${resolved.codeHtml}\n--- style.css ---\n${resolved.codeCss}\n--- game.js ---\n${resolved.codeJs}\n\nKid's question: ${question}\nReturn JSON only.`,
      maxTokens: 600,
      effort: "low",
    });

    if (ai && typeof ai.answer === "string" && ai.answer.length > 0) {
      return NextResponse.json({
        answer: ai.answer,
        relatedConcepts: Array.isArray(ai.relatedConcepts) ? ai.relatedConcepts : [],
        suggestedNextQuestions: Array.isArray(ai.suggestedNextQuestions) ? ai.suggestedNextQuestions : suggestedAskQuestions,
        highlightLines: ai.highlightLines,
      });
    }
  }

  // Fallback
  return NextResponse.json({
    answer:
      "I only know about this project's code so far. Try one of the suggested questions, or click any line and I'll explain it.",
    relatedConcepts: [],
    suggestedNextQuestions: suggestedAskQuestions,
  });
}
