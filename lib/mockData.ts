import type { Idea, Project, User } from "./types";
import { findAccountById, findAccountByHandle } from "./accountStore";

export const users: User[] = [
  { id: "u_maya", handle: "maya", emoji: "🌊" },
  { id: "u_alex", handle: "alex", emoji: "🚀" },
  { id: "u_sam", handle: "sam", emoji: "🌱" },
  { id: "u_riya", handle: "riya", emoji: "🌟" },
  { id: "u_jordan", handle: "jordan", emoji: "🐉" },
];

export const ideas: Idea[] = [
  {
    id: "idea_ocean",
    title: "Ocean Cleanup Game",
    description: "A turtle collects plastic and protects the ocean.",
    emoji: "🐢",
    tags: ["Game", "Environment", "Beginner"],
    suggestedProjectType: "collector_game",
    gradient: "sky",
  },
  {
    id: "idea_space_math",
    title: "Space Math Quest",
    description: "Solve math problems to power a rocket.",
    emoji: "🚀",
    tags: ["Quiz", "Math", "Space"],
    suggestedProjectType: "quiz_game",
    gradient: "indigo",
  },
  {
    id: "idea_kindness",
    title: "Kindness Adventure",
    description: "Choose what to do in different friendship situations.",
    emoji: "🌱",
    tags: ["Story", "Social Good", "Choices"],
    suggestedProjectType: "story",
    gradient: "mint",
  },
  {
    id: "idea_healthy",
    title: "Healthy Habits Quiz",
    description: "Learn about sleep, food, and exercise.",
    emoji: "🥗",
    tags: ["Quiz", "Health", "Beginner"],
    suggestedProjectType: "quiz_game",
    gradient: "peach",
  },
  {
    id: "idea_recycling",
    title: "Recycling Sorter",
    description: "Sort items into trash, recycling, or compost.",
    emoji: "♻️",
    tags: ["Game", "Environment"],
    suggestedProjectType: "collector_game",
    gradient: "lavender",
  },
];

// Hand-written, kid-friendly Ocean Cleanup code.
// This is the gold standard the Code tab points at.
const oceanCleanupHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>Ocean Cleanup Game</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Ocean Cleanup Game</h1>
    <p>Use the arrow keys to move the turtle and collect plastic!</p>
    <div id="score">Score: 0</div>
    <div id="game">
      <div id="player">🐢</div>
      <div id="plastic">🧴</div>
    </div>
    <script src="game.js"></script>
  </body>
</html>
`;

const oceanCleanupCss = `/* The page background looks like the ocean */
body {
  background: #BAE6FD;
  font-family: sans-serif;
  text-align: center;
}

/* The play area where the game happens */
#game {
  position: relative;
  width: 400px;
  height: 300px;
  margin: 20px auto;
  background: #38BDF8;
  border-radius: 16px;
  overflow: hidden;
}

/* The player and the plastic are emoji */
#player,
#plastic {
  position: absolute;
  font-size: 32px;
}
`;

const oceanCleanupJs = `// Keep track of how many pieces of plastic we collected
let score = 0;

// Find the things on the page we want to control
const player = document.getElementById("player");
const plastic = document.getElementById("plastic");
const scoreText = document.getElementById("score");

// Where the turtle starts on the screen
let playerX = 180;
let playerY = 130;

// When the player presses an arrow key, move the turtle
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") playerX -= 10;
  if (event.key === "ArrowRight") playerX += 10;
  if (event.key === "ArrowUp") playerY -= 10;
  if (event.key === "ArrowDown") playerY += 10;
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
  checkCollision();
});

// Check if the turtle is touching the plastic
function checkCollision() {
  const plasticX = plastic.offsetLeft;
  const plasticY = plastic.offsetTop;
  if (Math.abs(playerX - plasticX) < 32 && Math.abs(playerY - plasticY) < 32) {
    score = score + 1;
    scoreText.innerText = "Score: " + score;
    plastic.style.left = Math.random() * 360 + "px";
    plastic.style.top = Math.random() * 260 + "px";
  }
}
`;

// Space Junk variant: same code, swapped player + collectible.
const spaceJunkHtml = oceanCleanupHtml
  .replace("Ocean Cleanup Game", "Space Junk Rescue")
  .replace("turtle", "astronaut")
  .replace("plastic", "space junk")
  .replace("🐢", "👩‍🚀")
  .replace("🧴", "🛰️");

const spaceJunkCss = oceanCleanupCss
  .replace("ocean", "space")
  .replace("#BAE6FD", "#1E1B4B")
  .replace("#38BDF8", "#312E81");

const spaceJunkJs = oceanCleanupJs
  .replace(/turtle/g, "astronaut")
  .replace(/plastic/g, "junk");

export const projects: Project[] = [
  {
    id: "p_ocean",
    title: "Ocean Cleanup Game",
    description: "Move the turtle to collect plastic and protect the ocean.",
    creatorId: "u_maya",
    projectType: "collector_game",
    originalIdeaId: "idea_ocean",
    config: {
      player: "🐢",
      collectible: "🧴",
      background: "ocean",
      goal: "Collect plastic and earn points",
    },
    tags: ["Game", "Environment", "Beginner"],
    concepts: ["variables", "events", "conditionals", "loops"],
    codeHtml: oceanCleanupHtml,
    codeCss: oceanCleanupCss,
    codeJs: oceanCleanupJs,
    learningSummary:
      "This project uses a score variable, keyboard events, a game loop, and a condition that checks when the turtle touches plastic.",
    changeSummary: [
      "Created a turtle player",
      "Added plastic as the collectible",
      "Added a score that increases when plastic is collected",
    ],
    nextChallenge: "Try adding a timer or a level-up when score reaches 10.",
    safetyStatus: "checked",
    remixCount: 12,
    createdAt: "2026-05-03T12:00:00.000Z",
    gradient: "sky",
  },
  {
    id: "p_space_junk",
    title: "Space Junk Rescue",
    description: "Move the astronaut to collect space junk.",
    creatorId: "u_alex",
    projectType: "collector_game",
    forkedFromProjectId: "p_ocean",
    config: {
      player: "👩‍🚀",
      collectible: "🛰️",
      background: "space",
      goal: "Collect space junk and earn points",
    },
    tags: ["Game", "Space", "Remix"],
    concepts: ["variables", "events", "conditionals", "loops"],
    codeHtml: spaceJunkHtml,
    codeCss: spaceJunkCss,
    codeJs: spaceJunkJs,
    learningSummary:
      "You reused the same movement, score, and collision logic, but changed the theme and objects.",
    changeSummary: [
      "Changed the player from turtle to astronaut",
      "Changed plastic into space junk",
      "Changed the background from ocean to space",
      "Kept the scoring and collision logic",
    ],
    nextChallenge: "Try adding a timer.",
    safetyStatus: "checked",
    remixCount: 4,
    createdAt: "2026-05-03T12:30:00.000Z",
    gradient: "indigo",
  },
  {
    id: "p_climate_quiz",
    title: "Climate Quiz Challenge",
    description: "Answer climate questions and learn how the planet works.",
    creatorId: "u_riya",
    projectType: "quiz_game",
    config: {
      theme: "climate",
      questions: [
        {
          q: "Which gas traps the most heat in the atmosphere?",
          choices: ["Oxygen", "Carbon dioxide", "Helium"],
          answerIndex: 1,
        },
        {
          q: "What helps reduce ocean plastic?",
          choices: ["Recycling", "Littering", "Burning trash"],
          answerIndex: 0,
        },
      ],
    },
    tags: ["Quiz", "Climate"],
    concepts: ["arrays", "conditionals", "score"],
    codeHtml: "",
    codeCss: "",
    codeJs: "",
    learningSummary:
      "This quiz uses an array of questions, a score variable, and conditionals to check answers.",
    changeSummary: ["Created a climate quiz", "Added 2 questions", "Added a score"],
    nextChallenge: "Add 3 more questions and a final score screen.",
    safetyStatus: "checked",
    remixCount: 7,
    createdAt: "2026-05-03T11:00:00.000Z",
    gradient: "mint",
  },
  {
    id: "p_kindness_quest",
    title: "Kindness Quest",
    description: "Choose what to do in tricky friendship moments.",
    creatorId: "u_sam",
    projectType: "story",
    config: {
      theme: "kindness",
      scenes: [
        {
          id: "start",
          text: "Your friend looks sad at lunch. What do you do?",
          choices: [
            { label: "Sit with them", nextId: "good" },
            { label: "Keep walking", nextId: "neutral" },
          ],
        },
        { id: "good", text: "They smile. You made their day.", choices: [] },
        { id: "neutral", text: "Lunch ends. You wonder how they felt.", choices: [] },
      ],
    },
    tags: ["Story", "Social Good"],
    concepts: ["branching", "state"],
    codeHtml: "",
    codeCss: "",
    codeJs: "",
    learningSummary:
      "This story uses branching logic and state to remember what choices you made.",
    changeSummary: ["Created an opening scene", "Added two choices", "Added two endings"],
    nextChallenge: "Add a third ending where the friend invites you to their house.",
    safetyStatus: "checked",
    remixCount: 3,
    createdAt: "2026-05-03T10:00:00.000Z",
    gradient: "peach",
  },
  {
    id: "p_dragon_star",
    title: "Dragon Star Collector",
    description: "Fly the dragon and collect glowing stars in the night sky.",
    creatorId: "u_jordan",
    projectType: "collector_game",
    config: {
      player: "🐉",
      collectible: "⭐",
      background: "space",
      goal: "Collect stars and earn points",
    },
    tags: ["Game", "Fantasy"],
    concepts: ["events", "score", "collision"],
    codeHtml: oceanCleanupHtml.replace("🐢", "🐉").replace("🧴", "⭐"),
    codeCss: oceanCleanupCss.replace("#BAE6FD", "#1E1B4B").replace("#38BDF8", "#312E81"),
    codeJs: oceanCleanupJs,
    learningSummary:
      "This game uses keyboard events, a score variable, and collision detection.",
    changeSummary: ["Made a dragon player", "Stars instead of plastic", "Night sky background"],
    nextChallenge: "Add a timer and a high score.",
    safetyStatus: "checked",
    remixCount: 9,
    createdAt: "2026-05-03T09:00:00.000Z",
    gradient: "lavender",
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

// Resolves a creator by id. Live accounts created via sign-up take precedence
// over the seeded mock users; falls back to the mock list.
export function resolveCreator(id: string): User | undefined {
  const account = findAccountById(id);
  if (account) return account;
  return users.find((u) => u.id === id);
}

// Resolves a user/account by handle (case-insensitive).
export function resolveUserByHandle(handle: string): User | undefined {
  const norm = handle.trim().toLowerCase();
  const account = findAccountByHandle(norm);
  if (account) return account;
  return users.find((u) => u.handle.toLowerCase() === norm);
}

export function getIdeaById(id: string): Idea | undefined {
  return ideas.find((i) => i.id === id);
}

// Prewritten Q&A used as fallback for Ask the Code on the demo project.
// Keys are normalized (lowercase, trimmed) question text.
export const oceanCleanupAskAnswers: Record<
  string,
  { answer: string; relatedConcepts: string[]; suggestedNext: string[]; highlightJsLines?: number[] }
> = {
  "how does the score work?": {
    answer:
      "The score starts at 0. Each time the turtle touches the plastic, the game adds 1 to score and updates the text on the screen.",
    relatedConcepts: ["variables", "conditionals"],
    suggestedNext: [
      "Where does the game check collision?",
      "How can I add a timer?",
    ],
    highlightJsLines: [1, 26, 27],
  },
  "where does the player move?": {
    answer:
      "The player moves whenever you press an arrow key. The keydown event listener changes playerX or playerY by 10 pixels and then redraws the turtle in its new position.",
    relatedConcepts: ["events", "variables"],
    suggestedNext: ["How does the score work?", "How can I make it harder?"],
    highlightJsLines: [13, 14, 15, 16, 17, 18, 19, 20],
  },
  "how can i make it harder?": {
    answer:
      "Try moving the plastic faster, making the play area smaller, or only counting the score if the player collects 5 pieces in a row. You could also add a timer that ends the game after 30 seconds.",
    relatedConcepts: ["variables", "loops"],
    suggestedNext: ["How does the score work?", "Where does the player move?"],
  },
  "what does this line do?": {
    answer:
      "Tap any line in the code to highlight it, and I'll explain what it does in plain language. For example, line 1 (`let score = 0;`) creates a variable called score and starts it at zero.",
    relatedConcepts: ["variables"],
    suggestedNext: ["How does the score work?", "Where does the player move?"],
  },
};

export const suggestedAskQuestions = [
  "How does the score work?",
  "Where does the player move?",
  "How can I make it harder?",
];
