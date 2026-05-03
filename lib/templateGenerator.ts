import type {
  CollectorGameConfig,
  Concept,
  GradientPreset,
  Project,
  ProjectType,
  QuizGameConfig,
  StoryGameConfig,
} from "./types";

// ─── Collector themes ─────────────────────────────────────────────────────────

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

const defaultCollectorTheme: KeywordTheme = {
  match: /.*/,
  player: "🐢",
  collectible: "🧴",
  background: "ocean",
  goal: "Collect items and earn points",
  title: "New Collector Game",
  tags: ["Game", "Beginner"],
  gradient: "sky",
};

function pickCollectorTheme(prompt: string): KeywordTheme {
  const trimmed = prompt.trim();
  if (!trimmed) return defaultCollectorTheme;
  return collectorThemes.find((t) => t.match.test(trimmed)) ?? defaultCollectorTheme;
}

// Keep the old name working for callers outside this module.
/** @deprecated use pickCollectorTheme */
function pickTheme(prompt: string): KeywordTheme {
  return pickCollectorTheme(prompt);
}

// ─── Quiz themes ──────────────────────────────────────────────────────────────

type QuizTheme = {
  match: RegExp;
  title: string;
  theme: string;
  tags: string[];
  gradient: GradientPreset;
  questions: QuizGameConfig["questions"];
};

const quizThemes: QuizTheme[] = [
  {
    match: /\b(math|numbers|addition|subtract|multiply|divide|equation|algebra|calculate)\b/i,
    title: "Space Math Quest",
    theme: "math",
    tags: ["Quiz", "Math", "Space"],
    gradient: "indigo",
    questions: [
      { q: "What is 7 × 8?", choices: ["48", "54", "56", "64"], answerIndex: 2 },
      { q: "What is 144 ÷ 12?", choices: ["10", "11", "12", "14"], answerIndex: 2 },
      { q: "What is 2 to the power of 5?", choices: ["10", "16", "32", "64"], answerIndex: 2 },
      { q: "What is 15% of 200?", choices: ["20", "25", "30", "35"], answerIndex: 2 },
    ],
  },
  {
    match: /\b(health|sleep|food|exercise|nutrition|body|habits|diet|eat|hydrat)\b/i,
    title: "Healthy Habits Quiz",
    theme: "health",
    tags: ["Quiz", "Health", "Beginner"],
    gradient: "peach",
    questions: [
      {
        q: "How many hours of sleep do kids need each night?",
        choices: ["5–7 hours", "7–8 hours", "9–11 hours", "12+ hours"],
        answerIndex: 2,
      },
      {
        q: "Which food gives you long-lasting energy?",
        choices: ["Candy bar", "Soda", "Whole grain bread", "Potato chips"],
        answerIndex: 2,
      },
      {
        q: "How many minutes of exercise per day is recommended for kids?",
        choices: ["10 minutes", "30 minutes", "45 minutes", "60 minutes"],
        answerIndex: 3,
      },
      {
        q: "Which drink is best after exercise?",
        choices: ["Energy drink", "Juice box", "Water", "Chocolate milk"],
        answerIndex: 2,
      },
    ],
  },
  {
    match: /\b(science|biology|chemistry|physics|nature|animal|plant|earth|ecology|environment)\b/i,
    title: "Science Explorer Quiz",
    theme: "science",
    tags: ["Quiz", "Science", "Nature"],
    gradient: "mint",
    questions: [
      {
        q: "What gas do plants breathe in to make food?",
        choices: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        answerIndex: 2,
      },
      {
        q: "What is the closest star to Earth?",
        choices: ["Sirius", "Betelgeuse", "Alpha Centauri", "The Sun"],
        answerIndex: 3,
      },
      {
        q: "How many bones are in the adult human body?",
        choices: ["106", "206", "256", "306"],
        answerIndex: 1,
      },
      {
        q: "Which animal is the fastest on land?",
        choices: ["Lion", "Horse", "Cheetah", "Ostrich"],
        answerIndex: 2,
      },
    ],
  },
];

const defaultQuizTheme: QuizTheme = {
  match: /.*/,
  title: "Knowledge Quest",
  theme: "general",
  tags: ["Quiz", "Beginner"],
  gradient: "lavender",
  questions: [
    {
      q: "How many continents are there on Earth?",
      choices: ["5", "6", "7", "8"],
      answerIndex: 2,
    },
    {
      q: "What is the largest planet in our solar system?",
      choices: ["Earth", "Saturn", "Neptune", "Jupiter"],
      answerIndex: 3,
    },
    {
      q: "How many sides does a hexagon have?",
      choices: ["5", "6", "7", "8"],
      answerIndex: 1,
    },
    {
      q: "What does HTML stand for?",
      choices: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "How To Make Links",
        "Hyper Transfer Markup Layout",
      ],
      answerIndex: 0,
    },
  ],
};

function pickQuizTheme(prompt: string): QuizTheme {
  const trimmed = prompt.trim();
  if (!trimmed) return defaultQuizTheme;
  return quizThemes.find((t) => t.match.test(trimmed)) ?? defaultQuizTheme;
}

// ─── Story themes ─────────────────────────────────────────────────────────────

type StoryTheme = {
  match: RegExp;
  title: string;
  theme: string;
  tags: string[];
  gradient: GradientPreset;
  scenes: StoryGameConfig["scenes"];
};

const storyThemes: StoryTheme[] = [
  {
    match: /\b(kindness|friendship|friend|help|social|kind|school|bully|empathy|choice)\b/i,
    title: "Kindness Quest",
    theme: "kindness",
    tags: ["Story", "Social Good", "Choices"],
    gradient: "mint",
    scenes: [
      {
        id: "start",
        text: "You see your friend drop all their books in the hallway. What do you do?",
        choices: [
          { label: "Help pick them up right away", nextId: "help" },
          { label: "Keep walking — you're in a hurry", nextId: "ignore" },
        ],
      },
      {
        id: "help",
        text: "Your friend smiles big. \"Thanks so much!\" they say. Do you walk to class together?",
        choices: [
          { label: "Yes! You chat the whole way there", nextId: "end_together" },
          { label: "You wave and head your separate ways", nextId: "end_wave" },
        ],
      },
      {
        id: "end_together",
        text: "You arrive at class with a stronger friendship. Kindness always comes back around. 🌟",
        choices: [],
      },
      {
        id: "end_wave",
        text: "You both smile. A small moment, but it made someone's day better. That counts. 🌟",
        choices: [],
      },
      {
        id: "ignore",
        text: "You walk past. A few minutes later you feel a little guilty. What do you do?",
        choices: [
          { label: "Go back and apologize", nextId: "apologize" },
          { label: "Decide to do better next time", nextId: "end_learn" },
        ],
      },
      {
        id: "apologize",
        text: "You find your friend and say sorry. They smile: \"It's okay — thanks for coming back!\" 🌟",
        choices: [],
      },
      {
        id: "end_learn",
        text: "You make a promise to yourself: next time you'll stop and help. Everyone makes mistakes — what matters is learning from them. 🌟",
        choices: [],
      },
    ],
  },
  {
    match: /\b(adventure|explore|dragon|hero|quest|magic|forest|cave|treasure|knight)\b/i,
    title: "The Dragon's Cave",
    theme: "adventure",
    tags: ["Story", "Fantasy", "Adventure"],
    gradient: "indigo",
    scenes: [
      {
        id: "start",
        text: "You find a mysterious cave in the forest. A warm glow comes from inside. What do you do?",
        choices: [
          { label: "Enter the cave bravely", nextId: "cave" },
          { label: "Look for another path around it", nextId: "path" },
        ],
      },
      {
        id: "cave",
        text: "Inside you find a friendly dragon! It's guarding a large chest. What do you say?",
        choices: [
          { label: "\"Hi! What's in the chest?\"", nextId: "ask_dragon" },
          { label: "Try to sneak past the dragon", nextId: "sneak" },
        ],
      },
      {
        id: "ask_dragon",
        text: "The dragon grins. \"A map to the hidden library — full of every book ever written!\" It hands you the map. 🗺️",
        choices: [],
      },
      {
        id: "sneak",
        text: "The dragon opens one eye. \"I could hear you the whole time!\" it laughs. \"Why not just ask?\"",
        choices: [{ label: "Ask about the treasure after all", nextId: "ask_dragon" }],
      },
      {
        id: "path",
        text: "The path winds through tall trees. You spot a rope ladder leading up to something. Do you climb?",
        choices: [
          { label: "Climb the ladder", nextId: "treehouse" },
          { label: "Keep walking on the ground", nextId: "meadow" },
        ],
      },
      {
        id: "treehouse",
        text: "A treehouse full of maps and telescopes! A sign reads: 'Explorer HQ'. You are an explorer now. 🌿",
        choices: [],
      },
      {
        id: "meadow",
        text: "You walk into a sunlit meadow. A note on a tree says: \"Well done, brave traveler. The real adventure is the path you chose.\" 🌟",
        choices: [],
      },
    ],
  },
];

const defaultStoryTheme: StoryTheme = {
  match: /.*/,
  title: "Choose Your Path",
  theme: "general",
  tags: ["Story", "Choices", "Beginner"],
  gradient: "lavender",
  scenes: [
    {
      id: "start",
      text: "You wake up and find a glowing door in your room that wasn't there yesterday. Do you open it?",
      choices: [
        { label: "Open the door — adventure awaits!", nextId: "open" },
        { label: "Go back to sleep", nextId: "sleep" },
      ],
    },
    {
      id: "open",
      text: "On the other side is a world of floating islands. A friendly guide appears: \"Welcome, traveler!\"",
      choices: [
        { label: "Follow the guide", nextId: "guide" },
        { label: "Explore on your own", nextId: "explore" },
      ],
    },
    {
      id: "guide",
      text: "The guide shows you forests, mountains, and a city made of clouds. You find your way home carrying a new map. 🌤️",
      choices: [],
    },
    {
      id: "explore",
      text: "You find a crystal that shows you any answer you can think of. You keep it safe and find your way home. 💎",
      choices: [],
    },
    {
      id: "sleep",
      text: "You roll over. When you wake up, the door is gone. You wonder: what was on the other side? 🌙",
      choices: [],
    },
  ],
};

function pickStoryTheme(prompt: string): StoryTheme {
  const trimmed = prompt.trim();
  if (!trimmed) return defaultStoryTheme;
  return storyThemes.find((t) => t.match.test(trimmed)) ?? defaultStoryTheme;
}

// ─── Code generators ──────────────────────────────────────────────────────────

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

export function makeQuizCode(
  questions: QuizGameConfig["questions"],
  title: string,
): { html: string; css: string; js: string } {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>${title}</h1>
    <div id="score">Score: 0</div>
    <div id="question-num"></div>
    <div id="question"></div>
    <div id="choices"></div>
    <button id="next-btn" onclick="nextQuestion()">Next →</button>
    <div id="result"></div>
    <script src="game.js"></script>
  </body>
</html>
`;

  const css = `/* Page background */
body {
  background: #FFF7ED;
  font-family: sans-serif;
  text-align: center;
  padding: 20px;
}

/* The question text */
#question {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
}

/* Each answer button */
.choice-btn {
  display: block;
  width: 300px;
  margin: 8px auto;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}
.choice-btn:hover { background: #f0f9ff; }
.correct { background: #d1fae5 !important; border-color: #10b981 !important; }
.wrong   { background: #fee2e2 !important; border-color: #ef4444 !important; }

/* Next button */
#next-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: #f97316;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: none;
}
`;

  const questionsJson = JSON.stringify(questions, null, 2);
  const js = `// All the quiz questions and answers
const questions = ${questionsJson};

// Keep track of which question we are on and the score
let currentIndex = 0;
let score = 0;
let answered = false;

// Find the HTML elements we need to update
const questionEl = document.getElementById("question");
const choicesEl  = document.getElementById("choices");
const scoreEl    = document.getElementById("score");
const numEl      = document.getElementById("question-num");
const nextBtn    = document.getElementById("next-btn");
const resultEl   = document.getElementById("result");

// Show the current question on screen
function showQuestion() {
  answered = false;
  nextBtn.style.display = "none";
  resultEl.textContent = "";

  const q = questions[currentIndex];
  numEl.textContent = "Question " + (currentIndex + 1) + " of " + questions.length;
  questionEl.textContent = q.q;

  // Build one button for each answer choice
  choicesEl.innerHTML = "";
  q.choices.forEach(function(choice, i) {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.onclick = function() { checkAnswer(i, btn); };
    choicesEl.appendChild(btn);
  });
}

// Check if the clicked answer is correct
function checkAnswer(index, clickedBtn) {
  if (answered) return;
  answered = true;

  const correct = questions[currentIndex].answerIndex;
  if (index === correct) {
    score = score + 1;
    clickedBtn.classList.add("correct");
    scoreEl.textContent = "Score: " + score;
  } else {
    clickedBtn.classList.add("wrong");
    // Highlight the right answer in green so you can learn from it
    choicesEl.children[correct].classList.add("correct");
  }

  // Disable all buttons so you cannot change your answer
  Array.from(choicesEl.children).forEach(function(btn) {
    btn.disabled = true;
  });

  nextBtn.style.display = "inline-block";
}

// Move to the next question (or show the final score)
function nextQuestion() {
  currentIndex = currentIndex + 1;
  if (currentIndex >= questions.length) {
    choicesEl.innerHTML = "";
    questionEl.innerHTML = "🎉 Quiz complete!";
    numEl.textContent = "";
    resultEl.textContent = "You scored " + score + " out of " + questions.length + "!";
    nextBtn.style.display = "none";
  } else {
    showQuestion();
  }
}

// Start the quiz!
showQuestion();
`;

  return { html, css, js };
}

export function makeStoryCode(
  scenes: StoryGameConfig["scenes"],
  title: string,
): { html: string; css: string; js: string } {
  const firstSceneId = scenes[0]?.id ?? "start";

  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>${title}</h1>
    <p id="choices-made">Choices made: 0</p>
    <div id="scene-text"></div>
    <div id="choices"></div>
    <button id="restart-btn" onclick="restartStory()">Start Over</button>
    <script src="game.js"></script>
  </body>
</html>
`;

  const css = `/* Page background */
body {
  background: #F5F3FF;
  font-family: sans-serif;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
}

/* The story text */
#scene-text {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
  line-height: 1.5;
}

/* Each choice button */
.choice-btn {
  display: block;
  width: 100%;
  margin: 8px 0;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  text-align: left;
}
.choice-btn:hover { background: #ede9fe; }

/* Restart button */
#restart-btn {
  margin-top: 20px;
  padding: 10px 24px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: none;
}
`;

  const scenesJson = JSON.stringify(scenes, null, 2);
  const js = `// All the story scenes
const scenes = ${scenesJson};

// Keep track of where we are in the story
let currentId = "${firstSceneId}";
let choicesMade = 0;

// Find the HTML elements we need to update
const sceneTextEl  = document.getElementById("scene-text");
const choicesEl    = document.getElementById("choices");
const choicesNumEl = document.getElementById("choices-made");
const restartBtn   = document.getElementById("restart-btn");

// Show the current scene on screen
function showScene() {
  const scene = scenes.find(function(s) { return s.id === currentId; });

  if (!scene || scene.choices.length === 0) {
    // End of the story
    if (scene) sceneTextEl.textContent = scene.text;
    choicesEl.innerHTML = "<p style=\\"font-size:40px\\">🌟 The End!</p>";
    restartBtn.style.display = "inline-block";
    return;
  }

  sceneTextEl.textContent = scene.text;
  restartBtn.style.display = "none";

  // Build one button for each choice
  choicesEl.innerHTML = "";
  scene.choices.forEach(function(choice) {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.label;
    btn.onclick = function() { makeChoice(choice.nextId); };
    choicesEl.appendChild(btn);
  });
}

// The player picked a choice — move to the next scene
function makeChoice(nextId) {
  choicesMade = choicesMade + 1;
  choicesNumEl.textContent = "Choices made: " + choicesMade;
  currentId = nextId !== null ? nextId : "__end__";
  showScene();
}

// Reset everything back to the beginning
function restartStory() {
  currentId = "${firstSceneId}";
  choicesMade = 0;
  choicesNumEl.textContent = "Choices made: 0";
  showScene();
}

// Start the story!
showScene();
`;

  return { html, css, js };
}

// ─── Draft generators ─────────────────────────────────────────────────────────

const baseConcepts: Concept[] = ["variables", "events", "conditionals", "loops"];

export type ProjectDraft = Omit<Project, "id" | "createdAt" | "remixCount">;

export function generateProjectDraft(args: {
  prompt: string;
  projectType: ProjectType | "auto";
  creatorId: string;
  originalIdeaId?: string;
}): ProjectDraft {
  const { prompt, projectType, creatorId, originalIdeaId } = args;

  // ── Quiz game ──
  if (projectType === "quiz_game") {
    const qTheme = pickQuizTheme(prompt);
    const code = makeQuizCode(qTheme.questions, qTheme.title);
    const description =
      prompt.trim().length > 0
        ? `Answer questions about ${qTheme.theme}. Built from: "${prompt.trim()}".`
        : "Answer questions and see how many you can get right.";
    return {
      title: qTheme.title,
      description,
      creatorId,
      projectType: "quiz_game",
      originalIdeaId,
      config: { questions: qTheme.questions, theme: qTheme.theme } as QuizGameConfig,
      tags: qTheme.tags,
      concepts: ["arrays", "conditionals", "score"],
      codeHtml: code.html,
      codeCss: code.css,
      codeJs: code.js,
      learningSummary:
        "This project uses an array of questions, a score variable, and conditionals to check if your answer is correct.",
      changeSummary: [
        `Created ${qTheme.questions.length} questions about ${qTheme.theme}`,
        "Added score tracking for correct answers",
        "Added feedback that shows the right answer when you're wrong",
      ],
      nextChallenge: "Try adding a timer so each question has a time limit.",
      safetyStatus: "checked",
      gradient: qTheme.gradient,
      published: false,
    };
  }

  // ── Story ──
  if (projectType === "story") {
    const sTheme = pickStoryTheme(prompt);
    const code = makeStoryCode(sTheme.scenes, sTheme.title);
    const description =
      prompt.trim().length > 0
        ? `A branching story where your choices matter. Built from: "${prompt.trim()}".`
        : "A branching story where every choice leads somewhere different.";
    return {
      title: sTheme.title,
      description,
      creatorId,
      projectType: "story",
      originalIdeaId,
      config: { theme: sTheme.theme, scenes: sTheme.scenes } as StoryGameConfig,
      tags: sTheme.tags,
      concepts: ["branching", "state", "conditionals"],
      codeHtml: code.html,
      codeCss: code.css,
      codeJs: code.js,
      learningSummary:
        "This project uses branching logic — each choice changes which scene comes next, just like an if-statement in code.",
      changeSummary: [
        `Created ${sTheme.scenes.length} story scenes`,
        "Added choices that lead to different paths",
        "Added a restart button so you can read the story again",
      ],
      nextChallenge: "Try adding a new scene with a completely different ending.",
      safetyStatus: "checked",
      gradient: sTheme.gradient,
      published: false,
    };
  }

  // ── Collector game (default for "auto" and "collector_game") ──
  const theme = pickTheme(prompt);
  const noun =
    theme.collectible === "🧴"
      ? "Plastic"
      : theme.collectible === "🛰️"
        ? "Space Junk"
        : theme.collectible === "🌰"
          ? "Acorn"
          : theme.collectible === "♻️"
            ? "Recycling"
            : "Star";
  const code = makeCollectorCode(theme.player, theme.collectible, theme.background, noun);

  const description =
    prompt.trim().length > 0
      ? `Move the player to collect ${noun.toLowerCase()}. Built from: "${prompt.trim()}".`
      : `Move the player to collect ${noun.toLowerCase()}.`;

  return {
    title: theme.title,
    description,
    creatorId,
    projectType: "collector_game",
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
    published: false,
  };
}

export function generateRemixDraft(args: {
  parent: Project;
  remixPrompt: string;
  creatorId: string;
}): ProjectDraft {
  const { parent, remixPrompt, creatorId } = args;
  const theme = pickTheme(remixPrompt);
  const noun =
    theme.collectible === "🧴"
      ? "Plastic"
      : theme.collectible === "🛰️"
        ? "Space Junk"
        : theme.collectible === "🌰"
          ? "Acorn"
          : theme.collectible === "♻️"
            ? "Recycling"
            : "Star";
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
    published: false,
  };
}
