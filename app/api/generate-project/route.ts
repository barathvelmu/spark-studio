import { NextResponse } from "next/server";
import { generateProjectDraft } from "@/lib/templateGenerator";
import type { ProjectType } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  prompt?: string;
  projectType?: ProjectType | "auto";
  ideaId?: string;
};

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore — fall through to defaults
  }
  const draft = generateProjectDraft({
    prompt: body.prompt ?? "",
    projectType: body.projectType ?? "auto",
    originalIdeaId: body.ideaId,
  });
  return NextResponse.json(draft);
}
