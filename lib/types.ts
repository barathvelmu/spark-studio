export type ProjectType = "collector_game" | "quiz_game" | "story" | "clicker";

export type Concept =
  | "variables"
  | "events"
  | "conditionals"
  | "loops"
  | "arrays"
  | "branching"
  | "state"
  | "score"
  | "collision";

export type SafetyStatus = "checked" | "needs_review";

export type GradientPreset = "indigo" | "sky" | "mint" | "peach" | "lavender";

export type User = {
  id: string;
  handle: string;
  emoji: string;
  email?: string;
  createdAt?: string;
};

export type Account = User & {
  email: string;
  createdAt: string;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tags: string[];
  suggestedProjectType: ProjectType;
  gradient: GradientPreset;
};

export type CollectorGameConfig = {
  player: string;
  collectible: string;
  background: "ocean" | "space" | "forest" | "city";
  goal: string;
};

export type QuizGameConfig = {
  questions: Array<{ q: string; choices: string[]; answerIndex: number }>;
  theme: string;
};

export type StoryGameConfig = {
  theme: string;
  scenes: Array<{
    id: string;
    text: string;
    choices: Array<{ label: string; nextId: string | null }>;
  }>;
};

export type ProjectConfig = CollectorGameConfig | QuizGameConfig | StoryGameConfig;

export type Project = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  projectType: ProjectType;
  forkedFromProjectId?: string;
  originalIdeaId?: string;
  config: ProjectConfig;
  tags: string[];
  concepts: Concept[];
  codeHtml: string;
  codeCss: string;
  codeJs: string;
  learningSummary: string;
  changeSummary: string[];
  nextChallenge: string;
  safetyStatus: SafetyStatus;
  remixCount: number;
  createdAt: string;
  gradient: GradientPreset;
  published: boolean;
};

export type AskCodeAnswer = {
  answer: string;
  relatedConcepts: Concept[];
  suggestedNextQuestions: string[];
  highlightLines?: { file: "html" | "css" | "js"; lines: number[] };
};

export type Reaction =
  | "inspired_me"
  | "i_remixed_this"
  | "cool_idea"
  | "great_design"
  | "smart_logic"
  | "i_learned_from_this";
