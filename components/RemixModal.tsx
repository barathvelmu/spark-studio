"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { generateRemixDraft } from "@/lib/templateGenerator";
import { remixProject } from "@/lib/projectStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

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
    if (open) {
      setPrompt("");
      setBusy(false);
    }
  }, [open]);

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
      <Textarea
        label="What do you want to change?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Make it about space junk instead of ocean plastic"
        autoFocus
      />
    </Modal>
  );
}

export default RemixModal;
