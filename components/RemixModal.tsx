"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { generateRemixDraft } from "@/lib/templateGenerator";
import { remixProject } from "@/lib/projectStore";

type RemixModalProps = {
  parent: Project;
  open: boolean;
  onClose: () => void;
};

export function RemixModal({ parent, open, onClose }: RemixModalProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setPrompt("");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function submit() {
    if (busy || !prompt.trim()) return;
    setBusy(true);
    setTimeout(() => {
      const draft = generateRemixDraft({ parent, remixPrompt: prompt });
      const child = remixProject(parent.id, draft);
      if (child) {
        router.push(`/project/${child.id}`);
      }
    }, 500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(30, 27, 75, 0.40)" }}
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl shadow-xl p-8 max-w-[520px] w-[92%] mx-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="remix-title"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 id="remix-title" className="font-display text-h3">Remix this project</h2>
            <p className="text-body-sm text-text-muted mt-1">
              Forking from <strong>{parent.title}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text w-10 h-10 inline-flex items-center justify-center rounded-md"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <label className="block text-body-sm font-semibold mb-2" htmlFor="remix-prompt">
          What do you want to change?
        </label>
        <textarea
          id="remix-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Make it about space junk instead of ocean plastic"
          className="w-full min-h-[96px] bg-surface-muted rounded-md p-4 text-body resize-y focus:bg-surface focus:outline-none border-[1.5px] border-transparent focus:border-primary transition-colors"
          autoFocus
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="text-text-muted hover:text-text font-semibold rounded-lg h-11 px-5 text-label transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy || !prompt.trim()}
            className="bg-primary hover:bg-primary-hover text-white font-bold rounded-lg h-11 px-6 shadow-md disabled:bg-text-subtle disabled:shadow-none transition-all"
          >
            {busy ? "Remixing…" : "Remix"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemixModal;
