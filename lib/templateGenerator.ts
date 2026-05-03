import type { CollectorGameConfig, Concept, GradientPreset, Project, ProjectType } from "./types";

type KeywordTheme = {
  match: RegExp;
  player: string;
  collectible: string;
  background: CollectorGameConfig["background"];
  goal: string;
  title: string;
  tags: string[];
  gradient: GradientPreset;
};

// Order matters — first match wins.
const collectorThemes: KeywordTheme[] = [
  {
    match: /\b(ocean|sea|turtle|plastic|reef|beach|coral)\b/i,
    player: "🐢",
    collectible: "🧴",
    background: "ocean",
    goal: "Collect plastic and earn points",
    title: "Ocean Cleanup Game",
    tags: ["Game", "Environment", "Beginner"],
    gradient: "sky",
  },
  {
    match: /\b(space|junk|astronaut|rocket|star|galaxy|planet|satellite)\b/i,
    player: "👩‍🚀",
    collectible: "🛰️",
    background: "space",
    goal: "Collect space junk and earn points",
    title: "Space Junk Rescue",
    tags: ["Game", "Space"],
    gradient: "indigo",
  },
  {
    match: /\b(forest|tree|acorn|fox|woods|nature)\b/i,
    player: "🦊",
    collectible: "🌰",
    background: "forest",
    goal: "Collect acorns and earn points",
    title: "Forest Forager",
    tags: ["Game", "Nature"],
    gradient: "mint",
  },
  {
    match: /\b(city|recycle|recycling|trash|bin|sort|can)\b/i,
    player: "🧑",
    collectible: "♻️",
    background: "city",
    goal: "Sort recyclables and earn points",
    title: "Recycling Sorter",
    tags: ["Game", "Environment"],
    gradient: "lavender",
  },
  {
    match: /\b(dragon|fantasy|knight|magic|fire|sword)\b/i,
    player: "🐉",
    collectible: "⭐",
    background: "space",
    goal: "Collect stars and earn points",
    title: "Dragon Star Collector",
    tags: ["Game", "Fantasy"],
    gradient: "lavender",
  },
];

const defaultTheme: KeywordTheme = {
  match: /.*/,
  player: "🐢",
  collectible: "🧴",
  background: "ocean",
  goal: "Collect items and earn points",
  title: "New Collector Game",
  tags: ["Game", "Beginner"],
  gradient: "sky",
};

function pickTheme(prompt: string): KeywordTheme {
  const trimmed = prompt.trim();
  if (!trimmed) return defaultTheme;
  return collectorThemes.find((t) => t.match.test(trimmed)) ?? defaultTheme;
}

// Parameterized version of the Ocean Cleanup hand-written code.
// The Ocean seed project has its own hand-tuned strings in mockData; this is for fresh generations.
export function makeCollectorCode(
  player: string,
  collectible: string,
  background: CollectorGameConfig["background"],
  noun: string,
): { html: string; css: string; js: string } {
  const bgColors = {
    ocean: { page: "#BAE6FD", play: "#38BDF8" },
    space: { page: "#1E1B4B", play: "#312E81" },
    forest: { page: "#BBF7D0", play: "#4ADE80" },
    city: { page: "#E5E7EB", play: "#94A3B8" },
  } as const;
  const c = bgColors[background];

  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>${noun} Game</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>${noun} Game</h1>
    <p>Use the arrow keys to move and collect ${noun.toLowerCase()}!</p>
    <div id="score">Score: 0</div>
    <div id="game">
      <div id="player">${player}</div>
      <div id="item">${collectible}</div>
    </div>
    <script src="game.js"></script>
  </body>
</html>
`;

  const css = `/* The page background */
body {
  background: ${c.page};
  font-family: sans-serif;
  text-align: center;
}

/* The play area */
#game {
  position: relative;
  width: 400px;
  height: 300px;
  margin: 20px auto;
  background: ${c.play};
  border-radius: 16px;
  overflow: hidden;
}

/* The player and the item are emoji */
#player,
#item {
  position: absolute;
  font-size: 32px;
}
`;

  const js = `// Keep track of how many items we collected
let score = 0;

// Find the things on the page we want to control
const player = document.getElementById("player");
const item = document.getElementById("item");
const scoreText = document.getElementById("score");

// Where the player starts on the screen
let playerX = 180;
let playerY = 130;

// When the player presses an arrow key, move
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") playerX -= 10;
  if (event.key === "ArrowRight") playerX += 10;
  if (event.key === "ArrowUp") playerY -= 10;
  if (event.key === "ArrowDown") playerY += 10;
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
  checkCollision();
});

// Check if the player is touching the item
function checkCollision() {
  const itemX = item.offsetLeft;
  const itemY = item.offsetTop;
  if (Math.abs(playerX - itemX) < 32 && Math.abs(playerY - itemY) < 32) {
    score = score + 1;
    scoreText.innerText = "Score: " + score;
    item.style.left = Math.random() * 360 + "px";
    item.style.top = Math.random() * 260 + "px";
  }
}
`;

  return { html, css, js };
}

const baseConcepts: Concept[] = ["variables", "events", "conditionals", "loops"];

export type ProjectDraft = Omit<Project, "id" | "createdAt" | "remixCount">;

export function generateProjectDraft(args: {
  prompt: string;
  projectType: ProjectType | "auto";
  creatorId: string;
  originalIdeaId?: string;
}): ProjectDraft {
  const { prompt, projectType, creatorId, originalIdeaId } = args;
  const theme = pickTheme(prompt);
  // For must-ship, every "auto" or "collector_game" generation uses the collector path.
  // Quiz/Story stretch goals would branch here.
  const _resolvedType: ProjectType = projectType === "quiz_game" || projectType === "story" ? "collector_game" : "collector_game";

  const noun = theme.collectible === "🧴" ? "Plastic" : theme.collectible === "🛰️" ? "Space Junk" : theme.collectible === "🌰" ? "Acorn" : theme.collectible === "♻️" ? "Recycling" : "Star";
  const code = makeCollectorCode(theme.player, theme.collectible, theme.background, noun);

  const description =
    prompt.trim().length > 0
      ? `Move the player to collect ${noun.toLowerCase()}. Built from: "${prompt.trim()}".`
      : `Move the player to collect ${noun.toLowerCase()}.`;

  return {
    title: theme.title,
    description,
    creatorId,
    projectType: _resolvedType,
    originalIdeaId,
    config: {
      player: theme.player,
      collectible: theme.collectible,
      background: theme.background,
      goal: theme.goal,
    },
    tags: theme.tags,
    concepts: baseConcepts,
    codeHtml: code.html,
    codeCss: code.css,
    codeJs: code.js,
    learningSummary:
      "This project uses a score variable, keyboard events, a game loop, and a condition that checks when the player touches the item.",
    changeSummary: [
      `Created a ${theme.player} player`,
      `Added ${theme.collectible} as the collectible`,
      "Added a score that increases on collision",
    ],
    nextChallenge: "Try adding a timer or a level-up when score reaches 10.",
    safetyStatus: "checked",
    gradient: theme.gradient,
  };
}

export function generateRemixDraft(args: {
  parent: Project;
  remixPrompt: string;
  creatorId: string;
}): ProjectDraft {
  const { parent, remixPrompt, creatorId } = args;
  const theme = pickTheme(remixPrompt);
  const noun = theme.collectible === "🧴" ? "Plastic" : theme.collectible === "🛰️" ? "Space Junk" : theme.collectible === "🌰" ? "Acorn" : theme.collectible === "♻️" ? "Recycling" : "Star";
  const code = makeCollectorCode(theme.player, theme.collectible, theme.background, noun);

  return {
    title: theme.title,
    description: `Remix of ${parent.title}. Built from: "${remixPrompt.trim()}".`,
    creatorId,
    projectType: "collector_game",
    forkedFromProjectId: parent.id,
    originalIdeaId: parent.originalIdeaId,
    config: {
      player: theme.player,
      collectible: theme.collectible,
      background: theme.background,
      goal: theme.goal,
    },
    tags: theme.tags,
    concepts: baseConcepts,
    codeHtml: code.html,
    codeCss: code.css,
    codeJs: code.js,
    learningSummary:
      "You reused the same movement, score, and collision logic, but changed the theme and objects.",
    changeSummary: [
      `Changed the player to ${theme.player}`,
      `Changed the collectible to ${theme.collectible}`,
      `Changed the background to ${theme.background}`,
      "Kept the scoring and collision logic",
    ],
    nextChallenge: "Try adding a timer.",
    safetyStatus: "checked",
    gradient: theme.gradient,
  };
}
