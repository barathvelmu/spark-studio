"use client";

import { useEffect, useRef, useState } from "react";
import { oceanCleanupAskAnswers, suggestedAskQuestions } from "@/lib/mockData";
import type { Project } from "@/lib/types";

type Message = { role: "user" | "assistant"; text: string };

type AskTheCodePanelProps = {
  project: Project;
  onLookHere?: (file: "html" | "css" | "js", lines: number[]) => void;
};

function answerFor(question: string): { text: string; suggestedNext: string[]; highlightJsLines?: number[] } {
  const key = question.trim().toLowerCase();
  const exact = oceanCleanupAskAnswers[key];
  if (exact) {
    return { text: exact.answer, suggestedNext: exact.suggestedNext, highlightJsLines: exact.highlightJsLines };
  }
  // Fuzzy: try to find a key whose words are mostly contained in the question
  for (const [k, v] of Object.entries(oceanCleanupAskAnswers)) {
    const words = k.replace(/[?]/g, "").split(/\s+/).filter((w) => w.length > 3);
    const hits = words.filter((w) => key.includes(w)).length;
    if (hits >= Math.max(2, Math.floor(words.length / 2))) {
      return { text: v.answer, suggestedNext: v.suggestedNext, highlightJsLines: v.highlightJsLines };
    }
  }
  return {
    text:
      "I only know about this project's code so far. Try one of the suggested questions below — or click any line in the code and I'll explain it.",
    suggestedNext: suggestedAskQuestions,
  };
}

export function AskTheCodePanel({ project, onLookHere }: AskTheCodePanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    const { text, highlightJsLines } = answerFor(trimmed);
    setMessages((m) => [
      ...m,
      { role: "user", text: trimmed },
      { role: "assistant", text },
    ]);
    setInput("");
    if (highlightJsLines && onLookHere) {
      onLookHere("js", highlightJsLines);
    }
  }

  const empty = messages.length === 0;

  return (
    <aside className="bg-surface-muted rounded-xl p-6 flex flex-col h-full min-h-[480px]">
      <div className="mb-4">
        <h3 className="font-display text-h3">Ask the code</h3>
        <p className="text-body-sm text-text-muted">I only know about <em>this</em> project.</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto space-y-3 pr-1" aria-live="polite">
        {empty && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-body-sm text-text-muted mb-4">Ask me anything about this project's code 👇</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                "max-w-[85%] px-4 py-3 text-body-sm " +
                (m.role === "user"
                  ? "bg-primary-soft text-text rounded-xl rounded-br-sm"
                  : "bg-surface text-text rounded-xl rounded-bl-sm shadow-sm")
              }
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested chips */}
      <div className="flex flex-wrap gap-2 mt-4 mb-3">
        {suggestedAskQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            className="rounded-pill bg-surface text-text-muted hover:text-text text-tiny font-semibold px-4 h-8 shadow-sm transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex gap-2 items-end"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${project.title}…`}
          className="flex-1 bg-surface rounded-md p-3 text-body-sm focus:outline-none border-[1.5px] border-transparent focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-11 px-5 text-label disabled:bg-text-subtle transition-colors"
        >
          Ask
        </button>
      </form>
    </aside>
  );
}

export default AskTheCodePanel;
