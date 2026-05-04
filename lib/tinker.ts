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

// ── Collector game rules ──────────────────────────────────────────────────────
const COLLECTOR_RULES: Rule[] = [
  {
    summary: "Make the player move faster",
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
    explanation: "A bigger collision radius makes collecting easier.",
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

// ── Quiz game rules ───────────────────────────────────────────────────────────
const QUIZ_RULES: Rule[] = [
  {
    summary: "Start with a bonus point",
    file: "js",
    before: "let score = 0;",
    after: "let score = 1;",
    concept: "variables",
    explanation: "Starting at 1 gives the player a free bonus point.",
  },
  {
    summary: "Show which question you're on",
    file: "js",
    before: "numEl.textContent = \"Question \"",
    after: "numEl.textContent = \"🧠 Question \"",
    concept: "variables",
    explanation: "Adding an emoji makes the question number more fun.",
  },
  {
    summary: "Make the Next button say 'Keep going!'",
    file: "js",
    before: "nextBtn.style.display = \"inline-block\";",
    after: "nextBtn.style.display = \"inline-block\";\n  nextBtn.textContent = \"Keep going! →\";",
    concept: "events",
    explanation: "A friendlier button label encourages the player.",
  },
];

// ── Story game rules ──────────────────────────────────────────────────────────
const STORY_RULES: Rule[] = [
  {
    summary: "Show a welcome message at the start",
    file: "js",
    before: "// Start the story!",
    after: "// Start the story!\nsceneTextEl.textContent = \"✨ Your story begins...\";",
    concept: "variables",
    explanation: "A short intro line sets the mood before the first scene loads.",
  },
  {
    summary: "Track choices with an emoji",
    file: "js",
    before: "choicesNumEl.textContent = \"Choices made: \"",
    after: "choicesNumEl.textContent = \"🔀 Choices made: \"",
    concept: "variables",
    explanation: "Adding an emoji makes the choice counter more fun.",
  },
  {
    summary: "Make the restart button friendlier",
    file: "js",
    before: "restartBtn.style.display = \"inline-block\";",
    after: "restartBtn.style.display = \"inline-block\";\n  restartBtn.textContent = \"🔁 Play again!\";",
    concept: "events",
    explanation: "A friendlier restart button invites the reader to try again.",
  },
];

function sourceFor(project: Project, file: TinkerFile): string {
  if (file === "js") return project.codeJs;
  if (file === "css") return project.codeCss;
  return project.codeHtml;
}

function rulesFor(project: Project): Rule[] {
  if (project.projectType === "quiz_game") return QUIZ_RULES;
  if (project.projectType === "story") return STORY_RULES;
  return COLLECTOR_RULES;
}

function calcHighlightLine(src: string, after: string, needle: string): number[] {
  const modified = src.replace(after, needle); // find needle in modified
  const idx = modified.indexOf(needle);
  const line = idx === -1 ? 0 : modified.slice(0, idx).split("\n").length;
  return line ? [line] : [];
}

export function pickTinkerSuggestion(project: Project): TinkerSuggestion | undefined {
  const rules = rulesFor(project);
  for (const rule of rules) {
    const src = sourceFor(project, rule.file);
    if (!src.includes(rule.before)) continue;
    const modified = src.replace(rule.before, rule.after);
    const idx = modified.indexOf(rule.after);
    const line = idx === -1 ? 0 : modified.slice(0, idx).split("\n").length;
    return { ...rule, highlightLines: line ? [line] : [] };
  }
  return undefined;
}

// Called client-side when Claude doesn't return highlightLines.
// Calculates the line number of `after` in the modified source.
export function calcTinkerHighlight(
  src: string,
  before: string,
  after: string,
): number[] {
  const modified = src.replace(before, after);
  const idx = modified.indexOf(after);
  const line = idx === -1 ? 0 : modified.slice(0, idx).split("\n").length;
  return line ? [line] : [];
}
