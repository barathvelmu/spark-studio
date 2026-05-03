"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type ModalSize = "default" | "large";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  ariaLabel?: string;
};

const SIZE_CLASSES: Record<ModalSize, string> = {
  default: "max-w-[520px]",
  large: "max-w-[720px]",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "default",
  closeOnBackdrop = true,
  ariaLabel,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  // Keep onClose ref fresh without retriggering the focus-trap effect.
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    // Prefer focusing the first form field; fall back to first non-Close button.
    const firstField = dialog?.querySelector<HTMLElement>(
      'input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
    );
    let initialTarget: HTMLElement | undefined = firstField ?? undefined;
    if (!initialTarget) {
      const buttons = dialog?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (buttons) {
        initialTarget =
          Array.from(buttons).find((el) => el.getAttribute("aria-label") !== "Close") ??
          buttons[0];
      }
    }
    initialTarget?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key === "Tab") {
        // Re-query each time so we don't trap against stale DOM.
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <div
        aria-hidden="true"
        onClick={() => {
          if (closeOnBackdrop) onClose();
        }}
        className="absolute inset-0 bg-[rgba(44,24,16,0.40)] animate-spark-fade-in"
        style={{ animation: "spark-fade-in 200ms ease-out forwards" }}
      />
      <div
        ref={dialogRef}
        className={`relative w-full ${SIZE_CLASSES[size]} bg-surface rounded-xl shadow-xl p-8`}
        style={{
          animation: "spark-modal-in 320ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        {title ? <h2 className="font-display text-h3 text-text mb-4 pr-10">{title}</h2> : null}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:bg-surface-muted hover:text-text transition-colors"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
        <div className="text-body text-text">{children}</div>
        {footer ? <div className="flex items-center justify-end gap-3 mt-8">{footer}</div> : null}
      </div>
      <style>{`
        @keyframes spark-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spark-modal-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}
