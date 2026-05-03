import { NextResponse } from "next/server";
import { oceanCleanupAskAnswers, suggestedAskQuestions } from "@/lib/mockData";

export const runtime = "nodejs";

type Body = {
  projectId?: string;
  question?: string;
};

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore
  }
  const q = (body.question ?? "").trim().toLowerCase();
  const exact = oceanCleanupAskAnswers[q];
  if (exact) {
    return NextResponse.json({
      answer: exact.answer,
      relatedConcepts: exact.relatedConcepts,
      suggestedNextQuestions: exact.suggestedNext,
      highlightLines: exact.highlightJsLines ? { file: "js", lines: exact.highlightJsLines } : undefined,
    });
  }
  return NextResponse.json({
    answer:
      "I only know about this project's code so far. Try one of the suggested questions, or click any line and I'll explain it.",
    relatedConcepts: [],
    suggestedNextQuestions: suggestedAskQuestions,
  });
}
