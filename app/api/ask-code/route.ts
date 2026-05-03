import { NextResponse } from "next/server";
import { askClaudeJson, isAnthropicConfigured } from "@/lib/anthropic";
import { getProjectById, oceanCleanupAskAnswers, suggestedAskQuestions } from "@/lib/mockData";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  question?: string;
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
  const project = body.projectId ? getProjectById(body.projectId) : undefined;

  // Fast-path: prewritten answer for the demo project's known questions.
  const key = question.toLowerCase();
  const exact = oceanCleanupAskAnswers[key];
  if (exact) {
    return NextResponse.json({
      answer: exact.answer,
      relatedConcepts: exact.relatedConcepts,
      suggestedNextQuestions: exact.suggestedNext,
      highlightLines: exact.highlightJsLines ? { file: "js", lines: exact.highlightJsLines } : undefined,
    });
  }

  if (isAnthropicConfigured() && project && question.length > 0) {
    const ai = await askClaudeJson<ClaudeShape>({
      systemHint: SYSTEM_HINT,
      userMessage: `Project: ${project.title}\nDescription: ${project.description}\n\n--- index.html ---\n${project.codeHtml}\n--- style.css ---\n${project.codeCss}\n--- game.js ---\n${project.codeJs}\n\nKid's question: ${question}\nReturn JSON only.`,
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
