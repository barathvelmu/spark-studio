"use client";

import { useEffect, useRef, useState } from "react";
import { suggestedAskQuestions } from "@/lib/mockData";
import type { Project } from "@/lib/types";

type Message = { role: "user" | "assistant"; text: string };

type AskTheCodePanelProps = {
  project: Project;
  onLookHere?: (file: "html" | "css" | "js", lines: number[]) => void;
};

type AskResponse = {
  answer: string;
  relatedConcepts?: string[];
  suggestedNextQuestions?: string[];
  highlightLines?: { file: "html" | "css" | "js"; lines: number[] };
};

export function AskTheCodePanel({ project, onLookHere }: AskTheCodePanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggested, setSuggested] = useState<string[]>(suggestedAskQuestions);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset chat + suggestions when switching projects.
    setMessages([]);
    setSuggested(suggestedAskQuestions);
  }, [project.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setInput("");
    setMessages((m) => [...m, { role: "user", text: trimmed }]);

    try {
      const res = await fetch("/api/ask-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          question: trimmed,
          // Snapshot so the server sees the latest code (including Tinker
          // edits) even for projects that only exist in localStorage.
          project: {
            id: project.id,
            title: project.title,
            description: project.description,
            codeHtml: project.codeHtml,
            codeCss: project.codeCss,
            codeJs: project.codeJs,
          },
        }),
      });
      if (!res.ok) throw new Error(`ask-code ${res.status}`);
      const data = (await res.json()) as AskResponse;
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
      if (Array.isArray(data.suggestedNextQuestions) && data.suggestedNextQuestions.length > 0) {
        setSuggested(data.suggestedNextQuestions.slice(0, 3));
      }
      if (data.highlightLines && onLookHere) {
        onLookHere(data.highlightLines.file, data.highlightLines.lines);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Something went wrong. Try again, or pick a suggested question below.",
        },
      ]);
    } finally {
      setBusy(false);
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
        {busy && (
          <div className="flex justify-start">
            <div className="bg-surface text-text-muted rounded-xl rounded-bl-sm shadow-sm px-4 py-3 text-body-sm inline-flex gap-1 items-center">
              <span className="w-2 h-2 rounded-pill bg-text-subtle animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-pill bg-text-subtle animate-bounce" style={{ animationDelay: "120ms" }} />
              <span className="w-2 h-2 rounded-pill bg-text-subtle animate-bounce" style={{ animationDelay: "240ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested chips */}
      <div className="flex flex-wrap gap-2 mt-4 mb-3">
        {suggested.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            disabled={busy}
            className="rounded-pill bg-surface text-text-muted hover:text-text text-tiny font-semibold px-4 h-8 shadow-sm transition-colors disabled:opacity-60"
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
          disabled={busy}
          className="flex-1 bg-surface rounded-md p-3 text-body-sm focus:outline-none border-[1.5px] border-transparent focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || busy}
          className="bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-11 px-5 text-label disabled:bg-text-subtle transition-colors"
        >
          {busy ? "…" : "Ask"}
        </button>
      </form>
    </aside>
  );
}

export default AskTheCodePanel;
