import { NextResponse } from "next/server";
import { getProjectById } from "@/lib/mockData";
import { pickTinkerSuggestion } from "@/lib/tinker";

export const runtime = "nodejs";

type Body = { projectId?: string };

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore
  }
  const project = body.projectId ? getProjectById(body.projectId) : undefined;
  if (!project) {
    return NextResponse.json({ error: "no suggestion available" }, { status: 404 });
  }
  const suggestion = pickTinkerSuggestion(project);
  if (!suggestion) {
    return NextResponse.json({ error: "no suggestion available" }, { status: 404 });
  }
  return NextResponse.json(suggestion);
}
