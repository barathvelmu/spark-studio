import type { Project } from "./types";

export type TinkerFile = "html" | "css" | "js";

export type TinkerSuggestion = {
  summary: string;
  file: TinkerFile;
  before: string;
  after: string;
  highlightLines?: number[];
  concept: string;
  explanation: string;
};

type Rule = Omit<TinkerSuggestion, "highlightLines">;

const RULES: Rule[] = [
  {
    summary: "Make the player faster",
    file: "js",
    before: "playerX -= 10",
    after: "playerX -= 20",
    concept: "variables",
    explanation: "Bigger steps mean a faster player.",
  },
  {
    summary: "Start with a bonus score",
    file: "js",
    before: "let score = 0;",
    after: "let score = 5;",
    concept: "variables",
    explanation: "Starting at 5 gives the player a head start.",
  },
  {
    summary: "Make collecting easier",
    file: "js",
    before: "< 32 && Math.abs(playerY",
    after: "< 48 && Math.abs(playerY",
    concept: "conditionals",
    explanation: "A bigger reach makes collecting easier.",
  },
  {
    summary: "Bigger reward per item",
    file: "js",
    before: "score = score + 1",
    after: "score = score + 2",
    concept: "variables",
    explanation: "Each item is worth two points instead of one.",
  },
];

function sourceFor(project: Project, file: TinkerFile): string {
  if (file === "js") return project.codeJs;
  if (file === "css") return project.codeCss;
  return project.codeHtml;
}

export function pickTinkerSuggestion(project: Project): TinkerSuggestion | undefined {
  for (const rule of RULES) {
    const src = sourceFor(project, rule.file);
    if (!src.includes(rule.before)) continue;
    const after = src.replace(rule.before, rule.after);
    const idx = after.indexOf(rule.after);
    const line = idx === -1 ? 0 : after.slice(0, idx).split("\n").length;
    return { ...rule, highlightLines: line ? [line] : [] };
  }
  return undefined;
}
