// Curated kid-safe word lists for auto-generated handles.
// Format: "<adjective><animal_or_bug><3-digit-number>" — all lowercase, no separators.

const ADJECTIVES = [
  "sunny",
  "breezy",
  "happy",
  "cozy",
  "fluffy",
  "sparkly",
  "swift",
  "brave",
  "clever",
  "mighty",
  "gentle",
  "lucky",
  "merry",
  "bouncy",
  "snappy",
  "zippy",
  "jolly",
  "peppy",
  "dreamy",
  "starry",
  "mossy",
  "pebbly",
  "leafy",
  "rosy",
  "mellow",
  "plucky",
  "spunky",
  "nifty",
  "dandy",
  "snazzy",
  "perky",
  "zesty",
  "tangy",
  "minty",
  "dusty",
  "frosty",
  "misty",
  "shiny",
  "glowy",
  "tiny",
];

const ANIMALS = [
  "panda",
  "otter",
  "fox",
  "owl",
  "koala",
  "tiger",
  "puffin",
  "narwhal",
  "axolotl",
  "octopus",
  "platypus",
  "hedgehog",
  "raccoon",
  "lemur",
  "kitten",
  "puppy",
  "bunny",
  "duckling",
  "turtle",
  "dolphin",
  "seahorse",
  "starfish",
  "ladybug",
  "firefly",
  "bumblebee",
  "butterfly",
  "dragonfly",
  "cricket",
  "snail",
  "caterpillar",
  "robin",
  "sparrow",
  "penguin",
  "flamingo",
  "toucan",
  "parrot",
  "frog",
  "newt",
  "gecko",
  "chipmunk",
];

// Kid-safe avatar emojis used for new accounts.
const AVATAR_EMOJIS = [
  "🦊",
  "🐢",
  "🐼",
  "🦁",
  "🐯",
  "🐸",
  "🐙",
  "🐳",
  "🦉",
  "🦄",
  "🐝",
  "🐞",
  "🦋",
  "🌟",
  "🌈",
  "🌊",
  "🌱",
  "🍄",
  "🚀",
  "🛸",
  "🎨",
  "🎮",
  "🎲",
  "🎈",
  "🐉",
  "🦖",
  "🦕",
  "🦔",
  "🐧",
  "🐨",
];

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T;
}

function pad3(n: number): string {
  return String(n % 1000).padStart(3, "0");
}

export function pickAvatarEmoji(): string {
  return pick(AVATAR_EMOJIS);
}

export const AVATAR_OPTIONS: readonly string[] = AVATAR_EMOJIS;

// Generate a candidate handle. Does not check for uniqueness — the caller
// (accountStore.createAccount / regenerate) is responsible for that.
export function generateCandidateHandle(): string {
  return `${pick(ADJECTIVES)}${pick(ANIMALS)}${pad3(Math.floor(Math.random() * 1000))}`;
}

// Generate a handle that is unique against the provided "taken" set.
// Tries up to `maxTries` times; on collision past that, appends a 4th digit.
export function generateUniqueHandle(taken: ReadonlySet<string>, maxTries = 8): string {
  for (let i = 0; i < maxTries; i++) {
    const candidate = generateCandidateHandle();
    if (!taken.has(candidate)) return candidate;
  }
  // Fallback: 4-digit suffix on a fresh adjective+animal.
  const base = `${pick(ADJECTIVES)}${pick(ANIMALS)}`;
  for (let i = 0; i < 50; i++) {
    const candidate = `${base}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    if (!taken.has(candidate)) return candidate;
  }
  // Last-ditch: timestamp suffix. Effectively never collides.
  return `${base}${Date.now().toString().slice(-5)}`;
}

export function generateNewProfile(taken: ReadonlySet<string>): { handle: string; emoji: string } {
  return { handle: generateUniqueHandle(taken), emoji: pickAvatarEmoji() };
}
