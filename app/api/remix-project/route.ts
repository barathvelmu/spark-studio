import { NextResponse } from "next/server";
import { generateRemixDraft } from "@/lib/templateGenerator";
import { getProjectById } from "@/lib/mockData";

export const runtime = "nodejs";

type Body = {
  parentProjectId?: string;
  remixPrompt?: string;
};

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore
  }
  const parent = body.parentProjectId ? getProjectById(body.parentProjectId) : undefined;
  if (!parent) {
    return NextResponse.json({ error: "parent project not found" }, { status: 404 });
  }
  const draft = generateRemixDraft({ parent, remixPrompt: body.remixPrompt ?? "" });
  return NextResponse.json(draft);
}
