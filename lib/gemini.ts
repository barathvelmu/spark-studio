/**
 * lib/gemini.ts
 *
 * Drop-in replacement for lib/anthropic.ts.
 * Exports the same two symbols used by every route:
 *   - isAnthropicConfigured()
 *   - askClaudeJson<T>(args)
 *
 * Backed by Gemini 2.5 Flash via the REST generateContent endpoint.
 * Set GEMINI_API_KEY in your environment (or .env.local).
 */

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/** Mirrors isAnthropicConfigured() — routes call this as a gate. */
export function isAnthropicConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return typeof key === "string" && key.trim().length > 0;
}

const SAFETY_RULES = `You are Spark Studio's AI helper. Spark Studio is a creative coding playground for kids ages 10-14.
Hard rules — NEVER violate:
- Keep all content age-appropriate. No violence, sexual content, hate, self-harm, or scary themes.
- No personal data collection. No real names, addresses, phone numbers.
- No external links or URLs in any code or text you generate.
- If a user prompt is unsafe, redirect to a safe themed alternative (e.g. ocean cleanup, recycling, friendly fantasy).
- Output ONLY valid JSON matching the schema you are told to follow. No prose preamble, no markdown fences, no comments.`;

/**
 * Mirrors askClaudeJson<T>() from lib/anthropic.ts.
 * Identical signature; returns null on any failure so routes fall back to mock data.
 *
 * Parameters used by routes:
 *   systemHint  — task-specific instructions appended after SAFETY_RULES
 *   userMessage — the user-facing prompt (idea, code snapshot, question, etc.)
 *   maxTokens   — soft output budget (default 4096); mapped to maxOutputTokens
 *   effort      — ignored for Gemini (was an Anthropic-specific hint); accepted
 *                 for signature compatibility but not forwarded
 *   timeoutMs   — AbortController timeout in ms (default 20 000)
 */
export async function askClaudeJson<T>(args: {
  systemHint: string;
  userMessage: string;
  maxTokens?: number;
  effort?: "low" | "medium" | "high" | "xhigh" | "max";
  timeoutMs?: number;
}): Promise<T | null> {
  if (!isAnthropicConfigured()) return null;

  const apiKey = process.env.GEMINI_API_KEY as string;
  const systemText = `${SAFETY_RULES}\n\n${args.systemHint}`;
  const maxOutputTokens = args.maxTokens ?? 4096;
  const timeoutMs = args.timeoutMs ?? 45000;

  const body = {
    systemInstruction: {
      parts: [{ text: systemText }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: args.userMessage }],
      },
    ],
    generationConfig: {
      maxOutputTokens,
      // Disable thinking tokens — they consume the output budget before any
      // visible text is emitted, leaving parts[] empty on low-token calls.
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      console.warn(`[gemini] HTTP ${res.status}:`, errText);
      return null;
    }

    const data = (await res.json()) as {
      candidates?: {
        content?: { parts?: { text?: string }[] };
        finishReason?: string;
      }[];
      error?: { message: string };
    };

    if (data.error) {
      console.warn("[gemini] API error:", data.error.message);
      return null;
    }

    const candidate = data.candidates?.[0];
    const finishReason = candidate?.finishReason;
    if (finishReason && finishReason !== "STOP") {
      console.warn("[gemini] non-STOP finishReason:", finishReason);
      return null;
    }
    const text = candidate?.content?.parts?.[0]?.text;
    if (typeof text !== "string" || text.trim().length === 0) {
      console.warn("[gemini] empty or missing text in response");
      return null;
    }

    // Even with responseMimeType: application/json the model occasionally adds
    // a fenced block. Strip it just in case (mirrors the Anthropic fallback).
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (err) {
    // Network error, AbortError (timeout), JSON parse failure — all fall through.
    console.warn(
      "[gemini] call failed, falling back:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}
