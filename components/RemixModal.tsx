"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { generateRemixDraft } from "@/lib/templateGenerator";
import { remixProject } from "@/lib/projectStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/lib/auth";

type RemixModalProps = {
  parent: Project;
  open: boolean;
  onClose: () => void;
};

const REMIX_PRESETS: Array<{ label: string; seed: string }> = [
  { label: "Change theme", seed: "Change the theme to something completely different" },
  { label: "Add timer", seed: "Add a timer that ends the game after 30 seconds" },
  { label: "Make it harder", seed: "Make it harder by adding more obstacles or fewer chances" },
  { label: "Change character", seed: "Change the main character to something unexpected" },
  { label: "Add levels", seed: "Add a level-up when the score reaches 10" },
  { label: "Different setting", seed: "Move the action to a different setting or background" },
];

export function RemixModal({ parent, open, onClose }: RemixModalProps) {
  const router = useRouter();
  const { account, isSignedIn, requireAuth } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setPrompt("");
      setBusy(false);
    }
  }, [open]);

  function performRemix(creatorId: string, remixPrompt: string) {
    setBusy(true);
    setTimeout(() => {
      const draft = generateRemixDraft({ parent, remixPrompt, creatorId });
      const child = remixProject(parent.id, draft);
      if (child) {
        router.push(`/project/${child.id}`);
      }
    }, 500);
  }

  function submit() {
    if (busy || !prompt.trim()) return;
    const remixPrompt = prompt;

    if (!isSignedIn) {
      // Close this modal so the auth modal isn't stacked on top of it.
      onClose();
      requireAuth({
        reason: "remix",
        onSuccess: (acct) => performRemix(acct.id, remixPrompt),
      });
      return;
    }
    if (!account) return;
    performRemix(account.id, remixPrompt);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Remix this project"
      footer={
        <>
          <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={submit}
            disabled={!prompt.trim()}
            isLoading={busy}
          >
            {busy ? "Remixing…" : "Remix"}
          </Button>
        </>
      }
    >
      <p className="text-body-sm text-text-muted mb-4">
        Forking from <strong className="text-text">{parent.title}</strong>
      </p>
      <p className="text-body-sm font-semibold text-text mb-2">Try a quick remix:</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {REMIX_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setPrompt(preset.seed)}
            disabled={busy}
            className="rounded-pill bg-surface-muted hover:bg-primary-soft text-text-muted hover:text-primary text-tiny font-semibold px-4 h-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {preset.label}
          </button>
        ))}
      </div>
      <Textarea
        label="What do you want to change?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Make it about space junk instead of ocean plastic"
        autoFocus
      />
      {!isSignedIn ? (
        <p className="text-tiny text-text-muted mt-3">
          We'll set up a quick account when you tap Remix. No password needed.
        </p>
      ) : null}
    </Modal>
  );
}

export default RemixModal;
