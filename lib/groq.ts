const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export function isAnthropicConfigured(): boolean {
  const key = process.env.GROQ_API_KEY;
  return typeof key === "string" && key.trim().length > 0;
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
  maxTokens?: number;
  effort?: "low" | "medium" | "high" | "xhigh" | "max";
  timeoutMs?: number;
}): Promise<T | null> {
  if (!isAnthropicConfigured()) return null;

  const apiKey = process.env.GROQ_API_KEY as string;
  const maxTokens = args.maxTokens ?? 4096;
  const timeoutMs = args.timeoutMs ?? 30000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: `${SAFETY_RULES}\n\n${args.systemHint}` },
          { role: "user", content: args.userMessage },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      console.warn(`[groq] HTTP ${res.status}:`, errText);
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string }; finish_reason?: string }[];
      error?: { message: string };
    };

    if (data.error) {
      console.warn("[groq] API error:", data.error.message);
      return null;
    }

    const finish = data.choices?.[0]?.finish_reason;
    if (finish && finish !== "stop") {
      console.warn("[groq] non-stop finish_reason:", finish);
      return null;
    }

    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!raw) {
      console.warn("[groq] empty content in response");
      return null;
    }

    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (err) {
    clearTimeout(timer);
    console.warn("[groq] call failed, falling back:", err instanceof Error ? err.message : err);
    return null;
  }
}
