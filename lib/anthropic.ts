import Anthropic from "@anthropic-ai/sdk";

let cached: Anthropic | null | undefined;

function getClient(): Anthropic | null {
  if (cached !== undefined) return cached;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.trim().length === 0) {
    cached = null;
    return null;
  }
  cached = new Anthropic({ apiKey: key });
  return cached;
}

export function isAnthropicConfigured(): boolean {
  return getClient() !== null;
}

const SAFETY_RULES = `You are Spark Studio's AI helper. Spark Studio is a creative coding playground for kids ages 10-14.
Hard rules — NEVER violate:
- Keep all content age-appropriate. No violence, sexual content, hate, self-harm, or scary themes.
- No personal data collection. No real names, addresses, phone numbers.
- No external links or URLs in any code or text you generate.
- If a user prompt is unsafe, redirect to a safe themed alternative (e.g. ocean cleanup, recycling, friendly fantasy).
- Output ONLY valid JSON matching the schema you are told to follow. No prose preamble, no markdown fences, no comments.`;

export async function askClaudeJson<T>(args: {
  systemHint: string;
  userMessage: string;
  /** Soft request budget. Default 2048. Generation routes pass higher. */
  maxTokens?: number;
  /** Effort level. "low" for latency-sensitive demo paths. */
  effort?: "low" | "medium" | "high" | "xhigh" | "max";
  /** Per-call timeout in ms; on timeout we throw and the route falls back to mock. */
  timeoutMs?: number;
}): Promise<T | null> {
  const client = getClient();
  if (!client) return null;

  const system = `${SAFETY_RULES}\n\n${args.systemHint}`;
  const maxTokens = args.maxTokens ?? 2048;
  const effort = args.effort ?? "low";
  const timeoutMs = args.timeoutMs ?? 20000;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const response = await client.messages.create(
      {
        model: "claude-opus-4-7",
        max_tokens: maxTokens,
        system,
        output_config: { effort },
        messages: [{ role: "user", content: args.userMessage }],
      },
      { signal: controller.signal },
    );
    clearTimeout(timer);

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text",
    );
    if (!textBlock) return null;
    const raw = textBlock.text.trim();
    // If Claude wrapped output in a fenced block despite instructions, strip it.
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    // Any failure (network, parse, abort, refusal) falls through to mock.
    console.warn("[anthropic] call failed, falling back:", err instanceof Error ? err.message : err);
    return null;
  }
}
